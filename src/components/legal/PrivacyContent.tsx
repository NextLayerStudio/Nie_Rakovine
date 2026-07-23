export function PrivacyContent({ className }: { className?: string }) {
  return (
    <div className={className}>
      <h3 className="mb-3 text-sm font-bold text-brand-purple">
        1. Prevádzkovateľ a kontakt
      </h3>
      <p className="mb-4">
        Prevádzkovateľom osobných údajov je <strong>NIE RAKOVINE, o. z.</strong>,
        so sídlom Cukrová 2272/14, 811 01 Bratislava-Staré Mesto, IČO: 50654896
        (ďalej len „Prevádzkovateľ“). Vo veciach ochrany osobných údajov nás
        môžete kontaktovať na{" "}
        <a href="mailto:office@nierakovine.sk" className="font-semibold underline underline-offset-2">
          office@nierakovine.sk
        </a>{" "}
        alebo telefonicky na{" "}
        <a href="tel:+421911843336" className="font-semibold underline underline-offset-2">
          +421 911 843 336
        </a>
        .
      </p>
      <p className="mb-4">
        Prevádzkovateľ nemá povinnosť menovať Zodpovednú osobu (DPO) a v
        súčasnosti žiadnu nemenoval. Všetky otázky, žiadosti a podnety
        týkajúce sa ochrany osobných údajov vybavuje priamo Prevádzkovateľ na
        vyššie uvedenom e-maile.
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        2. Kategórie spracúvaných údajov
      </h3>
      <p className="mb-2">
        <strong>Bežné osobné údaje:</strong> meno a priezvisko, e-mailová
        adresa, telefónne číslo, dátum narodenia, profilová fotografia a
        ďalšie údaje, ktoré dobrovoľne uvedie vo svojom profile (napr. mesto,
        záujmy, dôvod registrácie). Pri prihlásení a zabezpečení účtu
        spracúvame aj IP adresu, avšak len prechodne — na ochranu proti
        zneužitiu (napr. obmedzenie počtu pokusov o prihlásenie) — a
        neuchovávame ju trvalo v databáze.
      </p>
      <p className="mb-2">
        <strong>Osobitná kategória údajov (citlivé zdravotné údaje):</strong>{" "}
        ak sa rozhodnete o sebe vyplniť alebo zverejniť informácie o svojom
        zdravotnom stave — napríklad, či ste onkologický pacient, typ, rok a
        štádium diagnózy, priebeh liečby, denné hodnotenie nálady, alebo
        akékoľvek podobné informácie, ktoré uvediete vo svojom profile, v
        príspevkoch, komentároch alebo diskusiách. Tieto údaje nám
        poskytujete výlučne dobrovoľne a na základe vášho výslovného súhlasu.
      </p>
      <p>
        Denné záznamy o nálade sú súkromné a viditeľné len vám; Prevádzkovateľ
        k nim môže mať prístup výhradne v anonymizovanej/súhrnnej forme (napr.
        na štatistické účely), nikdy nie k obsahu jednotlivého záznamu
        konkrétneho člena.
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        3. Účely a právne základy spracovania
      </h3>
      <ul className="mb-4 list-disc space-y-2 pl-5">
        <li>
          <strong>Poskytovanie služieb platformy</strong> (vytvorenie a
          správa účtu, členstvo, fóra, videoknižnica, OK Karta) — právny
          základ: <strong>plnenie zmluvy</strong> (Podmienky používania).
        </li>
        <li>
          <strong>Spracúvanie údajov o zdravotnom stave</strong> (diagnóza,
          štádium, priebeh liečby, nálada) — právny základ:{" "}
          <strong>váš výslovný súhlas</strong> v zmysle čl. 9 ods. 2 písm. a)
          GDPR. Súhlas môžete kedykoľvek odvolať; odvolanie súhlasu nemá
          vplyv na zákonnosť spracúvania vykonaného pred jeho odvolaním.
        </li>
        <li>
          <strong>Organizácia podujatí a aktivít</strong> (registrácia
          účasti, komunikácia o podujatí) — právny základ:{" "}
          <strong>plnenie zmluvy</strong>, resp.{" "}
          <strong>oprávnený záujem</strong> Prevádzkovateľa na organizácii
          komunitných aktivít.
        </li>
        <li>
          <strong>Zasielanie noviniek a marketingová komunikácia</strong> —
          právny základ: <strong>váš súhlas</strong> (checkbox „newsletter“ v
          nastaveniach účtu), ktorý môžete kedykoľvek odvolať, resp.{" "}
          <strong>oprávnený záujem</strong> pri transakčných e-mailoch
          nevyhnutných na prevádzku účtu (napr. potvrdenie registrácie,
          upozornenie na prihlásenie z nového zariadenia).
        </li>
      </ul>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        4. Doba uchovávania údajov
      </h3>
      <p className="mb-4">
        Vaše údaje uchovávame po celú dobu existencie vášho účtu na
        platforme. Ak svoj účet zrušíte (alebo o zrušenie požiadate), vaše
        osobné údaje sa okamžite vymažú z produkčnej databázy platformy.
        V technických zálohách infrastruktúry môžu z bezpečnostných dôvodov
        zostať uložené najviac ešte 30 dní od zrušenia účtu, po uplynutí
        ktorých sa automaticky prepíšu/vymažú aj z nich.
      </p>
      <p>
        Ak vám bola poskytnutá platená služba (napr. Ročné alebo Podporujúce
        členstvo), údaje potrebné na splnenie účtovných a daňových povinností
        Prevádzkovateľa môžeme uchovávať aj po zrušení účtu, a to po dobu
        vyžadovanú platnými právnymi predpismi.
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        5. Príjemcovia údajov (tretie strany)
      </h3>
      <p className="mb-2">
        Vaše osobné údaje nezverejňujeme ani nepredávame tretím stranám.
        Prístup k nim majú výhradne poverení zamestnanci/spolupracovníci
        Prevádzkovateľa a nasledujúci technickí sprostredkovatelia, vždy len
        v rozsahu nevyhnutnom na plnenie ich úlohy a na základe zmluvy o
        spracúvaní osobných údajov:
      </p>
      <ul className="mb-4 list-disc space-y-1.5 pl-5">
        <li><strong>Vercel Inc.</strong> — hosting platformy, úložisko videí a základná analytika návštevnosti,</li>
        <li><strong>Neon (Neon, Inc.)</strong> — hosting databázy (servery v EÚ, región Frankfurt),</li>
        <li><strong>Resend</strong> — odosielanie transakčných a marketingových e-mailov,</li>
        <li><strong>Upstash</strong> — technické zabezpečenie a ochrana pred zneužitím (rate limiting),</li>
        <li><strong>GoPay</strong> — platobná brána spracúvajúca platby za členstvo (Prevádzkovateľ platobné údaje ako číslo karty nevidí ani neukladá).</li>
      </ul>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        6. Kde sú vaše údaje uložené
      </h3>
      <p className="mb-4">
        Dáta sú uložené na serveroch v rámci Európskej únie (región Frankfurt)
        a neopúšťajú územie EÚ. Spracúvanie prebieha v súlade s nariadením
        Európskeho parlamentu a Rady (EÚ) 2016/679 (GDPR).
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        7. Vaše práva
      </h3>
      <p className="mb-2">V súlade s GDPR máte právo najmä na:</p>
      <ul className="mb-4 list-disc space-y-1.5 pl-5">
        <li>prístup k svojim osobným údajom,</li>
        <li>opravu nesprávnych alebo neúplných údajov,</li>
        <li>vymazanie údajov („právo na zabudnutie“),</li>
        <li>obmedzenie spracovania,</li>
        <li>prenosnosť údajov,</li>
        <li>namietať proti spracovaniu založenom na oprávnenom záujme,</li>
        <li>kedykoľvek odvolať udelený súhlas so spracovaním (napr. so spracovaním zdravotných údajov alebo so zasielaním newslettera), bez toho, aby to malo vplyv na zákonnosť spracúvania pred jeho odvolaním.</li>
      </ul>
      <p className="mb-4">
        Žiadosti o výkon týchto práv zasielajte na{" "}
        <a href="mailto:office@nierakovine.sk" className="font-semibold underline underline-offset-2">
          office@nierakovine.sk
        </a>
        . Vybavíme ich najneskôr do 30 dní. Ak sa domnievate, že spracovanie
        vašich údajov porušuje GDPR, máte tiež právo podať sťažnosť na Úrad
        na ochranu osobných údajov Slovenskej republiky.
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        8. Automatizované rozhodovanie a profilovanie
      </h3>
      <p className="mb-4">
        Platforma prispôsobuje zobrazovaný obsah (napr. poradie článkov,
        videí a podujatí vo vašom prehľade) podľa typu ochorenia, ktorý ste
        si sami uviedli vo svojom profile — ide o jednoduché zoradenie
        relevantnejšieho obsahu vyššie, nie o skrytie akéhokoľvek obsahu ani
        o analýzu vášho správania. Platforma nevykonáva automatizované
        rozhodovanie s právnymi účinkami ani iné profilovanie v zmysle čl. 22
        GDPR, ktoré by významne ovplyvňovalo vaše práva alebo povinnosti.
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        9. Cookies
      </h3>
      <p>
        Informácie o tom, ako platforma používa cookies, nájdete na stránke{" "}
        <span className="font-semibold">Zásady používania súborov cookies</span>.
      </p>
    </div>
  );
}
