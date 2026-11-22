export function SectionPlaceholder({ title }: { title: string }) {
  return (
    <main className="page-shell">
      <p className="eyebrow">FaetonMES</p>
      <h1 className="section-heading">{title}</h1>
      <p className="section-description">Содержимое раздела будет добавлено позже.</p>
      <p className="page-note">Мы формируем структуру сайта.</p>
    </main>
  );
}
