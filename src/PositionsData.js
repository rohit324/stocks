
class PositionsData {
    headerRowIndex = 1;
    rowDelimiter = '\n';
    columnDelimiter = ',';
    static data = PositionsData.getDefaultData();

    static setDate(data){
        PositionsData.data = data;
    }

    testFunc() {
        return "estf";
    }

    getFormattedData() {
        const data = PositionsData.data;
        const rows = data.split(this.rowDelimiter);
        return this.jsonFromRows(rows);
    }

    jsonFromRows(rows) {
        const result = [];
        if (!rows || rows.length === 0) return result;
        const headerRow = rows[this.headerRowIndex];
        const headerColumn = headerRow.split(this.columnDelimiter);
        for (let i = this.headerRowIndex + 1; i < rows.length; i++) {
            const cols = rows[i].split(this.columnDelimiter);
            const record = {};
            for (let j = 0; j < cols.length; j++) {
                record[headerColumn[j]] = cols[j];
            }
            result.push(record);
        }
        this.getTotalValues(result);
        return result;
    }


    getTotalValues(results) {
        const total = {};
        if (!results || results.length === 0) return results;

        total.Symbol = 'Total Values';
        total.Product = results[0].Product;
        total.Qty = 0;
        total.Avg = 0;
        total.price = 0;
        total.LTP = 0;
        total.PNL = 0;
        total['Buy Avg'] = 0;
        total['Sell Avg'] = 0;
        total.PEQty = 0;
        total.CEQty = 0;

        for (let i = 0; i < results.length; i++) {
            total.Qty += parseInt(results[i].Qty);
            total.PNL += parseInt(results[i].PNL);
            if (results[i].Symbol.endsWith('CE')) {
                total.PEQty += parseInt(results[i].Qty);
            } else {
                total.CEQty += parseInt(results[i].Qty);
            }
            if (results[i].Qty < 0) {
                total['Sell Avg'] += results[i].LTP * results[i].Qty;
            } else {
                total['Buy Avg'] += results[i].LTP * results[i].Qty;
            }

        }
        total.Qty = total.Qty + 'PE:' + total.PEQty + 'CE:' + total.CEQty;
        results.push(total);
        return results;
    }

    getFilteredData(filter) {
        const data = PositionsData.data;
        const rows = data.split(this.rowDelimiter);
        const result = [];
        result.push(rows[0]);
        result.push(rows[1]);
        for (let index = 2; index < rows.length; index++) {
            const element = rows[index];
            if (element.toUpperCase().indexOf(filter.toUpperCase()) !== -1) result.push(element);

        }
        return this.jsonFromRows(result);
    }

    getProjectedData(filter, startRange, endRange) {
        startRange = parseInt(startRange);
        endRange = parseInt(endRange);
        const results = this.getFilteredData(filter);
        const values = [];
        for(let projectedStrikePrice=startRange;projectedStrikePrice<endRange;projectedStrikePrice= projectedStrikePrice+100) {
            const value = {};
            value.totalCEQty = 0;
            value.totalPEQty = 0;
            value.totalCEPNL = 0;
            value.totalPEPNL = 0;
            value.strikePrice = projectedStrikePrice;
            for (let index = 0; index < results.length-1; index++) {
                const element = results[index];
                const strikePrice = element.Symbol.substring(element.Symbol.length-7,element.Symbol.length-2);
                value.Symbol = element.Symbol;     
                if(element.Symbol.endsWith('CE')) {
                    value.totalCEQty += parseInt(element.Qty);
                    if(element.Qty <  0) {
                        if(projectedStrikePrice<=strikePrice) {
                            value.totalCEPNL +=  (-element.Qty)*element['Sell Avg'] 
                        } else {
                            value.totalCEPNL -=  (-element.Qty)*((projectedStrikePrice-strikePrice) - (element['Sell Avg'])) 
                        }
                    } else {
                        if(projectedStrikePrice<=strikePrice) {
                            value.totalCEPNL -=  element.Qty*element['Buy Avg'] 
                        } else {
                            value.totalCEPNL +=  element.Qty*((projectedStrikePrice-strikePrice) - (element['Buy Avg']))
                        }
                    }
                }  else {
                    value.totalPEQty += parseInt(element.Qty);
                    if(element.Qty <  0) {
                        if(projectedStrikePrice>=strikePrice) {
                            value.totalPEPNL +=  (-element.Qty)*element['Sell Avg'] 
                        } else {
                            value.totalPEPNL -=  (-element.Qty)*((strikePrice-projectedStrikePrice) - (element['Sell Avg'])) 
                        }
                    } else {
                        if(projectedStrikePrice>=strikePrice) {
                            value.totalPEPNL -=  element.Qty*element['Buy Avg'] 
                        } else {
                            value.totalPEPNL +=  element.Qty*((strikePrice-projectedStrikePrice) - (element['Buy Avg']))
                        }
                    }
                }   
            }
            value.totalPNL = value.totalPEPNL + value.totalCEPNL;
            values.push(value);
    
         }    

        return values;
    }

    static getDefaultData() {
        return `
Symbol,Product,Qty,Avg. Price,LTP,PNL,Buy Avg,Sell Avg
NIFTY2330917200CE,NRML,-50,189.55,195,-272.5,0,189.55
NIFTY2330917200PE,NRML,-50,51.85,50.05,90,0,51.85
NIFTY2330917250CE,NRML,-50,178.15,158.95,960,0,178.15
NIFTY2330917250PE,NRML,-50,104.25,64.15,2005,0,104.25
NIFTY2330917350CE,NRML,-50,179.85,99.15,4035,0,179.85
NIFTY2330917350PE,NRML,-50,102.55,103.6,-52.5,0,102.55
NIFTY2330917450CE,NRML,-100,206.25,55.05,15120,0,206.25
NIFTY2330917450PE,NRML,-50,124,159.45,-1772.5,0,124
NIFTY2330917500CE,NRML,-100,212.35,38.7,17365,0,212.35
NIFTY2330917500PE,NRML,-150,135.55,194.35,-8820,0,135.55
NIFTY2330917550CE,NRML,-50,206.8,26.75,9002.5,0,206.8
NIFTY2330917550PE,NRML,-50,154.55,231.35,-3840,0,154.55
NIFTY2330917600CE,NRML,-100,174.68,18.05,15663,0,174.68
NIFTY2330917600PE,NRML,-100,162.68,271.55,-10887,0,162.68
NIFTY2331617600CE,NRML,-50,239,54.65,9217.5,0,239
NIFTY23APR17500CE,NRML,-50,735,314.4,21030,0,735
NIFTY23MAR17000CE,NRML,-50,483,484.95,-97.5,0,483
NIFTY23MAR17000PE,NRML,-50,112.35,91,1067.5,0,112.35
NIFTY23MAR17100CE,NRML,-50,407.35,409.1,-87.5,0,407.35
NIFTY23MAR17100PE,NRML,-50,142.4,114.15,1412.5,0,142.4
NIFTY23MAR17200CE,NRML,-50,389.15,337.35,2590,0,389.15
NIFTY23MAR17200PE,NRML,-50,146.8,142.25,227.5,0,146.8
NIFTY23MAR17250CE,NRML,-50,354.25,298.8,2772.5,0,354.25
NIFTY23MAR17250PE,NRML,-50,162,157.6,220,0,162
NIFTY23MAR17300CE,NRML,-50,478.5,273.55,10247.5,0,478.5
NIFTY23MAR17300PE,NRML,-50,163.25,175.7,-622.5,0,163.25
NIFTY23MAR17400CE,NRML,-50,481,213.5,13375,0,481
NIFTY23MAR17400PE,NRML,-50,158.4,216.35,-2897.5,0,158.4
NIFTY23MAR17500CE,NRML,-50,459.05,162.3,14837.5,0,459.05
NIFTY23MAR17500PE,NRML,-50,156.9,264.5,-5380,0,156.9
NIFTY23MAR17600CE,NRML,-50,417.6,119.75,14892.5,0,417.6
NIFTY23MAR17600PE,NRML,-50,166.05,321.65,-7780,0,166.05
NIFTY23MAR17700CE,NRML,-50,456.5,84.75,18587.5,0,456.5
NIFTY23MAR17700PE,NRML,-50,147.55,386.8,-11962.5,0,147.55
NIFTY23MAR17850CE,NRML,-50,476.55,48.1,21422.5,0,476.55
NIFTY23MAR17850PE,NRML,-50,143.1,496,-17645,0,143.1
NIFTY23MAR18200CE,NRML,-50,284.9,14.5,13520,0,284.9
NIFTY23MAR18200PE,NRML,-50,244.6,808,-28170,0,244.6
NIFTY23MAR18400PE,NRML,-50,751.25,1011.35,-13005,0,751.25
NIFTY23MAY17500CE,NRML,-50,443.2,426.4,840,0,443.2
NIFTY23MAY17500PE,NRML,-50,357.6,371.95,-717.5,0,357.6
NIFTY23MAY17000CE,NRML,-50,900,900.4,840,0,900.2
NIFTY23MAY17000PE,NRML,-50,140.6,140.95,-717.5,0,140.6
NIFTY23MAY18000CE,NRML,-50,255.6,255.95,-717.5,0,255.6
NIFTY23MAY18000PE,NRML,-50,476.2,476.4,840,0,476.2
NIFTY23MAYMAR18400CE,NRML,150,6.2,6.4,840,0,6.2
NIFTY23MAYMAR16500PE,NRML,150,6.2,6.4,840,0,6.2
`
    }
}

export default PositionsData;

