import { Lock, Swords, CheckCircle2, GripVertical } from 'lucide-react';
import { getCategoryColor, getCategoryLabel } from '../../utils/questHelpers';
import { NODE_W_EXPORT as NODE_W, NODE_H_EXPORT as NODE_H } from './useMindMapLayout';

const STATUS_BORDER = {
  locked: '#475569',
  in_progress: '#7c3aed',
  completed: '#f59e0b',
};

const STATUS_ICON = {
  locked: Lock,
  in_progress: Swords,
  completed: CheckCircle2,
};

const STATUS_ICON_COLOR = {
  locked: '#475569',
  in_progress: '#a78bfa',
  completed: '#f59e0b',
};

export default function QuestNode({ quest, x, y, onPointerDown, onClick }) {
  const borderColor = STATUS_BORDER[quest.status] || '#475569';
  const IconComp = STATUS_ICON[quest.status] || Lock;
  const iconColor = STATUS_ICON_COLOR[quest.status] || '#475569';
  const categoryColor = getCategoryColor(quest.category);
  const categoryLabel = getCategoryLabel(quest.category);
  const isActive = quest.status === 'in_progress';
  const isLocked = quest.status === 'locked';

  return (
    <foreignObject
      x={x}
      y={y}
      width={NODE_W}
      height={NODE_H}
      data-quest-id={quest.id}
      style={{ overflow: 'visible' }}
    >
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        className={`mindmap-node-inner ${isActive ? 'quest-active-glow' : ''}`}
        data-quest-id={quest.id}
        onPointerDown={onPointerDown}
        onClick={onClick}
        style={{
          width: NODE_W,
          height: NODE_H,
          backgroundColor: '#12121a',
          borderRadius: 10,
          border: `1px solid rgba(255,255,255,0.07)`,
          borderLeft: `3px solid ${borderColor}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '8px 10px 8px 10px',
          cursor: 'pointer',
          opacity: isLocked ? 0.65 : 1,
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top row: icon + title + grip */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <IconComp size={13} style={{ color: iconColor, flexShrink: 0, marginTop: 2 }} />
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: '#e2e8f0',
              lineHeight: 1.3,
              flex: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {quest.title}
          </span>
          <GripVertical
            size={12}
            style={{ color: '#334155', flexShrink: 0, marginTop: 1, cursor: 'grab' }}
          />
        </div>

        {/* Bottom row: category badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: categoryColor,
              backgroundColor: `${categoryColor}18`,
              border: `1px solid ${categoryColor}40`,
              borderRadius: 4,
              padding: '1px 5px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {categoryLabel}
          </span>
          <span style={{ fontSize: 9, color: '#475569', marginLeft: 'auto' }}>
            {quest.xpReward} XP
          </span>
        </div>
      </div>
    </foreignObject>
  );
}
