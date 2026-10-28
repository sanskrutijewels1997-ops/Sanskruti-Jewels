import { describe, expect, it, vi } from 'vitest';
import { compressImage } from './image';

describe('compressImage', () => {
  it('rejects files that are not images', async () => {
    await expect(compressImage(new File(['x'], 'notes.txt', { type: 'text/plain' }))).rejects.toThrow('not an image');
  });

  it('returns the original file when the browser cannot decode it', async () => {
    vi.stubGlobal('createImageBitmap', vi.fn().mockRejectedValue(new Error('decode failed')));
    const file = new File(['abc'], 'photo.jpg', { type: 'image/jpeg' });
    await expect(compressImage(file)).resolves.toBe(file);
    vi.unstubAllGlobals();
  });
});

describe('compressImage (decodable image)', () => {
  it('downscales to the max side and re-encodes as JPEG when that is smaller', async () => {
    const close = vi.fn();
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue({ width: 4000, height: 2000, close }));
    const drawImage = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ fillRect: vi.fn(), drawImage, fillStyle: '' } as unknown as CanvasRenderingContext2D);
    const small = new Blob(['x'], { type: 'image/jpeg' });
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(function (this: HTMLCanvasElement, cb) {
      expect([this.width, this.height]).toEqual([1600, 800]);
      cb(small);
    });
    const big = new File([new Uint8Array(5000)], 'huge.png', { type: 'image/png' });
    await expect(compressImage(big)).resolves.toBe(small);
    expect(drawImage).toHaveBeenCalled();
    expect(close).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('keeps the original when re-encoding would not shrink it', async () => {
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue({ width: 100, height: 100, close: vi.fn() }));
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ fillRect: vi.fn(), drawImage: vi.fn(), fillStyle: '' } as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((cb) => cb(new Blob([new Uint8Array(999)])));
    const file = new File(['tiny'], 'tiny.jpg', { type: 'image/jpeg' });
    await expect(compressImage(file)).resolves.toBe(file);
    vi.unstubAllGlobals();
  });
});
