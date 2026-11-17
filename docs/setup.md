# 導入・起動手順書

メモ帳アプリ（WAKIASEMEMO）を自分のパソコンで動かす手順です。
Docker Compose で3つのコンテナを立ち上げるので、Node.js や MySQL を直接入れる必要はありません。
アプリの使い方は `docs/manual.md` を見てください。

## 1. 構成

| コンテナ | 中身 | ポート |
|---|---|---|
| app | Node.js / Express / TypeScript（画面・API・WebSocket） | 3000 |
| mysql | MySQL 8.4（Prisma で操作） | 3306 |
| phpmyadmin | データベースをブラウザで見る道具 | 8080 |

## 2. 必要なもの

| ソフト | 用途 | 確認コマンド |
|---|---|---|
| Git | リポジトリを取得する | `git --version` |
| Docker Desktop（Docker Compose v2 入り） | コンテナを動かす | `docker compose version` |
| Web ブラウザ | 画面を開く | ― |
| Node.js（任意） | VS Code の型補完を効かせたいときだけ | `node -v` |

ポート 3000・3306・8080 がほかのアプリで使われていないことも確認してください。

## 3. 導入手順（初回だけ）

コマンドは PowerShell で実行します。

1. リポジトリを取得する

   ```powershell
   git clone https://github.com/25011107-dotcom/WAKIASEMEMO.git
   cd WAKIASEMEMO
   ```

2. `.env` を作る。できた `.env` を開き、パスワードを自分用に書き換える

   ```powershell
   Copy-Item .env.example .env
   ```

   | 項目 | 内容 | 初期値 |
   |---|---|---|
   | `MYSQL_ROOT_PASSWORD` | MySQL の管理者パスワード | rootpassword |
   | `MYSQL_DATABASE` | データベース名 | memo |
   | `MYSQL_USER` | アプリ用のユーザー名 | memo_user |
   | `MYSQL_PASSWORD` | アプリ用のパスワード | changeme |

3. Docker Desktop を起動してから、コンテナを作って起動する（初回はパッケージのインストールで数分かかる）

   ```powershell
   docker compose up -d --build
   ```

4. テーブルを作る。先にログを見て `Server running at http://localhost:3000` が出るまで待つ（Ctrl+C でログ表示だけ止められる）

   ```powershell
   docker compose logs -f app
   docker compose exec app npx prisma migrate dev
   ```

ここまでで導入は完了です。次回からは「4. 起動・停止手順」だけで動きます。

## 4. 起動・停止手順（2回目から）

Docker Desktop を起動し、リポジトリのフォルダで実行します。

| やりたいこと | コマンド |
|---|---|
| 起動する | `docker compose up -d` |
| 停止する | `docker compose down` |
| ログを見る | `docker compose logs -f app` |
| 他の人が追加したパッケージを入れる | `docker compose restart app` |
| 他の人が変えたテーブルを反映する | `docker compose exec app npx prisma migrate dev` |

`docker compose down` してもメモのデータは消えません。

### アクセス先

| 内容 | URL |
|---|---|
| 画面 | http://localhost:3000/ |
| API | http://localhost:3000/api/memos |
| WebSocket | ws://localhost:3000/ws |
| phpMyAdmin | http://localhost:8080/（`.env` の `MYSQL_USER` と `MYSQL_PASSWORD` でログイン） |

## 5. 動作確認

次の4つがすべて通れば、正しく起動できています。

- [ ] `docker compose ps` で app・mysql・phpmyadmin の3つが Up になっている（mysql は healthy）
- [ ] http://localhost:3000/api/memos を開くと `[]`（またはメモの一覧）が表示される
- [ ] http://localhost:3000/ でメモを作って保存できる
- [ ] タブを2つ開き、片方で保存するともう片方にも反映される（WebSocket）

## 6. よくあるトラブルと対処

| 症状 | 原因 | 対処 |
|---|---|---|
| `prisma: not found` | パッケージのインストールがまだ終わっていない | ログに `Server running at ...` が出てからもう一度実行する |
| `port is already allocated` | 3000・3306・8080 をほかのアプリが使っている | そのアプリ（ローカルの MySQL など）を止める |
| `The "MYSQL_USER" variable is not set` | `.env` がない | 「3. 導入手順」の2をやり直す |
| migrate で権限エラー（shadow database） | 権限を与えるスクリプトは MySQL のボリュームを初めて作るときだけ動く | `docker compose down -v` で作り直す（**メモのデータは消える**） |
| `.env` のパスワードを変えたら接続できない | MySQL のユーザーは初回の値で作られている | 元の値に戻すか、`docker compose down -v` で作り直す（**メモのデータは消える**） |
| コードを変えても反映されない | 変更の検知は1秒ごと | 数秒待つ。だめなら `docker compose restart app` |
| VS Code で import に赤線が出る | `node_modules` がコンテナの中にしかない | `app` フォルダで `npm install` と `npx prisma generate` を実行する（動作には影響なし） |
