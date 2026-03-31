import Badge from './Badge';
import { getCategoryColor, getCategoryLabel } from '../../utils/questHelpers';

export default function CategoryBadge({ category, className = '' }) {
  const color = getCategoryColor(category);
  const label = getCategoryLabel(category);
  return (
    <Badge color={color} className={className}>
      {label}
    </Badge>
  );
}
