import { useEffect, useRef, useState, type ReactNode } from 'react'

/* IntersectionObserver reveal. No scroll listeners anywhere on this page. */
function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('is-visible')
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* ---------------------------------------------------------------------
   The roasting console. The brass dial sets the roast level and the milled
   switch decides whether that level is being held on the sample roaster
   or parked. Both are real controls: pointer drag and keyboard on the
   dial, click and keyboard on the switch.
   --------------------------------------------------------------------- */
const ROASTS = [
  {
    level: 1,
    name: 'Filter roast',
    detail: 'Set one past the second crack. Pale, high acidity, made for a V60 or a cafetiere.',
    charge: '198 C',
    time: '8 min 40 s',
    dev: '1 min 12 s',
    drop: '14.8 %',
    batch: '12 kg',
    roaster: 'Callum Bisset',
    green: 'Yirgacheffe, Kochere',
    process: 'Washed',
    altitude: '1 900 m',
    variety: 'Heirloom',
  },
  {
    level: 2,
    name: 'Omni roast',
    detail: 'Straight through first crack and into the turn. Brown sugar and stone fruit, the house cup.',
    charge: '201 C',
    time: '9 min 25 s',
    dev: '1 min 58 s',
    drop: '16.2 %',
    batch: '12 kg',
    roaster: 'Callum Bisset',
    green: 'Huila, El Mirador',
    process: 'Natural',
    altitude: '1 750 m',
    variety: 'Caturra',
  },
  {
    level: 3,
    name: 'Espresso roast',
    detail: 'Taken further into second crack. Dense and syrupy, built to sit under milk without vanishing.',
    charge: '204 C',
    time: '10 min 50 s',
    dev: '2 min 45 s',
    drop: '18.4 %',
    batch: '12 kg',
    roaster: 'Morag Bain',
    green: 'Sidama, Bombe',
    process: 'Honey',
    altitude: '2 050 m',
    variety: '74158',
  },
  {
    level: 4,
    name: 'Filter dark',
    detail: 'A long second-crack phase for anyone who takes milk in their coffee. Bitter-chocolate, low acid.',
    charge: '208 C',
    time: '11 min 35 s',
    dev: '3 min 20 s',
    drop: '19.9 %',
    batch: '12 kg',
    roaster: 'Morag Bain',
    green: 'Kiambu, Gichathaini',
    process: 'Washed',
    altitude: '1 820 m',
    variety: 'SL28, SL34',
  },
]

/* Degrees on the dial face. 270 degrees of travel, gap at the bottom,
   so the pointer reads as part rotation rather than a loading ring. */
const SWEEP = 270
const STEP = 90

function angleFor(level: number) {
  return -135 + (level - 1) * STEP
}

const LOTS = [
  {
    name: 'Kochere',
    line: 'Yirgacheffe, washed',
    place: 'Gedeb, Ethiopia',
    body: 'Bergamot and lemon peel over a very clean finish. The lot the filter drinkers come back for every Friday.',
    notes: 'Bergamot, lemon peel, black tea',
    img: 'https://picsum.photos/seed/fieldfable-coffee-cherries-drying/1200/900',
    alt: 'Ripe coffee cherries spread out to dry on raised beds',
    crop: '2026',
    weight: '300 g',
  },
  {
    name: 'El Mirador',
    line: 'Huila, natural',
    place: 'Acevedo, Colombia',
    body: 'Dried on the roof at the farm. Blueberry and cocoa, heavy body, and the best filter of the four on a V60.',
    notes: 'Blueberry, cocoa nib, orange peel',
    img: 'https://picsum.photos/seed/fieldfable-green-coffee-sacks/800/600',
    alt: 'Burlap sacks of green coffee stacked in a store',
    crop: '2026',
    weight: '500 g',
  },
  {
    name: 'Bombe',
    line: 'Sidama, honey',
    place: 'Bensa, Ethiopia',
    body: 'Only the top of the hill, and only the ripe cherry. Apricot, jasmine and a long syrupy sweetness.',
    notes: 'Apricot, jasmine, brown sugar',
    img: 'https://picsum.photos/seed/fieldfable-roaster-drum-chaff/800/600',
    alt: 'Chaff clearing from the cooling tray after a roast',
    crop: '2025',
    weight: '250 g',
  },
  {
    name: 'Gichathaini',
    line: 'Kiambu, washed',
    place: 'Nyeri, Kenya',
    body: 'SL28 and SL34 off the same factory as last year. Blackcurrant, tomato leaf, a very Kenyan finish.',
    notes: 'Blackcurrant, tomato leaf, molasses',
    img: 'https://picsum.photos/seed/fieldfable-roast-scale-and-tray/800/600',
    alt: 'Roasted coffee cooling on a flatbed cooling tray',
    crop: '2026',
    weight: '1 kg',
  },
]

/* Numbered rows rather than three equal feature cards. */
const PROCESS = [
  {
    n: '1',
    title: 'Green buying',
    body: 'Two people fly the buying trip and cup every lot blind before money moves. Contracts are per lot, per year, not blended away.',
  },
  {
    n: '2',
    title: 'Roasting',
    body: 'A 12 kg drum roaster built in 1978 and rebuilt twice. Every batch is logged by hand, charge temperature to drop weight.',
  },
  {
    n: '3',
    title: 'Resting',
    body: 'Nothing leaves the bench for eleven days off the roast. Filter lots rest twelve. Espresso needs the week.',
  },
  {
    n: '4',
    title: 'Dispatch',
    body: 'One-way valve bags, sealed the same morning, with the roast date written on the kraft and not printed on a sticker.',
  },
]

function QuoteMark() {
  return (
    <svg width="34" height="26" viewBox="0 0 34 26" fill="none" aria-hidden="true">
      <path
        d="M0 26V14.6C0 6.2 4.4 1 12.4 0l1.4 4.2c-4.4 1.2-6.6 3.8-6.8 7.6h6.4V26H0zm20.2 0V14.6C20.2 6.2 24.6 1 32.6 0L34 4.2c-4.4 1.2-6.6 3.8-6.8 7.6h6.4V26H20.2z"
        fill="currentColor"
      />
    </svg>
  )
}

function ArrowGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path
        d="M2 11L11 2M11 2H4.2M11 2v6.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function App() {
  const [level, setLevel] = useState(2)
  const [holding, setHolding] = useState(true)
  const [name, setName] = useState('')
  const [lot, setLot] = useState('')
  const [weight, setWeight] = useState('250 g')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const roast = ROASTS[level - 1]

  /* Pointer drag on the dial. Pointer capture, released on up and on
     cancel, so the dial can never get stuck mid-turn.

     Geometry: the pointer notch sits at 12 o'clock and is rotated by
     angleFor(level), so it points at atan2 = 270 + angle. Level 1 is the
     225deg CSS stop, i.e. atan2 135 (down left), and each step of 90
     degrees runs clockwise through up to down right. */
  function dragDial(e: React.PointerEvent<HTMLDivElement>) {
    if (e.buttons !== 1 && e.pointerType === 'mouse') return
    const box = e.currentTarget.getBoundingClientRect()
    const cx = box.left + box.width / 2
    const cy = box.top + box.height / 2
    const deg = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI
    const norm = (deg + 360) % 360
    /* Snap to the nearest detent, but only inside the 270 degree of travel.
       Anything in the gap below the dial falls to whichever end is closer. */
    let rel = norm - 135
    if (rel < 0) rel += 360
    /* rel is now 0 to 360, where 0 to SWEEP is the travel and the rest is
       the dead gap below the dial. Fall back to whichever end is nearer. */
    if (rel > SWEEP) rel = rel - SWEEP < 360 - rel ? SWEEP : 0
    setLevel(Math.min(4, Math.max(1, Math.round(rel / STEP) + 1)))
  }

  function dialKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      setLevel((l) => Math.min(4, l + 1))
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      setLevel((l) => Math.max(1, l - 1))
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!lot) {
      setError('Choose a lot so we know what to roast for you.')
      return
    }
    if (name.trim().length < 2) {
      setError('Add the name the subscription should sit under.')
      return
    }
    if (weight === '1 kg' && !holding) {
      setError('Kilo bags are subscription only. Throw the bench switch back on.')
      return
    }
    setError('')
    setSent(true)
  }

  return (
    <>
      <header className="wood-panel sticky top-0 z-30 border-x-0 border-t-0">
        <div className="shell flex h-18 max-h-20 items-center justify-between py-3">
          <a href="#top" className="flex items-baseline gap-2.5">
            <span className="stamp-light font-display text-[1.35rem] font-semibold tracking-[-0.02em]">
              Field and Fable
            </span>
          </a>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
            <a href="#console" className="link-underline text-sm text-bone hover:text-chalk">
              Console
            </a>
            <a href="#lots" className="link-underline text-sm text-bone hover:text-chalk">
              Lots
            </a>
            <a href="#process" className="link-underline text-sm text-bone hover:text-chalk">
              Bench
            </a>
            <a href="#book" className="link-underline text-sm text-bone hover:text-chalk">
              Subscribe
            </a>
          </nav>
          <a href="#book" className="btn btn-primary !py-2 !text-sm">
            Start a subscription
          </a>
        </div>
      </header>

      <main id="top">
        {/* Hero: copy left, the kraft bag of the current roast right. */}
        <section className="shell flex min-h-[100dvh] items-center pt-24 pb-16">
          <div className="grid w-full items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal>
              <h1 className="max-w-[15ch] text-[clamp(2.3rem,4.5vw,3.85rem)] text-chalk">
                Roasted on a bench, twelve lots a week.
              </h1>
              <p className="mt-7 max-w-[46ch] text-[1.0625rem] leading-[1.65] text-bone">
                Single origins from Yirgacheffe, Huila, Sidama and Kiambu. Roasted in batches of twelve
                kilos and dated by hand.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3.5">
                <a href="#console" className="btn btn-primary">
                  Set the roast
                  <span className="btn-icon">
                    <ArrowGlyph />
                  </span>
                </a>
                <a href="#lots" className="btn btn-ghost">
                  See the lots
                </a>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div className="tray p-4 sm:p-5">
                <div className="kraft flex h-full flex-col justify-between gap-8 p-7 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="stamp text-[0.6875rem] uppercase tracking-[0.19em] text-ink-soft">
                        Field and Fable
                      </p>
                      <h2 className="stamp mt-2 text-2xl leading-tight">
                        {ROASTS[level - 1].green.split(',')[0]}
                      </h2>
                      <p className="mt-1 font-mono text-[0.8125rem] font-semibold tracking-[0.04em] text-ink-soft">
                        {ROASTS[level - 1].process} process
                      </p>
                    </div>
                    <span className="rivet mt-1" aria-hidden="true" />
                  </div>
                  <p className="max-w-[30ch] text-[0.9375rem] leading-[1.65] text-ink-soft">
                    {ROASTS[level - 1].detail}
                  </p>
                  <dl className="grid grid-cols-3 gap-4 border-t border-ink/20 pt-5">
                    {[
                      ['Roasted', ROASTS[level - 1].charge],
                      ['Batch', ROASTS[level - 1].batch],
                      ['Net', '300 g'],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.18em] text-ink-soft">
                          {k}
                        </dt>
                        <dd className="stamp mt-1.5 text-sm">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-ink-soft">
                    Roasted 24-09-2026 by Callum Bisset
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Console: steel faceplate left with the live dial and switch, log
           readout right. One layout family, used once. */}
        <section id="console" className="shell py-24 md:py-32">
          <Reveal>
            <p className="micro mb-6">Roasting console</p>
            <h2 className="max-w-[18ch] text-[clamp(2rem,3.9vw,3.1rem)] text-chalk">
              Set the level, then hold it.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <Reveal>
              <div className="plate flex h-full flex-col items-center gap-8 p-8 md:p-10">
                <div className="flex flex-wrap items-center justify-center gap-7">
                  <div
                    className="dial"
                    role="slider"
                    tabIndex={0}
                    aria-label="Roast level"
                    aria-valuemin={1}
                    aria-valuemax={4}
                    aria-valuenow={level}
                    aria-valuetext={`${level} of 4, ${ROASTS[level - 1].name}`}
                    onPointerDown={(e) => {
                      e.currentTarget.setPointerCapture(e.pointerId)
                      dragDial(e)
                    }}
                    onPointerMove={(e) => {
                      if (e.currentTarget.hasPointerCapture(e.pointerId)) dragDial(e)
                    }}
                    onPointerUp={(e) => e.currentTarget.releasePointerCapture(e.pointerId)}
                    onPointerCancel={(e) => e.currentTarget.releasePointerCapture(e.pointerId)}
                    onKeyDown={dialKey}
                    style={{ ['--dial-angle' as string]: `${angleFor(level)}deg` }}
                  >
                    <span className="dial-scale" aria-hidden="true" />
                    <span className="dial-bezel" aria-hidden="true" />
                    <span className="dial-hand" aria-hidden="true" />
                    <span className="dial-boss" aria-hidden="true" />
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <button
                      type="button"
                      className="toggle"
                      data-on={holding}
                      role="switch"
                      aria-checked={holding}
                      aria-label="Hold the roast level on the sample roaster"
                      onClick={() => setHolding((h) => !h)}
                    >
                      <span className="toggle-cap" aria-hidden="true" />
                      <span className="toggle-led" aria-hidden="true" />
                    </button>
                    <span className="engrave text-center">Bench hold</span>
                  </div>
                </div>

                <div className="plate-inset flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5 py-3">
                  <span className="engrave">Drag or arrow the dial</span>
                  <span aria-hidden="true" className="engrave text-slate-400/70">
                    Level {level} of 4
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="tray flex h-full flex-col justify-between gap-8 p-7 md:p-9">
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <h3 className="stamp-light text-2xl">{roast.name}</h3>
                  <span className="font-mono text-[0.8125rem] font-semibold text-ember">
                    {holding ? 'Held on the sample roaster' : 'Parked, no roast running'}
                  </span>
                </div>
                <p className="max-w-[52ch] leading-[1.7] text-bone">{roast.detail}</p>
                <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
                  {[
                    ['Charge', roast.charge],
                    ['Total time', roast.time],
                    ['Development', roast.dev],
                    ['Drop weight', roast.drop],
                    ['Green', roast.green],
                    ['Roaster', roast.roaster],
                  ].map(([k, v]) => (
                    <div key={k} className="border-t border-bone/15 pt-4">
                      <dt className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.18em] text-ash">
                        {k}
                      </dt>
                      <dd className="mt-2 text-sm text-chalk">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Lots: 2+1 asymmetric card grid, four cards, four images. */}
        <section id="lots" className="shell py-24 md:py-32">
          <Reveal>
            <h2 className="max-w-[16ch] text-[clamp(2rem,3.9vw,3.1rem)] text-chalk">
              Four lots on the shelf this month.
            </h2>
            <p className="mt-5 max-w-[58ch] text-bone">
              Everything listed is roasted within the week and dated on the bag. When a lot runs out
              it is gone until the next harvest.
            </p>
          </Reveal>

          {/* Lots: 2x2, exactly four cells for four items. Asymmetry comes
              from the cards themselves, not from spanning cells. */}
          <div className="mt-14 grid gap-4 md:grid-cols-2">
            {LOTS.map((l, i) => (
              <Reveal key={l.name} delay={i * 70}>
                <article className="wood-panel flex h-full flex-col overflow-hidden sm:flex-row">
                  <img
                    src={l.img}
                    alt={l.alt}
                    width={i === 0 ? 1200 : 800}
                    height={i === 0 ? 900 : 600}
                    loading="lazy"
                    className="h-44 w-full shrink-0 object-cover sm:h-auto sm:w-[38%]"
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-3.5 p-7">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <h3 className="stamp-light text-xl">{l.name}</h3>
                      <span className="font-mono text-[0.8125rem] font-semibold text-ember">
                        {l.weight}
                      </span>
                    </div>
                    <p className="font-mono text-[0.8125rem] font-semibold tracking-[0.03em] text-ash">
                      {l.line} at {l.place}
                    </p>
                    <p className="text-[0.9375rem] leading-[1.65] text-bone">{l.body}</p>
                    <div className="mt-auto flex flex-wrap items-baseline justify-between gap-3 border-t border-bone/15 pt-4">
                      <span className="text-sm text-chalk">{l.notes}</span>
                      <span className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ash">
                        Crop {l.crop}
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Bench: numbered process rows, no cards, no hairline table. */}
        <section id="process" className="wood-panel border-y border-y-roast-950/60 py-24 md:py-32">
          <div className="shell">
            <Reveal>
              <h2 className="max-w-[20ch] text-[clamp(2rem,3.9vw,3.1rem)] text-chalk">
                Four stages between the tree and your mug.
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-x-14 gap-y-10 md:grid-cols-2">
              {PROCESS.map((p, i) => (
                <Reveal key={p.n} delay={i * 70}>
                  <div className="flex gap-6">
                    <span
                      aria-hidden="true"
                      className="stamp-light font-display text-4xl leading-none text-ember"
                    >
                      {p.n}
                    </span>
                    <div className="max-w-[46ch]">
                      <h3 className="stamp-light text-xl">{p.title}</h3>
                      <p className="mt-3 leading-[1.7] text-bone">{p.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Quote: kraft slip full width, single family used once. */}
        <section className="shell py-24 md:py-32">
          <Reveal>
            <figure className="kraft px-7 py-14 md:px-16 md:py-16">
              <QuoteMark />
              <blockquote className="stamp mt-8 max-w-[46ch] text-[clamp(1.4rem,2.5vw,2rem)] leading-[1.3]">
                I have bought the Kochere every Friday for two years and it has not once tasted like
                the Friday before. That is the whole reason I keep my subscription on.
              </blockquote>
              <figcaption className="mt-9 text-sm font-semibold text-ink-soft">
                Ines Braithwaite, cafe owner, Glasgow
              </figcaption>
            </figure>
          </Reveal>
        </section>

        {/* Subscribe: switch state feeds the form, labels above inputs. */}
        <section id="book" className="shell pb-24 md:pb-32">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <Reveal>
              <h2 className="max-w-[14ch] text-[clamp(2rem,3.9vw,3.1rem)] text-chalk">
                Two bags a month, no minimum.
              </h2>
              <p className="mt-6 max-w-[48ch] leading-[1.7] text-bone">
                Tell us the lots and the weight, we roast to the level you set on the console above
                and post on the next dispatch day.
              </p>
              <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-5">
                {[
                  ['Roastery', 'Unit 4, Templeton Street'],
                  ['Telephone', '0141 428 6610'],
                  ['Dispatch days', 'Tuesday and Friday'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.18em] text-ash">
                      {k}
                    </dt>
                    <dd className="mt-2 text-sm text-chalk">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={120}>
              <form className="plate flex flex-col gap-5 p-7 md:p-9" onSubmit={submit} noValidate>
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm text-chalk">
                    Name on the subscription
                  </label>
                  <input
                    id="name"
                    name="name"
                    className="field"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ines Braithwaite"
                    aria-describedby="name-hint"
                    aria-invalid={Boolean(error) && name.trim().length < 2}
                  />
                  <p id="name-hint" className="font-mono text-[0.6875rem] font-semibold text-slate-300">
                    Used for the label on the bag only
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="lot" className="text-sm text-chalk">
                    Lot
                  </label>
                  <select
                    id="lot"
                    name="lot"
                    className="field appearance-none"
                    value={lot}
                    onChange={(e) => setLot(e.target.value)}
                    aria-describedby="lot-hint"
                    aria-invalid={Boolean(error) && !lot}
                  >
                    <option value="">Select a lot</option>
                    {LOTS.map((l) => (
                      <option key={l.name} value={l.name}>
                        {l.name}, {l.line}
                      </option>
                    ))}
                  </select>
                  <p id="lot-hint" className="font-mono text-[0.6875rem] font-semibold text-slate-300">
                    One lot a month, alternated if you prefer
                  </p>
                </div>

                <fieldset className="flex flex-col gap-2">
                  <legend className="mb-2 text-sm text-chalk">Weight per bag</legend>
                  <div className="flex flex-wrap gap-2">
                    {['250 g', '500 g', '1 kg'].map((w) => (
                      <button
                        key={w}
                        type="button"
                        className="tab"
                        aria-pressed={weight === w}
                        onClick={() => setWeight(w)}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                  <p
                    id="weight-hint"
                    className="font-mono text-[0.6875rem] font-semibold text-slate-300"
                  >
                    {weight === '1 kg' && !holding
                      ? 'Kilo bags need the bench hold switched on'
                      : 'Any weight, roasted to order'}
                  </p>
                </fieldset>

                {error && (
                  <p role="alert" className="text-sm font-semibold text-ember">
                    {error}
                  </p>
                )}

                {sent ? (
                  <div
                    className="plate-inset px-5 py-4 text-sm text-slate-200"
                    role="status"
                  >
                    Subscription started for {name.trim()} on the {ROASTS[level - 1].name.toLowerCase()} profile.
                    First dispatch is Tuesday, the {lot.toLowerCase()} lot roasted to the level you set
                    on the console.
                  </div>
                ) : (
                  <button type="submit" className="btn btn-primary self-start">
                    Start a subscription
                    <span className="btn-icon">
                      <ArrowGlyph />
                    </span>
                  </button>
                )}
              </form>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="wood-panel border-x-0 border-b-0">
        <div className="shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:py-16">
          <div>
            <p className="stamp-light font-display text-lg font-semibold">Field and Fable</p>
            <p className="mt-3 max-w-[40ch] text-sm leading-[1.65] text-bone">
              A bench roastery working four lots at a time, with a drum that has been rebuilt twice
              and a chalk board that has not changed since 2016.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-col gap-3 text-sm">
            <a href="#console" className="link-underline text-bone hover:text-chalk">
              Console
            </a>
            <a href="#lots" className="link-underline text-bone hover:text-chalk">
              Lots
            </a>
            <a href="#process" className="link-underline text-bone hover:text-chalk">
              Bench
            </a>
          </nav>
          <div className="text-sm text-bone">
            <p>Unit 4, Templeton Street</p>
            <p className="mt-1">Glasgow G21 5XS</p>
            <a href="#book" className="link-underline mt-4 inline-block hover:text-chalk">
              Start a subscription
            </a>
          </div>
        </div>
        <div className="shell border-t border-bone/15 py-7">
          <p className="font-mono text-[0.6875rem] font-semibold text-bone">
            Developed by{' '}
            <a href="https://thediyadevelopers.com" className="link-underline text-chalk">
              Diya Developers
            </a>
          </p>
        </div>
      </footer>
    </>
  )
}