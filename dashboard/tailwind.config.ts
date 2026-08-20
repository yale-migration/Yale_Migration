import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper:'var(--paper)', card:'var(--card)', 'card-sunk':'var(--card-sunk)',
        ink:'var(--ink)', 'ink-2':'var(--ink-2)', 'ink-3':'var(--ink-3)',
        rule:'var(--rule)', 'rule-strong':'var(--rule-strong)',
        accent:'var(--accent)', 'accent-soft':'var(--accent-soft)',
        good:'var(--good)', warn:'var(--warn)', crit:'var(--crit)',
        'good-soft':'var(--good-soft)', 'warn-soft':'var(--warn-soft)', 'crit-soft':'var(--crit-soft)',
      },
      borderRadius: { DEFAULT:'var(--r)', card:'var(--r)' },
      boxShadow: { card:'var(--shadow)' },
      fontFamily: { serif:['var(--serif)'] },
    },
  },
  plugins: [],
} satisfies Config
