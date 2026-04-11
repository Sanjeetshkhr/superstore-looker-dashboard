function buildReportData(){
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const source = ss.getSheetByName('Orders');


    let target = ss.getSheetByName('ReportData');

    if (!target) {
        target = ss.insertSheet('ReportData');
    }
    else {
        target.clearContents();
    }

    const values = source.getDataRange().getValues();
    const headers = values[0];

    const idx = {
        orderDate: headers.indexOf('Order Date'),
        sales: headers.indexOf('Sales'),
        profit: headers.indexOf('Profit'),
        discount: headers.indexOf('Discount'),
    };

    for (const[key, val] of Object.entries(idx)){
        if (val == -1){
            throw new Error('Missing column: ' + key);
        }
    }

    const newHeaders = [
        ...headers,
        'Order Year',
        'Order Month',
        'Profit Margin',
        'Discount Band',
        'Loss Flag',
        'Order Count'
    ];
    const out = [newHeaders];

    for (let i = 1; i < values.length; i++){
        const row = values[i];
        const orderDate = new Date(row[idx.orderDate]);
        const sales = Number(row[idx.sales]) || 0;
        const profit = Number(row[idx.profit]) || 0;
        const discount = Number(row[idx.discount]) || 0;

        const orderYear = orderDate.getFullYear();
        const orderMonth = Utilities.formatDate(
            orderDate,
            Session.getScriptTimeZone(),
            'yyyy-MM'
        );
        const ProfitMargin = sales !== 0 ? profit / sales : 0;

        let discountBand = 'No Discount';
        if(discount >0 && discount <= 0.2) discountBand = 'Low';
        else if (discount > 0.2 && discount <= 0.4) discountBand = 'Medium';
        else if (discount > 0.4) discountBand = 'High';

        const lossFlag = profit < 0 ? 'Yes' : 'No';
        const orderCount = 1;

        out.push([
            ...row,
            orderYear,
            orderMonth,
            ProfitMargin,
            discountBand,
            lossFlag,
            orderCount
        ]);
    }
    target.getRange(1,1, out.length, out[0].length).setValues(out);
    SpreadsheetApp.flush();
    Logger.log('ReportData built: ' + (out.length - 1) + 'rows');
}

