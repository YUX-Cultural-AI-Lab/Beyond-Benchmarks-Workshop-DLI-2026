const SHEET_NAME = "Kitala_workshop_registrations";

const HEADERS = [
  "submittedAt",
  "fullName",
  "email",
  "affiliation",
  "role",
  "primaryLanguages",
  "otherLanguages",
  "aiEvaluationExperience",
  "areasOfInterest",
  "expectations",
];

function doPost(event) {
  const sheet = getRegistrationSheet();
  const payload = event.parameter || {};

  const row = HEADERS.map((header) => {
    if (header === "submittedAt") return new Date().toISOString();
    return payload[header] || "";
  });

  sheet.appendRow(row);

  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
    ContentService.MimeType.JSON
  );
}

function getRegistrationSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  return sheet;
}
