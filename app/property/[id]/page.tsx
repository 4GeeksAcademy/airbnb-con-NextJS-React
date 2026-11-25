import { PropertyExperience } from "@/components/PropertyExperience";
import { safeCatalogReturn, type QueryRecord } from "@/lib/query";

export default async function PropertyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<QueryRecord>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const returnValue = Array.isArray(query.returnTo) ? query.returnTo[0] : query.returnTo;

  return <PropertyExperience id={id} returnTo={safeCatalogReturn(returnValue)} />;
}