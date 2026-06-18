import { CATS, catCount } from '../effects';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  active: string;
  onSelect: (cat: string) => void;
}

export default function CatChips({ active, onSelect }: Props) {
  const { t } = useLanguage();

  return (
    <div className="wrap">
      <div className="cats">
        {CATS.map((c) => (
          <button
            key={c}
            className={'chip' + (c === active ? ' active' : '')}
            onClick={() => onSelect(c)}
          >
            {t('cat.' + c)} <span className="chip-n">{catCount(c)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
