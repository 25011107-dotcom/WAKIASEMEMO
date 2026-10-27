import { Screen } from "../../base/js/Screen.js";

// メモ画面（仕様書「画面モックアップ」：左に一覧と操作、右にエディタ）
export default class MemoScreen extends Screen {
  title = "メモ";
  styles = ["/main/memos/memos.css"];

  async mount(container) {
    const section = document.createElement("section");
    section.className = "screen";

    const heading = document.createElement("h1");
    heading.className = "screen-title";
    heading.textContent = "メモ";

    section.append(heading);
    container.append(section);

    // TODO: 一覧（F-01・F-05）とエディタ（F-02〜F-04・F-06）を作る
  }

  // TODO(F-07): 未保存の変更があるときは確認し、破棄しないなら false を返す
  canLeave() {
    return true;
  }

  // TODO: WebSocket の切断など、この画面で始めたものを片付ける
  unmount() {}
}
