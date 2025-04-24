export class ImageHelper {
  static getImageUrl(path: string, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
    if (!path) return 'assets/images/no-image.jpg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  static getBackdropUrl(path: string, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string {
    if (!path) return 'assets/images/no-backdrop.jpg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  static getProfileUrl(path: string, size: 'w45' | 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w185'): string {
    if (!path) return 'assets/images/no-profile.jpg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  static handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/no-image.jpg';
  }
}
