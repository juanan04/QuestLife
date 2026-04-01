import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { RotateCcw } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { computeLayout, NODE_W_EXPORT as NODE_W, NODE_H_EXPORT as NODE_H } from './useMindMapLayout';
import { usePanZoom } from './usePanZoom';
import QuestNode from './QuestNode';
import QuestEdge from './QuestEdge';
import QuestEditModal from '../quests/QuestEditModal';

const LS_KEY = 'mindmap-positions';
const DRAG_THRESHOLD = 5;

function loadSavedPositions() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function savePositions(positions) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(positions));
  } catch {}
}

export default function MindMapCanvas() {
  const { data, updateQuest } = useGame();
  const quests = data?.quests || [];

  // Compute default layout
  const defaultPositions = useMemo(() => computeLayout(quests), [quests.length]);

  // Positions state: default + saved overrides
  const [positions, setPositions] = useState(() => {
    const saved = loadSavedPositions();
    return { ...defaultPositions, ...saved };
  });

  // When quests change (e.g. new quest added), add missing positions
  useEffect(() => {
    setPositions(prev => {
      const saved = loadSavedPositions();
      const merged = { ...defaultPositions, ...saved };
      // Keep any existing overrides, add new quests from default
      const next = { ...merged };
      for (const id of Object.keys(defaultPositions)) {
        if (!next[id]) next[id] = defaultPositions[id];
      }
      return next;
    });
  }, [defaultPositions]);

  // Pan / zoom
  const { offset, scale, isPanningRef, panHandlers, startPan, onWheel } = usePanZoom({ x: 120, y: 0 });

  // Selected quest for modal
  const [selectedQuest, setSelectedQuest] = useState(null);

  // Drag state
  const dragState = useRef(null); // { questId, startClient: {x,y}, startPos: {x,y}, moved: bool }

  // Build edges list: for each quest, for each prerequisite, create an edge
  const edges = useMemo(() => {
    const result = [];
    for (const q of quests) {
      for (const prereqId of (q.prerequisites || [])) {
        result.push({ parentId: prereqId, childId: q.id, childStatus: q.status });
      }
    }
    return result;
  }, [quests]);

  const handleCanvasPointerDown = useCallback((e) => {
    // Check if pointer is on a node
    const nodeEl = e.target.closest('[data-quest-id]');
    if (nodeEl) return; // Node handles its own drag
    // Start panning
    startPan(e);
    isPanningRef.current = true;
    e.currentTarget.classList.add('is-panning');
  }, [startPan, isPanningRef]);

  const handleCanvasPointerUp = useCallback((e) => {
    e.currentTarget.classList.remove('is-panning');
    panHandlers.onPointerUp();
  }, [panHandlers]);

  const handleNodePointerDown = useCallback((quest, e) => {
    e.stopPropagation();
    dragState.current = {
      questId: quest.id,
      startClient: { x: e.clientX, y: e.clientY },
      startPos: { ...positions[quest.id] },
      moved: false,
    };
    // Capture on the SVG root so we get move/up everywhere
    const svg = e.currentTarget.closest('svg');
    if (svg) svg.setPointerCapture(e.pointerId);
  }, [positions]);

  const handleSvgPointerMove = useCallback((e) => {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startClient.x;
    const dy = e.clientY - dragState.current.startClient.y;
    if (!dragState.current.moved && Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
      dragState.current.moved = true;
    }
    if (dragState.current.moved) {
      const { questId, startPos } = dragState.current;
      setPositions(prev => ({
        ...prev,
        [questId]: {
          x: startPos.x + dx / scale,
          y: startPos.y + dy / scale,
        },
      }));
    }
  }, [scale]);

  const handleSvgPointerUp = useCallback((e) => {
    if (!dragState.current) return;
    const { questId, moved } = dragState.current;
    dragState.current = null;

    if (!moved) {
      // Treat as click: open modal
      const quest = quests.find(q => q.id === questId);
      if (quest) setSelectedQuest(quest);
    } else {
      // Persist new positions
      setPositions(prev => {
        savePositions(prev);
        return prev;
      });
    }
  }, [quests]);

  const handleResetLayout = useCallback(() => {
    localStorage.removeItem(LS_KEY);
    setPositions(defaultPositions);
  }, [defaultPositions]);

  const handleSaveQuest = useCallback((form) => {
    if (selectedQuest) {
      updateQuest(selectedQuest.id, form);
    }
    setSelectedQuest(null);
  }, [selectedQuest, updateQuest]);

  const containerRef = useRef(null);

  // Register wheel as non-passive so we can preventDefault (prevent page scroll)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  return (
    <>
    <div
      ref={containerRef}
      className="mindmap-container"
      onPointerDown={handleCanvasPointerDown}
      onPointerUp={handleCanvasPointerUp}
      onPointerMove={panHandlers.onPointerMove}
      onPointerLeave={panHandlers.onPointerLeave}
      onPointerCancel={handleCanvasPointerUp}
    >
      <svg
        width="100%"
        height="100%"
        onPointerMove={handleSvgPointerMove}
        onPointerUp={handleSvgPointerUp}
        style={{ display: 'block' }}
      >
        <defs>
          {/* Arrowhead marker */}
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="rgba(100,116,139,0.5)" />
          </marker>

          {/* Blueprint grid pattern */}
          <pattern id="grid-minor" width="20" height="20" patternUnits="userSpaceOnUse"
            patternTransform={`translate(${offset.x % 20} ${offset.y % 20}) scale(${scale})`}
          >
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(124,58,237,0.05)" strokeWidth="0.5" />
          </pattern>
          <pattern id="grid-major" width="100" height="100" patternUnits="userSpaceOnUse"
            patternTransform={`translate(${offset.x % 100} ${offset.y % 100}) scale(${scale})`}
          >
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(124,58,237,0.12)" strokeWidth="0.75" />
          </pattern>
        </defs>

        {/* Background grid layers */}
        <rect width="100%" height="100%" fill="url(#grid-minor)" />
        <rect width="100%" height="100%" fill="url(#grid-major)" />

        {/* All content (edges + nodes) in transform group */}
        <g transform={`translate(${offset.x},${offset.y}) scale(${scale})`}>
          {/* Edges (rendered below nodes) */}
          {edges.map(({ parentId, childId, childStatus }) => (
            <QuestEdge
              key={`${parentId}-${childId}`}
              parentPos={positions[parentId]}
              childPos={positions[childId]}
              childStatus={childStatus}
            />
          ))}

          {/* Nodes */}
          {quests.map(q => (
            <QuestNode
              key={q.id}
              quest={q}
              x={positions[q.id]?.x ?? 0}
              y={positions[q.id]?.y ?? 0}
              onPointerDown={(e) => handleNodePointerDown(q, e)}
              onClick={() => {}} // handled in pointerUp
            />
          ))}
        </g>
      </svg>

      {/* Reset layout button */}
      <button
        onClick={handleResetLayout}
        className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
        style={{
          backgroundColor: 'rgba(18,18,26,0.9)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#64748b',
          backdropFilter: 'blur(8px)',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
        onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
      >
        <RotateCcw size={12} />
        Resetear layout
      </button>

    </div>

      {/* Quest detail modal — rendered via portal outside canvas to avoid event conflicts */}
      {selectedQuest && createPortal(
        <QuestEditModal
          quest={selectedQuest}
          onClose={() => setSelectedQuest(null)}
          onSave={handleSaveQuest}
        />,
        document.body
      )}
    </>
  );
}
