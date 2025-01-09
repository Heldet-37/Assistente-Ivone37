const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function validateImage(file: File): Promise<void> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Formato de imagem não suportado. Use JPEG, PNG ou WebP.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Imagem muito grande. O tamanho máximo é 4MB.');
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Imagem inválida ou corrompida'));
    img.src = URL.createObjectURL(file);
  });
}