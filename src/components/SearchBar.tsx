import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  value: string;
  onChange: (v: string) => void;
  count: number;
  total: number;
  filtered: boolean;
}

export default function SearchBar({ value, onChange, count, total, filtered }: Props) {
  const { t } = useLanguage();

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
          placeholder={t('search.placeholder')}
          autoComplete="off"
          aria-label={t('search.label')}
        />
      </div>
      <div className="count">
        <span>{count}</span>
        {filtered && (
          <>
            <span>{t('search.of')}</span>
            <span>{total}</span>
          </>
        )}{' '}
        {t('search.effects')}
      </div>
    </div>
  );
}
