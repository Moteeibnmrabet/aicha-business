/**
 * Fonction utilitaire pour obtenir l'URL complète d'une image
 * Gère les images uploadées localement (/uploads/) et les URLs externes
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // Si c'est une image uploadée localement
  if (imagePath.startsWith('/uploads/')) {
    const apiUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${apiUrl}${imagePath}`;
  }
  
  // Sinon, c'est une URL externe, la retourner telle quelle
  return imagePath;
};
