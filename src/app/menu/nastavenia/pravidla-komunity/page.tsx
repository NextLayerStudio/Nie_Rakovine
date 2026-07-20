import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { CommunityGuidelinesContent } from "@/components/legal/CommunityGuidelinesContent";

export default function NastaveniaPravidlaKomunityPage() {
  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <TopBar backHref="/menu/nastavenia/pravne" title="Pravidlá komunity" />

        <article className="px-6 py-4 pb-8">
          <CommunityGuidelinesContent className="card space-y-4 p-5 text-sm leading-relaxed text-brand-purple/85" />
        </article>
      </div>
    </PhoneShell>
  );
}
