/** Limpieza que devuelve cada preview para poder pararla al salir de viewport. */
export interface PreviewHandle {
  stop(): void;
}

/** Un efecto del catálogo Motion Lab. */
export interface Effect {
  /** único, kebab-case */
  id: string;
  /** único */
  title: string;
  /** debe existir en CAT_ORDER */
  cat: string;
  /** términos para el buscador */
  tags: string[];
  /** descripción corta */
  desc: string;
  /** etiquetas (ya no se renderizan; se conservan en datos) */
  meta?: string[];
  /** texto descriptivo del efecto */
  prompt: string;
  /** código fuente real (opcional; si falta, se deriva de render()) */
  code?: string;
  /** pinta la preview dentro de `el` y devuelve su cleanup */
  render(el: HTMLElement): PreviewHandle;
}

/** Efecto + metadatos derivados en build (fuente para el toggle de código). */
export interface EffectEntry extends Effect {
  /** fuente del módulo tal cual (vía ?raw), para mostrar el código real */
  source: string;
}
