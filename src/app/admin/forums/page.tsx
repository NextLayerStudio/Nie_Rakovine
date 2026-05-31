import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteForumAction } from "@/lib/actions/admin-forums";
import { forumAvatarStyle } from "@/lib/avatar-style";

export const dynamic = "force-dynamic";

export default async function AdminForumsPage() {
  const forums = await prisma.forum.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { members: true, threads: true } },
    },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Fóra</h1>
          <p className="mt-1 text-sm text-brand-purple/70">
            Admin vytvára fóra. Používatelia píšu správy — admin ich schvaľuje.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/forums/moderation"
            className="rounded-pill border border-brand-purple px-4 py-2 text-sm font-semibold text-brand-purple"
          >
            Schvaľovanie
          </Link>
          <Link
            href="/admin/forums/new"
            className="rounded-pill bg-brand-purple px-4 py-2 text-sm font-semibold text-white"
          >
            + Nové fórum
          </Link>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-brand-purple/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-brand-purple/5 text-left text-xs uppercase tracking-wide text-brand-purple/70">
            <tr>
              <th className="px-4 py-3">Foto</th>
              <th className="px-4 py-3">Názov</th>
              <th className="px-4 py-3">Členovia</th>
              <th className="px-4 py-3">Príspevky</th>
              <th className="px-4 py-3">Stav</th>
              <th className="px-4 py-3 text-right">Akcie</th>
            </tr>
          </thead>
          <tbody>
            {forums.map((f) => (
              <tr key={f.id} className="border-t border-brand-purple/10">
                <td className="px-4 py-3">
                  <div
                    aria-hidden
                    className="h-10 w-10 rounded-full bg-cover bg-center"
                    style={forumAvatarStyle(f)}
                  />
                </td>
                <td className="px-4 py-3 font-medium">{f.title}</td>
                <td className="px-4 py-3">{f._count.members}</td>
                <td className="px-4 py-3">{f._count.threads}</td>
                <td className="px-4 py-3">
                  {f.published ? "Publikované" : "Skryté"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/forums/${f.id}`}
                    className="mr-2 text-brand-purple hover:underline"
                  >
                    Spravovať
                  </Link>
                  <form action={deleteForumAction} className="inline">
                    <input type="hidden" name="id" value={f.id} />
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
