import { defineConfig, devices } from '@playwright/test'

/**
 * ⚠️ The test server runs with the Supabase env vars BLANKED.
 *
 * That drops the app into demo mode: synthetic fixtures and the ?as= role
 * switcher, so a browser can walk every role without a magic-link inbox. It
 * also means no test can ever touch the real project — which matters, because
 * that project now holds a live schema and will hold client data.
 *
 * ⛔ Not a workaround. Testing against live data would make the suite depend on
 * rows somebody could delete, and a test that fails because a client was
 * archived teaches nothing.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:3100', trace: 'off' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    // Clients are on phones. Staff are at desks. Both get tested.
    // ⚠️ Chromium at iPhone dimensions, not devices['iPhone 13'] — that one
    // needs WebKit. This checks LAYOUT, which is what breaks; it does not
    // catch Safari-specific rendering. Worth knowing before trusting it.
    { name: 'mobile', use: { ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 }, isMobile: false, hasTouch: true } },
    // 🔴 DARK MODE HAD NO TEST UNTIL 24 AUG 2026, and it is where the worst
    // visual defect of this build happened: `--navy` inverted in dark mode, so
    // the login hero rendered white-on-white — invisible heading and an
    // INVISIBLE SUBMIT BUTTON on the first screen a client ever sees. It was
    // fixed by eye and nothing stopped it coming back. Roughly half of phones
    // default to dark, so this is not a niche path. (D-390)
    { name: 'dark', use: { ...devices['Desktop Chrome'], colorScheme: 'dark' } },
  ],
  webServer: {
    command: 'next dev -p 3100',
    url: 'http://127.0.0.1:3100/dashboard',
    reuseExistingServer: false,
    timeout: 120_000,
    env: { NEXT_PUBLIC_SUPABASE_URL: '', NEXT_PUBLIC_SUPABASE_ANON_KEY: '' },
  },
})
