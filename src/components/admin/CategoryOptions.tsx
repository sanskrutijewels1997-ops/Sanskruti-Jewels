import type { Category } from '../../types';

/**
 * <option>s for a category <select>: main categories with sub-categories grouped under
 * them. A main category with sub-categories is still selectable ("Rings (all types)").
 */
export function CategoryOptions({ categories }: { categories: Category[] }) {
  const tops = categories.filter((c) => !c.parentId);
  return (
    <>
      {tops.map((c) => {
        const subs = categories.filter((s) => s.parentId === c.id);
        if (!subs.length) {
          return (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          );
        }
        return (
          <optgroup key={c.id} label={c.name}>
            <option value={c.id}>{c.name} (all types)</option>
            {subs.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </optgroup>
        );
      })}
    </>
  );
}
