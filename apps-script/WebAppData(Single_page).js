function getDashboardData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('ReportData');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const idx = {
    sales: headers.indexOf('Sales'),
    profit: headers.indexOf('Profit'),
    region: headers.indexOf('Region'),
    category: headers.indexOf('Category'),
    orderMonth: headers.indexOf('Order Month'),
    discountBand: headers.indexOf('Discount Band'),
    orderCount: headers.indexOf('Order Count'),
    lossFlag: headers.indexOf('Loss Flag')
  };

  let totalSales = 0;
  let totalProfit = 0;
  let totalOrders = 0;

  const salesByRegion = {};
  const salesByCategory = {};
  const salesByMonth = {};
  const profitByDiscountBand = {};
  const salesByDiscountBand = {};

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const sales = Number(row[idx.sales]) || 0;
    const profit = Number(row[idx.profit]) || 0;
    const region = row[idx.region];
    const category = row[idx.category];
    const month = row[idx.orderMonth];
    const discountBand = row[idx.discountBand];

    totalSales += sales;
    totalProfit += profit;
    totalOrders += 1;

    // Sales by Region
    salesByRegion[region] = (salesByRegion[region] || 0) + sales;

    // Sales by Category
    salesByCategory[category] = (salesByCategory[category] || 0) + sales;

    // Sales by Month
    var monthKey;
    if (month instanceof Date) {
      monthKey = Utilities.formatDate(month, Session.getScriptTimeZone(), 'yyyy-MM');
    } else {
      monthKey = String(month);
    }
    salesByMonth[monthKey] = (salesByMonth[monthKey] || 0) + sales;

    // Profit and Sales by Discount Band
    profitByDiscountBand[discountBand] = (profitByDiscountBand[discountBand] || 0) + profit;
    salesByDiscountBand[discountBand] = (salesByDiscountBand[discountBand] || 0) + sales;
  }

  // Calculate Profit Ratio by Discount Band
  const profitRatioByDiscountBand = {};
  for (var band in salesByDiscountBand) {
    profitRatioByDiscountBand[band] = salesByDiscountBand[band] !== 0
      ? profitByDiscountBand[band] / salesByDiscountBand[band]
      : 0;
  }

  // Sort monthly data
  const sortedMonths = Object.keys(salesByMonth).sort();
  const monthlySales = sortedMonths.map(function(m) {
    return { month: m, sales: salesByMonth[m] };
  });

  return {
    totalSales: totalSales,
    totalProfit: totalProfit,
    totalOrders: totalOrders,
    profitRatio: totalSales !== 0 ? totalProfit / totalSales : 0,
    avgOrderValue: totalOrders !== 0 ? totalSales / totalOrders : 0,
    salesByRegion: salesByRegion,
    salesByCategory: salesByCategory,
    monthlySales: monthlySales,
    profitRatioByDiscountBand: profitRatioByDiscountBand
  };
}