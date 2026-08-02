"use client";

import { useState } from "react";
import { deleteAccountAction } from "@/lib/actions/settings";
import { ChevronDown } from "@/app/menu/nastavenia/settings-ui";

export function DeleteAccountSection({ email }: { email: string }) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="mt-6 border-t border-brand-purple/10 pt-5">
      <button
        type="button"
        onClick={() => setDeleteOpen((v) => !v)}
        className="flex w-full items-center justify-between py-1 text-left"
      >
        <span>
          <span className="block text-sm font-semibold text-red-600">
            Zrušiť účet
          </span>
          <span className="text-xs text-red-500/70">
            {deleteOpen ? "Skryť" : "Natrvalo odstrániť účet a údaje"}
          </span>
        </span>
        <ChevronDown open={deleteOpen} />
      </button>

      {deleteOpen && (
        <form action={deleteAccountAction} className="mt-4 space-y-4">
          <p className="text-xs leading-relaxed text-red-600/80">
            Táto akcia je <span className="font-semibold">nezvratná</span>.
            Váš účet, profil, príspevky vo fóre a všetky súvisiace údaje budú
            natrvalo odstránené. Na e-mail{" "}
            <span className="font-semibold">{email}</span> vám pošleme
            potvrdenie o zrušení účtu.
          </p>
          <button
            type="submit"
            onClick={(e) => {
              if (
                !window.confirm(
                  "Naozaj chcete natrvalo zrušiť svoj účet? Táto akcia sa nedá vrátiť späť.",
                )
              ) {
                e.preventDefault();
              }
            }}
            className="w-full rounded-pill border border-red-200 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            Natrvalo zrušiť účet
          </button>
        </form>
      )}
    </div>
  );
}
