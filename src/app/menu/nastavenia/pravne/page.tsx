import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { DocIcon } from "../icons";
import { MenuRow } from "../settings-ui";

export default function LegalSettingsPage() {
  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <TopBar backHref="/menu/nastavenia" title="Právne informácie" />

        <nav aria-label="Právne informácie">
          <MenuRow
            href="/menu/nastavenia/podmienky"
            icon={<DocIcon />}
            title="Podmienky používania"
            subtitle="Pravidlá členstva a používania platformy"
          />
          <MenuRow
            href="/menu/nastavenia/obchodne-podmienky"
            icon={<DocIcon />}
            title="Obchodné podmienky"
            subtitle="Cena, platba a odstúpenie od zmluvy"
          />
          <MenuRow
            href="/menu/nastavenia/ochrana-sukromia"
            icon={<DocIcon />}
            title="Zásady ochrany osobných údajov"
            subtitle="Ako spracúvame vaše osobné údaje"
          />
          <MenuRow
            href="/menu/nastavenia/pravidla-komunity"
            icon={<DocIcon />}
            title="Pravidlá komunity"
            subtitle="Zdravotné informácie, správanie, sankcie"
          />
          <MenuRow
            href="/menu/nastavenia/pravne-vyhlasenie"
            icon={<DocIcon />}
            title="Právne vyhlásenie o zodpovednosti"
            subtitle="Obsah appky nenahrádza lekársku starostlivosť"
          />
          <MenuRow
            href="/cookies?from=/menu/nastavenia/pravne"
            icon={<DocIcon />}
            title="Zásady používania súborov cookies"
            subtitle="Ako používame cookies v aplikácii"
          />
        </nav>

        <div aria-hidden className="h-10 shrink-0" />
      </div>
    </PhoneShell>
  );
}
