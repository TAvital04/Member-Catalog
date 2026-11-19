import { redirect } from "next/navigation";

export default async function MemberDetailRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const sParams = await searchParams;
  const urlParams = new URLSearchParams();

  Object.entries(sParams).forEach(([key, val]) => {
    if (typeof val === "string") {
      urlParams.set(key, val);
    } else if (Array.isArray(val)) {
      urlParams.set(key, val.join(","));
    }
  });

  urlParams.set("member", id);
  redirect(`/?${urlParams.toString()}`);
}
