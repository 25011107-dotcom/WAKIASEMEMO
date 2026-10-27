// ステータスコード付きのエラー。コントローラで throw すると errorHandler がそのコードで返す
export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}
