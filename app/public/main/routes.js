// 画面の一覧。画面を増やすときは、ここに1行足して main/<画面>/ にクラスを作る
// path の :id などは、画面の mount() に params.id として渡される
// "*" はどの path にも当てはまらないときの画面
export const routes = [
  { path: "/", load: () => import("./memos/MemoScreen.js") },
  { path: "*", load: () => import("./not-found/NotFoundScreen.js") },
];
