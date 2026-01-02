/**
 * Utilitaires pour la manipulation et l'optimisation d'images
 */

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_DIMENSION = 1920; // Largeur/hauteur max

/**
 * Compresse une image avant conversion en Base64
 * Réduit la taille du fichier et les dimensions si nécessaire
 */
export async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Vérifier la taille du fichier
    if (file.size > MAX_FILE_SIZE) {
      // Si le fichier est trop grand, on le compresse
      compressImageFile(file)
        .then(resolve)
        .catch(reject);
    } else {
      // Si le fichier est déjà petit, juste le convertir
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    }
  });
}

/**
 * Compresse un fichier image en réduisant sa qualité et ses dimensions
 */
function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Réduire les dimensions si nécessaire
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = (height * MAX_DIMENSION) / width;
            width = MAX_DIMENSION;
          } else {
            width = (width * MAX_DIMENSION) / height;
            height = MAX_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Impossible de créer le contexte canvas'));
          return;
        }

        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir en base64 avec compression
        // Qualité entre 0.7 et 0.9 selon la taille originale
        const quality = file.size > 5 * 1024 * 1024 ? 0.7 : 0.85;
        const base64 = canvas.toDataURL('image/jpeg', quality);

        resolve(base64);
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Valide un fichier image
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Vérifier le type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Le fichier doit être une image' };
  }

  // Vérifier la taille (max 5MB avant compression)
  const maxSizeBeforeCompression = 5 * 1024 * 1024;
  if (file.size > maxSizeBeforeCompression) {
    return { valid: false, error: 'L\'image est trop grande (max 5MB)' };
  }

  return { valid: true };
}

/**
 * Obtient la taille d'une image Base64 en KB
 */
export function getBase64Size(base64: string): number {
  // Approximer la taille en retirant le préfixe data:image/...
  const base64Data = base64.split(',')[1] || base64;
  const sizeInBytes = (base64Data.length * 3) / 4;
  return Math.round(sizeInBytes / 1024);
}

