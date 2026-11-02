-- CreateIndex
CREATE INDEX `idx_memos_is_deleted_updated_at` ON `memos`(`is_deleted`, `updated_at`);

-- 以下は Prisma のスキーマに書けないので手書きしている（docs/database.md）
-- 本文は 10,000 文字以内（N-02）。TEXT 型だけでは約 65KB まで入ってしまう
ALTER TABLE `memos` ADD CONSTRAINT `chk_memos_content_length` CHECK (CHAR_LENGTH(`content`) <= 10000);

-- タイトルは空にしない（UC-10 の事後条件）
ALTER TABLE `memos` ADD CONSTRAINT `chk_memos_title_not_blank` CHECK (CHAR_LENGTH(TRIM(`title`)) > 0);
