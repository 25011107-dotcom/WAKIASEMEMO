// タイトル自動補完（F-09 / UC-10）
// 前後の空白を取り除き、空ならサーバーの当日の日付で「メモ(YYYY-MM-DD)」にする
export function defaultTitle(title: unknown): string {
  const trimmed = typeof title === "string" ? title.trim() : "";
  if (trimmed) {
    return trimmed;
  }

  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `メモ(${yyyy}-${mm}-${dd})`;
}
