const ITEMS = [
  { cls: 't-backend', label: 'Backend / Java' },
  { cls: 't-ai', label: 'Generative AI' },
  { cls: 't-both', label: 'Both' },
];

export function Legend() {
  return (
    <ul className="legend" aria-label="Color legend">
      {ITEMS.map((item) => (
        <li key={item.cls}>
          <i className={`dot ${item.cls}`} aria-hidden="true" /> {item.label}
        </li>
      ))}
    </ul>
  );
}
