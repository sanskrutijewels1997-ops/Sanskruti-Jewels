import { CheckIcon } from 'lucide-react';
import { BottomSheet } from '../BottomSheet';
import { sorts, type SortKey } from '../../lib/filters';

export function SortSheet({
  open,
  onClose,
  value,
  onChange
}: {
  open: boolean;
  onClose: () => void;
  value: SortKey;
  onChange: (s: SortKey) => void;
}) {
  return (
    <BottomSheet open={open} onClose={onClose} title="Sort by">
      <ul className="py-2" role="radiogroup" aria-label="Sort by">
        {(Object.entries(sorts) as [SortKey, string][]).map(([key, label]) => (
          <li key={key}>
            <button
              type="button"
              role="radio"
              aria-checked={value === key}
              onClick={() => {
                onChange(key);
                onClose();
              }}
              className={`pressable flex w-full items-center justify-between px-5 py-3.5 text-left text-[15px] ${
                value === key ? 'font-semibold text-brand' : 'text-ink'
              }`}
            >
              {label}
              {value === key && <CheckIcon className="h-5 w-5" />}
            </button>
          </li>
        ))}
      </ul>
    </BottomSheet>
  );
}
