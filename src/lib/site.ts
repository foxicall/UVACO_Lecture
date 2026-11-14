export const staticSite = process.env.NEXT_PUBLIC_STATIC_SITE === 'true';
export function sitePath(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${path}`;
}
