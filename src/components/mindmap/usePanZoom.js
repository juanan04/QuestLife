import { useState, useCallback, useRef } from 'react';

const SCALE_MIN = 0.2;
const SCALE_MAX = 2.5;

export function usePanZoom(initialOffset = { x: 80, y: 0 }) {
  const [offset, setOffset] = useState(initialOffset);
  const [scale, setScale] = useState(0.9);
  const isPanning = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });

  const onPointerDown = useCallback((e) => {
    // Only start pan on the background (canvas), not on nodes
    // Caller is responsible for checking target before calling this
    isPanning.current = true;
    lastPoint.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastPoint.current.x;
    const dy = e.clientY - lastPoint.current.y;
    lastPoint.current = { x: e.clientX, y: e.clientY };
    setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const onPointerUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  const onWheel = useCallback((e) => {
    e.preventDefault();
    // Use e.currentTarget if available (React synthetic), else e.target (native listener)
    const el = e.currentTarget || e.target;
    const rect = el.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setScale(prevScale => {
      const factor = e.deltaY < 0 ? 1.08 : 0.93;
      const newScale = Math.min(SCALE_MAX, Math.max(SCALE_MIN, prevScale * factor));
      const scaleRatio = newScale / prevScale;
      setOffset(prev => ({
        x: mouseX - scaleRatio * (mouseX - prev.x),
        y: mouseY - scaleRatio * (mouseY - prev.y),
      }));
      return newScale;
    });
  }, []);

  return {
    offset,
    scale,
    isPanningRef: isPanning,
    panHandlers: {
      onPointerMove,
      onPointerUp,
      onPointerLeave: onPointerUp,
    },
    startPan: onPointerDown,
    onWheel,
  };
}
