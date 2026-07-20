"use client";

import { useActionState, useState } from "react";
import { ConsentCheckbox } from "@/components/ConsentCheckbox";
import { SubmitButton } from "@/components/FormError";
import { SettingSwitch } from "@/components/SettingSwitch";
import {
  updatePreferencesAction,
  type SettingsActionState,
} from "@/lib/actions/settings";
import { Feedback } from "../settings-ui";

const INITIAL: SettingsActionState = { ok: false };

type NotificationPrefs = {
  notifyNewPosts: boolean;
  notifyForumApproved: boolean;
  notifyForumReactions: boolean;
  notifyEventsNearby: boolean;
};

export function NotificationsForm({
  consentNewsletter,
  notifyRadiusKm,
  notificationPrefs,
}: {
  consentNewsletter: boolean;
  notifyRadiusKm: number;
  notificationPrefs: NotificationPrefs;
}) {
  const [prefsState, prefsAction] = useActionState(
    updatePreferencesAction,
    INITIAL,
  );
  const [radius, setRadius] = useState(notifyRadiusKm);

  return (
    <form action={prefsAction} className="px-5 py-4">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-brand-purple/45">
          V aplikácii
        </p>
        <div className="divide-y divide-brand-purple/8">
          <SettingSwitch
            name="notifyNewPosts"
            label="Nové príspevky"
            description="Keď profil, ktorý sledujete, zverejní nový obsah."
            defaultChecked={notificationPrefs.notifyNewPosts}
          />
          <SettingSwitch
            name="notifyForumApproved"
            label="Fórum — schválenie príspevku"
            description="Keď moderátor schváli váš nový príspevok vo fóre."
            defaultChecked={notificationPrefs.notifyForumApproved}
          />
          <SettingSwitch
            name="notifyForumReactions"
            label="Fórum — reakcie na správy"
            description="Keď niekto reaguje srdiečkom alebo napíše textovú reakciu na váš príspevok či správu v chate."
            defaultChecked={notificationPrefs.notifyForumReactions}
          />
          <SettingSwitch
            name="notifyEventsNearby"
            label="Aktivity v okolí"
            description="Keď sa vo vašom okolí objaví nová aktivita alebo podujatie."
            defaultChecked={notificationPrefs.notifyEventsNearby}
          />
        </div>
      </div>

      <div className="mt-6 border-t border-brand-purple/10 pt-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-brand-purple/45">
          E-mail
        </p>
        <ConsentCheckbox
          name="consentNewsletter"
          defaultChecked={consentNewsletter}
        >
          Chcem dostávať newsletter a novinky ONKO KLUBU e-mailom.
        </ConsentCheckbox>
      </div>

      <div className="mt-6 border-t border-brand-purple/10 pt-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-brand-purple/45">
          Polomer pre aktivity
        </p>
        <div className="mb-3 flex items-end justify-between">
          <p className="max-w-[70%] text-xs text-brand-purple/60">
            Vzdialenosť od vášho miesta pre upozornenia na aktivity v okolí.
          </p>
          <span className="text-xs font-bold text-brand-purple">
            {radius} km
          </span>
        </div>
        <input
          name="notifyRadiusKm"
          type="range"
          min={10}
          max={200}
          step={5}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="settings-range w-full"
        />
        <div className="mt-1 flex justify-between text-[10px] text-brand-purple/50">
          <span>10 km</span>
          <span>200 km</span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Feedback state={prefsState} />
        <SubmitButton className="btn-secondary w-full py-2.5 text-sm">
          Uložiť notifikácie
        </SubmitButton>
      </div>
    </form>
  );
}
