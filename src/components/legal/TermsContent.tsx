// Shared between the registration TermsModal and the public /podmienky page —
// single source of truth so the two never drift apart.

export function TermsContent({ className }: { className?: string }) {
  return (
    <div className={className}>
      <h3 className="mb-3 text-sm font-bold text-brand-purple">
        1. Úvodné ustanovenia
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
      <p className="mb-4">
        Tieto Podmienky používania (ďalej len „Podmienky“) upravujú vzájomné
        práva a povinnosti medzi Prevádzkovateľom a používateľom platformy
        ONKO KLUB (ďalej len „Používateľ“). Registráciou na platforme
        Používateľ vyjadruje súhlas s týmito Podmienkami a zaväzuje sa ich
        dodržiavať.
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        2. Definícia služieb
      </h3>
      <p className="mb-4">
        ONKO KLUB je uzavretá členská online platforma (sociálna sieť)
        určená onkologickým pacientom, ich blízkym a podporovateľom.
        V rámci platformy Prevádzkovateľ poskytuje najmä:
      </p>
      <ul className="mb-4 list-disc space-y-1.5 pl-5">
        <li>diskusné fóra a profily členov, kde môžete zdieľať príspevky, komentáre a fotografie a komunikovať s ostatnými členmi komunity,</li>
        <li>videoknižnicu, odborné prednášky, podcasty a články,</li>
        <li>kalendár podujatí a aktivít s možnosťou online registrácie účasti (vrátane fyzických podujatí),</li>
        <li>digitálnu OK Kartu so zľavami u partnerov platformy,</li>
        <li>ďalšie funkcie súvisiace s podporou onkologických pacientov a ich blízkych (napr. Sociálny kompas, sledovanie nálady).</li>
      </ul>
      <p className="mb-4">
        Ide výlučne o digitálnu službu poskytovanú online — nejde o predaj
        fyzického tovaru. Fyzické podujatia organizované Prevádzkovateľom sú
        súčasťou služby, prístup k platforme a registrácia na ne však
        prebieha elektronicky.
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        3. Cena, mena a spôsob platby
      </h3>
      <p className="mb-4">
        Aktuálne ceny členstva sú uvedené v cenníku na platforme, vždy
        v eurách (EUR) a ako konečná cena vrátane DPH, bez akýchkoľvek
        skrytých poplatkov. Platba prebieha online, bezpečne, cez platobnú
        bránu GoPay platobnou kartou.
      </p>
      <p className="mb-4">
        Platforma ponúka štyri formy členstva: <strong>Free</strong> členstvo
        je bezplatné a nevyžaduje žiadnu platbu; <strong>Mesačné</strong> a{" "}
        <strong>Ročné</strong> členstvo sú opakované platby — mesačné sa
        automaticky obnovuje raz mesačne, ročné raz ročne, vždy vo výške
        aktuálnej ceny platnej v čase obnovenia; <strong>Podporujúce</strong>{" "}
        členstvo je jednorazová dobrovoľná platba vo výške, ktorú si používateľ
        sám zvolí (minimálne 50 €) — nejde o opakovanú platbu, po jej úhrade
        získate prístup na 1 rok, rovnako ako pri Ročnom členstve, a je určené
        predovšetkým pre osoby, ktoré nie sú onkologickými pacientmi, ale
        chcú komunitu finančne podporiť.
      </p>
      <p className="mb-4">
        Pri platbe je možné uplatniť zľavový kód poskytnutý Prevádzkovateľom
        (napríklad partnerom alebo spolupracovníkom), ktorý zníži cenu
        o percento alebo o pevnú sumu podľa podmienok konkrétneho kódu.
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        4. Podmienky registrácie a účtu
      </h3>
      <p className="mb-4">
        <strong>Veková hranica:</strong> registrácia a používanie platformy
        ONKO KLUB je určené osobám, ktoré dosiahli vek 18 rokov. Vytvorením
        účtu Používateľ potvrdzuje, že je plnoletý. Ak Prevádzkovateľ zistí,
        že účet používa osoba mladšia ako 18 rokov, je oprávnený tento účet
        bez náhrady zablokovať alebo zrušiť.
      </p>
      <p className="mb-4">
        <strong>Pravdivosť údajov:</strong> Používateľ je povinný uvádzať
        pri registrácii a počas používania platformy pravdivé, presné a
        aktuálne údaje o svojej osobe. Uvedenie nepravdivých údajov môže byť
        dôvodom na zablokovanie alebo zrušenie účtu.
      </p>
      <p className="mb-4">
        <strong>Zodpovednosť za prístupové údaje:</strong> Používateľ je
        povinný uchovávať svoje prihlasovacie údaje (heslo) v tajnosti a
        nezdieľať ich s tretími osobami. Používateľ zodpovedá za všetky
        aktivity vykonané pod jeho účtom, a to aj v prípade, že k
        prístupovým údajom neoprávnene získala prístup tretia osoba
        v dôsledku nedostatočného zabezpečenia zo strany Používateľa.
        Podozrenie na zneužitie účtu je Používateľ povinný bezodkladne
        oznámiť Prevádzkovateľovi na{" "}
        <a href="mailto:office@nierakovine.sk" className="font-semibold underline underline-offset-2">
          office@nierakovine.sk
        </a>
        .
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        5. Poskytnutie služby a odstúpenie od zmluvy
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
        k už poskytnutému obsahu. Rovnaké pravidlo platí aj pri jednorazovej
        platbe v rámci Podporujúceho členstva.
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
        6. Reklamačný poriadok
      </h3>
      <p className="mb-4">
        Ak sa domnievate, že vám bola členská platforma poskytnutá vadne, že
        vám bola omylom strhnutá platba, alebo že vám nebol umožnený prístup
        k funkciám zodpovedajúcim vášmu predplatnému, môžete si túto
        skutočnosť reklamovať.
      </p>
      <p className="mb-4">
        <strong>Ako reklamáciu podať:</strong> e-mailom na{" "}
        <a href="mailto:office@nierakovine.sk" className="font-semibold underline underline-offset-2">
          office@nierakovine.sk
        </a>{" "}
        s uvedením mena, e-mailu použitého pri registrácii, dátumu platby a
        popisu problému. Keďže ide o digitálnu službu bez fyzického tovaru,
        reklamácia sa nezasiela poštou ani na žiadnu fyzickú adresu.
      </p>
      <p className="mb-4">
        <strong>Vybavenie:</strong> reklamáciu vybavíme najneskôr do 30 dní
        od jej doručenia a o výsledku vás budeme informovať e-mailom na
        adresu, z ktorej bola reklamácia podaná.
      </p>
      <p className="mb-4">
        <strong>Kedy reklamáciu nemožno uplatniť:</strong> ak bol dôvod na
        strane používateľa (napr. zabudnuté prihlasovacie údaje, vlastné
        zrušenie členstva pred koncom už zaplateného obdobia, alebo
        porušenie týchto Podmienok vedúce k zrušeniu členstva).
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        7. Členstvo a prístup k platforme
      </h3>
      <p className="mb-4">
        Členstvo na platforme OnkoKlub je určené pre onkologických pacientov,
        ich rodinných príslušníkov a osoby blízke tejto téme. Podporujúce
        členstvo je určené aj osobám bez osobnej či rodinnej skúsenosti
        s onkologickým ochorením, ktoré chcú platformu a jej poslanie finančne
        podporiť — majú rovnaký prístup k platforme ako Ročné členstvo.
        Prevádzkovateľ si vyhradzuje právo odmietnuť registráciu alebo zrušiť
        členstvo v prípade porušenia týchto Podmienok.
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        8. Práva a povinnosti používateľa
      </h3>
      <p className="mb-4">
        Používateľ je oprávnený využívať platformu len na účely, na ktoré je
        určená — na osobné, nekomerčné využitie v súvislosti s podporou
        v oblasti onkologických ochorení.
      </p>
      <p className="mb-2">
        Zakazuje sa akékoľvek komerčné využívanie platformy bez
        predchádzajúceho písomného súhlasu Prevádzkovateľa, najmä:
      </p>
      <ul className="mb-4 list-disc space-y-1.5 pl-5">
        <li>propagácia, ponuka alebo predaj produktov a služieb, vrátane produktov a služieb spájaných s alternatívnou medicínou alebo nepodloženými liečebnými metódami,</li>
        <li>reklama tretích strán,</li>
        <li>zbieranie kontaktných či osobných údajov iných členov na komerčné účely.</li>
      </ul>
      <p className="mb-4">
        Používateľ sa zaväzuje neporušovať autorské práva a iné práva
        duševného vlastníctva tretích osôb ani Prevádzkovateľa — najmä
        nezverejňovať obsah (texty, fotografie, videá, hudbu), na ktorý nemá
        potrebné práva alebo súhlas autora.
      </p>
      <p className="mb-4">
        Používateľ sa ďalej zaväzuje dodržiavať pravidlá správania v
        komunite (podrobne rozpísané na stránke Pravidlá komunity): správať
        sa k ostatným členom s úctou a rešpektom, nezverejňovať urážlivý,
        diskriminačný, nenávistný alebo nepravdivý obsah, a príspevky
        obsahujúce osobnú zdravotnú skúsenosť jasne odlišovať od odbornej
        lekárskej rady. Prevádzkovateľ si vyhradzuje právo odstrániť
        akýkoľvek obsah, ktorý porušuje tieto pravidlá, a to bez
        predchádzajúceho upozornenia. Opakované porušovanie pravidiel môže
        viesť k trvalému zrušeniu členstva bez nároku na vrátenie platby.
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        9. Práva a povinnosti prevádzkovateľa
      </h3>
      <p className="mb-4">
        Prevádzkovateľ je oprávnený kedykoľvek a bez predchádzajúceho
        upozornenia odstrániť akýkoľvek obsah (príspevok, komentár,
        fotografiu), ktorý porušuje tieto Podmienky, Pravidlá komunity alebo
        platné právne predpisy.
      </p>
      <p className="mb-4">
        Prevádzkovateľ je oprávnený dočasne alebo trvalo zablokovať alebo
        zrušiť účet Používateľa, ktorý porušuje tieto Podmienky, a to aj bez
        udania dôvodu a bez nároku Používateľa na náhradu škody alebo
        vrátenie už uhradenej platby za členstvo, ak k porušeniu došlo
        zavinením Používateľa.
      </p>
      <p className="mb-4">
        Prevádzkovateľ je oprávnený z technických, bezpečnostných alebo
        údržbových dôvodov kedykoľvek dočasne obmedziť alebo prerušiť
        prevádzku platformy (odstávka), a to aj bez predchádzajúceho
        upozornenia; Prevádzkovateľ sa však bude snažiť plánované odstávky
        vopred oznámiť a minimalizovať ich dopad na Používateľov.
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        10. Organizácia podujatí a aktivít
      </h3>
      <p className="mb-4">
        Prevádzkovateľ organizuje v rámci platformy online aj fyzické
        podujatia a aktivity (napr. prednášky, komunitné stretnutia), na
        ktoré sa Používateľ môže prihlásiť priamo cez platformu. Ak má
        podujatie obmedzenú kapacitu, po jej naplnení nie je možné sa na
        podujatie ďalej prihlásiť.
      </p>
      <p className="mb-4">
        Ak sa Používateľ nemôže po prihlásení na podujatie zúčastniť, je
        povinný svoju neúčasť oznámiť Prevádzkovateľovi, najlepšie čo
        najskôr pred konaním podujatia (napr. e-mailom na{" "}
        <a href="mailto:office@nierakovine.sk" className="font-semibold underline underline-offset-2">
          office@nierakovine.sk
        </a>
        ), aby sa uvoľnené miesto mohlo ponúknuť inému záujemcovi.
      </p>
      <p className="mb-4">
        Účasť na fyzických podujatiach je dobrovoľná a na vlastnú
        zodpovednosť Používateľa. Prevádzkovateľ nezodpovedá za úrazy ani
        škody na zdraví alebo majetku, ktoré Používateľovi vzniknú v
        súvislosti s účasťou na podujatí, ibaže by tieto škody vznikli
        priamym zavinením Prevádzkovateľa alebo osôb, za ktoré Prevádzkovateľ
        zodpovedá.
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        11. Duševné vlastníctvo
      </h3>
      <p className="mb-4">
        Všetky práva duševného vlastníctva k platforme ONKO KLUB — vrátane
        jej dizajnu, grafického spracovania, loga, zdrojového kódu, textov a
        ostatného obsahu vytvoreného Prevádzkovateľom — patria
        Prevádzkovateľovi, prípadne subjektom, od ktorých Prevádzkovateľ
        odvodzuje svoje práva. Používateľ nie je oprávnený tento obsah
        kopírovať, upravovať, šíriť ani inak používať bez predchádzajúceho
        písomného súhlasu Prevádzkovateľa.
      </p>
      <p className="mb-4">
        Nahraním fotografie, príspevku, komentára alebo iného obsahu (ďalej
        len „Obsah používateľa“) na platformu udeľuje Používateľ
        Prevádzkovateľovi nevýhradnú, bezplatnú, územne neobmedzenú licenciu
        na použitie tohto Obsahu používateľa, a to na účely:
      </p>
      <ul className="mb-4 list-disc space-y-1.5 pl-5">
        <li>zobrazenia a fungovania platformy ONKO KLUB,</li>
        <li>propagácie a marketingu činnosti NIE RAKOVINE, o. z. a platformy ONKO KLUB (napr. na webe, sociálnych sieťach, v propagačných materiáloch).</li>
      </ul>
      <p className="mb-4">
        Licencia trvá po dobu, počas ktorej je Obsah používateľa na
        platforme zverejnený, a primeranú dobu potrebnú na jeho odstránenie
        z už vytvorených propagačných materiálov po tom, ako o to
        Používateľ požiada. Používateľ zostáva autorom svojho obsahu a
        udelením licencie sa svojich autorských práv nezbavuje.
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        12. Ochrana osobných údajov
      </h3>
      <p className="mb-4">
        Spracovanie osobných údajov sa riadi Zásadami ochrany osobných
        údajov, ktoré nájdete na stránke{" "}
        <span className="font-semibold">Zásady ochrany osobných údajov</span>. Máte právo
        na prístup k svojim údajom, ich opravu, vymazanie a prenosnosť
        v zmysle nariadenia GDPR. Žiadosti o výkon práv zasielajte na adresu{" "}
        <a href="mailto:office@nierakovine.sk" className="font-semibold underline underline-offset-2">
          office@nierakovine.sk
        </a>
        .
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        13. Zodpovednosť a obmedzenie záväzkov
      </h3>
      <p className="mb-4">
        Obsah dostupný na platforme OnkoKlub (videá, články, prednášky)
        má informatívny charakter a nenahrádza odbornú lekársku pomoc.
        Prevádzkovateľ nenesie zodpovednosť za zdravotné rozhodnutia
        prijaté na základe informácií zverejnených na platforme.
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        14. Alternatívne riešenie sporov
      </h3>
      <p className="mb-4">
        Ak nie ste spokojní s vybavením vašej reklamácie alebo sťažnosti,
        máte právo obrátiť sa na Slovenskú obchodnú inšpekciu (SOI) alebo
        využiť platformu na riešenie sporov online dostupnú na{" "}
        <span className="font-semibold">ec.europa.eu/consumers/odr</span>.
      </p>

      <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
        15. Záverečné ustanovenia
      </h3>
      <p className="mb-4">
        Tieto Podmienky, ako aj vzťah medzi Prevádzkovateľom a Používateľom,
        sa spravujú právnym poriadkom Slovenskej republiky. Prevádzkovateľ a
        Používateľ sa budú prípadné spory snažiť riešiť prednostne vzájomnou
        dohodou; ak k dohode nedôjde, na rozhodovanie sporu je príslušný
        všeobecný súd Slovenskej republiky.
      </p>
      <p className="mb-4">
        Prevádzkovateľ si vyhradzuje právo tieto Podmienky kedykoľvek
        zmeniť. O zmenách budete informovaní e-mailom najmenej 14 dní
        vopred. Pokračovanie v používaní platformy po nadobudnutí
        účinnosti zmien sa považuje za súhlas s novými Podmienkami.
      </p>
      <p>
        Tieto Podmienky nadobúdajú účinnosť dňom registrácie člena
        na platforme ONKO KLUB.
      </p>
    </div>
  );
}
