const NODE_W = 180;
const NODE_H = 80;
const H_GAP = 100;
const V_GAP = 28;

/**
 * Computes (x, y) pixel positions for each quest node using a
 * left-to-right hierarchical layout based on prerequisites/unlocks.
 *
 * @param {Array} quests
 * @returns {{ [questId]: { x: number, y: number } }}
 */
export function computeLayout(quests) {
  if (!quests || quests.length === 0) return {};

  // --- Pass 1: assign depth via BFS from roots ---
  const depthMap = {}; // questId → depth

  // Roots have no prerequisites
  const queue = [];
  for (const q of quests) {
    if (!q.prerequisites || q.prerequisites.length === 0) {
      depthMap[q.id] = 0;
      queue.push(q.id);
    }
  }

  // Build children map from unlocks
  const childrenOf = {};
  for (const q of quests) {
    childrenOf[q.id] = q.unlocks || [];
  }

  // BFS
  let head = 0;
  while (head < queue.length) {
    const current = queue[head++];
    const currentDepth = depthMap[current];
    for (const childId of (childrenOf[current] || [])) {
      const existingDepth = depthMap[childId] ?? -1;
      if (currentDepth + 1 > existingDepth) {
        depthMap[childId] = currentDepth + 1;
        queue.push(childId);
      }
    }
  }

  // Any quest not reached (e.g. orphan or missing link) gets depth 0
  for (const q of quests) {
    if (depthMap[q.id] === undefined) {
      depthMap[q.id] = 0;
    }
  }

  // --- Pass 2: group by depth, sort within column by parent Y-order ---
  const byDepth = {}; // depth → [questId]
  for (const q of quests) {
    const d = depthMap[q.id];
    if (!byDepth[d]) byDepth[d] = [];
    byDepth[d].push(q.id);
  }

  // Build parent index: questId → [parentId]
  const parentsOf = {};
  for (const q of quests) {
    parentsOf[q.id] = q.prerequisites || [];
  }

  // Sort each column by average column-index of parents (to reduce edge crossings)
  const colIndexMap = {}; // questId → column index within depth

  const depths = Object.keys(byDepth).map(Number).sort((a, b) => a - b);
  for (const d of depths) {
    const col = byDepth[d];

    if (d === 0) {
      // Roots: keep original order
      col.forEach((id, i) => { colIndexMap[id] = i; });
    } else {
      // Sort by average parent column index
      col.sort((a, b) => {
        const avgA = avgParentColIndex(a, parentsOf, colIndexMap);
        const avgB = avgParentColIndex(b, parentsOf, colIndexMap);
        return avgA - avgB;
      });
      col.forEach((id, i) => { colIndexMap[id] = i; });
    }
  }

  // --- Pass 3: compute pixel coordinates ---
  const positions = {};
  for (const q of quests) {
    const d = depthMap[q.id];
    const col = byDepth[d];
    const colIdx = colIndexMap[q.id];
    const totalInCol = col.length;

    const x = d * (NODE_W + H_GAP);
    // Center the column vertically
    const totalH = totalInCol * NODE_H + (totalInCol - 1) * V_GAP;
    const startY = -totalH / 2;
    const y = startY + colIdx * (NODE_H + V_GAP);

    positions[q.id] = { x, y };
  }

  return positions;
}

function avgParentColIndex(questId, parentsOf, colIndexMap) {
  const parents = parentsOf[questId] || [];
  if (parents.length === 0) return 0;
  const known = parents.filter(p => colIndexMap[p] !== undefined);
  if (known.length === 0) return 0;
  return known.reduce((sum, p) => sum + colIndexMap[p], 0) / known.length;
}

export const NODE_W_EXPORT = NODE_W;
export const NODE_H_EXPORT = NODE_H;
