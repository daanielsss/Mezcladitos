export function useSQLite() {
  async function query(sql: string, params: any[] = []) {
    return await window.api.query(sql, params);
  }

  async function run(sql: string, params: any[] = []) {
    return await window.api.run(sql, params);
  }

  return { query, run };
}
