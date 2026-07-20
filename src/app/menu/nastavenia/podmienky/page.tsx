import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { TermsContent } from "@/components/legal/TermsContent";

export default function NastaveniaPodmienkyPage() {
  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <TopBar backHref="/menu/nastavenia" title="Podmienky používania" />

        <article className="px-6 py-4 pb-8">
          <TermsContent className="card space-y-4 p-5 text-sm leading-relaxed text-brand-purple/85" />
        </article>
      </div>
    </PhoneShell>
  );
}
