import { redirect } from "next/navigation";

export default async function JobDetailRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const sParams = await searchParams;
  const urlParams = new URLSearchParams();

  Object.entries(sParams).forEach(([key, val]) => {
    if (typeof val === "string") {
      urlParams.set(key, val);
    } else if (Array.isArray(val)) {
      urlParams.set(key, val.join(","));
    }
  });

  urlParams.set("job", slug);
  redirect(`/jobs?${urlParams.toString()}`);
}
