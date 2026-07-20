export function LiabilityDisclaimerContent({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="mb-6 rounded-xl border border-brand-pink/30 bg-brand-pink/10 p-4">
        <p className="font-semibold text-brand-purple">
          Obsah v tejto aplikácii slúži výhradne na komunitné, podporné a
          informačné účely. Aplikácia neposkytuje lekársku pomoc, diagnostiku
          ani liečbu. Všetky informácie konzultujte so svojím ošetrujúcim
          lekárom.
        </p>
      </div>

      <ul className="list-disc space-y-2 pl-5">
        <li>
          Obsah zverejnený Prevádzkovateľom aj ostatnými členmi (články,
          videá, prednášky, príspevky, komentáre) má informatívny a podporný
          charakter a nenahrádza odbornú lekársku starostlivosť. Za obsah,
          ktorý na platforme zverejní iný člen, zodpovedá tento člen — nie
          Prevádzkovateľ (viac v Pravidlách komunity).
        </li>
        <li>
          Prevádzkovateľ nezodpovedá za zdravotné, finančné ani iné
          rozhodnutia, ktoré ktokoľvek urobí na základe informácií
          zverejnených na platforme.
        </li>
        <li>
          Účasť na fyzických podujatiach organizovaných Prevádzkovateľom je
          dobrovoľná a na vlastnú zodpovednosť — podrobnosti v čl. 10
          Podmienok používania.
        </li>
        <li>
          Prevádzkovateľ nezodpovedá za dočasnú nedostupnosť platformy
          spôsobenú technickou údržbou, výpadkom alebo okolnosťami mimo
          jeho kontroly.
        </li>
        <li>
          Platforma môže obsahovať odkazy na služby tretích strán (napr.
          partnerov zľavovej karty). Prevádzkovateľ nezodpovedá za obsah,
          dostupnosť ani kvalitu služieb poskytovaných týmito tretími
          stranami.
        </li>
        <li>
          Zodpovednosť Prevádzkovateľa je vo všetkých prípadoch obmedzená v
          rozsahu, ktorý pripúšťajú platné právne predpisy Slovenskej
          republiky.
        </li>
      </ul>

      <p className="mt-4 text-xs text-brand-purple/55">Posledná aktualizácia: júl 2026</p>
    </div>
  );
}
