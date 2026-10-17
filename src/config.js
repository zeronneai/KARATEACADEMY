// URL of the Google Apps Script web app (see apps-script/README.md).
// Set it in Vercel as an Environment Variable: VITE_SHEETS_ENDPOINT
// Without it, the form runs in demo mode and events use src/data/events.js.
export const SHEETS_ENDPOINT = import.meta.env.VITE_SHEETS_ENDPOINT || '';
