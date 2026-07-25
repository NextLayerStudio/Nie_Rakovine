"use client";

import { useActionState } from "react";
import {
  cancelEventTicketAction,
  type CancelTicketState,
} from "@/lib/actions/event-tickets";
import { FormError, SubmitButton } from "@/components/FormError";

const INITIAL: CancelTicketState = { ok: false };

export function CancelTicketForm({ ticketId }: { ticketId: string }) {
  const [state, formAction] = useActionState(cancelEventTicketAction, INITIAL);

  if (state.ok) {
    return (
      <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-[#6F2380]/10">
        <h2 className="text-lg font-black text-[#6F2380]">Boli ste odhlásení</h2>
        <p className="mt-2 text-sm text-[#6F2380]/70">
          Vašu registráciu sme zrušili. Mrzí nás, že sa nezúčastníte — snáď nabudúce.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#6F2380]/10">
      <input type="hidden" name="ticketId" value={ticketId} />
      <FormError message={state.message} />
      <SubmitButton
        className="w-full rounded-full bg-[#6F2380] py-3 text-sm font-black text-white"
        pendingLabel="Odhlasujem…"
      >
        Áno, odhlásiť sa z podujatia
      </SubmitButton>
    </form>
  );
}
