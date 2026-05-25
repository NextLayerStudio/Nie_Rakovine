import { FeedHeader } from "@/components/FeedHeader";

// Event detail + registration (ONKO YOGA modal in design 4)
export default function YogaEventPage() {
  return (
    <>
      <FeedHeader />

      <article className="mx-4 overflow-hidden rounded-3xl bg-white shadow-card">
        <div
          className="aspect-[5/3] w-full"
          style={{
            background:
              "linear-gradient(180deg, #f3c3a2 0%, #d98c80 60%, #6F2380 100%)",
          }}
        />
        <div className="-mt-12 rounded-t-3xl bg-brand-pink p-5 text-white">
          <h2 className="text-center text-xl font-extrabold tracking-wide">
            ONKO YOGA
          </h2>

          <p className="mt-4 text-xs leading-relaxed text-white/90">
            Pravidelné jogové stretnutia pre členky a členov klubu. Lekcia je
            vedená skúsenou cvičiteľkou špecializovanou na onkologických
            pacientov. Cvičenie je vhodné pre začiatočníkov.
          </p>

          <ul className="mt-4 space-y-2 text-xs">
            <li className="flex items-center gap-2">
              <DotIcon /> 14. 6. 2026, 10:00 - 11:30
            </li>
            <li className="flex items-center gap-2">
              <DotIcon /> Trnavská cesta 25, Bratislava
            </li>
            <li className="flex items-center gap-2">
              <DotIcon /> Voľných miest: 8 / 15
            </li>
          </ul>

          <form
            action="/home/events/yoga/registered"
            className="mt-5 flex flex-col gap-3"
          >
            <input
              name="name"
              placeholder="Meno"
              className="rounded-pill bg-white/15 px-4 py-2 text-sm text-white placeholder-white/70 outline-none focus:bg-white/25"
            />
            <input
              name="surname"
              placeholder="Priezvisko"
              className="rounded-pill bg-white/15 px-4 py-2 text-sm text-white placeholder-white/70 outline-none focus:bg-white/25"
            />
            <button
              type="submit"
              className="mt-1 rounded-pill bg-brand-purple py-2 text-sm font-semibold text-white"
            >
              Zaregistrovať sa
            </button>
          </form>
        </div>
      </article>

      <div className="h-6" />
    </>
  );
}

function DotIcon() {
  return (
    <span className="grid h-5 w-5 flex-none place-items-center rounded-full bg-white/20">
      <span className="h-1.5 w-1.5 rounded-full bg-white" />
    </span>
  );
}
