interface BlobCallback {
    (base64: string): void;
}

export const blobToBase64 = (blob: Blob, callback: BlobCallback) => {
  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = reader.result as string;
    const base64 = dataUrl.split(',')[1];
    callback(base64);
  };
  reader.readAsDataURL(blob);
};

export const isBase64 = (image: string) => image.includes('data:image') && image.includes('base64');
