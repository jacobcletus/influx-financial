/**
 * React twin of ui/Icon.astro for use inside hydrated islands.
 * Keep the path data in sync with Icon.astro.
 */
const paths: Record<string, string> = {
  home: 'M4 11.5 12 5l8 6.5M6 10v9h4v-5h4v5h4v-9',
  key: 'M14 10a4 4 0 1 0-3.7 3.99L12 12.3l1.5 1.5 1.5-1.5 1.5 1.5 2.5-2.5-4-4M8.5 9.5h.01M11 13l-6.5 6.5M7 17l1.5 1.5',
  hammer: 'M14 5.5 10 9.5m4-4 2-2 4.5 4.5-2 2m-4.5-4.5 4.5 4.5m-8.5-.5-7 7L5.5 20l7-7',
  refresh: 'M4.5 9A8 8 0 0 1 19 7.5M19.5 15A8 8 0 0 1 5 16.5M19 3.5v4h-4M5 20.5v-4h4',
  chart: 'M4 20h16M7 16v-4m5 4V8m5 8v-7M5 4.5l5 3 4-3.5 5 2.5',
  layers: 'M12 4 4 8.5l8 4.5 8-4.5L12 4Zm-8 9 8 4.5 8-4.5m-16 3.5L12 21l8-4.5',
  building: 'M5 20V6l7-3v17m0-17 7 3v14M5 20h14M9 9h.5m-.5 4h.5M15 9h.5m-.5 4h.5M11.5 20v-3h1v3',
  truck:
    'M3 7h11v9H3zM14 10h4l3 3v3h-7M6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  car: 'M3 16v-3l2.5-5.5h8.5l3.5 4.5H21v4h-2M3 16h2.5m10 0h-7M6 12.5h10M7.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm9.5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  briefcase: 'M4 8h16v11H4zM9 8V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V8m-11 5h16',
  calculator:
    'M6 3.5h12v17H6zM9 7h6M9 11h.5m2.5 0h.5m2.5 0h.5M9 14.5h.5m2.5 0h.5m2.5 0h.5M9 18h.5m2.5 0h.5m2.5 0h.5',
};

export function ServiceIcon({ name, size = 20 }: { name: string; size?: number }) {
  const d = paths[name] ?? paths['home'];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
