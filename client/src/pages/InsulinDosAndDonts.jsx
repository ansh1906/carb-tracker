import { useState } from 'react';
import Navbar from '../components/navbar';
import Sidebar from '../components/Sidebar';
import DotGrid from '../components/test';

const guideSections = [
  { id: 'before', label: 'Before you inject', number: '01' },
  { id: 'inject', label: 'Apply with care', number: '02' },
  { id: 'store', label: 'Store it right', number: '03' },
  { id: 'types', label: 'Know the types', number: '04' },
];

const injectionSteps = [
  ['Wash and check', 'Wash your hands. Check the insulin name, expiry date, and appearance. Do not use it if it is frozen, overheated, or looks different from usual.'],
  ['Use a new needle', 'Attach a new needle for every injection. Reusing needles can make injections less comfortable and can affect the dose.'],
  ['Prime the pen', 'With the needle pointing up, gently tap the pen and eject 1-2 units to clear air from the needle. Repeat according to your pen instructions until you see insulin at the tip.'],
  ['Choose and rotate', 'Use the site your care team recommended. Rotate within the area and avoid bruised, scarred, lumpy, tender, or irritated skin.'],
  ['Pinch if needed', 'Gently pinch a small fold of skin if your clinician has shown you to do so. Insert at the angle recommended for your needle, usually 90 degrees.'],
  ['Finish the dose', 'Press slowly, keep the needle in place for the time in your pen instructions, then remove it. Do not rub or massage the site. Dispose of the needle in a sharps container.'],
];

const insulinTypes = [
  ['Rapid-acting', 'About 10-15 min', 'Works around meals and usually lasts a few hours.'],
  ['Short-acting', 'About 30 min', 'Often called regular insulin; commonly taken before a meal.'],
  ['Intermediate-acting', '1-2 hours', 'Covers insulin needs for part of the day and night.'],
  ['Long-acting', 'Several hours', 'Provides a steady background level, often lasting about a day.'],
  ['Premixed', 'Varies', 'Combines two insulin actions in one product for a simpler schedule.'],
];

function SectionIcon({ type }) {
  const paths = {
    check: <path d="m5 12 4 4L19 6" />,
    drop: <path d="M12 3.5s5 5.5 5 9.5a5 5 0 1 1-10 0c0-4 5-9.5 5-9.5Z" />,
    snow: <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M7 4.8l5 3 5-3M7 19.2l5-3 5 3" />,
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8">
      {paths[type]}
    </svg>
  );
}

function InsulinDosAndDonts() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('before');
  const [checkedSteps, setCheckedSteps] = useState([]);

  const jumpTo = (sectionId) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleStep = (index) => {
    setCheckedSteps((current) => (
      current.includes(index) ? current.filter((step) => step !== index) : [...current, index]
    ));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAFAF9] dark:bg-[#121212] pt-18">
      <Navbar onSidebarToggle={() => setMobileSidebarOpen(true)} />
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      <div className="fixed inset-0 z-0 overflow-hidden opacity-10 pointer-events-none dark:opacity-30">
        <DotGrid
          dotSize={4}
          gap={15}
          baseColor="#2F293A"
          activeColor="#5227FF"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      <main className={`relative z-10 min-h-screen px-4 py-8 transition-all duration-300 md:py-12 ${sidebarCollapsed ? 'md:pl-28' : 'md:pl-96'}`}>
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">Everyday insulin guide</p>
              <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-[#1C1C1E] dark:text-[#F5F5F7] md:text-7xl">Small habits make insulin safer.</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#6E6E73] dark:text-[#B8B8C0] md:text-xl">A calm, practical refresher for preparing, applying, storing, and understanding insulin. Your prescribed dose and product instructions always come first.</p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-5 text-base leading-7 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100 lg:max-w-xs">
              <strong className="block">Quick safety note</strong>
              Never change your insulin dose or schedule based on this guide. Ask your diabetes care team when something is unclear.
            </div>
          </header>

          <nav aria-label="Insulin guide sections" className="mb-8 grid grid-cols-2 gap-2 rounded-2xl border border-gray-200/80 bg-white/85 p-2 shadow-sm dark:border-gray-800 dark:bg-[#1C1C1E]/90 md:grid-cols-4">
            {guideSections.map((section) => (
              <button key={section.id} type="button" onClick={() => jumpTo(section.id)} className={`rounded-xl px-3 py-3 text-left transition-colors ${activeSection === section.id ? 'bg-emerald-100 text-emerald-950 dark:bg-[#214338] dark:text-emerald-100' : 'text-[#6E6E73] hover:bg-gray-100 dark:text-[#B8B8C0] dark:hover:bg-[#2C2C2E]'}`}>
                <span className="block text-xs font-semibold tracking-widest opacity-60">{section.number}</span>
                <span className="mt-1 block text-base font-semibold">{section.label}</span>
              </button>
            ))}
          </nav>

          <section id="before" className="scroll-mt-24 rounded-3xl border border-emerald-200/70 bg-linear-to-br from-emerald-100 via-lime-50 to-white p-6 shadow-xl shadow-emerald-900/10 dark:border-emerald-900/60 dark:from-[#173129] dark:via-[#13241e] dark:to-[#1C1C1E] md:p-9">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div><div className="mb-4 inline-flex rounded-full bg-white/70 px-3 py-1 text-sm font-bold uppercase tracking-[0.16em] text-emerald-800 dark:bg-black/20 dark:text-emerald-200">Start here</div><h2 className="max-w-xl text-4xl font-semibold leading-tight text-[#1c2c23] dark:text-[#ddf5e6] md:text-5xl">Know the three moments that matter.</h2><p className="mt-4 max-w-xl text-lg leading-8 text-[#355144] dark:text-[#BFE1CE]">Before you inject, make sure the insulin is the right one. During the injection, use a clean technique. Afterward, store the product and dispose of the needle safely.</p></div>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">{[['Before', 'Check the label, expiry, appearance, and dose.'], ['During', 'Use a new needle and a recommended site.'], ['After', 'Hold the needle in, then use a sharps container.']].map(([title, text], index) => <div key={title} className="flex gap-3 rounded-2xl border border-white/80 bg-white/65 p-5 dark:border-white/10 dark:bg-black/15"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0f766e] text-base font-bold text-white">{index + 1}</span><div><h3 className="text-lg font-semibold text-[#1c2c23] dark:text-[#ddf5e6]">{title}</h3><p className="mt-1 text-base leading-6 text-[#527062] dark:text-[#BFE1CE]">{text}</p></div></div>)}</div>
            </div>
          </section>

          <section id="inject" className="scroll-mt-24 py-12">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div><p className="text-base font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">A simple routine</p><h2 className="mt-2 text-4xl font-semibold text-[#1C1C1E] dark:text-[#F5F5F7]">Injection checklist</h2></div><p className="text-base text-[#6E6E73] dark:text-[#B8B8C0]">{checkedSteps.length} of {injectionSteps.length} reviewed</p></div>
            <div className="grid gap-3 lg:grid-cols-2">{injectionSteps.map(([title, text], index) => { const checked = checkedSteps.includes(index); return <button key={title} type="button" onClick={() => toggleStep(index)} className={`flex items-start gap-4 rounded-2xl border p-6 text-left transition-all ${checked ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/25' : 'border-gray-200 bg-white/90 hover:border-blue-200 dark:border-gray-800 dark:bg-[#1C1C1E]/90 dark:hover:border-blue-900'}`}><span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${checked ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-300 text-transparent dark:border-gray-600'}`}><SectionIcon type="check" /></span><span><strong className={`block text-xl ${checked ? 'text-emerald-900 dark:text-emerald-100' : 'text-[#1C1C1E] dark:text-[#F5F5F7]'}`}>{index + 1}. {title}</strong><span className="mt-2 block text-base leading-7 text-[#6E6E73] dark:text-[#B8B8C0]">{text}</span></span></button>; })}</div>
          </section>

          <section id="store" className="scroll-mt-24 grid gap-5 pb-12 md:grid-cols-3">
            <div className="md:col-span-2 rounded-3xl bg-[#1C1C1E] p-6 text-white shadow-xl md:p-8"><div className="flex items-start gap-4"><span className="rounded-2xl bg-blue-500/20 p-3 text-blue-300"><SectionIcon type="snow" /></span><div><p className="text-base font-semibold uppercase tracking-[0.16em] text-blue-300">Storage snapshot</p><h2 className="mt-2 text-3xl font-semibold md:text-4xl">Cool, consistent, and never frozen.</h2></div></div><div className="mt-7 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl bg-white/10 p-5"><p className="text-3xl font-bold text-blue-200">2-8°C</p><p className="mt-1 text-base leading-6 text-gray-300">Typical refrigerator range for unopened insulin. Follow the product label.</p></div><div className="rounded-2xl bg-white/10 p-5"><p className="text-3xl font-bold text-amber-200">15-30°C</p><p className="mt-1 text-base leading-6 text-gray-300">Common room-temperature range for in-use insulin, depending on the product.</p></div></div><p className="mt-5 text-base leading-7 text-gray-300">Keep insulin away from direct sunlight, heaters, hot cars, and freezer compartments. Never use insulin that has frozen, even after it thaws. Check the leaflet or ask your pharmacist for the exact in-use discard date.</p></div>
            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 dark:border-rose-900/60 dark:bg-rose-950/25"><div className="text-rose-700 dark:text-rose-300"><SectionIcon type="drop" /></div><h3 className="mt-4 text-2xl font-semibold text-rose-950 dark:text-rose-100">Do not share</h3><p className="mt-2 text-base leading-7 text-rose-900/75 dark:text-rose-100/75">Never share pens, cartridges, syringes, or needles, even with a new needle. A pen is for one person only.</p></div>
          </section>

          <section id="types" className="scroll-mt-24 border-t border-gray-200 py-12 dark:border-gray-800"><div className="mb-6 max-w-2xl"><p className="text-base font-semibold uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300">The short version</p><h2 className="mt-2 text-4xl font-semibold text-[#1C1C1E] dark:text-[#F5F5F7]">Different insulin types</h2><p className="mt-3 text-lg leading-8 text-[#6E6E73] dark:text-[#B8B8C0]">Insulin types mainly differ in how quickly they start and how long they work. Timing varies by person and product, so use your prescription as the source of truth.</p></div><div className="overflow-hidden rounded-2xl border border-gray-200 bg-white/90 dark:border-gray-800 dark:bg-[#1C1C1E]/90">{insulinTypes.map(([name, onset, description], index) => <div key={name} className={`grid gap-2 px-5 py-5 md:grid-cols-[1fr_1fr_2fr] md:items-center ${index !== insulinTypes.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}><strong className="text-lg text-[#1C1C1E] dark:text-[#F5F5F7]">{name}</strong><span className="text-base font-medium text-violet-700 dark:text-violet-300">Starts {onset}</span><span className="text-base leading-7 text-[#6E6E73] dark:text-[#B8B8C0]">{description}</span></div>)}</div><p className="mt-6 text-center text-base text-[#6E6E73] dark:text-[#B8B8C0]">This learning guide supports, but does not replace, advice from your diabetes care team.</p></section>
        </div>
      </main>
    </div>
  );
}

export default InsulinDosAndDonts;
