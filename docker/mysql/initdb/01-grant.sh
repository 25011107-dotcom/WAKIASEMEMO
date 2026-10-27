#!/bin/bash
# MySQL のボリュームを初めて作るときだけ実行される
# prisma migrate dev は「シャドウデータベース」を一時的に作るので、
# アプリ用のユーザーにデータベースを作る権限を与える（ローカル開発専用）
mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" -e "GRANT ALL PRIVILEGES ON *.* TO '${MYSQL_USER}'@'%'; FLUSH PRIVILEGES;"
