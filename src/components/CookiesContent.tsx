export function CookiesContent({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p>
        Táto stránka vysvetľuje, ako platforma <strong>ONKO KLUB</strong>{" "}
        používa cookies a podobné technológie sledovania (tzv. trackery).
      </p>

      <section>
        <h2 className="font-bold text-brand-purple">Čo sú cookies?</h2>
        <p className="mt-1">
          Cookies sú malé textové súbory ukladané vo vašom prehliadači alebo
          zariadení. Pomáhajú nám zabezpečiť prihlásenie, zapamätať vaše
          nastavenia a zlepšiť fungovanie a stabilitu platformy.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-brand-purple">
          Nevyhnutné a funkčné cookies
        </h2>
        <p className="mt-1">
          Tieto cookies sú potrebné na fungovanie a zabezpečenie platformy —
          bez nich by prihlásenie a základné funkcie nefungovali. Nemožno ich
          vypnúť, ak chcete platformu používať.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-brand-purple">
          Analytické a štatistické trackery
        </h2>
        <p className="mt-1">
          Používame nástroje na meranie návštevnosti a technického fungovania
          platformy. Tieto nástroje spracúvajú dáta anonymizovane a
          agregovane (nie na úrovni identifikácie konkrétnej osoby) a — na
          rozdiel od bežných analytických nástrojov — nevyužívajú na to
          klasické cookies.
        </p>
      </section>

      <section className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-brand-purple/20">
              <th className="py-2 pr-3 font-bold text-brand-purple">Názov</th>
              <th className="py-2 pr-3 font-bold text-brand-purple">Účel</th>
              <th className="py-2 font-bold text-brand-purple">Platnosť</th>
            </tr>
          </thead>
          <tbody className="align-top">
            <tr className="border-b border-brand-purple/10">
              <td className="py-2 pr-3 font-semibold">onko_session</td>
              <td className="py-2 pr-3">Nevyhnutné — udržanie prihlásenia člena</td>
              <td className="py-2">30 dní</td>
            </tr>
            <tr className="border-b border-brand-purple/10">
              <td className="py-2 pr-3 font-semibold">onko_device</td>
              <td className="py-2 pr-3">Funkčné — rozpoznanie známeho zariadenia, upozornenie na prihlásenie z nového zariadenia</td>
              <td className="py-2">12 mesiacov</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 font-semibold">Vercel Web Analytics</td>
              <td className="py-2 pr-3">Analytické — anonymizovaná návštevnosť; nepoužíva cookies</td>
              <td className="py-2">—</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 font-semibold">Vercel Speed Insights</td>
              <td className="py-2 pr-3">Analytické — meranie rýchlosti a technického výkonu; nepoužíva cookies</td>
              <td className="py-2">—</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="font-bold text-brand-purple">Ako cookies spravovať</h2>
        <p className="mt-1">
          Cookies môžete obmedziť alebo vymazať v nastaveniach vášho
          prehliadača. Obmedzenie nevyhnutných cookies (napr.{" "}
          <span className="font-semibold">onko_session</span>) môže
          ovplyvniť prihlásenie a niektoré funkcie platformy.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-brand-purple">Kontakt</h2>
        <p className="mt-1">
          Otázky týkajúce sa spracovania údajov a cookies smerujte na{" "}
          <a
            href="mailto:office@nierakovine.sk"
            className="font-semibold text-brand-purple underline"
          >
            office@nierakovine.sk
          </a>
          .
        </p>
      </section>

      <p className="text-xs text-brand-purple/55">Posledná aktualizácia: júl 2026</p>
    </div>
  );
}
