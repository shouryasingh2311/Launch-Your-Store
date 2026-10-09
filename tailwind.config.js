/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Storecraft platform palette ─────────────────────
        brand: {
          DEFAULT:  '#064E3B',   // Emerald Ink
          hover:    '#0A6048',
          light:    '#D1FAE5',
          muted:    '#4B5F57',
        },
        champagne: {
          DEFAULT:  '#F8E7C9',
          card:     '#FFF9EC',
          border:   '#E8D5AE',
        },
        // ── Storefront CSS-variable tokens (don't use directly in platform UI) ──
        store: {
          bg:               'var(--store-bg, #ffffff)',
          surface:          'var(--store-surface, #ffffff)',
          text:             'var(--store-text, #0f172a)',
          muted:            'var(--store-muted, #64748b)',
          border:           'var(--store-border, #e2e8f0)',
          primary:          'var(--store-primary, #064E3B)',
          'primary-contrast':'var(--store-primary-contrast, #F8E7C9)',
          heading:          'var(--store-heading, var(--store-text))',
          link:             'var(--store-link, var(--store-primary))',
          'header-bg':      'var(--store-header-bg, var(--store-surface))',
          'footer-bg':      'var(--store-footer-bg, var(--store-surface))',
        },
      },
      fontFamily: {
        sans:     ['Inter', 'sans-serif'],
        poppins:  ['Poppins', 'sans-serif'],
        inter:    ['Inter', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
        lato:     ['Lato', 'sans-serif'],
        space:    ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        clay: '20px',
      },
      boxShadow: {
        'clay':    '0 2px 0 0 #E8D5AE, 0 8px 32px -4px rgba(6,78,59,0.08), inset 0 1px 0 rgba(255,255,255,0.65)',
        'clay-btn':'0 3px 0 0 #0A6048, 0 6px 16px -2px rgba(6,78,59,0.20)',
        'soft':    '0 2px 10px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)',
        'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
