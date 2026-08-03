"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronRight, X } from "lucide-react";
import { ExpandableText } from "@/components/landing/ExpandableText";

const VIDEOS = [
  { type: "video" as const, src: "/videos/adriana.mp4",  title: "Príbeh pacientky",                                        lektor: "Adriana",                  accent: "#FDA4C7" },
  { type: "video" as const, src: "/videos/petra.mp4",    title: "Rozhovor s onkologičkou",                                 lektor: "MUDr. Miroslava Malejčíková", accent: "#6F2380" },
  { type: "video" as const, src: "/videos/mirka.mp4",    title: "Odborné rady od profesionálov",                           lektor: "Petra Hlaváčová",           accent: "#FDA4C7" },
  { type: "audio" as const, src: "/audio/body-scan.mp3", photo: "/images/lektori/micuchova.jpg", title: "Mindfulness: ako zvládnuť úzkosť pri diagnóze", lektor: "Zuzana Mičúchová", accent: "#6F2380" },
];

export function VideokniznicaSection() {
  const [active, setActive] = useState<number | null>(null);
  const activeItem = active !== null ? VIDEOS[active] : null;

  return (
    <>
      <section className="pt-10 pb-14">
        {/* Nadpis */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="px-5 md:max-w-6xl md:mx-auto md:px-8 mb-8"
        >
          <h2 className="text-[2.2rem] font-black text-[#6F2380] leading-[1.1] mb-4">
            ONKO knižnica
          </h2>
          <div className="md:max-w-xl">
            <ExpandableText maxHeight={72} fadeColor="#FFF3F9">
              <p className="text-[#6F2380]/65 text-base leading-relaxed">
                Desiatky videí od overených odborníkov na tému pohyb, výživa, psychika
                a iné. Sledujte kedykoľvek, kdekoľvek a vo vlastnom tempe.
              </p>
            </ExpandableText>
          </div>
        </motion.div>

        {/* Karty — mobile: horizontálny scroll, desktop: grid */}
        <div className="md:max-w-6xl md:mx-auto md:px-8">
          <div className="flex gap-4 overflow-x-auto pl-5 pr-5 pb-2 scrollbar-none md:overflow-visible md:grid md:grid-cols-4 md:pl-0 md:pr-0 md:pb-0">
            {VIDEOS.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="shrink-0 w-[72vw] max-w-[280px] md:w-auto md:max-w-none cursor-pointer"
                onClick={() => setActive(i)}
              >
                {/* Video/audio thumbnail */}
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-3 group">
                  {v.type === "video" ? (
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onLoadedMetadata={(e) => {
                        const el = e.currentTarget;
                        // Some MP4s report duration as NaN/Infinity at this point —
                        // retry on durationchange (fired once it's actually known)
                        // so every card doesn't fall back to starting at frame 0.
                        if (Number.isFinite(el.duration) && el.duration > 0) {
                          el.currentTime = el.duration * ((i + 1) / (VIDEOS.length + 1));
                        }
                      }}
                      onDurationChange={(e) => {
                        const el = e.currentTarget;
                        if (el.currentTime === 0 && Number.isFinite(el.duration) && el.duration > 0) {
                          el.currentTime = el.duration * ((i + 1) / (VIDEOS.length + 1));
                        }
                      }}
                    >
                      <source src={v.src} type="video/mp4" />
                    </video>
                  ) : (
                    <Image
                      src={v.photo}
                      alt={v.lektor}
                      fill
                      className="object-cover object-[center_25%] transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: v.accent }}
                    >
                      <Play size={18} className="text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black/50 rounded-full px-2 py-1 flex items-center gap-1">
                      <svg viewBox="0 0 16 16" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 2h4v4M6 14H2v-4M14 2l-5 5M2 14l5-5" />
                      </svg>
                      <span className="text-white text-[10px] font-semibold">Zväčšiť</span>
                    </div>
                  </div>
                </div>
                <p className="text-[#6F2380] font-black text-[14px] leading-snug mb-1 line-clamp-2">{v.title}</p>
                <p className="text-[#6F2380]/45 text-[12px]">{v.lektor}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="px-5 mt-8 md:max-w-6xl md:mx-auto md:px-8">
          <div className="mb-5 md:max-w-xl">
            <ExpandableText maxHeight={64} fadeColor="#FFF3F9">
              <p className="text-[#6F2380]/50 text-sm">
                Ako člen/ka ONKO KLUBU získavate prístup k bohatej videotéke
                vytvorenej špeciálne pre potreby onkologických pacientov a ich
                blízkych.
              </p>
            </ExpandableText>
          </div>
          <div className="md:flex md:justify-start">
            <Link
              href="/pripravujeme"
              className="flex items-center justify-between bg-white rounded-2xl px-5 py-4 border border-[#FDA4C7]/20 active:scale-[0.98] transition-transform md:inline-flex md:gap-3 md:justify-center md:rounded-full md:border-2 md:border-[#FDA4C7] md:px-7 md:py-3"
            >
              <span className="text-[#6F2380] font-bold text-sm">Otvoriť ONKO knižnicu</span>
              <ChevronRight size={18} className="text-[#FDA4C7]" />
            </Link>
          </div>
        </div>
      </section>

      {/* Video/audio lightbox modal */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-3xl rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {activeItem.type === "video" ? (
                <video
                  key={activeItem.src}
                  src={activeItem.src}
                  controls
                  autoPlay
                  playsInline
                  className="w-full aspect-video bg-black"
                />
              ) : (
                <div className="relative w-full aspect-video bg-black">
                  <Image
                    src={activeItem.photo}
                    alt={activeItem.lektor}
                    fill
                    className="object-cover object-[center_25%]"
                  />
                  <audio
                    key={activeItem.src}
                    src={activeItem.src}
                    controls
                    autoPlay
                    className="absolute bottom-0 left-0 w-full"
                  />
                </div>
              )}
              <button
                onClick={() => setActive(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
