// すべての画面のもとになるクラス
// main/<画面>/ の画面クラスは、このクラスを継承して mount() に中身を書く
export class Screen {
  // ブラウザのタブに表示する画面名
  title = "";
  // この画面だけで使う CSS のパス（例: ["/main/memos/memos.css"]）
  styles = [];

  // 画面を表示する。container は <main>、params は URL の :id などの値
  async mount(container, params) {}

  // 別の画面へ移る直前に呼ばれる。false を返すと移動を止める
  // 未保存の変更があるときの確認（F-07 の編集ガード）などに使う
  canLeave() {
    return true;
  }

  // 画面を閉じるときに呼ばれる。タイマーや WebSocket などの後片付けをする
  unmount() {}
}
