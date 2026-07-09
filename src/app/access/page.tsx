import { AccessForm } from "./AccessForm";

export const dynamic = "force-dynamic";

export default async function AccessPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="min-h-screen bg-[#FFF3F9] font-sans flex items-center justify-center px-5">
      <div className="w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-[0_20px_50px_rgba(111,35,128,0.15)]">
        <p className="text-center text-[11px] font-bold uppercase tracking-widest text-[#6F2380]/50">
          ONKO KLUB
        </p>
        <h1 className="mt-2 text-center text-xl font-black text-[#6F2380]">
          Stránka je vo výstavbe
        </h1>
        <p className="mt-1 text-center text-sm text-[#6F2380]/60">
          Zadaj prístupové heslo
        </p>

        <AccessForm next={next ?? ""} />
      </div>
    </main>
  );
}
