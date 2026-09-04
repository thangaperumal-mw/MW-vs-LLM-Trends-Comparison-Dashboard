/**
 * MW Trend Analysis — live dashboard Web App.
 *
 * Deploy this as a Web App (Deploy > New deployment > Web app).
 * Set "Execute as: Me" so the script reads the sheet with YOUR access,
 * regardless of who opens the dashboard URL. That's what lets this work
 * even though the sheet itself isn't publicly link-shared.
 *
 * Every request to the web app URL re-reads the sheet from scratch and
 * builds a fresh page — there is no cache, so there is nothing to refresh.
 */

var CATEGORIES = [
  "arts_and_entertainment", "autos_and_vehicles", "beauty_and_fitness", "books_and_literature",
  "business_and_industrial", "computers_and_electronics", "finance", "food_and_drink", "games",
  "health", "hobbies_and_leisure", "home_and_garden", "internet_and_telecom", "jobs_and_education",
  "law_and_government", "news", "online_communities", "people_and_society", "pets_and_animals",
  "real_estate", "reference", "science", "shopping", "sports", "travel"
];

var COLS = [
  "location", "channel", "rank", "date_time", "mw_trend", "mw_entity_type", "mw_emerging_fading",
  "llm_trend", "llm_entity_type", "mentions_engagement", "source_names", "mw_rank_of_llm_trend",
  "llm_platform", "coverage", "cross_platform", "lead_lag", "confidence", "notes", "hitl_assignee"
];

var SEGMENTS_PER_CATEGORY = 340;
var DATA_START_ROW = 6; // row 5 is the header, data runs rows 6-345

function doGet(e) {
  var data = buildDashboardData();

  var tmpl = HtmlService.createTemplateFromFile('Index');
  tmpl.dataJson = JSON.stringify(data);
  tmpl.dashboardJs = HtmlService.createHtmlOutputFromFile('DashboardJs').getContent();
  tmpl.chartJsLib = HtmlService.createHtmlOutputFromFile('ChartJsLib').getContent();

  return tmpl.evaluate()
    .setTitle('MW Trend Analysis — Meltwater vs LLM Coverage')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    // ALLOWALL lets this be embedded in an iframe (e.g. a Confluence page) if useful later.
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function buildDashboardData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var segments = [];
  var counts = {};

  CATEGORIES.forEach(function (cat) {
    var sheet = ss.getSheetByName(cat);
    if (!sheet) {
      counts[cat] = 0;
      return;
    }
    var range = sheet.getRange(DATA_START_ROW, 1, SEGMENTS_PER_CATEGORY, COLS.length);
    var values = range.getValues();
    var n = 0;

    values.forEach(function (row) {
      var mw = row[4];
      var llm = row[7];
      var mwEmpty = (mw === '' || mw === null || mw === undefined);
      var llmEmpty = (llm === '' || llm === null || llm === undefined);
      if (mwEmpty && llmEmpty) return;

      var rec = { category: cat };
      COLS.forEach(function (key, idx) {
        var v = row[idx];
        if (Object.prototype.toString.call(v) === '[object Date]') {
          v = Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
        }
        if (v === '') v = null;
        rec[key] = v;
      });
      segments.push(rec);
      n++;
    });

    counts[cat] = n;
  });

  return {
    sheetId: ss.getId(),
    categories: CATEGORIES,
    segmentsPerCategory: SEGMENTS_PER_CATEGORY,
    segments: segments,
    snapshotTime: new Date().toISOString(),
    categoryCounts: counts
  };
}
