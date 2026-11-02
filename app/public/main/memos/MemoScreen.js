import { Screen } from "../../base/js/Screen.js";

const TITLE_MAX_LENGTH = 100;
const CONTENT_MAX_LENGTH = 10000;

// 並び替えの6パターン（F-05）
const SORT_OPTIONS = [
  { value: "updatedAt-desc", label: "更新日時（新しい順）" },
  { value: "updatedAt-asc", label: "更新日時（古い順）" },
  { value: "createdAt-desc", label: "登録日時（新しい順）" },
  { value: "createdAt-asc", label: "登録日時（古い順）" },
  { value: "title-asc", label: "タイトル（昇順）" },
  { value: "title-desc", label: "タイトル（降順）" },
];

// 要素を作り、className や id などのプロパティをまとめて設定する
function el(tag, props = {}) {
  return Object.assign(document.createElement(tag), props);
}

// メモ画面（仕様書「画面モックアップ」：左に一覧と操作、右にエディタ）
export default class MemoScreen extends Screen {
  title = "メモ";
  styles = ["/main/memos/memos.css"];

  async mount(container) {
    const root = el("div", { className: "memos" });
    root.append(this.#createSidebar(), this.#createEditor());
    container.append(root);

    // TODO: 一覧の取得と描画（F-01）、並び替え（F-05）、下書き（F-06）をつなぐ
  }

  // 左側：「＋ 新規」ボタン、並び替え、メモ一覧
  #createSidebar() {
    const sidebar = el("aside", { className: "memos-sidebar" });

    const heading = el("h1", { className: "memos-heading", textContent: "メモ一覧" });
    const newButton = el("button", {
      id: "newBtn",
      className: "button button-primary",
      type: "button",
      textContent: "＋ 新規",
    });

    const sortSelect = el("select", { id: "sortSelect", className: "input memos-sort-select" });
    for (const { value, label } of SORT_OPTIONS) {
      sortSelect.append(el("option", { value, textContent: label }));
    }
    const sort = el("label", { className: "memos-sort", textContent: "並び替え" });
    sort.append(sortSelect);

    const list = el("ul", { id: "memoList", className: "memos-list" });
    list.append(el("li", { className: "memos-empty", textContent: "メモはまだありません" }));

    sidebar.append(heading, newButton, sort, list);
    return sidebar;
  }

  // 右側：ノートのページ（タイトル、本文）と、ステータス、保存・削除ボタン
  #createEditor() {
    const editor = el("section", { className: "memos-editor" });
    editor.setAttribute("aria-label", "エディタ");

    const titleInput = el("input", {
      id: "titleInput",
      className: "input memos-title",
      type: "text",
      maxLength: TITLE_MAX_LENGTH,
      placeholder: "タイトル",
    });
    titleInput.setAttribute("aria-label", "タイトル");

    const contentInput = el("textarea", {
      id: "contentInput",
      className: "input memos-content",
      maxLength: CONTENT_MAX_LENGTH,
      placeholder: "本文を入力",
    });
    contentInput.setAttribute("aria-label", "本文");

    // ノートのページの上に印刷された欄（飾りなので読み上げない）
    const print = el("div", { className: "memos-page-print" });
    print.setAttribute("aria-hidden", "true");
    print.append(el("span", { textContent: "No." }), el("span", { textContent: "Date      .      ." }));

    const page = el("div", { className: "memos-page" });
    page.append(print, titleInput, contentInput);

    const status = el("p", { id: "status", className: "memos-status" });
    status.setAttribute("role", "status");

    // 新規作成中は削除できない（T-UI-04）
    const deleteButton = el("button", {
      id: "deleteBtn",
      className: "button button-danger",
      type: "button",
      textContent: "削除",
      disabled: true,
    });
    const saveButton = el("button", {
      id: "saveBtn",
      className: "button button-primary",
      type: "button",
      textContent: "保存",
    });

    const actions = el("div", { className: "memos-actions" });
    actions.append(status, deleteButton, saveButton);

    editor.append(page, actions);
    return editor;
  }

  // TODO(F-07): 未保存の変更があるときは確認し、破棄しないなら false を返す
  canLeave() {
    return true;
  }

  // TODO: WebSocket の切断など、この画面で始めたものを片付ける
  unmount() {}
}
