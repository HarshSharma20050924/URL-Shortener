const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function encodeBase62(num: number): string {
    if (num === 0) return chars[0];
    let encoded = '';
    while (num > 0) {
        encoded = chars[num % 62] + encoded;
        num = Math.floor(num / 62);
    }
    return encoded;
}
