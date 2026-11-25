import { CatalogExperience } from "@/components/CatalogExperience";
import { parseCatalogQuery, type QueryRecord } from "@/lib/query";

export default async function SearchPage({ searchParams }: { searchParams: Promise<QueryRecord> }) {
  const initialState = parseCatalogQuery(await searchParams);
  return <CatalogExperience initialState={initialState} />;
}