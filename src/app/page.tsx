"use client";

import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Noto_Sans_Telugu } from "next/font/google";

const notoSansTelugu = Noto_Sans_Telugu({
  subsets: ["telugu"],
  weight: ["400", "700", "800"],
});

export default function Home() {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const features = [
    {
      emoji: "🗣️",
      title: "Conversational Telugu",
      desc: "We focus on Vyāvahārika (spoken) Telugu, not textbook grammar. Kids learn how their family actually talks!",
      color: "bg-orange-100",
      accent: "text-orange-600",
      border: "border-orange-200"
    },
    {
      emoji: "✍️",
      title: "Interactive Tracing",
      desc: "Our custom canvas engine gently guides little hands through the beautiful curves of Telugu script.",
      color: "bg-green-100",
      accent: "text-green-600",
      border: "border-green-200"
    },
    {
      emoji: "📖",
      title: "AI Bedtime Stories",
      desc: "Powered by Gemini 2.5 Flash, Koorma generates infinite, grammatically perfect short stories tailored to your child's exact reading level.",
      color: "bg-blue-100",
      accent: "text-blue-600",
      border: "border-blue-200"
    }
  ];

  return (
    <main className="min-h-screen bg-sand text-brown font-comic overflow-x-hidden">
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
        {/* Parallax Background Blobs */}
        <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply blur-3xl opacity-60 animate-blob" />
          <div className="absolute top-40 right-20 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply blur-3xl opacity-60 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply blur-3xl opacity-60 animate-blob animation-delay-4000" />
        </motion.div>

        <div className="z-10 max-w-4xl text-center mt-12">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="text-8xl md:text-[120px] mb-8 mx-auto drop-shadow-2xl"
          >
            🐢
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className={`text-7xl md:text-9xl font-black text-orange-600 mb-2 tracking-tight drop-shadow-sm ${notoSansTelugu.className}`}>
              కూర్మ
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold text-brown mb-8 drop-shadow-sm">
              Koorma
            </h2>
            <p className="text-xl md:text-3xl text-brown/80 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              The magical world where NRI kids master conversational Telugu through guided lessons and AI-powered adventures! 🌺
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button
              onClick={() => router.push('/login?mode=signup')}
              className="w-full sm:w-auto px-12 py-6 bg-orange-500 text-white rounded-[32px] text-2xl font-bold shadow-[0_8px_0_rgb(194,65,12)] hover:translate-y-[4px] hover:shadow-[0_4px_0_rgb(194,65,12)] transition-all flex items-center justify-center gap-4 active:translate-y-[8px] active:shadow-none"
            >
              <span>Play Now</span>
              <span className="text-3xl">▶️</span>
            </button>

            <button
              onClick={() => router.push('/login?mode=login')}
              className="w-full sm:w-auto px-12 py-6 bg-white/80 backdrop-blur-sm text-orange-600 rounded-[32px] text-2xl font-bold border-4 border-orange-200 hover:border-orange-500 hover:bg-white transition-all shadow-lg"
            >
              Parents / Login
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-20 flex flex-col items-center text-brown/50 animate-bounce hidden sm:flex pointer-events-none"
        >
          <span className="text-sm font-bold uppercase tracking-widest mb-2">See how it works</span>
          <span className="text-2xl">👇</span>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS / FEATURES ── */}
      <section className="py-24 px-6 bg-white/50 backdrop-blur-md border-t-4 border-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h3 className="text-4xl md:text-5xl font-bold text-orange-600 mb-6">Designed for Joyful Learning ✨</h3>
            <p className="text-xl text-brown/70 max-w-2xl mx-auto">
              We threw away the boring textbooks. Koorma uses spaced repetition, speech synthesis, and gamification to make Telugu stick.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -8 }}
                className={`${f.color} ${f.border} border-4 rounded-3xl p-8 shadow-xl transition-all duration-300`}
              >
                <div className="text-6xl mb-6 bg-white w-24 h-24 rounded-2xl flex items-center justify-center shadow-sm">
                  {f.emoji}
                </div>
                <h4 className={`text-2xl font-bold mb-4 ${f.accent}`}>{f.title}</h4>
                <p className="text-lg text-brown/80 leading-relaxed font-medium">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE JOURNEY (Map preview) ── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-green-50 to-emerald-100 rounded-[40px] p-12 border-8 border-white shadow-2xl relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h3 className="text-4xl md:text-5xl font-bold text-green-700 mb-6">An Epic Journey</h3>
              <p className="text-xl text-green-900/80 mb-8 leading-relaxed">
                Kids explore a beautiful, hand-painted village map. They start by rescuing Vowels (అచ్చులు) from the garden, battle playfully through Consonants (హల్లులు) in the fort, and eventually unlock the magical Story Temple!
              </p>
              <ul className="space-y-4 text-lg font-bold text-green-800">
                <li className="flex items-center gap-3"><span className="text-2xl">🌱</span> అచ్చులు (Vowels)</li>
                <li className="flex items-center gap-3"><span className="text-2xl">🏰</span> హల్లులు (Consonants)</li>
                <li className="flex items-center gap-3"><span className="text-2xl">🔮</span> గుణింతాలు (Blends)</li>
                <li className="flex items-center gap-3"><span className="text-2xl">📖</span> కథల గుడి (Stories)</li>
              </ul>
            </div>
            <div className="flex-1 w-full flex justify-center">
              <div className="relative w-full max-w-sm aspect-square bg-white rounded-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 flex items-center justify-center border-8 border-green-100">
                <div className="absolute w-full h-full rounded-full border-4 border-dashed border-green-200 animate-[spin_60s_linear_infinite]" />
                <div className="text-center relative z-10 bg-white/80 p-6 rounded-3xl backdrop-blur-sm">
                  <div className="text-8xl mb-4">🗺️</div>
                  <div className="text-xl font-bold text-green-600">6 Unique Worlds</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-6 bg-orange-50 border-t-4 border-white">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-4xl md:text-5xl font-bold text-orange-600 mb-16">What Parents Are Saying 💬</h3>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { text: "My 5-year-old finally spoke to her Ammamma in Telugu instead of English! Worth every penny.", author: "Sneha P., Texas" },
              { text: "The tracing exercises are beautiful. It feels like an authentic cultural experience, not just a flashy game.", author: "Karthik R., London" },
              { text: "The AI stories are a game-changer. It generates stories using exactly the letters my son just learned!", author: "Divya M., California" }
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-8 rounded-3xl shadow-lg border-2 border-orange-100 relative"
              >
                <div className="text-4xl absolute -top-5 left-8 bg-white px-2 text-orange-300">"</div>
                <p className="text-lg text-brown/80 mb-6 font-medium italic">"{t.text}"</p>
                <p className="text-orange-600 font-bold">— {t.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING TIERS ── */}
      <section className="py-24 px-6 bg-white/80 backdrop-blur-md border-t-4 border-white overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative">
          <h3 className="text-4xl md:text-5xl font-bold text-green-600 mb-6">Choose Your Journey 🎟️</h3>
          <p className="text-xl text-brown/70 max-w-2xl mx-auto mb-16">
            Start for free, then unlock the full magic when your child is ready for more advanced adventures.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left relative z-10">
            {/* Free Tier */}
            <motion.div
              whileHover={{ y: -8 }}
              className="bg-white rounded-[40px] p-10 border-4 border-gray-200 shadow-xl"
            >
              <h4 className="text-3xl font-black text-gray-700 mb-2">Basic</h4>
              <div className="text-5xl font-black text-gray-900 mb-6">Free</div>
              <ul className="space-y-4 mb-10 text-lg font-medium text-brown/80">
                <li className="flex items-center gap-3">✅ <span className="flex-1">Full Vowels (అచ్చులు) Module</span></li>
                <li className="flex items-center gap-3">✅ <span className="flex-1">Basic Letter Tracing</span></li>
                <li className="flex items-center gap-3">✅ <span className="flex-1">1 Child Profile</span></li>
                <li className="flex items-center gap-3 opacity-50">❌ <span className="flex-1 line-through">Magic Story Generator</span></li>
              </ul>
              <button onClick={() => router.push('/login?mode=signup')} className="w-full py-4 rounded-2xl bg-gray-100 text-gray-700 font-bold text-xl hover:bg-gray-200 transition-colors">Start Free</button>
            </motion.div>

            {/* Premium Tier */}
            <motion.div
              whileHover={{ y: -8 }}
              className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-[40px] p-10 border-4 border-orange-400 shadow-2xl relative"
            >
              <div className="absolute top-0 right-10 -translate-y-1/2 bg-orange-500 text-white px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm shadow-lg">Most Popular</div>
              <h4 className="text-3xl font-black text-orange-600 mb-2">Premium</h4>
              <div className="text-5xl font-black text-orange-600 mb-1"><span className="text-3xl">$</span>8<span className="text-xl text-orange-400 font-bold">/mo</span></div>
              <p className="text-sm text-orange-500/80 font-bold mb-6">Billed annually ($96/yr)</p>
              <ul className="space-y-4 mb-10 text-lg font-medium text-brown/80">
                <li className="flex items-center gap-3">🌟 <span className="flex-1 font-bold text-orange-700">Everything in Basic</span></li>
                <li className="flex items-center gap-3">🌟 <span className="flex-1">All Consonants & Guninthalu</span></li>
                <li className="flex items-center gap-3">🌟 <span className="flex-1">AI Magic Story Generator</span></li>
                <li className="flex items-center gap-3">🌟 <span className="flex-1">Weekly Parent Reports</span></li>
                <li className="flex items-center gap-3">🌟 <span className="flex-1">Up to 3 Child Profiles</span></li>
              </ul>
              <button onClick={() => router.push('/login?mode=signup')} className="w-full py-4 rounded-2xl bg-orange-500 text-white font-bold text-xl shadow-[0_6px_0_rgb(194,65,12)] hover:translate-y-[2px] hover:shadow-[0_4px_0_rgb(194,65,12)] transition-all">Unlock Premium 🚀</button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="py-24 px-6 text-center">
        <h3 className="text-4xl font-bold text-orange-600 mb-10">Ready to start the adventure?</h3>
        <button
          onClick={() => router.push('/login?mode=signup')}
          className="px-16 py-6 bg-orange-500 text-white rounded-[32px] text-3xl font-bold shadow-[0_8px_0_rgb(194,65,12)] hover:translate-y-[4px] hover:shadow-[0_4px_0_rgb(194,65,12)] transition-all flex items-center justify-center gap-4 mx-auto active:translate-y-[8px] active:shadow-none"
        >
          <span>Let's Go!</span>
          <span className="text-4xl">🚀</span>
        </button>

        <div className="mt-20 text-sm text-brown/40 font-bold tracking-wider">
          KOORMA © {new Date().getFullYear()} • BUILT WITH NEXT.JS & SUPABASE
        </div>
      </section>
    </main>
  );
}
