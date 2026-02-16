/**
 * Convertit un nom de catégorie en slug URL (ex: "Grandes Trousses" -> "grandes-trousses")
 */
export const nameToSlug = (name) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

/**
 * Convertit un slug en nom (ex: "grandes-trousses" -> "Grandes Trousses")
 * Nécessite la liste des catégories pour retrouver le vrai nom (casse, accents)
 */
export const slugToName = (slug, categories) => {
  if (!slug || !categories?.length) return slug || '';
  const found = categories.find((c) => nameToSlug(c.name) === slug);
  return found ? found.name : slug.replace(/-/g, ' ');
};
