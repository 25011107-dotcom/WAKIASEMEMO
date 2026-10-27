# WAKIASEMEMO（メモ帳アプリ）

仕様書「メモ帳アプリ 仕様書」に沿って作る。データベースは仕様書の MongoDB ではなく MySQL を使う。

- 画面：HTML / CSS / JavaScript（ES6 のクラス、フレームワークなし）
- サーバー：Node.js / Express / TypeScript（tsx で実行）
- リアルタイム通信：WebSocket（ws）
- データベース：MySQL（Prisma で操作）
- 実行環境：Docker Compose（app・mysql・phpmyadmin）

## はじめて動かすとき

1. `.env.example` をコピーして `.env` を作り、パスワードなどを書き換える

   ```powershell
   Copy-Item .env.example .env
   ```

2. コンテナを起動する（初回はパッケージのインストールで数分かかる）

   ```powershell
   docker compose up -d --build
   ```

3. テーブルを作る

   ```powershell
   docker compose exec app npx prisma migrate dev
   ```

## コンテナを開始する

```powershell
docker compose up -d
```

## コンテナを停止する

```powershell
docker compose down
```

## アクセス先

| 内容 | URL |
|---|---|
| 画面 | http://localhost:3000/ |
| API | http://localhost:3000/api/memos |
| WebSocket | ws://localhost:3000/ws |
| phpMyAdmin | http://localhost:8080/（`.env` の `MYSQL_USER` と `MYSQL_PASSWORD` でログイン） |

## よく使うコマンド

| やりたいこと | コマンド |
|---|---|
| ログを見る | `docker compose logs -f app` |
| テーブルを変更したあと（`app/prisma/schema.prisma` を編集したら） | `docker compose exec app npx prisma migrate dev --name <変更内容>` |
| パッケージを追加する | `docker compose exec app npm install <パッケージ名>` |
| チームメンバーが追加したパッケージを入れる | `docker compose restart app` |
| 型チェック | `docker compose exec app npm run typecheck` |

## フォルダ構成

```text
app/
├── prisma/schema.prisma            # テーブルの定義（Memo）
├── public/                         # 画面（SPA）。Express がそのまま配信する（下の「画面の作り方」）
└── src/
    ├── index.ts                    # 起動（HTTP サーバーと WebSocket）
    ├── app.ts                      # Express の設定
    ├── routes/memoRoutes.ts        # ルーティング（/api/memos）
    ├── controllers/memoController.ts  # API の処理
    ├── realtime/broadcaster.ts     # WebSocket のイベント配信
    ├── middlewares/errorHandler.ts # エラーレスポンス
    ├── utils/defaultTitle.ts       # タイトル自動補完
    └── lib/                        # Prisma Client など
```

## 画面の作り方

画面は **base**（全画面で共通の土台）と **main**（画面ごとの中身）に分けています。

```text
app/public/
├── index.html                # 共通の枠（ヘッダー・ナビ）と、画面を表示する <main id="main">
├── base/                     # 共通の土台。変えるときはチームで相談する
│   ├── css/tokens.css        # デザイントークン（色・余白・角丸・動き。ダークモード対応）
│   ├── css/reset.css
│   ├── css/layout.css        # ヘッダーと main の配置、画面切り替えのアニメーション
│   ├── css/components.css    # 共通部品（.button / .input / .screen など）
│   └── js/
│       ├── app.js            # 起動
│       ├── router.js         # URL に合わせて画面を切り替える（ページを読み込み直さない）
│       └── Screen.js         # すべての画面のもとになるクラス
└── main/                     # 画面ごとの中身。担当者が自由に作る
    ├── routes.js             # 画面の一覧（URL と画面クラスの対応）
    ├── memos/                # メモ画面（/）
    └── not-found/            # 見つからない画面
```

### 画面を増やす手順

1. `main/<画面名>/` フォルダを作り、`Screen` を継承したクラスを `export default` する
2. `main/routes.js` に `{ path: "/settings", load: () => import("./settings/SettingsScreen.js") }` のように1行足す
3. 画面へのリンクには `data-link` を付ける（`<a href="/settings" data-link>`）。ページを読み込み直さずに切り替わる

### Screen クラスで書くところ

| メンバー | 役割 |
|---|---|
| `title` | タブに出る画面名 |
| `styles` | この画面だけの CSS（`["/main/memos/memos.css"]`）。表示の前に読み込まれる |
| `mount(container, params)` | 画面を作る。`params` には URL の `:id` などが入る |
| `canLeave()` | 別の画面へ移る前・タブを閉じる前に呼ばれる。`false` で止める（F-07 の編集ガード） |
| `unmount()` | 画面を閉じるときの後片付け（WebSocket の切断など） |

### CSS の約束

- 長さは `em` だけを使う（例外は `100vh`。N-05）
- 色・余白・角丸・動きは、値を直接書かず `var(--space-4)` のように `tokens.css` のトークンを使う
- 画面ごとのクラス名は、画面名から始める（例：`.memos-list`）。ほかの画面とぶつからないように

## 仕様書との違い

| 項目 | 仕様書 | このリポジトリ |
|---|---|---|
| データベース | MongoDB / Mongoose | MySQL / Prisma |
| メモの ID | ObjectId（24桁の16進文字列） | 連番の整数。正の整数でなければ 400 |
| コンテナ | app・mongo | app・mysql・phpmyadmin |

## エディタの補完について

`node_modules` はコンテナの中にだけ作られます。VS Code で型の補完を効かせたいときは、ホスト側でも `app` フォルダで `npm install` と `npx prisma generate` を実行してください。
