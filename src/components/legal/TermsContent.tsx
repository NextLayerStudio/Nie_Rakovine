// Shared between the registration TermsModal and the public /podmienky page —
// single source of truth so the two never drift apart.

export function TermsContent({ className }: { className?: string }) {
  return (
    <div className={className}>
      <h3 className="mb-3 text-sm font-bold text-brand-purple">
        1. Identifikačné údaje prevádzkovateľa
      </h3>
      <p className="mb-4">
        Platformu ONKO KLUB (dostupnú na doméne onkoklub.sk) prevádzkuje{" "}
        <strong>NIE RAKOVINE, o. z.</strong>, so sídlom Cukrová 2272/14,
        811 01 Bratislava-Staré Mesto, IČO: 50654896, DIČ: 2120693707,
        IČ DPH: SK2120693707, registrované v Evidencii občianskych združení
        vedenej Ministerstvom vnútra Slovenskej republiky pod reg. č.
        VVS/1-900/90-50348 (ďalej len „Prevádzkovateľ“).
      </p>
      <p className="mb-4">
        Kontakt: e-mail{" "}
        <a href="mailto:office@nierakovine.sk" className="font-semibold underline underline-offset-2">
          office@nierakovine.sk
        </a>
        , telefón{" "}
        <a href="tel:+421911843336" className="font-semibold underline underline-offset-2">
          +421 911 843 336
        </a>
        .
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        2. Popis služby
      </h3>
      <p className="mb-4">
        ONKO KLUB je uzavretá členská platforma pre onkologických pacientov
        a ich blízkych. Členstvo poskytuje prístup k videoknižnici, odborným
        prednáškam a podcastom, diskusným fóram, kalendáru podujatí, digitálnej
        OKkarte so zľavami u partnerov a Sociálnemu kompasu. Ide výlučne
        o digitálnu službu poskytovanú online — nejde o predaj fyzického tovaru.
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        3. Cena, mena a spôsob platby
      </h3>
      <p className="mb-4">
        Aktuálne ceny členstva sú uvedené v cenníku na platforme, vždy
        v eurách (EUR) a ako konečná cena vrátane DPH, bez akýchkoľvek
        skrytých poplatkov. Platba prebieha online, bezpečne, cez platobnú
        bránu GoPay platobnou kartou. Mesačné členstvo sa automaticky
        obnovuje raz mesačne, ročné členstvo raz ročne — vždy vo výške
        aktuálnej ceny platnej v čase obnovenia.
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        4. Poskytnutie služby a odstúpenie od zmluvy
      </h3>
      <p className="mb-4">
        Členstvo je digitálny obsah/služba poskytovaná okamžite po úspešnej
        registrácii a platbe — prístup k platforme získate ihneď, bez
        čakania na doručenie. Vzhľadom na to, že ide o digitálny obsah
        nedodávaný na hmotnom nosiči, súhlasíte pri dokončení registrácie
        s okamžitým začatím poskytovania služby pred uplynutím zákonnej
        14-dňovej lehoty na odstúpenie od zmluvy. V súlade s § 7 ods. 6
        písm. l) zákona č. 102/2014 Z. z. o ochrane spotrebiteľa pri predaji
        na diaľku tým strácate právo na odstúpenie od zmluvy vo vzťahu
        k už poskytnutému obsahu.
      </p>
      <p className="mb-4">
        Napriek tomu môžete členstvo <strong>kedykoľvek zrušiť</strong> priamo
        v nastaveniach svojho účtu, bez sankcií a bez udania dôvodu — prístup
        vám zostane aktívny do konca už zaplateného obdobia, ďalšie platby sa
        už nebudú strhávať. Ak sa domnievate, že vám bola služba poskytnutá
        vadne alebo vám bola omylom strhnutá platba, kontaktujte nás na{" "}
        <a href="mailto:office@nierakovine.sk" className="font-semibold underline underline-offset-2">
          office@nierakovine.sk
        </a>{" "}
        — vašu reklamáciu vybavíme najneskôr do 30 dní od jej doručenia.
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        5. Členstvo a prístup k platforme
      </h3>
      <p className="mb-4">
        Členstvo na platforme OnkoKlub je určené pre onkologických pacientov,
        ich rodinných príslušníkov a osoby blízke tejto téme. Prevádzkovateľ
        si vyhradzuje právo odmietnuť registráciu alebo zrušiť členstvo
        v prípade porušenia týchto Podmienok.
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        6. Pravidlá správania vo fóre a komunite
      </h3>
      <p className="mb-4">
        Všetci členovia sú povinní správať sa k ostatným s úctou a rešpektom.
        Zakazuje sa zverejňovanie urážlivého, diskriminačného alebo
        nenávistného obsahu. Príspevky s lekárskymi odporúčaniami musia byť
        jasne označené ako osobná skúsenosť, nie odborná rada.
      </p>
      <p className="mb-4">
        Prevádzkovateľ si vyhradzuje právo odstrániť akýkoľvek obsah, ktorý
        porušuje tieto pravidlá, a to bez predchádzajúceho upozornenia.
        Opakované porušovanie pravidiel môže viesť k trvalému zrušeniu
        členstva bez nároku na vrátenie platby.
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        7. Ochrana osobných údajov
      </h3>
      <p className="mb-4">
        Spracovanie osobných údajov sa riadi Zásadami ochrany osobných
        údajov, ktoré nájdete na stránke{" "}
        <span className="font-semibold">Ochrana súkromia</span>. Máte právo
        na prístup k svojim údajom, ich opravu, vymazanie a prenosnosť
        v zmysle nariadenia GDPR. Žiadosti o výkon práv zasielajte na adresu{" "}
        <a href="mailto:office@nierakovine.sk" className="font-semibold underline underline-offset-2">
          office@nierakovine.sk
        </a>
        .
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        8. Zodpovednosť a obmedzenie záväzkov
      </h3>
      <p className="mb-4">
        Obsah dostupný na platforme OnkoKlub (videá, články, prednášky)
        má informatívny charakter a nenahrádza odbornú lekársku pomoc.
        Prevádzkovateľ nenesie zodpovednosť za zdravotné rozhodnutia
        prijaté na základe informácií zverejnených na platforme.
      </p>
      <p className="mb-4">
        Prevádzkovateľ nezodpovedá za dočasnú nedostupnosť platformy
        spôsobenú technickou údržbou alebo okolnosťami mimo jeho kontroly.
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        9. Alternatívne riešenie sporov
      </h3>
      <p className="mb-4">
        Ak nie ste spokojní s vybavením vašej reklamácie alebo sťažnosti,
        máte právo obrátiť sa na Slovenskú obchodnú inšpekciu (SOI) alebo
        využiť platformu na riešenie sporov online dostupnú na{" "}
        <span className="font-semibold">ec.europa.eu/consumers/odr</span>.
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        10. Zmeny podmienok
      </h3>
      <p className="mb-4">
        Prevádzkovateľ si vyhradzuje právo tieto Podmienky kedykoľvek
        zmeniť. O zmenách budete informovaní e-mailom najmenej 14 dní
        vopred. Pokračovanie v používaní platformy po nadobudnutí
        účinnosti zmien sa považuje za súhlas s novými Podmienkami.
      </p>
      <p>
        Tieto Podmienky nadobúdajú účinnosť dňom registrácie člena
        na platforme OnkoKlub.
      </p>
    </div>
  );
}
