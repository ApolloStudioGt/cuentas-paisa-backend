export class DateFormatter {
  static getDDMMMMYYYY(date: Date): string {
    const formater = new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });

    return formater.format(date);
  }
}
