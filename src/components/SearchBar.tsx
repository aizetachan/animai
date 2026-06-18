interface Props {
  value: string;
  onChange: (v: string) => void;
  count: number;
  total: number;
  filtered: boolean;
}

export default function SearchBar({ value, onChange, count, total, filtered }: Props) {
  return (
    <div className="wrap">
      <div className="search">
        <svg viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar: gradiente, scroll, morph, hover, partículas…"
          autoComplete="off"
          aria-label="Buscar efectos"
        />
      </div>
      <div className="count">
        <span>{count}</span>
        {filtered && (
          <>
            <span> de </span>
            <span>{total}</span>
          </>
        )}{' '}
        efectos
      </div>
    </div>
  );
}
