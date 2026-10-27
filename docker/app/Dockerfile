# イメージを取得（Node.js の LTS 版）
FROM node:24.22.1-slim

# Prisma のマイグレーション（schema engine）が使う OpenSSL をインストール
RUN apt-get update && apt-get install -y \
	openssl \
	&& rm -rf /var/lib/apt/lists/*

# 作業ディレクトリを /app に設定
WORKDIR /app
