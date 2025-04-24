export class RatingHelper {
  static formatRating(rating: number): string {
    return rating.toFixed(1);
  }

  static getRatingColor(rating: number): string {
    if (rating >= 8) return '#4CAF50'; // Verde
    if (rating >= 6) return '#FFC107'; // Amarillo
    return '#F44336'; // Rojo
  }

  static getRatingText(rating: number): string {
    if (rating >= 8) return 'Excelente';
    if (rating >= 6) return 'Bueno';
    if (rating >= 4) return 'Regular';
    return 'Pobre';
  }

  static calculateAverageRating(ratings: number[]): number {
    if (!ratings.length) return 0;
    const sum = ratings.reduce((a, b) => a + b, 0);
    return sum / ratings.length;
  }
}
