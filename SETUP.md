# MW Trend Analysis — Live Dashboard (Apps Script Web App)

Recomputes the dashboard directly from the sheet on every single page load.
No cache, no refresh interval, nothing to go stale — and no service account needed,
because the script runs with **your** access to the sheet regardless of who's viewing.

## Setup (~5 minutes)

1. Open the Google Sheet → **Extensions → Apps Script.**
   (You'll need Editor access to the sheet to do this — if you only have Viewer/Commenter
   access, ask a.makdum@meltwater.com to either add this script or grant you Editor first.)

2. In the Apps Script editor, you'll see a default `Code.gs`. Replace its entire contents
   with this repo's `Code.gs`.

3. Add three new HTML files (the `+` next to "Files" → HTML):
   - `Index` → paste `Index.html`'s contents
   - `DashboardJs` → paste `DashboardJs.html`'s contents
   - `ChartJsLib` → paste `ChartJsLib.html`'s contents (this one's a big minified file —
     that's expected, it's the whole charting library so the page never needs an
     internet connection to a CDN)

4. **Deploy → New deployment → gear icon → Web app.**
   - **Execute as:** Me (this is the important one — it's what lets the script read
     the sheet using your access, not the viewer's)
   - **Who has access:** try **Anyone** first. If your Workspace blocks that option or it
     doesn't load for others, fall back to **Anyone within meltwater.com** — that still
     works for an internal stakeholder audience, it just requires viewers to be logged
     into a meltwater.com Google account.
   - Click **Deploy**, authorize the permissions it asks for (it's your own script reading
     your own sheet — reading data only).

5. Copy the **Web app URL** it gives you. That's your live dashboard link — bookmark it,
   share it with stakeholders, embed it wherever's useful. Every time anyone opens it,
   it re-reads the sheet fresh.

## If "Anyone" access is greyed out or blocked

That would mean your Workspace admin restricts Web App visibility the same way they
restrict Drive link-sharing (a plausible next wall, given what we've already run into).
If that happens, "Anyone within meltwater.com" is the safe fallback and needs no admin
change — just confirm your stakeholders are all on `@meltwater.com` Google accounts.

## Updating it later

Any time the dashboard's design needs to change (new page, new chart, styling), just
paste updated file contents back into the same three Apps Script files and re-deploy
(**Deploy → Manage deployments → edit → New version**). The web app URL stays the same.

## Notes

- The **Refresh now** button just reloads the page — since there's no cache to invalidate,
  a plain reload already gets you the current sheet state.
- Per team policy, this is still an AI-assisted analysis — sanity-check figures before
  quoting them in a stakeholder meeting or CRM note.
