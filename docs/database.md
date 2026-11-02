# データベース設計

「メモ帳アプリ 仕様書」の MongoDB / Mongoose の部分を、MySQL / Prisma に置き換えた設計です。
定義の本体は `app/prisma/schema.prisma` と `app/prisma/migrations/` にあります。

## テーブル一覧

| テーブル | 内容 |
|---|---|
| `memos` | メモ。このアプリで永続化する唯一のデータ |

### DB に持たないもの

| データ | 理由 |
|---|---|
| 下書き | ブラウザの LocalStorage（`memo-app:draft`）に保存する（F-06） |
| `X-Client-Id` / `originId` | イベントを配信するときに使うだけで、保存しない（F-08） |
| WebSocket イベント | 接続中のクライアントへ送るだけ。切断後は一覧の再取得で追いつく（N-03） |
| ユーザー、タグ、添付ファイル | 仕様書の対象外 |

## `memos` テーブル

文字コードは `utf8mb4`、照合順序は `utf8mb4_unicode_ci`、エンジンは InnoDB です。

| カラム | 型 | NULL | 既定値 | API のフィールド | 説明 |
|---|---|---|---|---|---|
| `id` | `INT` AUTO_INCREMENT | 不可 | 連番 | `id` | 主キー |
| `title` | `VARCHAR(100)` | 不可 | なし | `title` | タイトル。100文字以内（N-02）、空は不可（UC-10） |
| `content` | `TEXT` | 不可 | なし | `content` | 本文。10,000文字以内（N-02）。空文字は可 |
| `is_deleted` | `TINYINT(1)` | 不可 | `0` | `isDeleted` | 論理削除フラグ（N-01） |
| `created_at` | `DATETIME(3)` | 不可 | `CURRENT_TIMESTAMP(3)` | `createdAt` | 登録日時（UTC）。作成後は変更しない |
| `updated_at` | `DATETIME(3)` | 不可 | なし | `updatedAt` | 更新日時（UTC）。Prisma が保存のたびに設定する |

### インデックス

| 名前 | カラム | 用途 |
|---|---|---|
| `PRIMARY` | `id` | 1件の取得・更新・削除 |
| `idx_memos_is_deleted_updated_at` | `is_deleted`, `updated_at` | 一覧取得（未削除を更新日時の降順。F-01） |

### 制約

| 名前 | 内容 | 根拠 |
|---|---|---|
| `chk_memos_content_length` | `CHAR_LENGTH(content) <= 10000` | N-02 |
| `chk_memos_title_not_blank` | `CHAR_LENGTH(TRIM(title)) > 0` | UC-10 の事後条件 |

## 設計の理由

- **`content` は `TEXT`**：10,000文字は utf8mb4 で最大 40,000 バイトで、`TEXT` の上限（65,535 バイト）に収まる。
- **本文の長さを `CHECK` でも確認する**：`TEXT` だけでは 10,000 文字を超えても保存できてしまう。タイトルは `VARCHAR(100)` が上限を守る。
- **`CHECK` は手書きの SQL**：Prisma のスキーマに書けないので、マイグレーションに直接書いている。`prisma db pull` では取り込まれない。
- **ソート用のインデックスは作らない**：登録日時・タイトルのソートはブラウザ内で行い（F-05）、DB を呼ばない。同じ理由で、照合順序もソートには影響しない（タイトルの並びはブラウザの `ja` 照合で決まる）。
- **`deleted_at` や履歴は持たない**：仕様書が求めるのは `isDeleted` フラグだけ。
- **競合解決用のバージョン列は持たない**：最終書き込み優先で、競合解決は対象外。

## 注意点

- **論理削除でも `updated_at` は進む**：`prisma.memo.update()` は `updated_at` を自動で更新する。削除済みのメモは画面に出ないので、動作には影響しない。
- **SQL で直接 INSERT するときは日時に注意する**：Prisma は UTC で保存するが、MySQL の `CURRENT_TIMESTAMP` は JST（`TZ: Asia/Tokyo`）になる。phpMyAdmin などで `created_at` を省略して INSERT すると、API では 9 時間先の日時として返る。`created_at` に `UTC_TIMESTAMP(3)` を指定すること。
- **`docker/mysql/my.cnf` は現在効いていない**：Windows のマウントでは権限が world-writable になり、MySQL が読み飛ばす。`memos` は文字コードと照合順序をマイグレーションで明示しているので、このテーブルには影響しない。
