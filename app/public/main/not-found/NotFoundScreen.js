import { Screen } from "../../base/js/Screen.js";

// どの URL にも当てはまらないときの画面
export default class NotFoundScreen extends Screen {
  title = "ページが見つかりません";

  async mount(container) {
    const section = document.createElement("section");
    section.className = "screen";

    const heading = document.createElement("h1");
    heading.className = "screen-title";
    heading.textContent = "ページが見つかりません";

    const link = document.createElement("a");
    link.className = "button";
    link.href = "/";
    link.dataset.link = "";
    link.textContent = "メモへ戻る";

    section.append(heading, link);
    container.append(section);
  }
}
