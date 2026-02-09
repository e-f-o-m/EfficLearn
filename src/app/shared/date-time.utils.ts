export function nowFormatYMDHMS(): string {
  //"2026-01-05 09:36:14"
  return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 19).replace('T', ' ')
}