interface HeadingProps {
  html: string;
  level?: number;
}

export function Heading({ html, level = 2 }: HeadingProps) {
  // `renderedHtml` already contains <h1>-<h6>, so render into a wrapper div
  // to avoid invalid nested heading tags that cause hydration mismatches.
  const levelStyles: Record<number, string> = {
    1: "[&_h1]:text-4xl [&_h1]:md:text-6xl [&_h1]:font-black [&_h1]:mb-10 [&_h1]:text-slate-900 dark:[&_h1]:text-white",
    2: "[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-6 [&_h2]:border-l-4 [&_h2]:border-primary [&_h2]:pl-4 [&_h2]:text-slate-900 dark:[&_h2]:text-white",
    3: "[&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-4 [&_h3]:text-slate-800 dark:[&_h3]:text-slate-100",
    4: "[&_h4]:text-xl [&_h4]:font-semibold [&_h4]:mb-3 [&_h4]:text-slate-800 dark:[&_h4]:text-slate-200",
    5: "[&_h5]:text-lg [&_h5]:font-bold [&_h5]:mb-2 [&_h5]:text-slate-700 dark:[&_h5]:text-slate-300",
    6: "[&_h6]:text-base [&_h6]:font-bold [&_h6]:mb-2 [&_h6]:text-slate-600 dark:[&_h6]:text-slate-400",
  };

  return (
    <div
      className={`${levelStyles[level] || ""} [&_h1]:tracking-tight [&_h2]:tracking-tight [&_h3]:tracking-tight [&_h4]:tracking-tight [&_h5]:tracking-tight [&_h6]:tracking-tight [&_h1]:scroll-mt-24 [&_h2]:scroll-mt-24 [&_h3]:scroll-mt-24 [&_h4]:scroll-mt-24 [&_h5]:scroll-mt-24 [&_h6]:scroll-mt-24`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
