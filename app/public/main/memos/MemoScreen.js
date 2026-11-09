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

const API_BASE = "/api/memos";
// 下書きを保存する LocalStorage のキー（F-06）
const DRAFT_KEY = "memo-app:draft";

// タイトルの並びはブラウザの ja 照合で決める（F-05）
const titleCollator = new Intl.Collator("ja");
const dateFormat = new Intl.DateTimeFormat("ja-JP", { dateStyle: "short", timeStyle: "short" });

// 要素を作り、className や id などのプロパティをまとめて設定する
function el(tag, props = {}) {
  return Object.assign(document.createElement(tag), props);
}

// "updatedAt-desc" などの値で、メモの配列を並び替えたコピーを返す（F-05）
function sortMemos(memos, sortValue) {
  const [key, order] = sortValue.split("-");
  const sign = order === "asc" ? 1 : -1;
  const compare =
    key === "title"
      ? (a, b) => titleCollator.compare(a.title, b.title)
      : (a, b) => new Date(a[key]) - new Date(b[key]);
  return [...memos].sort((a, b) => compare(a, b) * sign);
}

// ---- 下書き（F-06） ----
// プライベートブラウズなどで LocalStorage が使えないときは、下書きなしで動かす

// { id, title, content }。id は編集中のメモの ID（新規なら null）
function readDraft() {
  try {
    const draft = JSON.parse(localStorage.getItem(DRAFT_KEY));
    if (draft && typeof draft.title === "string" && typeof draft.content === "string") {
      return { id: Number.isInteger(draft.id) ? draft.id : null, title: draft.title, content: draft.content };
    }
  } catch {
    // 壊れた下書きは使わない
  }
  return null;
}

function writeDraft(draft) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // 保存できなくても編集は続けられる
  }
}

function removeDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // 何もしない
  }
}

// API のエラー。status で 404 などを見分ける
class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// メモ画面（仕様書「画面モックアップ」：左に一覧と操作、右にエディタ）
export default class MemoScreen extends Screen {
  title = "メモ";
  styles = ["/main/memos/memos.css"];

  // 変更を起こしたのがこのタブかどうかを、サーバーに伝える ID（F-08 の originId）
  #clientId = crypto.randomUUID();
  // 取得したメモ（未削除のみ）
  #memos = [];
  // 編集中のメモの ID。null のときは新規作成中
  #selectedId = null;
  // 最後に保存（または読み込み）したときの内容。未保存の変更があるかの判定に使う
  #saved = { title: "", content: "" };
  // 保存・削除の通信中は、ボタンを押せないようにする
  #busy = false;

  // 画面の部品
  #list;
  #sortSelect;
  #titleInput;
  #contentInput;
  #printNo;
  #printDate;
  #dirtyMark;
  #status;
  #saveButton;
  #deleteButton;

  // Ctrl+S（Mac は ⌘S）で保存する。unmount() で外すので、関数を持っておく
  #onKeydown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s" && !e.isComposing) {
      e.preventDefault();
      this.#onSave();
    }
  };

  async mount(container) {
    const root = el("div", { className: "memos" });
    root.append(this.#createSidebar(), this.#createEditor());
    container.append(root);
    document.addEventListener("keydown", this.#onKeydown);

    // TODO: WebSocket での同期（F-08）をつなぐ
    const loaded = await this.#loadMemos();
    this.#restoreDraft(loaded);
  }

  // ---- API ----

  // API を呼ぶ。失敗したらサーバーの message を持った ApiError を投げる
  async #request(method, path = "", body) {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Client-Id": this.#clientId,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (res.status === 204) {
      return null;
    }
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw new ApiError(res.status, data?.message ?? `通信に失敗しました（${res.status}）`);
    }
    return data;
  }

  // 一覧を取得して描画する（F-01）。取得できたら true
  async #loadMemos() {
    try {
      this.#memos = await this.#request("GET");
      this.#renderList();
      return true;
    } catch (err) {
      this.#list.replaceChildren(
        el("li", { className: "memos-empty", textContent: "一覧を取得できませんでした" }),
      );
      this.#setStatus(`一覧を取得できませんでした：${err.message}`);
      return false;
    }
  }

  // ---- 下書き（F-06） ----

  // 前回の下書きがあれば、エディタに戻す
  #restoreDraft(loaded) {
    const draft = readDraft();
    if (!draft) {
      return;
    }

    const memo = draft.id === null ? null : this.#memos.find((m) => m.id === draft.id);
    if (memo || draft.id === null) {
      this.#edit(memo ?? null);
      this.#setStatus("下書きを復元しました");
    } else if (loaded) {
      // 元のメモがもうない（ほかの画面で削除された）ので、新規メモとして戻す
      this.#edit(null);
      this.#setStatus("元のメモが見つからないため、下書きを新規メモとして復元しました");
    } else {
      // 一覧が取れなかったときは、元のメモの ID のまま戻す（保存すると上書きになる）
      this.#edit(null);
      this.#selectedId = draft.id;
      this.#updateButtons();
      this.#setStatus("下書きを復元しました（一覧は取得できませんでした）");
    }

    this.#titleInput.value = draft.title;
    this.#contentInput.value = draft.content;
    this.#onInput();
  }

  // 入力のたびに、下書きと「未保存」の印を更新する
  #onInput() {
    const dirty = this.#isDirty();
    if (dirty) {
      writeDraft({
        id: this.#selectedId,
        title: this.#titleInput.value,
        content: this.#contentInput.value,
      });
    } else {
      removeDraft();
    }
    this.#dirtyMark.hidden = !dirty;
  }

  // ---- ボタンの処理 ----

  // 「＋ 新規」：エディタを空にして、新規作成にする
  #onNew() {
    if (this.#busy || !this.#confirmDiscard()) {
      return;
    }
    this.#edit(null);
    this.#setStatus("");
    this.#titleInput.focus();
  }

  // 一覧のメモを選ぶ：エディタに読み込む
  #onSelect(id) {
    if (this.#busy || id === this.#selectedId || !this.#confirmDiscard()) {
      return;
    }
    this.#edit(this.#memos.find((memo) => memo.id === id) ?? null);
    this.#setStatus("");
  }

  // 「保存」：新規なら POST（F-02）、既存なら PUT（F-03）
  async #onSave() {
    if (this.#busy) {
      return;
    }
    const body = { title: this.#titleInput.value, content: this.#contentInput.value };
    const id = this.#selectedId;

    this.#setBusy(true);
    this.#setStatus("保存しています…");
    try {
      const memo =
        id === null
          ? await this.#request("POST", "", body)
          : await this.#request("PUT", `/${id}`, body);

      // 一覧の中身を、サーバーが返した内容に置き換える
      this.#memos = [memo, ...this.#memos.filter((m) => m.id !== memo.id)];
      // タイトルが空のときはサーバーが「メモ(YYYY-MM-DD)」を入れるので、返った値を表示する（F-09）
      this.#edit(memo);
      this.#setStatus(id === null ? "作成しました" : "保存しました");
    } catch (err) {
      if (err.status === 404) {
        // ほかの画面で削除されていた。書いた内容は残して、新規メモとして続けられるようにする
        this.#forgetMemo(id);
        this.#selectedId = null;
        this.#saved = { title: "", content: "" };
        this.#updatePrint(null);
        this.#onInput();
        this.#setStatus("このメモはほかの画面で削除されていました。もう一度保存すると新しいメモとして作成します");
      } else {
        this.#setStatus(`保存できませんでした：${err.message}`);
      }
    } finally {
      this.#setBusy(false);
    }
  }

  // 「削除」：確認してから DELETE（F-04。サーバー側は論理削除）
  async #onDelete() {
    if (this.#busy || this.#selectedId === null) {
      return;
    }
    if (!confirm("このメモを削除しますか？")) {
      return;
    }

    const id = this.#selectedId;
    this.#setBusy(true);
    this.#setStatus("削除しています…");
    try {
      await this.#request("DELETE", `/${id}`);
      this.#forgetMemo(id);
      this.#edit(null);
      this.#setStatus("削除しました");
    } catch (err) {
      if (err.status === 404) {
        this.#forgetMemo(id);
        this.#edit(null);
        this.#setStatus("このメモはすでに削除されていました");
      } else {
        this.#setStatus(`削除できませんでした：${err.message}`);
      }
    } finally {
      this.#setBusy(false);
    }
  }

  // ---- 表示の更新 ----

  // memo をエディタに読み込む。null なら新規作成にする
  #edit(memo) {
    this.#selectedId = memo?.id ?? null;
    this.#saved = { title: memo?.title ?? "", content: memo?.content ?? "" };
    this.#titleInput.value = this.#saved.title;
    this.#contentInput.value = this.#saved.content;
    // 保存済みの内容を読み込んだので、下書きはいらない
    removeDraft();
    this.#dirtyMark.hidden = true;
    this.#updatePrint(memo);
    this.#updateButtons();
    this.#renderList();
  }

  // 一覧からメモを外す
  #forgetMemo(id) {
    this.#memos = this.#memos.filter((m) => m.id !== id);
    this.#renderList();
  }

  // ページの上の No. と Date の欄に、メモの ID と登録日を書く（新規は空欄）
  #updatePrint(memo) {
    if (!memo) {
      this.#printNo.textContent = "No.";
      this.#printDate.textContent = "Date      .      .";
      return;
    }
    const created = new Date(memo.createdAt);
    const mm = String(created.getMonth() + 1).padStart(2, "0");
    const dd = String(created.getDate()).padStart(2, "0");
    this.#printNo.textContent = `No. ${memo.id}`;
    this.#printDate.textContent = `Date ${created.getFullYear()} . ${mm} . ${dd}`;
  }

  // 並び替えの選択に合わせて一覧を描画する（F-05）
  #renderList() {
    const memos = sortMemos(this.#memos, this.#sortSelect.value);
    if (memos.length === 0) {
      this.#list.replaceChildren(
        el("li", { className: "memos-empty", textContent: "メモはまだありません" }),
      );
      return;
    }

    this.#list.replaceChildren(
      ...memos.map((memo) => {
        const button = el("button", { className: "memos-item", type: "button" });
        button.append(
          el("span", { className: "memos-item-title", textContent: memo.title }),
          el("time", {
            className: "memos-item-date",
            dateTime: memo.updatedAt,
            textContent: dateFormat.format(new Date(memo.updatedAt)),
          }),
        );
        if (memo.id === this.#selectedId) {
          button.setAttribute("aria-current", "true");
        }
        button.addEventListener("click", () => this.#onSelect(memo.id));

        const item = el("li");
        item.append(button);
        return item;
      }),
    );
  }

  #setBusy(busy) {
    this.#busy = busy;
    this.#updateButtons();
  }

  // 新規作成中は削除できない（T-UI-04）。通信中はどちらも押せない
  #updateButtons() {
    this.#saveButton.disabled = this.#busy;
    this.#deleteButton.disabled = this.#busy || this.#selectedId === null;
  }

  #setStatus(message) {
    this.#status.textContent = message;
  }

  // ---- 未保存の変更（F-07） ----

  #isDirty() {
    return (
      this.#titleInput.value !== this.#saved.title ||
      this.#contentInput.value !== this.#saved.content
    );
  }

  // 未保存の変更があれば確認する。破棄してよければ true（下書きも消す）
  #confirmDiscard() {
    if (!this.#isDirty()) {
      return true;
    }
    if (!confirm("保存していない変更があります。破棄しますか？")) {
      return false;
    }
    removeDraft();
    return true;
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
    list.append(el("li", { className: "memos-empty", textContent: "読み込み中…" }));

    newButton.addEventListener("click", () => this.#onNew());
    sortSelect.addEventListener("change", () => this.#renderList());
    this.#list = list;
    this.#sortSelect = sortSelect;

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
    titleInput.setAttribute("aria-label", "タイトル（空のまま保存すると日付が入ります）");

    const contentInput = el("textarea", {
      id: "contentInput",
      className: "input memos-content",
      maxLength: CONTENT_MAX_LENGTH,
      placeholder: "本文を入力",
    });
    contentInput.setAttribute("aria-label", "本文");

    // ノートのページの上に印刷された欄（飾りなので読み上げない）
    const printNo = el("span");
    const printDate = el("span");
    const print = el("div", { className: "memos-page-print" });
    print.setAttribute("aria-hidden", "true");
    print.append(printNo, printDate);

    const page = el("div", { className: "memos-page" });
    page.append(print, titleInput, contentInput);

    // 未保存の変更があるときだけ出す印
    const dirtyMark = el("span", { className: "memos-dirty", textContent: "未保存", hidden: true });

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
      title: "保存（Ctrl+S）",
    });

    titleInput.addEventListener("input", () => this.#onInput());
    contentInput.addEventListener("input", () => this.#onInput());
    saveButton.addEventListener("click", () => this.#onSave());
    deleteButton.addEventListener("click", () => this.#onDelete());
    this.#titleInput = titleInput;
    this.#contentInput = contentInput;
    this.#printNo = printNo;
    this.#printDate = printDate;
    this.#dirtyMark = dirtyMark;
    this.#status = status;
    this.#saveButton = saveButton;
    this.#deleteButton = deleteButton;
    this.#updatePrint(null);

    const actions = el("div", { className: "memos-actions" });
    actions.append(dirtyMark, status, deleteButton, saveButton);

    editor.append(page, actions);
    return editor;
  }

  // 未保存の変更があるときは確認し、破棄しないなら false を返す（F-07）
  canLeave() {
    return this.#confirmDiscard();
  }

  // TODO(F-08): WebSocket を始めたら、ここで切断する
  unmount() {
    document.removeEventListener("keydown", this.#onKeydown);
  }
}
