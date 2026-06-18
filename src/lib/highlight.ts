/** Resaltado mínimo (comentarios + keywords), igual que el prototipo. Devuelve HTML. */
export function highlight(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/(\/\/[^\n]*)/g, '<span style="color:#5a5c72;font-style:italic">$1</span>')
    .replace(
      /\b(const|let|var|function|return|if|else|for|while|new|this|true|false|null)\b/g,
      '<span style="color:#7b5cff">$1</span>'
    );
}
