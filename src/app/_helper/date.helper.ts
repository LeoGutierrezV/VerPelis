export class DateHelper {
  static formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  static getYear(date: string | Date): string {
    const d = new Date(date);
    return d.getFullYear().toString();
  }

  static isRecent(date: string | Date, months: number = 6): boolean {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= months * 30;
  }
}
