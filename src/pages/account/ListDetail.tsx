import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FolderHeartIcon, MoreVerticalIcon, PencilIcon, Share2Icon, Trash2Icon, XIcon } from 'lucide-react';
import { BottomSheet } from '../../components/BottomSheet';
import { HeaderIconButton, PageHeader } from '../../components/PageHeader';
import { ProductCard, ProductGrid } from '../../components/ProductCard';
import { EmptyState, inputClass, primaryButton } from '../../components/ui';
import { useApp } from '../../contexts/AppContext';
import { useCatalogue } from '../../lib/queries';

export function ListDetail() {
  const { id } = useParams();
  const { lists, renameList, deleteList, setListItem, updateListNote, notify } = useApp();
  const { byId, categoryName } = useCatalogue();
  const navigate = useNavigate();
  const list = lists.find((l) => l.id === id);
  const [note, setNote] = useState('');
  const [menu, setMenu] = useState(false);

  useEffect(() => setNote(list?.note ?? ''), [list?.id, list?.note]);

  if (!list) {
    return (
      <div>
        <PageHeader title="List" fallback="/lists" />
        <EmptyState icon={FolderHeartIcon} title="List not found" />
      </div>
    );
  }

  const items = list.productIds.map((pid) => byId(pid)).filter((p): p is NonNullable<typeof p> => !!p);

  const share = async () => {
    const lines = items.map((p) => `• ${p.name} — ${window.location.origin}/product/${p.slug}`);
    const text = `${list.name}\n${lines.join('\n')}`;
    try {
      if (navigator.share) await navigator.share({ title: list.name, text });
      else {
        await navigator.clipboard.writeText(text);
        notify('List copied — paste it anywhere to share');
      }
    } catch {
      // Share sheet dismissed.
    }
  };

  return (
    <div className="mx-auto max-w-site lg:px-6">
      <PageHeader
        title={list.name}
        subtitle={[list.occasion, `${items.length} pieces`].filter(Boolean).join(' · ')}
        fallback="/lists"
        actions={
          <>
            <HeaderIconButton label="Share list" onClick={share}>
              <Share2Icon className="h-5 w-5" />
            </HeaderIconButton>
            <HeaderIconButton label="More options" onClick={() => setMenu(true)}>
              <MoreVerticalIcon className="h-5 w-5" />
            </HeaderIconButton>
          </>
        }
      />

      <div className="px-4 py-4 lg:px-0">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink-2">Notes</span>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={() => note !== list.note && updateListNote(list.id, note)}
            placeholder="Budget, sizes, who it's for…"
            className={`${inputClass} h-auto resize-none py-3`}
          />
        </label>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={FolderHeartIcon}
          title="Nothing here yet"
          text="Open any piece and tap “Save to list”."
          action={
            <Link to="/catalogue" className={`w-full ${primaryButton}`}>
              Explore jewellery
            </Link>
          }
        />
      ) : (
        <div className="pb-6">
          <ProductGrid>
            {items.map((p) => (
              <div key={p.id} className="relative">
                <ProductCard product={p} categoryName={categoryName(p.categoryId)} />
                <button
                  type="button"
                  onClick={() => setListItem(list.id, p.id, false)}
                  aria-label={`Remove ${p.name} from list`}
                  className="pressable absolute left-1.5 top-1.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 text-ink-2 shadow-card"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </ProductGrid>
        </div>
      )}

      <BottomSheet open={menu} onClose={() => setMenu(false)}>
        <div className="py-2">
          <button
            type="button"
            onClick={() => {
              setMenu(false);
              const next = window.prompt('Rename list', list.name);
              if (next && next.trim()) renameList(list.id, next.trim());
            }}
            className="pressable flex w-full items-center gap-3 px-5 py-4 text-[15px] text-ink"
          >
            <PencilIcon className="h-5 w-5 text-ink-2" /> Rename list
          </button>
          <button
            type="button"
            onClick={() => {
              setMenu(false);
              if (!window.confirm(`Delete “${list.name}”?`)) return;
              deleteList(list.id);
              navigate('/lists', { replace: true });
            }}
            className="pressable flex w-full items-center gap-3 px-5 py-4 text-[15px] text-danger"
          >
            <Trash2Icon className="h-5 w-5" /> Delete list
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
