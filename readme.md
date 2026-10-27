# Nginx + PHP-fpm + MySQL コンテナ

- HTTP サーバ：Nginx
- PHP：fpmバージョン
- データベース：MySQL

## コンテナを開始する

```powershell
docker-compose up -d
```

## コンテナを停止する

```powershell
docker-compose down
```

## webページへのアクセス

http://localhost:8000/

## phpMyAdminへのアクセス

http://localhost:8000/phpmyadmin/
