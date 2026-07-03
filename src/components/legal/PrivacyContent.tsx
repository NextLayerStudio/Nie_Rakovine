export function PrivacyContent({ className }: { className?: string }) {
  return (
    <div className={className}>
      <h3 className="mb-3 text-sm font-bold text-brand-purple">
        1. Prevádzkovateľ
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

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        2. Aké údaje spracúvame
      </h3>
      <p className="mb-2">V súvislosti s prevádzkou platformy ONKO KLUB spracúvame najmä:</p>
      <ul className="mb-4 list-disc space-y-1.5 pl-5">
        <li>registračné a kontaktné údaje (meno, e-mail, dátum narodenia),</li>
        <li>profilové údaje, ktoré nám dobrovoľne poskytnete (napr. mesto, diagnóza, typ ochorenia, záujmy),</li>
        <li>údaje o členstve a platbách (typ predplatného, stav platby — samotné platobné údaje spracúva platobná brána GoPay, my ich nevidíme ani neukladáme),</li>
        <li>obsah, ktorý vytvoríte v rámci platformy (príspevky vo fórach, komentáre),</li>
        <li>technické údaje potrebné na prevádzku a bezpečnosť účtu (napr. identifikátor zariadenia pri prihlásení).</li>
      </ul>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        3. Účel a právny základ spracovania
      </h3>
      <p className="mb-4">
        Údaje spracúvame na účely poskytovania členstva a obsahu platformy
        (plnenie zmluvy), na základe vášho súhlasu (napr. newsletter,
        personalizácia obsahu podľa diagnózy) a na základe oprávneného záujmu
        Prevádzkovateľa (bezpečnosť účtu, prevencia zneužitia platformy).
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        4. Kde sú vaše údaje uložené
      </h3>
      <p className="mb-4">
        Dáta sú uložené na serveroch v rámci Európskej únie (región Frankfurt)
        a neopúšťajú územie EÚ. Spracúvanie prebieha v súlade s nariadením
        Európskeho parlamentu a Rady (EÚ) 2016/679 (GDPR).
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        5. Komu údaje sprístupňujeme
      </h3>
      <p className="mb-4">
        Vaše osobné údaje nezverejňujeme ani nepredávame tretím stranám.
        Prístup k nim majú výhradne poverení zamestnanci/spolupracovníci
        Prevádzkovateľa a technickí sprostredkovatelia potrební na chod
        platformy (napr. hosting, platobná brána GoPay, e-mailová služba) —
        vždy len v rozsahu nevyhnutnom na plnenie ich úlohy a na základe
        zmluvy o spracúvaní osobných údajov.
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        6. Vaše práva
      </h3>
      <p className="mb-2">V súlade s GDPR máte právo najmä na:</p>
      <ul className="mb-4 list-disc space-y-1.5 pl-5">
        <li>prístup k svojim osobným údajom,</li>
        <li>opravu nesprávnych alebo neúplných údajov,</li>
        <li>vymazanie údajov („právo na zabudnutie“),</li>
        <li>obmedzenie spracovania,</li>
        <li>prenosnosť údajov,</li>
        <li>namietať proti spracovaniu založenom na oprávnenom záujme,</li>
        <li>kedykoľvek odvolať udelený súhlas so spracovaním.</li>
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
        7. Doba uchovávania
      </h3>
      <p className="mb-4">
        Údaje uchovávame po dobu trvania vášho členstva a následne po dobu
        vyžadovanú platnými právnymi predpismi (napr. účtovnými a daňovými).
        Po zániku členstva a uplynutí týchto lehôt vaše údaje vymažeme alebo
        anonymizujeme.
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        8. Cookies
      </h3>
      <p>
        Informácie o tom, ako platforma používa cookies, nájdete v
        samostatnej sekcii Cookies dostupnej priamo v aplikácii ONKO KLUB.
      </p>
    </div>
  );
}
