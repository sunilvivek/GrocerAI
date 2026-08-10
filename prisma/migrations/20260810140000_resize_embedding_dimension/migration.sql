-- Match the vector dimension to the default local embedding provider
-- (all-MiniLM-L6-v2 emits 384-dim vectors). Columns are empty, so the resize
-- is safe and instant.
ALTER TABLE "products" ALTER COLUMN "embedding" TYPE vector(384);
ALTER TABLE "recipes" ALTER COLUMN "embedding" TYPE vector(384);
