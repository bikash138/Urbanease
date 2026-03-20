export function getDiceBearAvatarUrl(userId: string, name: string): string {
    const seed = encodeURIComponent(`${userId}-${name}`);
    return `https://api.dicebear.com/9.x/lorelei/svg?seed=${seed}`;
}