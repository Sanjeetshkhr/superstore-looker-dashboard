function onOpen() {
    SpreadsheetAp.getUi()
        .createMenu('Dashboard Tools')
        .addItem('Build Report Data', 'buildReportData')
        .addToUi();
}
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Superstore Dashboard App');
}