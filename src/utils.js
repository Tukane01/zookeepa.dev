export function createPageUrl(pageName) {
  return pageName === 'Home' ? '/' : `/${pageName}`;
}