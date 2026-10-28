import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, ImagePlusIcon, StarIcon, XIcon } from 'lucide-react';
import { api } from '../../lib/api';
import { friendlyError } from '../../lib/format';
import { compressImage } from '../../lib/image';
import { Spinner } from '../ui';

export interface UploadedImage {
  url: string;
  storagePath: string | null;
}

/**
 * Uploads images as soon as they're picked (compressed client-side) and lets the admin
 * reorder them; the first image is the cover. Files uploaded during this session that
 * never get saved are deleted from storage when the editor closes.
 */
export function ImageUploader({
  images,
  onChange,
  folder,
  multiple = true,
  onError,
  sessionUploads
}: {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  folder: string;
  multiple?: boolean;
  onError: (msg: string) => void;
  /** Collects storage paths uploaded in this session so the parent can clean up. */
  sessionUploads: React.MutableRefObject<Set<string>>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const latest = useRef(images);
  useEffect(() => {
    latest.current = images;
  }, [images]);

  const handleFiles = async (files: FileList | File[]) => {
    const picked = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (!picked.length) return;
    const batch = multiple ? picked : picked.slice(0, 1);
    setUploading((n) => n + batch.length);
    for (const file of batch) {
      try {
        const blob = await compressImage(file);
        const img = await api.uploadImage(blob, folder);
        if (img.storagePath) sessionUploads.current.add(img.storagePath);
        latest.current = multiple ? [...latest.current, img] : [img];
        onChange(latest.current);
      } catch (e) {
        onError(`${file.name}: ${friendlyError(e)}`);
      } finally {
        setUploading((n) => n - 1);
      }
    }
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors duration-150 ease-luxe ${
          dragOver ? 'border-brand bg-brand-soft' : 'border-line'
        }`}
      >
        {uploading > 0 ? <Spinner className="h-6 w-6 text-gold" /> : <ImagePlusIcon className="h-6 w-6 text-gold" />}
        <p className="mt-3 text-sm font-medium text-ink">
          {uploading > 0 ? `Uploading ${uploading}…` : multiple ? 'Drop photos here' : 'Drop a photo here'}
        </p>
        <p className="mt-1 text-xs text-ink-2">JPG, PNG or WebP · resized to 1600px automatically</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-4 rounded-full border border-ink px-5 py-2 text-xs font-semibold text-ink transition-colors duration-150 ease-luxe hover:bg-ink hover:text-bg"
        >
          {multiple ? 'Choose photos' : 'Choose photo'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            if (e.target.files) void handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {images.length > 0 && (
        <ul className={`mt-4 grid gap-3 ${multiple ? 'grid-cols-3 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'}`}>
          {images.map((img, i) => (
            <li key={img.url} className="group relative overflow-hidden rounded-lg border border-line bg-surface-2">
              <img src={img.url} alt="" className="aspect-square w-full object-cover" />
              {multiple && i === 0 && (
                <span className="eyebrow absolute left-1.5 top-1.5 rounded-full bg-brand px-2 py-0.5 text-[9px] text-brand-on">Cover</span>
              )}
              <button
                type="button"
                onClick={() => onChange(images.filter((_, j) => j !== i))}
                aria-label={`Remove image ${i + 1}`}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-surface/95 text-ink-2 shadow-card hover:text-danger"
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
              {multiple && images.length > 1 && (
                <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between">
                  <button
                    type="button"
                    disabled={i === 0}
                    onClick={() => move(i, i - 1)}
                    aria-label="Move left"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-surface/95 text-ink shadow-card disabled:opacity-30"
                  >
                    <ArrowLeftIcon className="h-3.5 w-3.5" />
                  </button>
                  {i !== 0 && (
                    <button
                      type="button"
                      onClick={() => move(i, 0)}
                      aria-label="Make cover image"
                      title="Make cover"
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-surface/95 text-gold shadow-card"
                    >
                      <StarIcon className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={i === images.length - 1}
                    onClick={() => move(i, i + 1)}
                    aria-label="Move right"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-surface/95 text-ink shadow-card disabled:opacity-30"
                  >
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Deletes uploads that were never saved, when the owning editor unmounts. */
export function useCleanupUnsavedUploads() {
  const sessionUploads = useRef(new Set<string>());
  useEffect(() => {
    const uploads = sessionUploads.current;
    return () => {
      if (uploads.size) void api.removeImages([...uploads]).catch(() => undefined);
    };
  }, []);
  /** Call after a successful save with the paths that are now referenced. */
  const markSaved = (paths: (string | null)[]) => paths.forEach((p) => p && sessionUploads.current.delete(p));
  return { sessionUploads, markSaved };
}
