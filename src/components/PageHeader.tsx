import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from 'lucide-react';

/** Goes back in app history, or to `fallback` when the screen was opened directly. */
export function useGoBack(fallback = '/') {
  const navigate = useNavigate();
  return () => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate(fallback, { replace: true });
  };
}

/**
 * Native-style top app bar. Tab roots pass `back={false}`; pushed screens get a back
 * chevron. On desktop the global nav sits above it, so it is not sticky there.
 */
export function PageHeader({
  title,
  subtitle,
  back = true,
  fallback,
  actions,
  large = false
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  fallback?: string;
  actions?: React.ReactNode;
  /** Big left-aligned title, used on tab roots. */
  large?: boolean;
}) {
  const goBack = useGoBack(fallback);
  return (
    <header className="pt-safe sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur-md lg:static lg:border-0 lg:bg-transparent lg:pt-0 lg:backdrop-blur-none">
      <div className="mx-auto flex h-14 max-w-site items-center gap-1 px-2 lg:h-auto lg:px-6 lg:pb-2 lg:pt-8">
        {back && (
          <button
            type="button"
            onClick={goBack}
            aria-label="Back"
            className="pressable flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink hover:bg-surface-2"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
        )}
        <div className={`min-w-0 flex-1 ${back ? '' : 'pl-2'}`}>
          <h1
            className={`truncate text-ink ${
              large ? 'font-display text-[26px] font-semibold lg:text-4xl' : 'text-[17px] font-semibold lg:font-display lg:text-4xl'
            }`}
          >
            {title}
          </h1>
          {subtitle && <p className="truncate text-xs text-ink-3 lg:mt-1 lg:text-sm">{subtitle}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
      </div>
    </header>
  );
}

export function HeaderIconButton({
  label,
  onClick,
  children,
  badge
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  badge?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="pressable relative flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-surface-2"
    >
      {children}
      {!!badge && (
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-brand-on">
          {badge}
        </span>
      )}
    </button>
  );
}
