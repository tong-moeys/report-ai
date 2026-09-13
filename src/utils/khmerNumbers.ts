const KHMER_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];

export function toKhmerNum(num: number | string | undefined | null): string {
  if (num === undefined || num === null) return '';
  const str = String(num);
  return str.replace(/[0-9]/g, (digit) => KHMER_DIGITS[parseInt(digit, 10)] || digit);
}

export function fromKhmerNum(str: string): string {
  if (!str) return '';
  return str.replace(/[០-៩]/g, (ch) => {
    const idx = KHMER_DIGITS.indexOf(ch);
    return idx !== -1 ? String(idx) : ch;
  });
}
