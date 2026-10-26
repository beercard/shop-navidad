/** Lista legible de comercios: sin repetidos y acotada ("A, B, C y 12 locales más"). Devuelve null si no hay comercios. */
export function formatMerchants(names: string[] | undefined, limit: number) {
  const unique = [...new Set((names ?? []).map((name) => name.trim()).filter(Boolean))];
  if (!unique.length) return null;
  if (unique.length <= limit) return unique.join(', ');
  const rest = unique.length - limit;
  return `${unique.slice(0, limit).join(', ')} y ${rest} ${rest === 1 ? 'local más' : 'locales más'}`;
}
