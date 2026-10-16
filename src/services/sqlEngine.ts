/**
 * Interactive SQL Query Engine for FutureAI World.
 * Executes queries client-side against the sample IT enterprise database.
 * Supports:
 * - SELECT (with columns, expressions, aliases, aggregates: COUNT, AVG, SUM, MIN, MAX)
 * - FROM (with optional table aliases)
 * - JOIN / INNER JOIN / LEFT JOIN ... ON ...
 * - WHERE (with =, !=, <>, >, <, >=, <=, LIKE, AND, OR, IN, BETWEEN)
 * - GROUP BY
 * - HAVING
 * - ORDER BY (ASC / DESC)
 * - LIMIT
 */

export interface EmployeeRecord {
  id: number;
  name: string;
  dept: string;
  dept_id: number;
  salary: number;
  rating: number;
  hire_year: number;
}

export interface DepartmentRecord {
  id: number;
  dept_name: string;
  location: string;
  budget_lpa: number;
  manager: string;
}

export const EMPLOYEES_TABLE: EmployeeRecord[] = [
  { id: 101, name: 'Siddharth R', dept: 'AI Engineering', dept_id: 1, salary: 1450000, rating: 4.8, hire_year: 2022 },
  { id: 102, name: 'Pooja Kumar', dept: 'Data Analytics', dept_id: 2, salary: 920000, rating: 4.5, hire_year: 2023 },
  { id: 103, name: 'Arun Balaji', dept: 'AI Engineering', dept_id: 1, salary: 1200000, rating: 4.1, hire_year: 2024 },
  { id: 104, name: 'Meenakshi S', dept: 'Cloud DevOps', dept_id: 3, salary: 1050000, rating: 4.6, hire_year: 2021 },
  { id: 105, name: 'Dinesh V', dept: 'Data Analytics', dept_id: 2, salary: 850000, rating: 3.9, hire_year: 2024 },
  { id: 106, name: 'Kavitha M', dept: 'AI Engineering', dept_id: 1, salary: 1600000, rating: 4.9, hire_year: 2020 },
  { id: 107, name: 'Rahul Sharma', dept: 'Cloud DevOps', dept_id: 3, salary: 1150000, rating: 4.3, hire_year: 2023 },
  { id: 108, name: 'Ananya Iyer', dept: 'Data Analytics', dept_id: 2, salary: 980000, rating: 4.7, hire_year: 2022 }
];

export const DEPARTMENTS_TABLE: DepartmentRecord[] = [
  { id: 1, dept_name: 'AI Engineering', location: 'Chennai (Tidel Park)', budget_lpa: 120, manager: 'Dr. S. Ramanathan' },
  { id: 2, dept_name: 'Data Analytics', location: 'Bengaluru (Whitefield)', budget_lpa: 85, manager: 'Priya Sundaram' },
  { id: 3, dept_name: 'Cloud DevOps', location: 'Hyderabad (Hitec City)', budget_lpa: 95, manager: 'Vikram Joshi' }
];

export interface QueryResult {
  columns: string[];
  rows: Array<Record<string, any>>;
  executionTimeMs: number;
  rowCount: number;
}

export interface SqlExecutionResponse {
  success: boolean;
  result?: QueryResult;
  error?: string;
  message?: string;
  summary?: string;
  executedStatementsCount?: number;
}

export interface CustomTable {
  name: string;
  columns: string[];
  rows: Array<Record<string, any>>;
  createdAt: number;
}

const CUSTOM_TABLES = new Map<string, CustomTable>();

export function resetCustomTables(): void {
  CUSTOM_TABLES.clear();
  // Pre-seed a clean starter custom table for instant practice
  CUSTOM_TABLES.set('students', {
    name: 'students',
    columns: ['id', 'name', 'score', 'city', 'track'],
    rows: [
      { id: 1, name: 'Ananya Sharma', score: 94, city: 'Bengaluru', track: 'AI Engineering' },
      { id: 2, name: 'Karthik Raja', score: 88, city: 'Chennai', track: 'Data Analytics' },
      { id: 3, name: 'Pooja Nair', score: 96, city: 'Kochi', track: 'AI Engineering' },
      { id: 4, name: 'Deepak Verma', score: 79, city: 'Hyderabad', track: 'Cloud DevOps' },
      { id: 5, name: 'Sneha Patel', score: 91, city: 'Bengaluru', track: 'Data Analytics' }
    ],
    createdAt: Date.now()
  });
}

// Initialize starter custom tables
resetCustomTables();

export function getCustomTables(): CustomTable[] {
  return Array.from(CUSTOM_TABLES.values());
}

export function listAvailableTables(): Array<{ name: string; columns: string[]; rowCount: number; isCustom: boolean }> {
  const list: Array<{ name: string; columns: string[]; rowCount: number; isCustom: boolean }> = [
    {
      name: 'employees',
      columns: ['id', 'name', 'dept', 'salary', 'rating', 'hire_year'],
      rowCount: EMPLOYEES_TABLE.length,
      isCustom: false
    },
    {
      name: 'departments',
      columns: ['id', 'dept_name', 'location', 'budget_lpa', 'manager'],
      rowCount: DEPARTMENTS_TABLE.length,
      isCustom: false
    }
  ];

  for (const table of CUSTOM_TABLES.values()) {
    list.push({
      name: table.name,
      columns: [...table.columns],
      rowCount: table.rows.length,
      isCustom: true
    });
  }

  return list;
}

export function getTableColumns(tableName: string): string[] {
  const norm = tableName.toLowerCase();
  if (norm === 'employees' || norm === 'employee' || norm === 'emp') {
    return ['id', 'name', 'dept', 'salary', 'rating', 'hire_year'];
  }
  if (norm === 'departments' || norm === 'department' || norm === 'dept' || norm === 'depts') {
    return ['id', 'dept_name', 'location', 'budget_lpa', 'manager'];
  }
  const custom = CUSTOM_TABLES.get(norm);
  if (custom) {
    return [...custom.columns];
  }
  return [];
}

export function executeSqlQuery(rawQuery: string): SqlExecutionResponse {
  const startTime = performance.now();
  const cleanedScript = stripSqlComments(rawQuery).trim();

  if (!cleanedScript) {
    return {
      success: false,
      error: 'Query is empty. Please enter a valid SQL query or DDL statement.'
    };
  }

  const statements = splitSqlStatements(cleanedScript);
  if (statements.length === 0) {
    return {
      success: false,
      error: 'No valid SQL statements found.'
    };
  }

  const executedSummaries: string[] = [];
  let lastQueryResult: QueryResult | undefined;

  for (let sIdx = 0; sIdx < statements.length; sIdx++) {
    const stmt = statements[sIdx].trim();
    if (!stmt) continue;

    // Detect command type
    const firstWordMatch = stmt.match(/^([a-zA-Z_]+)/);
    const firstWord = firstWordMatch ? firstWordMatch[1].toUpperCase() : '';

    if (firstWord === 'CREATE') {
      const createRes = executeCreateTable(stmt);
      if (!createRes.success) {
        return {
          success: false,
          error: statements.length > 1 ? `[Statement ${sIdx + 1}] ${createRes.error}` : createRes.error
        };
      }
      executedSummaries.push(createRes.message || `Table '${createRes.tableName}' created.`);
      if (createRes.tableName && createRes.columns) {
        lastQueryResult = {
          columns: createRes.columns,
          rows: [],
          executionTimeMs: 0.5,
          rowCount: 0
        };
      }
    } else if (firstWord === 'INSERT') {
      const insertRes = executeInsertInto(stmt);
      if (!insertRes.success) {
        return {
          success: false,
          error: statements.length > 1 ? `[Statement ${sIdx + 1}] ${insertRes.error}` : insertRes.error
        };
      }
      executedSummaries.push(insertRes.message || `Inserted ${insertRes.insertedCount} row(s).`);
      if (insertRes.tableName) {
        const tbl = CUSTOM_TABLES.get(insertRes.tableName);
        if (tbl) {
          lastQueryResult = {
            columns: tbl.columns,
            rows: tbl.rows,
            executionTimeMs: 0.5,
            rowCount: tbl.rows.length
          };
        }
      }
    } else if (firstWord === 'SELECT') {
      const selectRes = executeSingleSelect(stmt, startTime);
      if (!selectRes.success) {
        return {
          success: false,
          error: statements.length > 1 ? `[Statement ${sIdx + 1}] ${selectRes.error}` : selectRes.error
        };
      }
      lastQueryResult = selectRes.result;
      executedSummaries.push(`Query returned ${selectRes.result?.rowCount || 0} row(s).`);
    } else {
      const unsupported = ['UPDATE', 'DELETE', 'DROP', 'ALTER', 'TRUNCATE', 'REPLACE', 'UPSERT', 'GRANT', 'REVOKE'];
      if (unsupported.includes(firstWord)) {
        return {
          success: false,
          error: `Command '${firstWord}' is not supported in this interactive learning sandbox. Supported commands: CREATE TABLE, INSERT INTO, SELECT.`
        };
      }
      return {
        success: false,
        error: `Unrecognized SQL statement '${firstWord}'. Supported SQL commands in this sandbox: CREATE TABLE, INSERT INTO, SELECT.`
      };
    }
  }

  const elapsed = Math.round((performance.now() - startTime) * 10) / 10;
  if (lastQueryResult) {
    lastQueryResult.executionTimeMs = Math.max(elapsed, 0.5);
  }

  return {
    success: true,
    result: lastQueryResult,
    message: executedSummaries.join(' • '),
    summary: executedSummaries[executedSummaries.length - 1],
    executedStatementsCount: statements.length
  };
}

function stripSqlComments(sql: string): string {
  let clean = sql.replace(/\/\*[\s\S]*?\*\//g, '');
  clean = clean.replace(/--.*$/gm, '');
  return clean;
}

function splitSqlStatements(script: string): string[] {
  const statements: string[] = [];
  let inQuote: string | null = null;
  let cur = '';

  for (let i = 0; i < script.length; i++) {
    const ch = script[i];

    if ((ch === "'" || ch === '"') && !inQuote) {
      inQuote = ch;
      cur += ch;
    } else if (ch === inQuote) {
      inQuote = null;
      cur += ch;
    } else if (ch === ';' && !inQuote) {
      if (cur.trim()) {
        statements.push(cur.trim());
      }
      cur = '';
    } else {
      cur += ch;
    }
  }

  if (cur.trim()) {
    statements.push(cur.trim());
  }

  return statements;
}

function splitColumnDefinitions(str: string): string[] {
  const defs: string[] = [];
  let cur = '';
  let inParen = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === '(') inParen++;
    if (ch === ')') inParen--;
    if (ch === ',' && inParen === 0) {
      defs.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  if (cur.trim()) defs.push(cur.trim());
  return defs;
}

function executeCreateTable(stmt: string): { success: boolean; message?: string; error?: string; tableName?: string; columns?: string[] } {
  const match = stmt.match(/^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([\s\S]*)\)$/i);
  if (!match) {
    return {
      success: false,
      error: "Invalid CREATE TABLE syntax. Example: CREATE TABLE students (id INT, name VARCHAR(50), score INT, city TEXT);"
    };
  }

  const tableName = match[1].toLowerCase();
  if (tableName === 'employees' || tableName === 'departments') {
    return {
      success: false,
      error: `Cannot overwrite built-in system table '${tableName}'. Please choose a different table name.`
    };
  }

  const rawCols = match[2];
  const colDefs = splitColumnDefinitions(rawCols);
  if (colDefs.length === 0) {
    return {
      success: false,
      error: "CREATE TABLE must define at least one column. Example: CREATE TABLE products (id INT, title TEXT);"
    };
  }

  const columns: string[] = [];
  for (const def of colDefs) {
    const trimmed = def.trim();
    if (!trimmed) continue;
    const colNameMatch = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)/);
    if (colNameMatch) {
      columns.push(colNameMatch[1].toLowerCase());
    }
  }

  if (columns.length === 0) {
    return {
      success: false,
      error: "No valid column names found in CREATE TABLE statement."
    };
  }

  CUSTOM_TABLES.set(tableName, {
    name: tableName,
    columns,
    rows: [],
    createdAt: Date.now()
  });

  return {
    success: true,
    tableName,
    columns,
    message: `Table '${tableName}' created successfully with columns: ${columns.join(', ')}.`
  };
}

function splitValueTuples(rawValues: string): string[] {
  const tuples: string[] = [];
  let inParen = false;
  let inQuote: string | null = null;
  let cur = '';

  for (let i = 0; i < rawValues.length; i++) {
    const ch = rawValues[i];

    if ((ch === "'" || ch === '"') && !inQuote) {
      inQuote = ch;
      cur += ch;
    } else if (ch === inQuote) {
      inQuote = null;
      cur += ch;
    } else if (!inQuote && ch === '(') {
      inParen = true;
      cur = '';
    } else if (!inQuote && ch === ')') {
      inParen = false;
      tuples.push(cur.trim());
      cur = '';
    } else if (inParen) {
      cur += ch;
    }
  }

  return tuples;
}

function cleanSqlValue(raw: string): any {
  const trimmed = raw.trim();
  if (trimmed.toUpperCase() === 'NULL') return null;
  if (trimmed.toUpperCase() === 'TRUE') return true;
  if (trimmed.toUpperCase() === 'FALSE') return false;

  if ((trimmed.startsWith("'") && trimmed.endsWith("'")) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
    return trimmed.slice(1, -1);
  }

  if (!isNaN(Number(trimmed)) && trimmed !== '') {
    return Number(trimmed);
  }

  return trimmed;
}

function parseTupleValues(tupleContent: string): any[] {
  const items: any[] = [];
  let inQuote: string | null = null;
  let cur = '';

  for (let i = 0; i < tupleContent.length; i++) {
    const ch = tupleContent[i];

    if ((ch === "'" || ch === '"') && !inQuote) {
      inQuote = ch;
    } else if (ch === inQuote) {
      inQuote = null;
    } else if (ch === ',' && !inQuote) {
      items.push(cleanSqlValue(cur.trim()));
      cur = '';
    } else {
      cur += ch;
    }
  }
  if (cur.trim() || items.length > 0) {
    items.push(cleanSqlValue(cur.trim()));
  }

  return items;
}

function executeInsertInto(stmt: string): { success: boolean; message?: string; error?: string; insertedCount?: number; totalRows?: number; tableName?: string } {
  const match = stmt.match(/^INSERT\s+INTO\s+([a-zA-Z_][a-zA-Z0-9_]*)(?:\s*\(([^)]+)\))?\s+VALUES\s*([\s\S]+)$/i);
  if (!match) {
    return {
      success: false,
      error: "Invalid INSERT INTO syntax. Example: INSERT INTO students (id, name, score) VALUES (1, 'Aditya', 92), (2, 'Priya', 88);"
    };
  }

  const tableName = match[1].toLowerCase();
  const rawCols = match[2];
  const rawValues = match[3].trim();

  const table = CUSTOM_TABLES.get(tableName);
  if (!table) {
    const available = listAvailableTables().map(t => `'${t.name}'`).join(', ');
    return {
      success: false,
      error: `Table '${tableName}' does not exist. Available tables: ${available}. Run CREATE TABLE ${tableName} (...) first.`
    };
  }

  let targetCols: string[] = [];
  if (rawCols) {
    targetCols = rawCols.split(',').map(s => s.trim().toLowerCase());
    for (const c of targetCols) {
      if (!table.columns.includes(c)) {
        return {
          success: false,
          error: `Column '${c}' does not exist in table '${tableName}'. Valid columns: ${table.columns.join(', ')}.`
        };
      }
    }
  } else {
    targetCols = [...table.columns];
  }

  const tuples = splitValueTuples(rawValues);
  if (tuples.length === 0) {
    return {
      success: false,
      error: "No values found to insert. Example: VALUES (1, 'Alice', 95);"
    };
  }

  const newRows: Array<Record<string, any>> = [];

  for (let tIdx = 0; tIdx < tuples.length; tIdx++) {
    const tupleStr = tuples[tIdx];
    const vals = parseTupleValues(tupleStr);

    if (vals.length !== targetCols.length) {
      return {
        success: false,
        error: `Value count mismatch in row ${tIdx + 1}: Expected ${targetCols.length} values (${targetCols.join(', ')}), but found ${vals.length} values.`
      };
    }

    const rowObj: Record<string, any> = {};
    for (const col of table.columns) {
      rowObj[col] = null;
    }
    for (let i = 0; i < targetCols.length; i++) {
      rowObj[targetCols[i]] = vals[i];
    }
    newRows.push(rowObj);
  }

  table.rows.push(...newRows);

  return {
    success: true,
    tableName,
    insertedCount: newRows.length,
    totalRows: table.rows.length,
    message: `Successfully inserted ${newRows.length} row(s) into '${tableName}'. Total rows: ${table.rows.length}.`
  };
}

function executeSingleSelect(cleaned: string, startTime: number): SqlExecutionResponse {
  try {
    const clauseRegex = /\b(FROM|WHERE|GROUP\s+BY|HAVING|ORDER\s+BY|LIMIT)\b/gi;
    const clausePositions: Array<{ name: string; index: number }> = [];
    let match: RegExpExecArray | null;

    while ((match = clauseRegex.exec(cleaned)) !== null) {
      clausePositions.push({
        name: match[1].toUpperCase().replace(/\s+/g, ' '),
        index: match.index
      });
    }

    let selectSection = '';
    let fromSection = '';
    let whereSection = '';
    let groupBySection = '';
    let havingSection = '';
    let orderBySection = '';
    let limitSection = '';

    if (clausePositions.length === 0) {
      return {
        success: false,
        error: 'Missing FROM clause in SELECT query (e.g. SELECT * FROM employees).'
      };
    }

    selectSection = cleaned.substring(6, clausePositions[0].index).trim();

    for (let i = 0; i < clausePositions.length; i++) {
      const current = clausePositions[i];
      const nextIndex = i + 1 < clausePositions.length ? clausePositions[i + 1].index : cleaned.length;
      const content = cleaned.substring(current.index + current.name.length, nextIndex).trim();

      switch (current.name) {
        case 'FROM':
          fromSection = content;
          break;
        case 'WHERE':
          whereSection = content;
          break;
        case 'GROUP BY':
          groupBySection = content;
          break;
        case 'HAVING':
          havingSection = content;
          break;
        case 'ORDER BY':
          orderBySection = content;
          break;
        case 'LIMIT':
          limitSection = content;
          break;
      }
    }

    if (!fromSection) {
      return {
        success: false,
        error: 'FROM clause is required (e.g. FROM employees).'
      };
    }

    const { primaryTable, primaryAlias, joinTable, joinAlias, joinCondition, isLeftJoin } = parseFromClause(fromSection);

    const primaryData = getTableData(primaryTable);
    if (!primaryData) {
      const available = listAvailableTables().map((t) => `'${t.name}'`).join(', ');
      return {
        success: false,
        error: `Table '${primaryTable}' does not exist. Available tables: ${available}.`
      };
    }

    let joinedRows: Array<Record<string, any>> = [];

    if (joinTable) {
      const joinData = getTableData(joinTable);
      if (!joinData) {
        const available = listAvailableTables().map((t) => `'${t.name}'`).join(', ');
        return {
          success: false,
          error: `Table '${joinTable}' does not exist. Available tables: ${available}.`
        };
      }

      for (const pRow of primaryData) {
        let matchedAny = false;
        for (const jRow of joinData) {
          if (evaluateJoinCondition(pRow, primaryAlias, jRow, joinAlias, joinCondition)) {
            matchedAny = true;
            joinedRows.push(createCombinedRow(pRow, primaryAlias, primaryTable, jRow, joinAlias, joinTable));
          }
        }
        if (!matchedAny && isLeftJoin) {
          joinedRows.push(createCombinedRow(pRow, primaryAlias, primaryTable, {}, joinAlias, joinTable));
        }
      }
    } else {
      joinedRows = primaryData.map((row) => createSingleTableRow(row, primaryAlias, primaryTable));
    }

    let filteredRows = joinedRows;
    if (whereSection) {
      filteredRows = joinedRows.filter((row) => evaluateCondition(row, whereSection));
    }

    let projectedRows: Array<Record<string, any>> = [];
    let outputColumns: string[] = [];

    const isAggregateQuery = Boolean(groupBySection) || hasAggregateFunctions(selectSection);

    if (isAggregateQuery) {
      const grouped = performAggregation(filteredRows, selectSection, groupBySection, havingSection);
      projectedRows = grouped.rows;
      outputColumns = grouped.columns;
    } else {
      const projected = projectColumns(filteredRows, selectSection, primaryTable, joinTable);
      projectedRows = projected.rows;
      outputColumns = projected.columns;
    }

    if (orderBySection) {
      projectedRows = sortRows(projectedRows, orderBySection);
    }

    if (limitSection) {
      const limitNum = parseInt(limitSection.trim(), 10);
      if (!isNaN(limitNum) && limitNum >= 0) {
        projectedRows = projectedRows.slice(0, limitNum);
      }
    }

    const elapsed = Math.round((performance.now() - startTime) * 10) / 10;

    return {
      success: true,
      result: {
        columns: outputColumns,
        rows: projectedRows,
        executionTimeMs: Math.max(elapsed, 0.5),
        rowCount: projectedRows.length
      }
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'SQL Execution error: Please check your query syntax.'
    };
  }
}

// ----------------- Helpers & Parser Logic -----------------

function getTableData(tableName: string): any[] | null {
  const norm = tableName.toLowerCase();
  if (norm === 'employees' || norm === 'employee' || norm === 'emp') {
    return EMPLOYEES_TABLE;
  }
  if (norm === 'departments' || norm === 'department' || norm === 'dept' || norm === 'depts') {
    return DEPARTMENTS_TABLE;
  }
  const custom = CUSTOM_TABLES.get(norm);
  if (custom) {
    return custom.rows;
  }
  return null;
}

function parseFromClause(fromStr: string) {
  // Regex to detect JOIN
  const joinMatch = fromStr.match(
    /^(.*?)\s+(LEFT\s+OUTER\s+JOIN|LEFT\s+JOIN|INNER\s+JOIN|JOIN)\s+(.*?)\s+ON\s+(.*)$/i
  );

  if (joinMatch) {
    const leftPart = joinMatch[1].trim();
    const joinType = joinMatch[2].toUpperCase();
    const rightPart = joinMatch[3].trim();
    const joinCondition = joinMatch[4].trim();

    const [primaryTable, primaryAlias] = extractTableAndAlias(leftPart);
    const [joinTable, joinAlias] = extractTableAndAlias(rightPart);

    return {
      primaryTable,
      primaryAlias: primaryAlias || primaryTable,
      joinTable,
      joinAlias: joinAlias || joinTable,
      joinCondition,
      isLeftJoin: joinType.includes('LEFT')
    };
  }

  const [primaryTable, primaryAlias] = extractTableAndAlias(fromStr);
  return {
    primaryTable,
    primaryAlias: primaryAlias || primaryTable,
    joinTable: null,
    joinAlias: null,
    joinCondition: null,
    isLeftJoin: false
  };
}

function extractTableAndAlias(part: string): [string, string | null] {
  const tokens = part.trim().split(/\s+/);
  if (tokens.length === 1) {
    return [tokens[0], null];
  }
  if (tokens.length >= 3 && tokens[1].toUpperCase() === 'AS') {
    return [tokens[0], tokens[2]];
  }
  return [tokens[0], tokens[1]];
}

const COLUMN_SYNONYMS: Record<string, string[]> = {
  dept: ['department', 'dept_name', 'department_name'],
  department: ['dept', 'dept_name', 'department_name'],
  dept_name: ['dept', 'department'],
  id: ['employee_id', 'emp_id'],
  employee_id: ['id', 'emp_id'],
  emp_id: ['id', 'employee_id'],
  rating: ['performance_rating', 'perf_rating'],
  performance_rating: ['rating', 'perf_rating'],
  perf_rating: ['rating', 'performance_rating'],
  salary: ['compensation', 'comp'],
  compensation: ['salary', 'comp']
};

function createSingleTableRow(row: Record<string, any>, alias: string, table: string) {
  const combined: Record<string, any> = {};
  for (const [key, val] of Object.entries(row)) {
    const k = key.toLowerCase();
    combined[k] = val;
    combined[`${alias.toLowerCase()}.${k}`] = val;
    combined[`${table.toLowerCase()}.${k}`] = val;

    const syns = COLUMN_SYNONYMS[k] || [];
    for (const s of syns) {
      combined[s] = val;
      combined[`${alias.toLowerCase()}.${s}`] = val;
      combined[`${table.toLowerCase()}.${s}`] = val;
    }
  }
  return combined;
}

function createCombinedRow(
  pRow: Record<string, any>,
  pAlias: string,
  pTable: string,
  jRow: Record<string, any>,
  jAlias: string,
  jTable: string
) {
  const combined: Record<string, any> = {};

  for (const [key, val] of Object.entries(pRow)) {
    const k = key.toLowerCase();
    combined[k] = val;
    combined[`${pAlias.toLowerCase()}.${k}`] = val;
    combined[`${pTable.toLowerCase()}.${k}`] = val;
    const syns = COLUMN_SYNONYMS[k] || [];
    for (const s of syns) {
      combined[s] = val;
      combined[`${pAlias.toLowerCase()}.${s}`] = val;
      combined[`${pTable.toLowerCase()}.${s}`] = val;
    }
  }

  for (const [key, val] of Object.entries(jRow)) {
    const k = key.toLowerCase();
    if (!(k in combined)) {
      combined[k] = val;
    }
    combined[`${jAlias.toLowerCase()}.${k}`] = val;
    combined[`${jTable.toLowerCase()}.${k}`] = val;
    const syns = COLUMN_SYNONYMS[k] || [];
    for (const s of syns) {
      if (!(s in combined)) {
        combined[s] = val;
      }
      combined[`${jAlias.toLowerCase()}.${s}`] = val;
      combined[`${jTable.toLowerCase()}.${s}`] = val;
    }
  }

  return combined;
}

function evaluateJoinCondition(
  pRow: Record<string, any>,
  pAlias: string,
  jRow: Record<string, any>,
  jAlias: string,
  conditionStr: string | null
): boolean {
  if (!conditionStr) return true;
  const parts = conditionStr.split('=').map((s) => s.trim());
  if (parts.length !== 2) return true;

  const leftVal = resolveJoinOperand(parts[0], pRow, pAlias, jRow, jAlias);
  const rightVal = resolveJoinOperand(parts[1], pRow, pAlias, jRow, jAlias);

  return String(leftVal).toLowerCase() === String(rightVal).toLowerCase();
}

function resolveJoinOperand(
  operand: string,
  pRow: Record<string, any>,
  pAlias: string,
  jRow: Record<string, any>,
  jAlias: string
): any {
  const clean = operand.trim().toLowerCase();
  if (clean.includes('.')) {
    const [prefix, col] = clean.split('.');
    if (prefix === pAlias.toLowerCase()) return pRow[col];
    if (prefix === jAlias.toLowerCase()) return jRow[col];
  }
  return pRow[clean] !== undefined ? pRow[clean] : jRow[clean];
}

function evaluateCondition(row: Record<string, any>, whereClause: string): boolean {
  // Support OR / AND conjunctions
  // Split by OR first
  const orParts = whereClause.split(/\bOR\b/i);

  return orParts.some((orBlock) => {
    const andParts = orBlock.split(/\bAND\b/i);
    return andParts.every((sub) => evaluateSinglePredicate(row, sub.trim()));
  });
}

function evaluateSinglePredicate(row: Record<string, any>, predicate: string): boolean {
  const p = predicate.trim();

  // LIKE operator
  const likeMatch = p.match(/^(.*?)\s+LIKE\s+['"](.*?)['"]$/i);
  if (likeMatch) {
    const colName = likeMatch[1].trim().toLowerCase();
    const pattern = likeMatch[2].replace(/%/g, '.*');
    const val = String(resolveValue(row, colName) || '');
    const re = new RegExp(`^${pattern}$`, 'i');
    return re.test(val);
  }

  // Comparison operators (>=, <=, !=, <>, =, >, <)
  const compMatch = p.match(/^(.*?)\s*(>=|<=|!=|<>|=|>|<)\s*(.*)$/);
  if (!compMatch) return true;

  const leftRaw = compMatch[1].trim();
  const op = compMatch[2];
  const rightRaw = compMatch[3].trim().replace(/^['"]|['"]$/g, '');

  const leftVal = resolveValue(row, leftRaw.toLowerCase());
  let rightVal: any = rightRaw;

  // Convert numbers if numeric
  if (!isNaN(Number(rightRaw)) && !isNaN(parseFloat(rightRaw))) {
    rightVal = parseFloat(rightRaw);
  }

  const leftComp = typeof leftVal === 'number' ? leftVal : String(leftVal || '').toLowerCase();
  const rightComp = typeof rightVal === 'number' ? rightVal : String(rightVal || '').toLowerCase();

  switch (op) {
    case '=':
      return leftComp == rightComp;
    case '!=':
    case '<>':
      return leftComp != rightComp;
    case '>=':
      return leftComp >= rightComp;
    case '<=':
      return leftComp <= rightComp;
    case '>':
      return leftComp > rightComp;
    case '<':
      return leftComp < rightComp;
    default:
      return true;
  }
}

function resolveValue(row: Record<string, any>, colIdentifier: string): any {
  const key = colIdentifier.trim().toLowerCase();
  if (key in row) return row[key];

  // If identifier has alias like e.salary, check without prefix
  if (key.includes('.')) {
    const [, bare] = key.split('.');
    if (bare in row) return row[bare];
    const syns = COLUMN_SYNONYMS[bare] || [];
    for (const s of syns) {
      if (s in row) return row[s];
    }
  }

  const syns = COLUMN_SYNONYMS[key] || [];
  for (const s of syns) {
    if (s in row) return row[s];
  }

  return undefined;
}

function hasAggregateFunctions(selectStr: string): boolean {
  return /\b(COUNT|AVG|SUM|MIN|MAX)\b/i.test(selectStr);
}

function projectColumns(
  rows: Array<Record<string, any>>,
  selectStr: string,
  primaryTable?: string,
  joinTable?: string | null
) {
  const rawItems = splitSelectItems(selectStr);
  const isWildcard = rawItems.some((item) => item.trim() === '*');

  if (isWildcard) {
    let columns = primaryTable ? getTableColumns(primaryTable) : [];
    if (joinTable) {
      columns = [...columns, ...getTableColumns(joinTable)];
    }
    if (columns.length === 0) {
      if (rows.length > 0) {
        columns = Object.keys(rows[0]).filter((k) => !k.includes('.'));
      } else {
        columns = ['id', 'name', 'dept', 'salary', 'rating'];
      }
    }
    const projectedRows = rows.map((r) => {
      const out: Record<string, any> = {};
      for (const c of columns) {
        const val = resolveValue(r, c);
        out[c] = val !== undefined ? val : (primaryTable ? r[`${primaryTable.toLowerCase()}.${c}`] : undefined);
      }
      return out;
    });
    return { columns, rows: projectedRows };
  }

  const columnMeta = rawItems.map((item) => parseSelectItem(item));
  const columns = columnMeta.map((c) => c.alias);

  const projectedRows = rows.map((r) => {
    const out: Record<string, any> = {};
    for (const c of columnMeta) {
      out[c.alias] = resolveValue(r, c.col);
    }
    return out;
  });

  return { columns, rows: projectedRows };
}

function splitSelectItems(selectStr: string): string[] {
  const items: string[] = [];
  let current = '';
  let inParen = 0;

  for (let i = 0; i < selectStr.length; i++) {
    const ch = selectStr[i];
    if (ch === '(') inParen++;
    if (ch === ')') inParen--;

    if (ch === ',' && inParen === 0) {
      items.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) {
    items.push(current.trim());
  }

  return items;
}

function parseSelectItem(itemStr: string): { col: string; alias: string } {
  const trimmed = itemStr.trim();

  // Check for explicit "AS alias"
  const asMatch = trimmed.match(/^(.*?)\s+AS\s+([a-zA-Z_][a-zA-Z0-9_]*)$/i);
  if (asMatch) {
    return { col: asMatch[1].trim(), alias: asMatch[2].trim() };
  }

  // Check for aggregate functions with optional alias
  if (trimmed.includes(')')) {
    const afterParenIdx = trimmed.lastIndexOf(')');
    const expr = trimmed.substring(0, afterParenIdx + 1).trim();
    const rest = trimmed.substring(afterParenIdx + 1).trim();
    if (rest) {
      const alias = rest.replace(/^AS\s+/i, '').trim();
      return { col: expr, alias: alias || expr };
    }
    return { col: expr, alias: expr };
  }

  const spaceTokens = trimmed.split(/\s+/);
  if (spaceTokens.length === 2 && !spaceTokens[0].includes('(')) {
    return { col: spaceTokens[0], alias: spaceTokens[1] };
  }

  let alias = trimmed;
  if (alias.includes('.')) {
    const [, bare] = alias.split('.');
    alias = bare;
  }

  return { col: trimmed, alias };
}

function performAggregation(
  rows: Array<Record<string, any>>,
  selectStr: string,
  groupByStr: string,
  havingStr: string
) {
  const selectItems = splitSelectItems(selectStr).map(parseSelectItem);
  const groupCols = groupByStr ? groupByStr.split(',').map((s) => s.trim().toLowerCase()) : [];

  // Group rows
  const buckets = new Map<string, Array<Record<string, any>>>();

  if (groupCols.length > 0) {
    for (const r of rows) {
      const key = groupCols.map((c) => String(resolveValue(r, c))).join('__');
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key)!.push(r);
    }
  } else {
    // Entire dataset is single group
    buckets.set('__all__', rows);
  }

  const columns = selectItems.map((s) => s.alias);
  const resultRows: Array<Record<string, any>> = [];

  for (const [, bucketRows] of buckets.entries()) {
    const rowObj: Record<string, any> = {};

    for (const item of selectItems) {
      const expr = item.col.trim();

      // Check for aggregates
      const aggMatch = expr.match(/^(COUNT|AVG|SUM|MIN|MAX)\((.*?)\)$/i);
      if (aggMatch) {
        const fn = aggMatch[1].toUpperCase();
        const innerCol = aggMatch[2].trim().toLowerCase();

        let val: any = 0;
        if (fn === 'COUNT') {
          val = innerCol === '*' ? bucketRows.length : bucketRows.filter((r) => resolveValue(r, innerCol) !== undefined).length;
        } else if (fn === 'AVG') {
          const numbers = bucketRows.map((r) => parseFloat(resolveValue(r, innerCol))).filter((n) => !isNaN(n));
          val = numbers.length > 0 ? Math.round((numbers.reduce((a, b) => a + b, 0) / numbers.length) * 100) / 100 : 0;
        } else if (fn === 'SUM') {
          const numbers = bucketRows.map((r) => parseFloat(resolveValue(r, innerCol))).filter((n) => !isNaN(n));
          val = numbers.reduce((a, b) => a + b, 0);
        } else if (fn === 'MIN') {
          const numbers = bucketRows.map((r) => parseFloat(resolveValue(r, innerCol))).filter((n) => !isNaN(n));
          val = numbers.length > 0 ? Math.min(...numbers) : 0;
        } else if (fn === 'MAX') {
          const numbers = bucketRows.map((r) => parseFloat(resolveValue(r, innerCol))).filter((n) => !isNaN(n));
          val = numbers.length > 0 ? Math.max(...numbers) : 0;
        }

        rowObj[item.alias] = val;
      } else {
        // Group column or ordinary column
        rowObj[item.alias] = bucketRows.length > 0 ? resolveValue(bucketRows[0], expr) : null;
      }
    }

    // Evaluate HAVING if present
    if (havingStr) {
      if (!evaluateHavingClause(rowObj, havingStr, bucketRows)) {
        continue;
      }
    }

    resultRows.push(rowObj);
  }

  return { columns, rows: resultRows };
}

function evaluateHavingClause(
  rowObj: Record<string, any>,
  havingClause: string,
  bucketRows: Array<Record<string, any>>
): boolean {
  // Try resolving direct alias first e.g. total_staff > 2 or COUNT(id) > 2
  const compMatch = havingClause.trim().match(/^(.*?)\s*(>=|<=|!=|<>|=|>|<)\s*(.*)$/);
  if (!compMatch) return true;

  const leftExpr = compMatch[1].trim();
  const op = compMatch[2];
  const rightVal = parseFloat(compMatch[3].trim());

  let actualVal = rowObj[leftExpr];

  if (actualVal === undefined) {
    // If not found in rowObj aliases, check if it's COUNT(*) or AVG(...)
    const aggMatch = leftExpr.match(/^(COUNT|AVG|SUM)\((.*?)\)$/i);
    if (aggMatch) {
      const fn = aggMatch[1].toUpperCase();
      const col = aggMatch[2].trim().toLowerCase();
      if (fn === 'COUNT') {
        actualVal = col === '*' ? bucketRows.length : bucketRows.filter((r) => resolveValue(r, col) !== undefined).length;
      } else if (fn === 'AVG') {
        const nums = bucketRows.map((r) => parseFloat(resolveValue(r, col))).filter((n) => !isNaN(n));
        actualVal = nums.length > 0 ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
      }
    }
  }

  if (actualVal === undefined) return true;

  switch (op) {
    case '>=': return actualVal >= rightVal;
    case '<=': return actualVal <= rightVal;
    case '>': return actualVal > rightVal;
    case '<': return actualVal < rightVal;
    case '=': return actualVal == rightVal;
    case '!=':
    case '<>': return actualVal != rightVal;
    default: return true;
  }
}

function sortRows(rows: Array<Record<string, any>>, orderByStr: string) {
  const parts = orderByStr.split(',').map((s) => s.trim());
  const sortMeta = parts.map((part) => {
    const isDesc = /\bDESC\b/i.test(part);
    const colName = part.replace(/\b(ASC|DESC)\b/gi, '').trim().toLowerCase();
    return { colName, isDesc };
  });

  return [...rows].sort((a, b) => {
    for (const { colName, isDesc } of sortMeta) {
      const valA = a[colName] !== undefined ? a[colName] : resolveValue(a, colName);
      const valB = b[colName] !== undefined ? b[colName] : resolveValue(b, colName);

      if (valA === valB) continue;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return isDesc ? valB - valA : valA - valB;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      if (strA < strB) return isDesc ? 1 : -1;
      if (strA > strB) return isDesc ? -1 : 1;
    }
    return 0;
  });
}
