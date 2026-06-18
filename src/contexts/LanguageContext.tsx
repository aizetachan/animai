import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'es' | 'en' | 'zh';

interface LanguageContextProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  es: {
    // Nav
    'nav.home': 'Inicio',
    'nav.gallery': 'Galería',
    'nav.explore': 'Explorar',
    'nav.request': 'Sugerencias',

    // Request / Feedback Modal
    'request.button': 'Sugerencias',
    'request.title': 'Cuéntanos',
    'request.subtitle': 'Propón una animación, reporta un bug o déjanos cualquier idea.',
    'request.type.label': '¿De qué se trata?',
    'request.type.animation': 'Proponer animación',
    'request.type.bug': 'Reportar un bug',
    'request.type.other': 'Otro',
    'request.message.label': 'Tu mensaje',
    'request.message.placeholder': 'Describe tu propuesta, el bug que encontraste o tu idea…',
    'request.email.label': 'Email (opcional)',
    'request.email.placeholder': 'tucorreo@ejemplo.com — por si queremos responderte',
    'request.submit': 'Enviar',
    'request.sending': 'Enviando…',
    'request.cancel': 'Cancelar',
    'request.close': 'Cerrar',
    'request.success.title': '¡Gracias!',
    'request.success.text': 'Hemos recibido tu mensaje. Lo revisaremos pronto.',
    'request.error': 'No se pudo enviar. Inténtalo de nuevo en un momento.',
    'request.required': 'Escribe un mensaje antes de enviar.',

    // Landing
    'landing.eyebrow': 'Nakama Studio · Animai',
    'landing.hero.title1': 'El catálogo de animaciones',
    'landing.hero.title2': 'que hace ',
    'landing.hero.title3': 'respirar',
    'landing.hero.title4': ' tus landings',
    'landing.hero.sub': '{count} efectos listos para usar —shaders, 3D, scroll, tipografía, partículas, SVG y microinteracciones— con preview en vivo y código copiable. Sin dependencias externas.',
    'landing.hero.cta.explore': 'Explorar',
    'landing.hero.cta.cats': 'Ver categorías',
    'landing.hero.stats.effects': 'Efectos',
    'landing.hero.stats.cats': 'Categorías',
    'landing.hero.stats.deps': 'Dependencias',
    
    'landing.about.title': 'Una herramienta de motion para producto real',
    'landing.about.lead': 'Animai es a la vez nuestra biblioteca interna de Nakama Studio y un recurso público: inspiración y código de partida para equipos de diseño y desarrollo que quieren añadir movimiento con intención.',
    
    'landing.features.0.h': 'Preview en vivo real',
    'landing.features.0.p': 'Cada efecto se ve funcionando de verdad, no un gif. WebGL, Canvas 2D y CSS nativos.',
    'landing.features.1.h': 'Prompt + código',
    'landing.features.1.p': 'Un toggle alterna entre el prompt descriptivo y el código fuente exacto que produce el efecto.',
    'landing.features.2.h': 'Cero dependencias',
    'landing.features.2.p': 'Las previews no cargan ninguna librería ni CDN. Copia, pega y funciona en tu landing.',
    'landing.features.3.h': 'Rendimiento por visibilidad',
    'landing.features.3.p': 'Solo se animan las previews visibles (IntersectionObserver). {count} efectos sin fundir el navegador.',
    
    'landing.cats.title': 'Explora por categoría',
    'landing.cats.lead': 'Cada tarjeta es una preview viva. Entra a la galería para el resto.',
    'landing.cta.title1': '¿Listo para ',
    'landing.cta.title2': 'moverte',
    'landing.cta.title3': '?',
    'landing.cta.btn': 'Abrir la galería',
    
    // Gallery
    'gallery.title1': 'Animaciones que hacen ',
    'gallery.title2': 'respirar',
    'gallery.title3': ' una landing page',
    'gallery.sub': 'Catálogo de efectos para web: shaders WebGL, scroll, tipografía animada, partículas, SVG y microinteracciones. Cada uno con preview en vivo y un prompt listo para copiar. Sin dependencias externas: todo corre en Canvas/WebGL nativo.',
    'gallery.footer': 'Animai · {count} efectos con preview real en WebGL + Canvas + SVG · botón <code>&lt;/&gt;</code> para ver el código · sin dependencias externas · prompts orientativos, ajústalos a tu stack',
    'gallery.empty': 'Sin resultados. Prueba con otra palabra o categoría.',
    
    // SearchBar
    'search.placeholder': 'Buscar animación',
    'search.label': 'Buscar efectos',
    'search.of': ' de ',
    'search.effects': 'efectos',
    
    // EffectCard
    'card.prompt': 'Prompt',
    'card.code': 'Código',
    'card.view_prompt': 'Ver prompt',
    'card.view_code': 'Ver código',
    'card.copy': 'Copiar',
    'card.copied': '✓ Copiado',
    
    // Preview
    'preview.unavailable': 'preview no disponible',
    'preview.reduced_motion': 'Movimiento reducido · pulsa para reproducir',
    'preview.play_animation': 'Reproducir animación',
    
    // Categories
    'cat.Todos': 'Todos',
    'cat.Shaders WebGL': 'Shaders WebGL',
    'cat.3D / R3F': '3D / R3F',
    'cat.Postprocesado': 'Postprocesado',
    'cat.Scroll': 'Scroll',
    'cat.Texto': 'Texto',
    'cat.Partículas': 'Partículas',
    'cat.SVG': 'SVG',
    'cat.Hover & UI': 'Hover & UI',
    'cat.CSS Moderno': 'CSS Moderno',
    'cat.Loaders': 'Loaders',
    'cat.Micro-interacciones': 'Micro-interacciones',
    'cat.CSS Art': 'CSS Art',
    'cat.UI Components': 'UI Components',
    'cat.Navegación': 'Navegación',
    'cat.Datos / Charts': 'Datos / Charts',
    'cat.Creativos': 'Creativos',
    
    // Footer global
    'footer.text': 'Animai · Nakama Studio · diseño UX/UI + producción AI',
    
    // Cookie Banner
    'cookie.title': 'Uso de cookies',
    'cookie.text': 'Usamos cookies 100% anónimas para saber qué animaciones se usan y copian más. No registramos datos personales, tu IP ni rastreamos tu navegación.',
    'cookie.accept': 'Aceptar',
    'cookie.decline': 'Rechazar'
  },
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.gallery': 'Gallery',
    'nav.explore': 'Explore',
    'nav.request': 'Feedback',

    // Request / Feedback Modal
    'request.button': 'Feedback',
    'request.title': 'Tell us',
    'request.subtitle': 'Suggest an animation, report a bug, or share any idea.',
    'request.type.label': 'What is it about?',
    'request.type.animation': 'Suggest an animation',
    'request.type.bug': 'Report a bug',
    'request.type.other': 'Other',
    'request.message.label': 'Your message',
    'request.message.placeholder': 'Describe your suggestion, the bug you found, or your idea…',
    'request.email.label': 'Email (optional)',
    'request.email.placeholder': 'you@example.com — in case we want to reply',
    'request.submit': 'Send',
    'request.sending': 'Sending…',
    'request.cancel': 'Cancel',
    'request.close': 'Close',
    'request.success.title': 'Thank you!',
    'request.success.text': "We've received your message. We'll review it soon.",
    'request.error': 'Could not send. Please try again in a moment.',
    'request.required': 'Write a message before sending.',

    // Landing
    'landing.eyebrow': 'Nakama Studio · Animai',
    'landing.hero.title1': 'The animation catalog',
    'landing.hero.title2': 'that makes your landings ',
    'landing.hero.title3': 'breathe',
    'landing.hero.title4': '',
    'landing.hero.sub': '{count} ready-to-use effects—shaders, 3D, scroll, typography, particles, SVG, and microinteractions—with live preview and copyable code. Zero external dependencies.',
    'landing.hero.cta.explore': 'Explore',
    'landing.hero.cta.cats': 'View categories',
    'landing.hero.stats.effects': 'Effects',
    'landing.hero.stats.cats': 'Categories',
    'landing.hero.stats.deps': 'Dependencies',
    
    'landing.about.title': 'A motion tool for real products',
    'landing.about.lead': 'Animai is both our internal Nakama Studio library and a public resource: inspiration and starting code for design and development teams looking to add motion with intent.',
    
    'landing.features.0.h': 'Real Live Preview',
    'landing.features.0.p': 'Each effect is seen actually working, not a gif. Native WebGL, Canvas 2D, and CSS.',
    'landing.features.1.h': 'Prompt + Code',
    'landing.features.1.p': 'A toggle switches between the descriptive prompt and the exact source code producing the effect.',
    'landing.features.2.h': 'Zero Dependencies',
    'landing.features.2.p': 'The previews do not load any library or CDN. Copy, paste, and it works in your landing.',
    'landing.features.3.h': 'Visibility Performance',
    'landing.features.3.p': 'Only visible previews animate (IntersectionObserver). {count} effects without melting the browser.',
    
    'landing.cats.title': 'Explore by Category',
    'landing.cats.lead': 'Each card is a live preview. Enter the gallery for the rest.',
    'landing.cta.title1': 'Ready to ',
    'landing.cta.title2': 'move',
    'landing.cta.title3': '?',
    'landing.cta.btn': 'Open the gallery',
    
    // Gallery
    'gallery.title1': 'Animations that make a ',
    'gallery.title2': 'landing page',
    'gallery.title3': ' breathe',
    'gallery.sub': 'Catalog of web effects: WebGL shaders, scroll, animated typography, particles, SVG, and microinteractions. Each with a live preview and a ready-to-copy prompt. No external dependencies: everything runs on native Canvas/WebGL.',
    'gallery.footer': 'Animai · {count} effects with real preview in WebGL + Canvas + SVG · <code>&lt;/&gt;</code> button to view code · no external dependencies · guiding prompts, adjust to your stack',
    'gallery.empty': 'No results. Try another word or category.',
    
    // SearchBar
    'search.placeholder': 'Search animation',
    'search.label': 'Search effects',
    'search.of': ' of ',
    'search.effects': 'effects',
    
    // EffectCard
    'card.prompt': 'Prompt',
    'card.code': 'Code',
    'card.view_prompt': 'View prompt',
    'card.view_code': 'View code',
    'card.copy': 'Copy',
    'card.copied': '✓ Copied',
    
    // Preview
    'preview.unavailable': 'preview unavailable',
    'preview.reduced_motion': 'Reduced motion · click to play',
    'preview.play_animation': 'Play animation',
    
    // Categories
    'cat.Todos': 'All',
    'cat.Shaders WebGL': 'WebGL Shaders',
    'cat.3D / R3F': '3D / R3F',
    'cat.Postprocesado': 'Postprocessing',
    'cat.Scroll': 'Scroll',
    'cat.Texto': 'Text',
    'cat.Partículas': 'Particles',
    'cat.SVG': 'SVG',
    'cat.Hover & UI': 'Hover & UI',
    'cat.CSS Moderno': 'Modern CSS',
    'cat.Loaders': 'Loaders',
    'cat.Micro-interacciones': 'Micro-interactions',
    'cat.CSS Art': 'CSS Art',
    'cat.UI Components': 'UI Components',
    'cat.Navegación': 'Navigation',
    'cat.Datos / Charts': 'Data / Charts',
    'cat.Creativos': 'Creative',
    
    // Footer global
    'footer.text': 'Animai · Nakama Studio · UX/UI design + AI production',
    
    // Cookie Banner
    'cookie.title': 'Use of cookies',
    'cookie.text': 'We use 100% anonymous cookies to track which animations are used and copied. We do not collect personal data, your IP, or track your browsing.',
    'cookie.accept': 'Accept',
    'cookie.decline': 'Decline'
  },
  zh: {
    // Nav
    'nav.home': '首页',
    'nav.gallery': '效果库',
    'nav.explore': '探索',
    'nav.request': '反馈',

    // Request / Feedback Modal
    'request.button': '反馈',
    'request.title': '告诉我们',
    'request.subtitle': '推荐一个动画、报告 bug，或分享任何想法。',
    'request.type.label': '关于什么？',
    'request.type.animation': '推荐动画',
    'request.type.bug': '报告 bug',
    'request.type.other': '其他',
    'request.message.label': '你的留言',
    'request.message.placeholder': '描述你的建议、你发现的 bug，或你的想法……',
    'request.email.label': '邮箱（可选）',
    'request.email.placeholder': 'you@example.com — 方便我们回复你',
    'request.submit': '发送',
    'request.sending': '发送中…',
    'request.cancel': '取消',
    'request.close': '关闭',
    'request.success.title': '谢谢！',
    'request.success.text': '我们已收到你的留言，会尽快查看。',
    'request.error': '发送失败，请稍后重试。',
    'request.required': '请先填写留言再发送。',

    // Landing
    'landing.eyebrow': 'Nakama Studio · Animai',
    'landing.hero.title1': '让你的落地页',
    'landing.hero.title2': '充满 ',
    'landing.hero.title3': '呼吸感',
    'landing.hero.title4': ' 的动画目录',
    'landing.hero.sub': '{count} 个开箱即用的效果——着色器、3D、滚动、排版、粒子、SVG 和微交互——具有实时预览和可复制的代码。零外部依赖。',
    'landing.hero.cta.explore': '探索',
    'landing.hero.cta.cats': '查看分类',
    'landing.hero.stats.effects': '效果',
    'landing.hero.stats.cats': '分类',
    'landing.hero.stats.deps': '依赖',
    
    'landing.about.title': '用于真实产品的动效工具',
    'landing.about.lead': 'Animai 既是 Nakama Studio 的内部库，也是一个公共资源：为想要有目的地添加动效的设计和开发团队提供灵感和起点代码。',
    
    'landing.features.0.h': '真实的实时预览',
    'landing.features.0.p': '每个效果都是真实运行的，而不是 gif 图。基于原生 WebGL、Canvas 2D 和 CSS。',
    'landing.features.1.h': 'Prompt + 代码',
    'landing.features.1.p': '支持一键切换描述性 prompt 和生成该效果的精确源代码。',
    'landing.features.2.h': '零外部依赖',
    'landing.features.2.p': '预览不加载任何第三方库或 CDN。复制、粘贴，即可在你的落地页中运行。',
    'landing.features.3.h': '按需视口渲染',
    'landing.features.3.p': '仅渲染可见的预览（基于 IntersectionObserver）。在不卡顿浏览器的情况下展示 {count} 个效果。',
    
    'landing.cats.title': '按分类探索',
    'landing.cats.lead': '每个卡片都是一个实时预览。进入效果库查看更多。',
    'landing.cta.title1': '准备好让页面 ',
    'landing.cta.title2': '动起来',
    'landing.cta.title3': ' 了吗？',
    'landing.cta.btn': '打开效果库',
    
    // Gallery
    'gallery.title1': '让落地页充满 ',
    'gallery.title2': '呼吸感',
    'gallery.title3': ' 的动效',
    'gallery.sub': 'Web 动效库：WebGL 着色器、滚动、动画排版、粒子、SVG 和微交互。每个效果均有实时预览 and 可直接复制的 prompt。无外部依赖：全部运行在原生 Canvas/WebGL 上。',
    'gallery.footer': 'Animai · {count} 个具有真实 WebGL + Canvas + SVG 预览的效果 · 点击 <code>&lt;/&gt;</code> 查看代码 · 无外部依赖 · 指导性 prompt，根据你的技术栈进行调整',
    'gallery.empty': '未找到结果。请尝试其他关键字或分类。',
    
    // SearchBar
    'search.placeholder': '搜索动画',
    'search.label': '搜索效果',
    'search.of': ' / ',
    'search.effects': '个效果',
    
    // EffectCard
    'card.prompt': 'Prompt',
    'card.code': '代码',
    'card.view_prompt': '查看 prompt',
    'card.view_code': '查看代码',
    'card.copy': '复制',
    'card.copied': '✓ 已复制',
    
    // Preview
    'preview.unavailable': '预览不可用',
    'preview.reduced_motion': '减弱动态效果 · 点击播放',
    'preview.play_animation': '播放动画',
    
    // Categories
    'cat.Todos': '全部',
    'cat.Shaders WebGL': 'WebGL 着色器',
    'cat.3D / R3F': '3D / R3F',
    'cat.Postprocesado': '后处理',
    'cat.Scroll': '滚动',
    'cat.Texto': '文本',
    'cat.Partículas': '粒子',
    'cat.SVG': 'SVG',
    'cat.Hover & UI': '悬停与 UI',
    'cat.CSS Moderno': '现代 CSS',
    'cat.Loaders': '加载动画',
    'cat.Micro-interacciones': '微交互',
    'cat.CSS Art': 'CSS 艺术',
    'cat.UI Components': 'UI 组件',
    'cat.Navegación': '导航栏',
    'cat.Datos / Charts': '数据与图表',
    'cat.Creativos': '创意特效',
    
    // Footer global
    'footer.text': 'Animai · Nakama Studio · UX/UI 设计 + AI 制作',
    
    // Cookie Banner
    'cookie.title': 'Cookies 使用说明',
    'cookie.text': '我们使用 100% 匿名 Cookies 统计动画的使用和复制情况。我们不记录个人数据、您的 IP，也不追踪您的浏览行为。',
    'cookie.accept': '同意',
    'cookie.decline': '拒绝'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('animai_lang');
    if (saved === 'es' || saved === 'en' || saved === 'zh') return saved;
    // Spanish by default as requested
    return 'es';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('animai_lang', newLang);
    document.documentElement.lang = newLang;
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    let text = translations[lang][key] || translations['es'][key] || key;
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
