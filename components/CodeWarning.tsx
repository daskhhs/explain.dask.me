export function CodeWarning({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-md border border-[var(--warn-border)] bg-[var(--warn-bg)] p-4">
      <h3 className="mb-2 text-sm font-medium text-[var(--warn)]">Things to watch</h3>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-[var(--warn)]">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--warn)]" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
