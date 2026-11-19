import { redirect } from "next/navigation";

export default async function MembersRedirectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const urlParams = new URLSearchParams();

  Object.entries(params).forEach(([key, val]) => {
    if (typeof val === "string") {
      urlParams.set(key, val);
    } else if (Array.isArray(val)) {
      urlParams.set(key, val.join(","));
    }
  });

  const qs = urlParams.toString();
  redirect(`/${qs ? `?${qs}` : ""}`);
}
