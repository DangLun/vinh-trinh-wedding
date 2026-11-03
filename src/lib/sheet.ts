// Chỉ dùng ở server (Server Action, trang server): đọc SHEET_SCRIPT_URL / SHEET_SECRET.
// Danh sách khách, hồi âm và lời chúc nằm chung một Google Sheet, đọc ghi qua một
// Google Apps Script (scripts/google-apps-script.gs). Cách cài: docs/google-sheets.md.

export const sheetConfigured = () =>
  Boolean(process.env.SHEET_SCRIPT_URL && process.env.SHEET_SECRET);

/** Gọi một việc của Apps Script; script trả `{ ok: false }` thì ném lỗi */
export async function callSheet<T>(
  action: string,
  payload: object = {},
): Promise<T> {
  const url = process.env.SHEET_SCRIPT_URL;
  const secret = process.env.SHEET_SECRET;
  if (!url || !secret) throw new Error("sheet-not-configured");
  // Apps Script trả 302 sang trang kết quả; fetch tự theo chuyển hướng
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ secret, action, ...payload }),
    redirect: "follow",
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`sheet-http-${res.status}`);
  const data = (await res.json()) as { ok: boolean; error?: string } & T;
  if (!data.ok) throw new Error(`sheet-${data.error ?? "failed"}`);
  return data;
}
