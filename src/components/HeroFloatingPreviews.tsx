import { useState, useEffect, useRef } from 'react';
import Preview from './Preview';
import { ITEMS } from '../effects';
import type { Effect } from '../effects/types';

export default function HeroFloatingPreviews() {
  // Number of previews to mount: 9 on desktop, a reduced set on mobile/tablet
  // (mobile shows the first 4 cards — two above and two below the hero text).
  const [cardCount, setCardCount] = useState(0);
  const [cardEffects, setCardEffects] = useState<Effect[]>([]);

  // Pick how many canvas previews to mount based on the viewport width
  useEffect(() => {
    const checkSize = () => {
      setCardCount(window.innerWidth > 768 ? 9 : 4);
    };
    checkSize();
    window.addEventListener('resize', checkSize, { passive: true });
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // Initialize random distinct effects from ITEMS whenever the count changes
  useEffect(() => {
    if (cardCount === 0) return;
    const shuffled = [...ITEMS].sort(() => 0.5 - Math.random());
    setCardEffects(shuffled.slice(0, cardCount));
  }, [cardCount]);

  // Method to replace a clicked card with a new random unused effect
  const changeEffect = (index: number) => {
    // Collect all displayed effect IDs to prevent duplicates
    const usedIds = new Set(cardEffects.map(e => e.id));
    // Find visual effects that are not currently displayed
    const unused = ITEMS.filter(item => !usedIds.has(item.id));
    if (unused.length === 0) return;

    // Pick a random unused effect
    const newEffect = unused[Math.floor(Math.random() * unused.length)];

    // Update state to mount the new preview
    setCardEffects(prev => {
      const next = [...prev];
      next[index] = newEffect;
      return next;
    });
  };

  const cardsConfig = [
    { speedScroll: -0.24, speedMouse: 16, size: 'large', class: 'p1' },
    { speedScroll: 0.16, speedMouse: -26, size: 'medium', class: 'p2' },
    { speedScroll: -0.08, speedMouse: 34, size: 'small', class: 'p3' },
    { speedScroll: 0.28, speedMouse: -14, size: 'medium', class: 'p4' },
    { speedScroll: -0.05, speedMouse: 22, size: 'small', class: 'p5' },
    { speedScroll: 0.22, speedMouse: -20, size: 'large', class: 'p6' },
    { speedScroll: -0.14, speedMouse: 18, size: 'medium', class: 'p7' },
    { speedScroll: 0.10, speedMouse: -30, size: 'small', class: 'p8' },
    { speedScroll: -0.18, speedMouse: 20, size: 'medium', class: 'p9' }
  ];

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const lerpMouse = useRef({ x: 0, y: 0 });

  // Add random initial coordinate jitters to positions (±20px)
  const randomOffsets = useRef<{ x: number; y: number }[]>(
    Array(9).fill(null).map(() => ({
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 40
    }))
  );

  // Draggable offsets
  const dragOffsets = useRef<{ x: number; y: number }[]>(
    Array(9).fill(null).map(() => ({ x: 0, y: 0 }))
  );
  const activeDragIndex = useRef<number | null>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const currentDragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (cardEffects.length === 0) return;

    // Track mouse coordinates normalized between [-0.5, 0.5]
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) - 0.5;
      const ny = (e.clientY / window.innerHeight) - 0.5;
      mouse.current = { x: nx, y: ny };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Smooth animation loop using lerp for mouse and scroll position
    let rafId: number;
    const update = () => {
      lerpMouse.current.x += (mouse.current.x - lerpMouse.current.x) * 0.08;
      lerpMouse.current.y += (mouse.current.y - lerpMouse.current.y) * 0.08;

      const scrollY = window.scrollY;

      cardRefs.current.forEach((el, index) => {
        if (!el) return;
        const config = cardsConfig[index];

        const scrollOffset = scrollY * config.speedScroll;
        const mouseOffsetX = lerpMouse.current.x * config.speedMouse;
        const mouseOffsetY = lerpMouse.current.y * config.speedMouse;

        // Apply drag offsets from pointer interactions
        const dragX = dragOffsets.current[index]?.x || 0;
        const dragY = dragOffsets.current[index]?.y || 0;

        // Apply randomized initial coordinate jitters
        const rx = randomOffsets.current[index]?.x || 0;
        const ry = randomOffsets.current[index]?.y || 0;

        // Apply hardware-accelerated 3D translations combined with drag and random offsets
        el.style.transform = `translate3d(${mouseOffsetX + dragX + rx}px, ${scrollOffset + mouseOffsetY + dragY + ry}px, 0)`;
      });

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [cardEffects]);

  // Pointer dragging event handlers
  const handlePointerDown = (index: number, e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only left click / main tap
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    el.classList.add('dragging');

    activeDragIndex.current = index;
    dragStart.current = { x: e.clientX, y: e.clientY };
    currentDragOffset.current = { ...dragOffsets.current[index] };

    e.stopPropagation();
  };

  const handlePointerMove = (index: number, e: React.PointerEvent<HTMLDivElement>) => {
    if (activeDragIndex.current !== index) return;

    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    dragOffsets.current[index] = {
      x: currentDragOffset.current.x + dx,
      y: currentDragOffset.current.y + dy
    };
  };

  const handlePointerUp = (index: number, e: React.PointerEvent<HTMLDivElement>) => {
    if (activeDragIndex.current !== index) return;
    const el = e.currentTarget;
    try {
      el.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    el.classList.remove('dragging');
    activeDragIndex.current = null;

    // Click detection: if moved less than 5px, it's a tap/click -> change preview!
    const distance = Math.hypot(e.clientX - dragStart.current.x, e.clientY - dragStart.current.y);
    if (distance < 5) {
      changeEffect(index);
    }
  };

  if (cardEffects.length === 0) return null;

  return (
    <div className="hero-floating-previews" aria-hidden="true">
      {cardsConfig.slice(0, cardCount).map((card, i) => {
        const effect = cardEffects[i];
        if (!effect) return null;

        return (
          <div
            key={effect.id}
            ref={el => { cardRefs.current[i] = el; }}
            className={`floating-card size-${card.size} ${card.class}`}
            onPointerDown={e => handlePointerDown(i, e)}
            onPointerMove={e => handlePointerMove(i, e)}
            onPointerUp={e => handlePointerUp(i, e)}
            onPointerCancel={e => handlePointerUp(i, e)}
          >
            <div className="card-inner">
              <Preview effect={effect} badge={false} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
