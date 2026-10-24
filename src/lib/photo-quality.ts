export type PhotoQuality = { dark: boolean; bright: boolean; blurry: boolean };

export function checkPhoto(src: string): Promise<PhotoQuality> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const size = 240;
      const scale = size / Math.max(img.naturalWidth, img.naturalHeight);
      const width = Math.max(1, Math.round(img.naturalWidth * scale));
      const height = Math.max(1, Math.round(img.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return resolve({ dark: false, bright: false, blurry: false });
      context.drawImage(img, 0, 0, width, height);
      const pixels = context.getImageData(0, 0, width, height).data;
      const gray = new Float32Array(width * height);
      let total = 0;
      for (let index = 0; index < gray.length; index++) {
        const value =
          pixels[index * 4] * 0.299 +
          pixels[index * 4 + 1] * 0.587 +
          pixels[index * 4 + 2] * 0.114;
        gray[index] = value;
        total += value;
      }
      const mean = total / gray.length;
      let sum = 0;
      let sumSquares = 0;
      let count = 0;
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const at = y * width + x;
          const laplacian =
            4 * gray[at] - gray[at - 1] - gray[at + 1] - gray[at - width] - gray[at + width];
          sum += laplacian;
          sumSquares += laplacian * laplacian;
          count++;
        }
      }
      const variance = count ? sumSquares / count - (sum / count) ** 2 : 0;
      resolve({ dark: mean < 55, bright: mean > 235, blurry: variance < 60 });
    };
    img.onerror = () => resolve({ dark: false, bright: false, blurry: false });
    img.src = src;
  });
}
