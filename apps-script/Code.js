function onOpen() {
    SpreadsheetAp.getUi()
        .createMenu('Dashboard Tools')
        .addItem('Build Report Data', 'buildReportData')
        .addToUi();
}