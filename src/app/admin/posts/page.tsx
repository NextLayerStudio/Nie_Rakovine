import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePostAction } from "@/lib/actions/posts";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Obsah</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-pill bg-brand-purple px-4 py-2 text-sm font-semibold text-white"
        >
          + Nový obsah
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-brand-purple/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-brand-purple/5 text-left text-xs uppercase tracking-wide text-brand-purple/70">
            <tr>
              <th className="px-4 py-3">Názov</th>
              <th className="px-4 py-3">Typ</th>
              <th className="px-4 py-3">Stav</th>
              <th className="px-4 py-3">Vytvorené</th>
              <th className="px-4 py-3 text-right">Akcie</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm text-brand-purple/60"
                >
                  Žiadny obsah. Pridajte prvý kúsok pomocou tlačidla vyššie.
                </td>
              </tr>
            )}
            {posts.map((post) => (
              <tr key={post.id} className="border-t border-brand-purple/10">
                <td className="px-4 py-3 font-medium">{post.title}</td>
                <td className="px-4 py-3 text-brand-purple/80">
                  {typeLabel(post.type)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-pill px-2 py-0.5 text-[10px] font-semibold ${post.published ? "bg-green-100 text-green-700" : "bg-brand-purple/10 text-brand-purple"}`}
                  >
                    {post.published ? "Publikované" : "Koncept"}
                  </span>
                </td>
                <td className="px-4 py-3 text-brand-purple/60">
                  {new Intl.DateTimeFormat("sk-SK", {
                    dateStyle: "short",
                  }).format(post.createdAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="mr-3 text-brand-purple underline-offset-2 hover:underline"
                  >
                    Upraviť
                  </Link>
                  <form action={deletePostAction} className="inline">
                    <input type="hidden" name="id" value={post.id} />
                    <button
                      type="submit"
                      className="text-xs text-red-600 hover:underline"
                    >
                      Zmazať
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function typeLabel(type: string): string {
  switch (type) {
    case "VIDEO":
      return "Video";
    case "ARTICLE":
      return "Článok";
    case "RECIPE":
      return "Recept";
    default:
      return type;
  }
}
