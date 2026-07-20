import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { PrivacyContent } from "@/components/legal/PrivacyContent";

export default function NastaveniaOchranaSukromiaPage() {
  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <TopBar backHref="/menu/nastavenia/pravne" title="Zásady ochrany osobných údajov" />

        <article className="px-6 py-4 pb-8">
          <PrivacyContent className="card space-y-4 p-5 text-sm leading-relaxed text-brand-purple/85" />
        </article>
      </div>
    </PhoneShell>
  );
}
