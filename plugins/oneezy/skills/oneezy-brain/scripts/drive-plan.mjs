// Plan native Sheets requests. The caller reads live cells, serializes writers,
// rereads the exact targets, applies one batch, then verifies by immutable ID.
export function value(cell) {
  const entered = cell?.userEnteredValue;
  const v = entered?.formulaValue !== undefined ? cell?.effectiveValue : entered ?? cell?.effectiveValue;
  return v?.stringValue ?? v?.numberValue ?? v?.boolValue ?? '';
}
export function records(table) {
  const idColumn = table.headers.indexOf('ID');
  if (idColumn < 0) throw new Error('Live ID header is missing');
  return table.rows.filter(row => String(value(row.cells[idColumn])) !== '').map(row => ({
    rowIndex: row.rowIndex,
    data: Object.fromEntries(table.headers.map((key, index) => [key, value(row.cells[index])])),
  }));
}
export function lookup(state, id) {
  const hits = [];
  for (const name of ['Inbox', 'Backlog']) {
    for (const row of records(state.tables[name])) {
      if (String(row.data.ID) === String(id)) hits.push({tab: name, ...row});
    }
  }
  if (hits.length > 1) throw new Error(`ID ${id} occurs more than once; reconcile before writing`);
  return hits[0] ?? null;
}
function emptyRow(table) {
  const idColumn = table.headers.indexOf('ID');
  const row = table.rows.find(row => String(value(row.cells[idColumn])) === '' &&
    row.cells.every(c => value(c) === '' || value(c) === false));
  if (!row) throw new Error('No bounded empty row; extend the grid and reread');
  return row.rowIndex;
}
function cell(v) {
  if (v === '' || v === null || v === undefined) return {};
  const key = typeof v === 'boolean' ? 'boolValue' : typeof v === 'number' ? 'numberValue' : 'stringValue';
  return {userEnteredValue: {[key]: v}};
}
function write(table, rowIndex, data) {
  return {updateCells: {start: {sheetId: table.sheetId, rowIndex, columnIndex: 0},
    rows: [{values: table.headers.map(key => cell(data[key]))}], fields: 'userEnteredValue'}};
}
function check(state, data) {
  if (!String(data.ID ?? '') || !data.title) throw new Error('ID and title are required');
  if (data.status && !state.statuses.includes(data.status)) throw new Error('Status is outside live List');
  if (data.collection && !['personal', 'work'].includes(data.collection)) throw new Error('Use a current collection');
  if (data.energy && !state.energy.includes(data.energy)) throw new Error('Energy is outside live List');
  if (data.priority_developer && state.priorities && !state.priorities.includes(data.priority_developer)) throw new Error('Priority is outside live List');
  const lists = {...state.lists};
  const liveList = state.tables.List;
  if (liveList) for (const [index, key] of liveList.headers.entries()) {
    if (['ID', 'project'].includes(key)) continue;
    lists[key === 'process' ? 'gtd_process' : key === 'context' ? 'gtd_context' : key] = liveList.rows.map(r => value(r.cells[index])).filter(v => v !== '');
  }
  for (const [key, options] of Object.entries(lists)) {
    if (data[key] !== '' && data[key] !== undefined && !options.map(String).includes(String(data[key]))) throw new Error(`${key} is outside live List`);
  }
  const ids = new Set(['Inbox', 'Backlog'].flatMap(name => records(state.tables[name]).map(row => String(row.data.ID))));
  for (const id of String(data.dependencies_before ?? '').split(',').map(x => x.trim()).filter(Boolean)) {
    if (id === String(data.ID) || !ids.has(id)) throw new Error(`Invalid prerequisite ${id}`);
  }
  // No edge is inferred from a parent, related topic, or document order.
}
export function plan(state, operation) {
  const {kind, id, data = {}} = operation;
  const hit = lookup(state, id ?? data.ID);
  if (kind === 'capture') {
    for (const key of Object.keys(data)) if (!state.tables.Inbox.headers.includes(key)) throw new Error(`Unknown Inbox field ${key}`);
    if (hit) {
      if (hit.data.source_url !== data.source_url || hit.data.title !== data.title) throw new Error('Retry ID belongs to different material');
      return {requests: [], result: 'already captured', id: hit.data.ID};
    }
    const normalized = data.title.trim().toLocaleLowerCase();
    for (const name of ['Inbox', 'Backlog']) {
      const duplicate = records(state.tables[name]).find(row =>
        row.data.source_url === data.source_url && row.data.title.trim().toLocaleLowerCase() === normalized);
      if (duplicate) return {requests: [], result: 'source retry', id: duplicate.data.ID};
    }
    check(state, data);
    const table = state.tables.Inbox;
    return {requests: [write(table, emptyRow(table), data)], result: 'captured', id: data.ID};
  }
  if (!hit) throw new Error(`Exact ID ${id} is absent`);
  if (operation.expect_modified !== undefined && hit.data.date_modified !== operation.expect_modified) throw new Error('Record changed; reread');
  if (kind === 'promote') {
    if (hit.tab === 'Backlog') return {requests: [], result: 'already promoted', id};
    if (operation.selected !== true) throw new Error('Promotion needs an explicit selection');
    const next = {...hit.data, ...data, ID: String(id), views: 'Backlog'};
    for (const key of Object.keys(data)) if (!state.tables.Backlog.headers.includes(key)) throw new Error(`Unknown Backlog field ${key}`);
    check(state, next);
    return {requests: [write(state.tables.Backlog, emptyRow(state.tables.Backlog), next),
      write(state.tables.Inbox, hit.rowIndex, {})], result: 'promoted', id,
      recovery: {tab: 'Inbox', rowIndex: hit.rowIndex, data: hit.data,
        promoted: Object.fromEntries(state.tables.Backlog.headers.map(key => [key, next[key] ?? '']))}};
  }
  if (kind === 'update') {
    if (data.ID !== undefined && String(data.ID) !== String(id)) throw new Error('ID is immutable');
    const next = {...hit.data, ...data};
    check(state, next);
    const table = state.tables[hit.tab];
    const requests = [];
    for (const [key, v] of Object.entries(data)) {
      const columnIndex = table.headers.indexOf(key);
      if (columnIndex < 0) throw new Error(`Unknown live field ${key}`);
      requests.push({updateCells: {start: {sheetId: table.sheetId, rowIndex: hit.rowIndex, columnIndex},
        rows: [{values: [cell(v)]}], fields: 'userEnteredValue'}});
    }
    return {requests, result: 'updated', id};
  }
  if (kind === 'recover') {
    const receipt = operation.recovery;
    if (hit.tab !== 'Backlog' || receipt.tab !== 'Inbox' || String(receipt.data.ID) !== String(id)) throw new Error('Recovery receipt does not match');
    const currentRow = state.tables.Backlog.rows.find(row => row.rowIndex === hit.rowIndex);
    const entered = c => c?.userEnteredValue?.formulaValue ?? c?.userEnteredValue?.stringValue ?? c?.userEnteredValue?.numberValue ?? c?.userEnteredValue?.boolValue ?? '';
    // Header array outputs are recalculated by Sheets and have no entered value.
    // Compare every entered cell, including a later human formula or checkbox.
    if (!receipt.promoted || state.tables.Backlog.headers.some((key, index) => entered(currentRow.cells[index]) !== receipt.promoted[key])) throw new Error('Backlog changed after promotion; reconcile without overwrite');
    const target = state.tables.Inbox.rows.find(row => row.rowIndex === receipt.rowIndex);
    const idColumn = state.tables.Inbox.headers.indexOf('ID');
    if (!target || value(target.cells[idColumn]) !== '' || target.cells.some(c => value(c) !== '' && value(c) !== false)) throw new Error('Recovery slot is occupied');
    return {requests: [write(state.tables.Inbox, receipt.rowIndex, receipt.data),
      write(state.tables.Backlog, hit.rowIndex, {})], result: 'recovered', id};
  }
  if (kind === 'remove-test') {
    if (!String(id).startsWith('TEST-') || !hit.data.title.startsWith('[TEST]')) throw new Error('Only labeled test records may be removed');
    return {requests: [write(state.tables[hit.tab], hit.rowIndex, {})], result: 'test removed', id};
  }
  throw new Error(`Unknown operation ${kind}`);
}
export function publishable(state, projectId) {
  // Public output is values from an explicit allowlist. Never grant IMPORTRANGE.
  return records(state.tables.Backlog).filter(row => row.data.project_id === projectId &&
    row.data.client_visible === true && !row.data.archived).map(({data}) => ({
      ID: data.ID, title: data.client_title || '', project: data.project,
      type: data.type, status: data.status, priority_developer: data.priority_developer,
      estimation: data.estimation, date_due: data.date_due, user_owned: '',
      phase: data.phase, record_kind: data.record_kind, date_start: data.date_start,
      details_summary: data.client_summary || '',
    }));
}
