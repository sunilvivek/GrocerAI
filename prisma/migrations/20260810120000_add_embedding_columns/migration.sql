-- Add pgvector embedding support for semantic search (Milestone 7).
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE "products" ADD COLUMN "embedding" vector(1536);
ALTER TABLE "products" ADD COLUMN "embeddingUpdatedAt" TIMESTAMP(3);
CREATE INDEX "products_embeddingUpdatedAt_idx" ON "products"("embeddingUpdatedAt");

ALTER TABLE "recipes" ADD COLUMN "embedding" vector(1536);
ALTER TABLE "recipes" ADD COLUMN "embeddingUpdatedAt" TIMESTAMP(3);
CREATE INDEX "recipes_embeddingUpdatedAt_idx" ON "recipes"("embeddingUpdatedAt");
