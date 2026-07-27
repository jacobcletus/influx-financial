import { useEffect, useRef, useState } from 'react';

interface DuoStatProps {
  label: string;
}

/**
 * The "2-in-1" statistic, animated in step with StatCounter: both
 * digits count up from 0 with the same duration and easing so the
 * trust bar finishes as one. Renders the final value immediately for
 * reduced-motion users and before hydration.
 */
export default function DuoStat({ label }: DuoStatProps) {
  const [digits, setDigits] = useState<[number, number]>([2, 1]);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();
        const duration = 1400;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setDigits([Math.round(2 * eased), Math.round(1 * eased)]);
          if (t < 1) requestAnimationFrame(tick);
        };
        setDigits([0, 0]);
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-[2.9rem] font-extrabold tracking-[-0.02em] text-pine-950 sm:text-[3.4rem]">
        {digits[0]}
        <span className="text-pine-600">-in-</span>
        {digits[1]}
      </p>
      <p className="mt-2 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-ink-500">
        {label}
      </p>
    </div>
  );
}
