function getFilterOptions() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('ReportData');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const regionIdx = headers.indexOf('Region');
  const segmentIdx = headers.indexOf('Segment');
  const categoryIdx = headers.indexOf('Category');

  const regions = {};
  const segments = {};
  const categories = {};

  for (var i = 1; i < data.length; i++) {
    regions[data[i][regionIdx]] = true;
    segments[data[i][segmentIdx]] = true;
    categories[data[i][categoryIdx]] = true;
  }

  return {
    regions: Object.keys(regions).sort(),
    segments: Object.keys(segments).sort(),
    categories: Object.keys(categories).sort()
  };
}

function getFilteredData(filters) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('ReportData');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const idx = {
    sales: headers.indexOf('Sales'),
    profit: headers.indexOf('Profit'),
    orderCount: headers.indexOf('Order Count'),
    region: headers.indexOf('Region'),
    segment: headers.indexOf('Segment'),
    category: headers.indexOf('Category'),
    orderYear: headers.indexOf('Order Year'),
    orderMonth: headers.indexOf('Order Month'),
    profitMargin: headers.indexOf('Profit Margin'),
    discountBand: headers.indexOf('Discount Band'),
    lossFlag: headers.indexOf('Loss Flag'),
    shipMode: headers.indexOf('Ship Mode'),
    state: headers.indexOf('State'),
    subCategory: headers.indexOf('Sub-Category'),
    orderDate: headers.indexOf('Order Date')
  };

  var filteredRows = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];

    if (filters.region && filters.region !== 'All' && row[idx.region] !== filters.region) continue;
    if (filters.segment && filters.segment !== 'All' && row[idx.segment] !== filters.segment) continue;
    if (filters.category && filters.category !== 'All' && row[idx.category] !== filters.category) continue;

    if (filters.startDate && filters.endDate) {
      var orderDate = new Date(row[idx.orderDate]);
      var start = new Date(filters.startDate);
      var end = new Date(filters.endDate);
      if (orderDate < start || orderDate > end) continue;
    }

    filteredRows.push(row);
  }

  var totalSales = 0, totalProfit = 0, totalOrders = 0, lossOrders = 0, lossValue = 0;
  var regionData = {}, segmentData = {}, yearMonthData = {}, discountBandData = {};
  var lossFlagByDiscount = {}, shipModeData = {}, stateData = {}, subCatRegionData = {};

  for (var i = 0; i < filteredRows.length; i++) {
    var row = filteredRows[i];
    var sales = Number(row[idx.sales]) || 0;
    var profit = Number(row[idx.profit]) || 0;
    var orderCount = Number(row[idx.orderCount]) || 0;
    var region = row[idx.region];
    var segment = row[idx.segment];
    var year = row[idx.orderYear];
    var month = row[idx.orderMonth];
    var discountBand = row[idx.discountBand];
    var lossFlag = row[idx.lossFlag];
    var shipMode = row[idx.shipMode];
    var state = row[idx.state];
    var subCat = row[idx.subCategory];

    totalSales += sales;
    totalProfit += profit;
    totalOrders += orderCount;

    if (lossFlag === 'Yes') { lossOrders++; lossValue += profit; }

    if (!regionData[region]) regionData[region] = { sales: 0, profit: 0 };
    regionData[region].sales += sales;
    regionData[region].profit += profit;

    if (!segmentData[segment]) segmentData[segment] = { sales: 0, profit: 0 };
    segmentData[segment].sales += sales;
    segmentData[segment].profit += profit;

    var monthDate = new Date(month);
    var monthNum = monthDate.getMonth() + 1;
    var yearNum = Number(year);
    var key = yearNum + '-' + monthNum;
    if (!yearMonthData[key]) yearMonthData[key] = { year: yearNum, month: monthNum, sales: 0 };
    yearMonthData[key].sales += sales;

    if (!discountBandData[discountBand]) discountBandData[discountBand] = { sales: 0, profit: 0 };
    discountBandData[discountBand].sales += sales;
    discountBandData[discountBand].profit += profit;

    var lfKey = discountBand + '|' + lossFlag;
    if (!lossFlagByDiscount[lfKey]) lossFlagByDiscount[lfKey] = 0;
    lossFlagByDiscount[lfKey] += orderCount;

    if (!shipModeData[shipMode]) shipModeData[shipMode] = { sales: 0, profit: 0, orders: 0 };
    shipModeData[shipMode].sales += sales;
    shipModeData[shipMode].profit += profit;
    shipModeData[shipMode].orders += orderCount;

    if (!stateData[state]) stateData[state] = { sales: 0, profit: 0, orders: 0 };
    stateData[state].sales += sales;
    stateData[state].profit += profit;
    stateData[state].orders += orderCount;

    var scKey = subCat + '|' + region;
    if (!subCatRegionData[scKey]) subCatRegionData[scKey] = { sales: 0, profit: 0 };
    subCatRegionData[scKey].sales += sales;
    subCatRegionData[scKey].profit += profit;
  }

  return {
    totals: {
      sales: totalSales,
      profit: totalProfit,
      orders: totalOrders,
      profitRatio: totalSales !== 0 ? totalProfit / totalSales : 0,
      aov: totalOrders !== 0 ? totalSales / totalOrders : 0,
      lossOrders: lossOrders,
      lossValue: lossValue
    },
    regionData: regionData,
    segmentData: segmentData,
    yearMonthData: yearMonthData,
    discountBandData: discountBandData,
    lossFlagByDiscount: lossFlagByDiscount,
    shipModeData: shipModeData,
    stateData: stateData,
    subCatRegionData: subCatRegionData
  };
}