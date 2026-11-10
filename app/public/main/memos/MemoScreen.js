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
// 再接続までの待ち時間。失敗するたびに倍にして、最大 30 秒（N-03）
const RECONNECT_MIN_DELAY = 1000;
const RECONNECT_MAX_DELAY = 30000;
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

// ---- ページをめくる動き ----
// めくる紙を、折り目の線で「まだ平らな部分」と「めくれた部分」に分けて描く
// 折り目は右端から綴じ側（左端）へ動き、下の角から先にめくれるように少し斜めになる

// 1回めくるのにかける時間（ミリ秒）
const PAGE_TURN_DURATION = 800;
// 紙の色（--color-surface）と、影の色（--color-text）。毎フレーム計算するので数値で持つ
const PAPER_RGB = "255 250 240";
const SHADOW_RGB = "44 36 21";

// 0〜1 の進み具合を、ゆっくり始まってゆっくり終わる動きにする
function easeInOut(t) {
  return 0.5 - Math.cos(Math.PI * t) / 2;
}

// 幅 w・高さ h の長方形を、点 p を通り法線 n に垂直な直線で切る
// side が 1 なら n の向き側、-1 なら反対側の多角形の頂点を返す
function clipRect(w, h, p, n, side) {
  const corners = [[0, 0], [w, 0], [w, h], [0, h]];
  const distance = ([x, y]) => side * ((x - p[0]) * n[0] + (y - p[1]) * n[1]);
  const points = [];
  corners.forEach((a, i) => {
    const b = corners[(i + 1) % corners.length];
    const da = distance(a);
    const db = distance(b);
    if (da >= 0) {
      points.push(a);
    }
    if (da >= 0 !== db >= 0) {
      const r = da / (da - db);
      points.push([a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r]);
    }
  });
  return points;
}

function toPolygon(points) {
  if (points.length < 3) {
    return "polygon(0 0, 0 0, 0 0)";
  }
  return `polygon(${points.map(([x, y]) => `${x}px ${y}px`).join(", ")})`;
}

// 折り目に垂直なグラデーション。stops は [折り目からの距離(px), 色] の並び（n の向きが正）
function foldGradient(w, h, p, n, stops) {
  const length = Math.abs(w * n[0]) + Math.abs(h * n[1]);
  const fold = (p[0] - w / 2) * n[0] + (p[1] - h / 2) * n[1] + length / 2;
  const angle = Math.atan2(n[1], n[0]) + Math.PI / 2;
  return `linear-gradient(${angle}rad, ${stops.map(([u, color]) => `${color} ${fold + u}px`).join(", ")})`;
}

function shadow(alpha) {
  return `rgb(${SHADOW_RGB} / ${alpha})`;
}

// めくり具合 t（0：平ら、1：めくり終わり）の1コマを描く
function drawPageTurn({ width: w, height: h, leaf, leafShade, flap, flapShade, flapHolder, underShade }, t) {
  // 紙が浮いている度合い。めくり始めと終わりは 0、真ん中で 1
  const lift = Math.sin(Math.PI * t);

  // 折り目の線：上の端と下の端の位置。下の角が先にめくれるので、下の方が左に出る
  const center = w * (1 - t);
  const tilt = h * 0.22 * lift;
  const top = center + tilt / 2;
  const bottom = center - tilt / 2;
  const length = Math.hypot(h, top - bottom);
  // 折り目の法線（めくれる側＝右向き）
  const n = [h / length, (top - bottom) / length];
  const p = [top, 0];

  // 平らな部分は折り目の左だけ見せる
  leaf.style.clipPath = toPolygon(clipRect(w, h, p, n, -1));

  // めくれた部分は、折り目の右を折り目で裏返し、浮いて丸まる分だけ折り目の方へ縮める
  const curl = 1 - 0.45 * lift;
  const angle = Math.atan2(n[1], n[0]);
  flap.style.clipPath = toPolygon(clipRect(w, h, p, n, 1));
  flap.style.transform =
    `translate(${p[0]}px, ${p[1]}px) rotate(${angle}rad) scale(${-curl}, 1) ` +
    `rotate(${-angle}rad) translate(${-p[0]}px, ${-p[1]}px)`;
  // 裏は表の文字がうっすら透ける紙の色にして、丸まった面の明るさの差をつける
  flapShade.style.background = [
    foldGradient(w, h, p, n, [
      [0, shadow(0.16 * lift)],
      [w * 0.05, `rgb(255 255 255 / ${0.25 * lift})`],
      [w * 0.25, shadow(0.02)],
      [w * 0.7, shadow(0.14 * lift)],
    ]),
    `linear-gradient(rgb(${PAPER_RGB} / 0.86), rgb(${PAPER_RGB} / 0.86))`,
  ].join(", ");
  // 浮いた紙の影が、まだ平らな部分に落ちる
  flapHolder.style.filter = `drop-shadow(${-0.6 * lift}em ${0.2 * lift}em ${1.2 * lift}em ${shadow(0.28 * lift)})`;

  // 平らな部分も、折り目の近くは持ち上がりかけて少し暗くなる
  leafShade.style.background = foldGradient(w, h, p, n, [
    [-w * 0.18, shadow(0)],
    [0, shadow(0.16 * lift)],
  ]);
  // 下の紙には、折り目のすぐ右に浮いた紙の影が落ちる
  underShade.style.background = foldGradient(w, h, p, n, [
    [0, shadow(0.38 * lift)],
    [w * 0.08, shadow(0.12 * lift)],
    [w * 0.3, shadow(0)],
  ]);
}

// テキストエリアのスクロール位置を、写した紙にもそろえる
function syncScroll(from, to) {
  to.querySelector(".memos-content").scrollTop = from.querySelector(".memos-content").scrollTop;
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
  // 削除されたと分かったメモの ID。ID は使い回されないので、ここにある ID のメモは二度と一覧に戻さない
  #deletedIds = new Set();
  // 編集中のメモの ID。null のときは新規作成中
  #selectedId = null;
  // 最後に保存（または読み込み）したときの内容。未保存の変更があるかの判定に使う
  #saved = { title: "", content: "" };
  // 保存・削除の通信中は、ボタンを押せないようにする
  #busy = false;
  // ページをめくっている間だけ入る、めくりを終わらせる関数
  #endPageTurn = null;

  // WebSocket（F-08）
  #ws = null;
  #reconnectTimer = null;
  #reconnectDelay = RECONNECT_MIN_DELAY;
  // 接続が切れている間は true。つながり直したら一覧を取り直す
  #disconnected = false;
  // 画面を閉じたら true。再接続しない
  #closed = false;

  // 画面の部品
  #list;
  #sortSelect;
  #book;
  #page;
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

    // 一覧を取っている間の変更も受け取れるように、先につなぐ
    this.#connect();
    const loaded = await this.#loadMemos();
    this.#restoreDraft(loaded);
  }

  // ---- WebSocket での同期（F-08 / N-03） ----

  #connect() {
    if (this.#closed) {
      return;
    }
    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${location.host}/ws`);
    this.#ws = ws;

    ws.addEventListener("open", () => {
      this.#reconnectDelay = RECONNECT_MIN_DELAY;
      if (this.#disconnected) {
        this.#disconnected = false;
        this.#resync();
      }
    });

    ws.addEventListener("message", (e) => {
      let event;
      try {
        event = JSON.parse(e.data);
      } catch {
        return;
      }
      this.#applyEvent(event);
    });

    ws.addEventListener("close", () => {
      if (this.#closed) {
        return;
      }
      if (!this.#disconnected) {
        this.#disconnected = true;
        this.#setStatus("サーバーとの接続が切れました。再接続しています…");
      }
      this.#reconnectTimer = setTimeout(() => this.#connect(), this.#reconnectDelay);
      this.#reconnectDelay = Math.min(this.#reconnectDelay * 2, RECONNECT_MAX_DELAY);
    });
  }

  // 切れている間のイベントは届かないので、一覧を取り直して追いつく
  async #resync() {
    if (!(await this.#loadMemos())) {
      return;
    }
    const memo = this.#memos.find((m) => m.id === this.#selectedId);
    if (this.#selectedId !== null && !memo) {
      this.#onSelectedDeleted();
    } else if (memo && !this.#isDirty()) {
      this.#edit(memo);
      this.#setStatus("再接続しました");
    } else {
      this.#setStatus("再接続しました");
    }
  }

  // ほかの画面（タブ）での変更を反映する
  #applyEvent(event) {
    // 自分の変更は、API の結果ですでに反映している
    if (!event || event.originId === this.#clientId) {
      return;
    }

    if (event.type === "created" || event.type === "updated") {
      const memo = event.memo;
      if (!memo || !Number.isInteger(memo.id)) {
        return;
      }
      // 更新と削除がほぼ同時に起きると、削除済みのメモの「更新」が、削除の前にも後にも届くことがある
      // 一覧には戻さず、削除として扱う
      if (memo.isDeleted || this.#deletedIds.has(memo.id)) {
        this.#onDeletedElsewhere(memo.id);
        return;
      }
      this.#memos = [memo, ...this.#memos.filter((m) => m.id !== memo.id)];
      if (memo.id === this.#selectedId) {
        if (this.#isDirty()) {
          // 書きかけの内容は消さない。保存すると最後に保存した方が残る
          this.#setStatus("ほかの画面でこのメモが更新されました。保存すると、いま書いている内容で上書きします");
        } else {
          this.#edit(memo);
          this.#setStatus("ほかの画面で更新された内容を表示しています");
        }
      }
      this.#renderList();
    } else if (event.type === "deleted") {
      if (Number.isInteger(event.id)) {
        this.#onDeletedElsewhere(event.id);
      }
    }
  }

  // ほかの画面でメモが削除された。同じメモの知らせが2回来ても、2回目は何もしない
  #onDeletedElsewhere(id) {
    if (this.#deletedIds.has(id)) {
      return;
    }
    this.#forgetMemo(id);
    if (id === this.#selectedId) {
      this.#onSelectedDeleted();
    }
  }

  // 編集中のメモがほかの画面で削除された
  #onSelectedDeleted() {
    if (this.#isDirty()) {
      this.#continueAsNew("このメモはほかの画面で削除されました。保存すると新しいメモとして作成します");
    } else {
      this.#edit(null);
      this.#setStatus("このメモはほかの画面で削除されました");
    }
  }

  // 書いている内容は残したまま、新規作成に切り替える
  #continueAsNew(message) {
    this.#selectedId = null;
    this.#saved = { title: "", content: "" };
    this.#updatePrint(null);
    this.#updateButtons();
    this.#onInput();
    this.#renderList();
    this.#setStatus(message);
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
    // 復元するかどうかを確認する。キャンセルなら下書きを消して、エディタは空のままにする
    if (!confirm("保存していない下書きがあります。復元しますか？")) {
      removeDraft();
      return;
    }

    const memo = draft.id === null ? null : this.#memos.find((m) => m.id === draft.id);
    if (memo || draft.id === null) {
      this.#edit(memo ?? null);
      this.#setStatus("下書きを復元しました");
    } else if (loaded) {
      // 元のメモが削除されたので、下書きは消す（T-DRF-07）
      removeDraft();
      this.#setStatus("元のメモが削除されていたため、下書きを削除しました");
      return;
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
    // 新しいメモは、ノートの次の白紙のページに書く
    this.#turnPage(true, () => {
      this.#edit(null);
      this.#setStatus("");
    });
    this.#titleInput.focus();
  }

  // 一覧のメモを選ぶ：エディタに読み込む
  #onSelect(id) {
    if (this.#busy || id === this.#selectedId || !this.#confirmDiscard()) {
      return;
    }
    const memo = this.#memos.find((m) => m.id === id) ?? null;
    this.#turnPage(this.#isForwardTo(id), () => {
      this.#edit(memo);
      this.#setStatus("");
    });
  }

  // ---- ページをめくる ----

  // 一覧で下にあるメモへ移るときは次のページへ、上にあるメモへ戻るときは前のページへめくる
  // 新規作成中から移るときは、次のページへめくる
  #isForwardTo(id) {
    const ids = sortMemos(this.#memos, this.#sortSelect.value).map((m) => m.id);
    const from = ids.indexOf(this.#selectedId);
    return from === -1 || ids.indexOf(id) > from;
  }

  // load() でページの中身を入れ替え、そのあいだを紙をめくる動きでつなぐ
  //   次へ：前のページを写した紙（snapshot）をめくり上げて、下の新しいページを見せる
  //   前へ：新しいページを綴じ側から戻してきて、写した前のページにかぶせる（次への逆再生）
  #turnPage(forward, load) {
    // めくっている途中なら、そこで終わらせてから次をめくる
    this.#endPageTurn?.();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      load();
      return;
    }

    const page = this.#page;
    const book = this.#book;
    const scrollTop = this.#contentInput.scrollTop;
    const snapshot = this.#copyPage(page);
    load();
    book.append(snapshot);
    snapshot.querySelector(".memos-content").scrollTop = scrollTop;

    // めくる紙（leaf）と、その下の紙（under）
    const leaf = forward ? snapshot : page;
    const under = forward ? page : snapshot;
    leaf.style.zIndex = "1";

    // めくれた部分（flap）は、leaf を写した紙を折り目で裏返して描く。表の文字が裏からうっすら透ける
    const flap = this.#copyPage(leaf);
    const flapShade = el("div", { className: "memos-page-shade" });
    flap.append(flapShade);
    const flapHolder = el("div", { className: "memos-page-flap" });
    flapHolder.append(flap);
    book.append(flapHolder);
    syncScroll(leaf, flap);

    const leafShade = el("div", { className: "memos-page-shade" });
    const underShade = el("div", { className: "memos-page-shade" });
    leaf.append(leafShade);
    under.append(underShade);

    const parts = {
      width: book.clientWidth,
      height: book.clientHeight,
      leaf,
      leafShade,
      flap,
      flapShade,
      flapHolder,
      underShade,
    };

    let frame = 0;
    const start = performance.now();
    const step = (now) => {
      const x = Math.min((now - start) / PAGE_TURN_DURATION, 1);
      const t = easeInOut(x);
      drawPageTurn(parts, forward ? t : 1 - t);
      if (x < 1) {
        frame = requestAnimationFrame(step);
      } else {
        end();
      }
    };

    const end = () => {
      if (this.#endPageTurn !== end) {
        return;
      }
      this.#endPageTurn = null;
      cancelAnimationFrame(frame);
      snapshot.remove();
      flapHolder.remove();
      leafShade.remove();
      underShade.remove();
      page.style.clipPath = "";
      page.style.zIndex = "";
    };
    this.#endPageTurn = end;

    drawPageTurn(parts, forward ? 0 : 1);
    frame = requestAnimationFrame(step);
  }

  // ページを写した、さわれない紙を作る（入力欄の値も写す）
  #copyPage(source) {
    const copy = source.cloneNode(true);
    copy.classList.add("memos-page-snapshot");
    copy.inert = true;
    copy.setAttribute("aria-hidden", "true");
    copy.style.clipPath = "";
    copy.style.zIndex = "";
    for (const node of copy.querySelectorAll("[id]")) {
      node.removeAttribute("id");
    }
    for (const node of copy.querySelectorAll(".memos-page-shade")) {
      node.remove();
    }
    copy.querySelector(".memos-title").value = source.querySelector(".memos-title").value;
    copy.querySelector(".memos-content").value = source.querySelector(".memos-content").value;
    return copy;
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

      // 保存と同時にほかの画面で削除されると、保存は通っても、メモは削除済みのまま返ってくる
      // 削除されていた（404）ときと同じに扱う
      if (memo.isDeleted || this.#deletedIds.has(memo.id)) {
        throw new ApiError(404, "見つかりません");
      }

      // 一覧の中身を、サーバーが返した内容に置き換える
      this.#memos = [memo, ...this.#memos.filter((m) => m.id !== memo.id)];
      // タイトルが空のときはサーバーが「メモ(YYYY-MM-DD)」を入れるので、返った値を表示する（F-09）
      this.#edit(memo);
      this.#setStatus(id === null ? "作成しました" : "保存しました");
    } catch (err) {
      if (err.status === 404) {
        // ほかの画面で削除されていた。書いた内容は残して、新規メモとして続けられるようにする
        this.#forgetMemo(id);
        this.#continueAsNew("このメモはほかの画面で削除されていました。もう一度保存すると新しいメモとして作成します");
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

  // 削除されたメモを一覧から外す
  #forgetMemo(id) {
    this.#deletedIds.add(id);
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

    // ページを置く台。めくるときは、ここにページを写した紙を重ねる
    const book = el("div", { className: "memos-book" });
    book.append(page);

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
    this.#book = book;
    this.#page = page;
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

    editor.append(book, actions);
    return editor;
  }

  // 未保存の変更があるときは確認し、破棄しないなら false を返す（F-07）
  canLeave() {
    return this.#confirmDiscard();
  }

  // WebSocket を切断し、再接続もやめる
  unmount() {
    this.#closed = true;
    clearTimeout(this.#reconnectTimer);
    this.#ws?.close();
    document.removeEventListener("keydown", this.#onKeydown);
  }
}
