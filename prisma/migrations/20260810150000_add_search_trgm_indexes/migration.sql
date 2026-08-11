CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX products_name_trgm_idx ON "products" USING gin ("name" gin_trgm_ops);
CREATE INDEX products_description_trgm_idx ON "products" USING gin ("description" gin_trgm_ops);
CREATE INDEX products_brand_trgm_idx ON "products" USING gin ("brand" gin_trgm_ops);
CREATE INDEX category_name_trgm_idx ON "categories" USING gin ("name" gin_trgm_ops);
