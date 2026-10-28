import React, { useEffect } from 'react';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { pushBackHandler } from '../lib/native';

const ease = [0.23, 1, 0.32, 1] as const;

/**
 * Bottom sheet on phones (drag down or tap outside to close), centred dialog on larger
 * screens. Closes on Escape and on the Android back button.
 */
export function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
  className = 'sm:max-w-md',
  full = false
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** Sticky action area at the bottom of the sheet. */
  footer?: React.ReactNode;
  className?: string;
  /** Full-height sheet (filter screen). */
  full?: boolean;
}) {
  // Dragging starts only from the handle/title, so scrolling the content never moves the sheet.
  const drag = useDragControls();
  const startDrag = (e: React.PointerEvent) => drag.start(e);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const removeBack = pushBackHandler(onClose);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      removeBack();
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease }}
            drag="y"
            dragControls={drag}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 600) onClose();
            }}
            onClick={(e) => e.stopPropagation()}
            className={`relative flex w-full flex-col overflow-hidden rounded-t-[22px] bg-surface shadow-sheet sm:rounded-2xl ${
              full ? 'h-[94dvh] sm:h-[85vh]' : 'max-h-[90dvh]'
            } ${className}`}
          >
            <div className="flex shrink-0 touch-none justify-center pb-1 pt-2.5 sm:hidden" aria-hidden="true" onPointerDown={startDrag}>
              <span className="h-1 w-10 rounded-full bg-surface-3" />
            </div>
            {title && (
              <div
                className="flex shrink-0 touch-none items-center justify-between gap-3 border-b border-line px-5 pb-3 pt-1 sm:pt-4"
                onPointerDown={startDrag}
              >
                <h2 className="text-base font-semibold text-ink">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="pressable -mr-2 flex h-9 w-9 items-center justify-center rounded-full text-ink-2 hover:bg-surface-2"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
            )}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {children}
            </div>
            {footer && <div className="shrink-0 border-t border-line bg-surface px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
