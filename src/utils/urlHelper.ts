/**
 * Helper function to generate photo URL
 * @param filename - The photo filename
 * @returns Full URL to the photo
 */
export const generatePhotoUrl = (filename: string): string => {
  const PORT = process.env.PORT || 3001;
  
  if (process.env.NODE_ENV === 'prod') {
    const domain = process.env.FRONTEND_DOMAIN;
    if (!domain) {
      throw new Error('FRONTEND_DOMAIN environment variable is required in production');
    }
    return `${domain}/colleagues/static/${filename}`;
  } else {
    return `http://localhost:${PORT}/static/${filename}`;
  }
}; 