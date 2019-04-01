export const formatCents = (c, to = 2) =>
  c < 100 ? `${c}¢` : `$${(c / 100).toFixed(to)}`
