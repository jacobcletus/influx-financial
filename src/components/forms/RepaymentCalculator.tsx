import { useMemo, useState } from 'react';

/**
 * Simple principal-and-interest repayment calculator.
 * Estimates only, clearly disclaimed on the page.
 */

function currency(n: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(n);
}

const FREQUENCIES = [
  { label: 'Monthly', perYear: 12 },
  { label: 'Fortnightly', perYear: 26 },
  { label: 'Weekly', perYear: 52 },
] as const;

export default function RepaymentCalculator() {
  const [amount, setAmount] = useState(600000);
  const [rate, setRate] = useState(6.0);
  const [years, setYears] = useState(30);
  const [freqIndex, setFreqIndex] = useState(0);

  const result = useMemo(() => {
    const perYear = FREQUENCIES[freqIndex].perYear;
    const n = years * perYear;
    const r = rate / 100 / perYear;
    if (amount <= 0 || n <= 0) return null;
    const repayment = r === 0 ? amount / n : (amount * r) / (1 - Math.pow(1 + r, -n));
    const totalPaid = repayment * n;
    return { repayment, totalInterest: totalPaid - amount, totalPaid };
  }, [amount, rate, years, freqIndex]);

  const labelCls = 'mb-1.5 block text-[0.9rem] font-semibold text-ink-900';

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5">
        <div>
          <label htmlFor="calc-amount" className={labelCls}>
            Loan amount
          </label>
          <input
            id="calc-amount"
            type="number"
            inputMode="numeric"
            min={10000}
            max={10000000}
            step={10000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="field-input"
          />
          <input
            type="range"
            min={100000}
            max={2000000}
            step={10000}
            value={Math.min(amount, 2000000)}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-3 w-full accent-[#006d5a]"
            aria-label="Loan amount slider"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="calc-rate" className={labelCls}>
              Interest rate (% p.a.)
            </label>
            <input
              id="calc-rate"
              type="number"
              inputMode="decimal"
              min={0.1}
              max={15}
              step={0.05}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="field-input"
            />
          </div>
          <div>
            <label htmlFor="calc-years" className={labelCls}>
              Loan term (years)
            </label>
            <input
              id="calc-years"
              type="number"
              inputMode="numeric"
              min={1}
              max={40}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="field-input"
            />
          </div>
        </div>
        <fieldset>
          <legend className={labelCls}>Repayment frequency</legend>
          <div className="flex gap-2" role="group">
            {FREQUENCIES.map((f, i) => (
              <button
                key={f.label}
                type="button"
                aria-pressed={freqIndex === i}
                onClick={() => setFreqIndex(i)}
                className={`rounded-full px-4 py-2 text-[0.9rem] font-semibold transition-colors ${
                  freqIndex === i
                    ? 'bg-pine-700 text-white'
                    : 'border border-line-200 bg-white text-ink-700 hover:border-sage-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="rounded-2xl bg-pine-950 p-8 text-white">
        {result ? (
          <>
            <p className="text-sm font-semibold uppercase tracking-wider text-sage-300">
              Estimated {FREQUENCIES[freqIndex].label.toLowerCase()} repayment
            </p>
            <p className="mt-2 text-5xl font-extrabold tracking-tight">
              {currency(result.repayment)}
            </p>
            <dl className="mt-8 space-y-3 border-t border-white/15 pt-6 text-[0.95rem]">
              <div className="flex justify-between gap-4">
                <dt className="text-sage-300">Total interest over {years} years</dt>
                <dd className="font-bold">{currency(result.totalInterest)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-sage-300">Total repaid</dt>
                <dd className="font-bold">{currency(result.totalPaid)}</dd>
              </div>
            </dl>
            <a
              href="/book-consultation"
              className="mt-8 inline-block rounded-full bg-white px-6 py-3 text-[0.95rem] font-semibold text-pine-900 transition-colors hover:bg-mist-100"
            >
              Get your real borrowing numbers
            </a>
          </>
        ) : (
          <p className="text-sage-200">Enter loan details to see an estimate.</p>
        )}
      </div>
    </div>
  );
}
