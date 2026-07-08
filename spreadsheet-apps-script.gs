const SHEET_NAME = "Kitala_workshop_registrations";

const HEADERS = [
  "submittedAt",
  "fullName",
  "email",
  "affiliation",
  "role",
  "primaryLanguages",
  "otherLanguages",
  "countryOfOrigin",
  "currentResidence",
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

  return ContentService.createTextOutput(
    JSON.stringify({ ok: true }),
  ).setMimeType(ContentService.MimeType.JSON);
}

function getRegistrationSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  } else {
    syncHeaderRow(sheet);
  }

  return sheet;
}

function syncHeaderRow(sheet) {
  HEADERS.forEach((header, index) => {
    const column = index + 1;
    const currentHeader = sheet.getRange(1, column).getValue();

    if (currentHeader === header) return;

    const lastColumn = Math.max(sheet.getLastColumn(), column);
    const headerRow = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];

    if (headerRow.includes(header)) return;

    sheet.insertColumnBefore(column);
    sheet.getRange(1, column).setValue(header);
  });
}
