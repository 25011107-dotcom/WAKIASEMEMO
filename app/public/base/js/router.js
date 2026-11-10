// URL に合わせて画面を切り替える（ページを読み込み直さない SPA のルーター）
// 画面の一覧は main/routes.js に書く
export class Router {
  #routes;
  #outlet;
  #appName;
  #current = null;
  // 何回目の切り替えか。読み込みを待つ間に次の切り替えが始まったら、古い方はやめる
  #renderCount = 0;

  // routes: [{ path: "/memos/:id", load: () => import("...") }]
  constructor({ routes, outlet, appName }) {
    this.#routes = routes.map((route) => ({ ...route, pattern: toPattern(route.path) }));
    this.#outlet = outlet;
    this.#appName = appName;
  }

  start() {
    // data-link の付いたリンクは、ページを読み込み直さずに画面を切り替える
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a[data-link]");
      if (!link || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) {
        return;
      }
      e.preventDefault();
      this.navigate(link.getAttribute("href"));
    });

    // ブラウザの「戻る」「進む」
    window.addEventListener("popstate", () => this.#render());

    // タブを閉じる・再読み込みするときも、画面に確認させる（F-07）
    window.addEventListener("beforeunload", (e) => {
      if (this.#current && !this.#current.canLeave()) {
        e.preventDefault();
      }
    });

    return this.#render();
  }

  async navigate(url) {
    if (url === location.pathname + location.search) {
      return;
    }
    if (this.#current && !this.#current.canLeave()) {
      return;
    }
    history.pushState(null, "", url);
    await this.#render();
  }

  async #render() {
    // 「戻る」「進む」を素早く押すと、前の切り替えの読み込みが終わる前に次の切り替えが始まる
    // 読み込みの速さで終わる順番が入れ替わるので、いちばん新しい切り替えだけを画面に出す
    const count = ++this.#renderCount;
    const isOutdated = () => count !== this.#renderCount;

    const { route, params } = this.#match(location.pathname);
    const { default: ScreenClass } = await route.load();
    if (isOutdated()) {
      return;
    }
    const screen = new ScreenClass();
    await loadStyles(screen.styles);
    if (isOutdated()) {
      return;
    }

    const swap = async () => {
      // アニメーションの開始を待つ間に、次の切り替えが始まることもある
      if (isOutdated()) {
        return;
      }
      this.#current?.unmount();
      this.#outlet.replaceChildren();
      this.#current = screen;
      await screen.mount(this.#outlet, params);
    };

    // 対応しているブラウザでは、画面切り替えをアニメーションさせる
    if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const transition = document.startViewTransition(swap);
      // タブが裏にあるときなどはアニメーションだけ中止され、ready が失敗する（画面の切り替えは行われる）
      // 受け取らないとコンソールにエラーが出るので、ここで受け止める
      transition.ready.catch(() => {});
      await transition.updateCallbackDone;
    } else {
      await swap();
    }
    if (isOutdated()) {
      return;
    }

    document.title = screen.title ? `${screen.title} | ${this.#appName}` : this.#appName;
    this.#updateNav();
    // 画面が変わったことをスクリーンリーダーに伝えるため、main にフォーカスを移す
    this.#outlet.focus({ preventScroll: true });
  }

  #match(pathname) {
    for (const route of this.#routes) {
      const m = route.pattern.exec(pathname);
      if (m) {
        return { route, params: m.groups ?? {} };
      }
    }
    // どれにも当てはまらなければ、path が "*" の画面（見つからない画面）
    return { route: this.#routes.find((route) => route.path === "*"), params: {} };
  }

  // 表示中の画面のリンクに aria-current を付ける
  #updateNav() {
    for (const link of document.querySelectorAll("a[data-link]")) {
      if (link.getAttribute("href") === location.pathname) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    }
  }
}

// "/memos/:id" → /^\/memos\/(?<id>[^/]+)$/
function toPattern(path) {
  if (path === "*") {
    return /^$/;
  }
  const source = path
    .split("/")
    .map((part) => (part.startsWith(":") ? `(?<${part.slice(1)}>[^/]+)` : part))
    .join("\\/");
  return new RegExp(`^${source}$`);
}

// 画面ごとの CSS を <head> に1回だけ追加し、読み込み終わるまで待つ
function loadStyles(hrefs) {
  return Promise.all(
    hrefs.map((href) => {
      if (document.querySelector(`link[href="${href}"]`)) {
        return null;
      }
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.append(link);
      return new Promise((resolve) => {
        link.addEventListener("load", resolve, { once: true });
        link.addEventListener("error", resolve, { once: true });
      });
    }),
  );
}
