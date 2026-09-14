// Heartify design tokens — pink, dark-mode-first, Spotify-like layout
export const colors = {
  background: '#120014',      // near-black plum backdrop
  surface: '#1F0421',         // cards, sheets
  surfaceAlt: '#2B0630',      // rows, chips
  primary: '#E6007A',         // Heartify hot pink (brand)
  primarySoft: '#FF6FB5',     // gradients, highlights
  accent: '#FFD1E8',          // light pink for subtle accents
  text: '#FFFFFF',
  textMuted: '#C79BC9',
  textFaint: '#8A6B8C',
  success: '#3DDC97',
  danger: '#FF5470',
  border: 'rgba(255,255,255,0.08)',
  gradient: ['#E6007A', '#7A0BC0'],
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export const radius = { sm: 8, md: 14, lg: 22, pill: 999 };

export const typography = {
  h1: { fontSize: 28, fontWeight: '800', color: colors.text },
  h2: { fontSize: 20, fontWeight: '700', color: colors.text },
  body: { fontSize: 15, fontWeight: '400', color: colors.text },
  caption: { fontSize: 12, fontWeight: '500', color: colors.textMuted },
};
