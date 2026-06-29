export function CookiesContent({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p>
        Táto stránka vysvetľuje, ako aplikácia <strong>ONKO KLUB</strong> používa
        cookies a podobné technológie.
      </p>

      <section>
        <h2 className="font-bold text-brand-purple">Čo sú cookies?</h2>
        <p className="mt-1">
          Cookies sú malé textové súbory ukladané vo vašom prehliadači. Pomáhajú nám
          zabezpečiť prihlásenie, zapamätať vaše nastavenia a zlepšiť fungovanie
          aplikácie.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-brand-purple">Aké cookies používame</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          <li>
            <strong>Nevyhnutné</strong> — session cookie pre prihlásenie a bezpečnosť
            účtu (bez nich aplikácia nefunguje správne).
          </li>
          <li>
            <strong>Funkčné</strong> — zapamätanie vašich volieb počas registrácie a
            používania aplikácie.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-bold text-brand-purple">Ako cookies spravovať</h2>
        <p className="mt-1">
          Cookies môžete obmedziť alebo vymazať v nastaveniach vášho prehliadača.
          Obmedzenie nevyhnutných cookies môže ovplyvniť prihlásenie a niektoré funkcie
          aplikácie.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-brand-purple">Kontakt</h2>
        <p className="mt-1">
          Otázky týkajúce sa spracovania údajov a cookies smerujte na{" "}
          <a
            href="mailto:info@onkoklub.sk"
            className="font-semibold text-brand-purple underline"
          >
            info@onkoklub.sk
          </a>
          .
        </p>
      </section>

      <p className="text-xs text-brand-purple/55">Posledná aktualizácia: máj 2026</p>
    </div>
  );
}
