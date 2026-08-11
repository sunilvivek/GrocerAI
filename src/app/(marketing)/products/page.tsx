import { listSearchCategories } from "@/features/search/data"
import { parseSearchQuery, type SearchPageParams } from "@/features/search/parse"
import { SearchPage } from "@/features/search/components/search-page"
import { searchProducts } from "@/lib/search/service"

export default async function ProductsPage({ searchParams }: SearchPageParams) {
  const query = await parseSearchQuery(await searchParams)
  const [data, categories] = await Promise.all([
    searchProducts(query),
    listSearchCategories(),
  ])

  return <SearchPage data={data} categories={categories} />
}
