import { NODE_W_EXPORT as NODE_W, NODE_H_EXPORT as NODE_H } from './useMindMapLayout';

const STATUS_STYLES = {
  completed: { stroke: 'rgba(245, 158, 11, 0.45)', strokeWidth: 1.5, strokeDasharray: 'none' },
  in_progress: { stroke: 'rgba(124, 58, 237, 0.6)', strokeWidth: 1.5, strokeDasharray: 'none' },
  locked: { stroke: 'rgba(71, 85, 105, 0.4)', strokeWidth: 1, strokeDasharray: '5 4' },
};

export default function QuestEdge({ parentPos, childPos, childStatus }) {
  if (!parentPos || !childPos) return null;

  // Connect right-center of parent to left-center of child
  const x1 = parentPos.x + NODE_W;
  const y1 = parentPos.y + NODE_H / 2;
  const x2 = childPos.x;
  const y2 = childPos.y + NODE_H / 2;

  const cpOffset = Math.abs(x2 - x1) * 0.45;
  const d = `M ${x1} ${y1} C ${x1 + cpOffset} ${y1}, ${x2 - cpOffset} ${y2}, ${x2} ${y2}`;

  const style = STATUS_STYLES[childStatus] || STATUS_STYLES.locked;

  return (
    <path
      d={d}
      fill="none"
      stroke={style.stroke}
      strokeWidth={style.strokeWidth}
      strokeDasharray={style.strokeDasharray === 'none' ? undefined : style.strokeDasharray}
      markerEnd="url(#arrowhead)"
    />
  );
}
