const AVATAR_GRADIENTS = [
  ['#ea580c', '#f97316'], // orange
  ['#2563eb', '#3b82f6'], // blue
  ['#059669', '#10b981'], // green
  ['#7c3aed', '#a855f7'], // purple
  ['#dc2626', '#ef4444'], // red
  ['#0891b2', '#06b6d4'], // cyan
  ['#ca8a04', '#eab308'], // gold
  ['#db2777', '#ec4899'], // pink
];

// "Tasty Bites" -> "TB", "Saurabh" -> "SA", "" -> "?"
export const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Same name always maps to the same gradient, different names usually differ.
export const getAvatarGradient = (name = '') => {
  const seed = name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const [from, to] = AVATAR_GRADIENTS[seed % AVATAR_GRADIENTS.length];
  return `linear-gradient(135deg, ${from}, ${to})`;
};
