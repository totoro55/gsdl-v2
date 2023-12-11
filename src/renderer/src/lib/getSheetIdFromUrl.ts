//Принимает url google таблицы, возвращает id google таблицы
export function getSheetIdFromUrl(url: string): string | null {
  if (!url) return null;
  const re = /s[^]d[^]*[^]e/g;
  const res = re.exec(url);
  if (!res) return null;
  return res[0].slice(4, res.length - 3);
}
