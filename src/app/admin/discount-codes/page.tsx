import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  deleteDiscountCodeAction,
  toggleDiscountCodeActiveAction,
} from "@/lib/actions/admin-discount-codes";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteConfirmButton } from "@/components/admin/DeleteConfirmButton";

export const dynamic = "force-dynamic";

function discountLabel(type: string, amount: number): string {
  return type === "PERCENT" ? `-${amount} %` : `-${amount} €`;
}

export default async function AdminDiscountCodesPage() {
  const codes = await prisma.membershipDiscountCode.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <AdminPageHeader
        title="Zľavové kódy"
        description="Kódy uplatniteľné pri platbe za mesačné/ročné členstvo — napr. pre partnerov alebo ľudí, ktorí za prístup neplatia."
        actions={
          <Link href="/admin/discount-codes/new" className="admin-btn-primary">
            + Nový kód
          </Link>
        }
      />

      <div className="admin-card overflow-hidden">
        {codes.length === 0 ? (
          <p className="p-8 text-center text-sm text-brand-purple/50">
            Zatiaľ žiadne zľavové kódy. Vytvorte prvý.
          </p>
        ) : (
          <ul className="divide-y divide-brand-purple/8">
            {codes.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-brand-purple/[0.02]"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-brand-purple">
                    {c.code}
                  </p>
                  <p className="text-xs text-brand-purple/50">
                    {discountLabel(c.type, c.amount)} · použité {c.usedCount}×
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/admin/discount-codes/${c.id}/edit`}
                    className="rounded bg-brand-purple px-3.5 py-1.5 text-xs font-semibold text-white hover:brightness-110"
                  >
                    Upraviť
                  </Link>
                  <form action={toggleDiscountCodeActiveAction}>
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="current" value={String(c.active)} />
                    <button
                      type="submit"
                      className={`rounded px-3.5 py-1.5 text-xs font-semibold transition ${
                        c.active
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                      }`}
                    >
                      {c.active ? "Aktívny" : "Neaktívny"}
                    </button>
                  </form>
                  <DeleteConfirmButton
                    action={deleteDiscountCodeAction}
                    id={c.id}
                    confirmText="Naozaj chceš zmazať tento zľavový kód? Táto akcia je nezvratná."
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
