import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Lock, Circle } from "lucide-react";

const CATEGORIES = [
  {
    label: "Podľa diagnózy",
    items: [
      "Rakovina prsníka",
      "Rakovina hrubého čreva a konečníka",
      "Rakovina pľúc",
      "Rakovina prostaty",
      "Rakovina pankreasu",
      "Rakovina semenníkov",
      "Rakovina kože",
      "Rakovina krčka maternice",
      "Rakovina vaječníkov",
      "Rakovina močového mechúra",
      "Iné",
    ],
  },
  {
    label: "Podľa témy",
    items: ["Psychická podpora", "Výživa a pohyb", "Nežiaduce účinky liečby", "Sociálne dávky", "Intimita a sexualita", "Návrat do práce"],
  },
  {
    label: "Podľa liečby",
    items: ["Chemoterapia", "Rádioterapia", "Chirurgická liečba", "Imunoterapia", "Hormonálna liečba", "Cielená liečba"],
  },
];

const SAMPLE_POSTS = [
  { forum: "Psychická podpora",        time: "pred 2 hodinami", replies: 8,  text: "Mám pocit, že všetci okolo mňa hovoria, aby som bola pozitívna — a ja neviem, ako to mám robiť. Je to v poriadku?", anon: true },
  { forum: "Nežiaduce účinky liečby",  time: "pred 5 hodinami", replies: 12, text: "Po druhej chémii mi vypadli vlasy. Neviete, kde zohnať dobrú parochňu, ktorú čiastočne hradí poisťovňa?",       anon: false },
  { forum: "Rakovina prsníka",         time: "včera",           replies: 24, text: "Práve som sa dozvedela výsledky. Neviem čo ďalej. Môžem sa tu niekoho opýtať na skúsenosti s liečbou v UN Bratislava?", anon: true },
];

export default function OnkorumkyPage() {
  return (
    <main className="min-h-screen bg-[#FFF3F9] font-sans">
      <Navbar />

      <section className="pt-24 pb-10 px-5">
        <p className="text-[#FDA4C7] text-sm font-bold uppercase tracking-widest mb-3">
          Diskusné fóra
        </p>
        <h1 className="text-[2.4rem] font-black text-[#6F2380] leading-[1.1] mb-5 max-w-xs">
          Podeľte sa o to, čím prechádzate
        </h1>
        <p className="text-[#6F2380]/70 text-base leading-relaxed mb-8 max-w-sm">
          Zdieľajte svoje skúsenosti, otázky, obavy či každodenné výzvy s
          ľuďmi, ktorí vedia, čo prežívate. Môžete prispievať pod vlastným
          menom alebo anonymne.
        </p>
        <Link href="/register" className="block w-full rounded-full bg-[#FDA4C7] text-white text-xl font-black py-5 text-center">
          Vstúpiť do komunity
        </Link>
      </section>

      {/* Anonymita */}
      <section className="px-5 pb-12">
        <div className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-[#FDA4C7]/15">
          <div className="w-11 h-11 rounded-xl bg-[#6F2380] flex items-center justify-center shrink-0">
            <Lock size={18} className="text-white" strokeWidth={2} />
          </div>
          <div>
            <h3 className="font-black text-[#6F2380] text-[15px] leading-tight mb-0.5">Súkromie máte vo svojich rukách.</h3>
            <p className="text-[#6F2380]/55 text-[13px] leading-relaxed">
              Vaša identita je viditeľná iba pre administrátora, ostatným
              používateľom sa nezobrazuje.
            </p>
          </div>
        </div>
      </section>

      {/* Kategórie fór */}
      <section className="px-5 pb-12">
        <h2 className="text-xl font-black text-[#6F2380] mb-6">29 fór — nájdi si svoje</h2>
        <div className="flex flex-col gap-4">
          {CATEGORIES.map((cat) => (
            <div key={cat.label} className="bg-white rounded-2xl p-5 border border-[#FDA4C7]/15">
              <p className="text-[#FDA4C7] text-xs font-bold uppercase tracking-wider mb-3">{cat.label}</p>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <span key={item} className="bg-[#FFF3F9] text-[#6F2380] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#6F2380]/10">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ukážkové príspevky */}
      <section className="px-5 pb-16">
        <h2 className="text-xl font-black text-[#6F2380] mb-2">Aktuálne z diskusií</h2>
        <p className="text-[#6F2380]/45 text-xs mb-6">Po prihlásení získate prístup k plným zneniam príspevkov a rozhovorov.</p>
        <div className="flex flex-col gap-3">
          {SAMPLE_POSTS.map((post, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-[#FDA4C7]/15">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#FDA4C7] text-xs font-bold">{post.forum}</span>
                <span className="text-[#6F2380]/30 text-xs">{post.time}</span>
              </div>
              <p className="text-[#6F2380]/75 text-sm leading-relaxed mb-3 italic">
                „{post.text}&rdquo;
              </p>
              <div className="flex items-center gap-2">
                <Circle size={5} className="text-[#FDA4C7] fill-[#FDA4C7]" />
                <p className="text-[#6F2380]/35 text-xs">
                  {post.anon ? "Anonymný člen" : "Člen"} · {post.replies} odpovedí · len pre členov
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 pb-16">
        <div className="rounded-[1.8rem] bg-[#6F2380] p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Nie ste v tom sami</h2>
          <p className="text-white/65 text-sm leading-relaxed mb-6">
            Po registrácii získate okamžitý prístup ku všetkým diskusným fóram.
            Môžete začať len čítaním, bez akéhokoľvek záväzku.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="inline-block rounded-full bg-[#FDA4C7] text-white font-black text-base px-8 py-4">
              Zobraziť diskusie
            </Link>
            <Link href="/register" className="inline-block rounded-full border-2 border-white text-white font-black text-base px-8 py-4">
              Vytvoriť príspevok
            </Link>
          </div>
        </div>
      </section>

      <footer className="px-5 pb-10 text-center text-[#6F2380]/40 text-xs">
        <Link href="/" className="underline">← Späť na úvod</Link>
      </footer>
    </main>
  );
}
