class Positions {

    static data;

    static setData(data) {
        Positions.data = data;
    }

    static removeData(token) {
        Positions.data.data = Positions.data.data.filter(val => 
            {
                return val.token!==parseInt(token);
            });
        console.log(Positions.data.data);
    }

    static getFromattedData() {
        return Positions.data.data;
    }

    static getFilteredData(filterText){
        if(!filterText) {
            return Positions.data.data;
        }
        return Positions.data.data.filter(val => val.trading_symbol.toUpperCase().indexOf(filterText.toUpperCase())!==-1)
    }

    static getExcludeFilterData(filterText){
        if(!filterText) {
            return Positions.data.data;
        }
        return Positions.data.data.filter(val => val.trading_symbol.toUpperCase().indexOf(filterText.toUpperCase())===-1)
    }

    static getTotalValues(results) {
        const total = {};
        if (!results || results.length === 0) return results;
        total.Symbol = 'Total Values';
        total.Product = results[0].trading_symbol;
        total.Qty = 0;
        total.Avg = 0;
        total.price = 0;
        total.LTP = 0;
        total.PNL = 0;
        total.sellValue = 100;
        total.buyValue = 0;
        total.PEQty = 0;
        total.CEQty = 0;

        for (let i = 0; i < results.length; i++) {
            total.Qty += parseInt(results[i].net_quantity);
            let PNL = Positions.getPNL(results[i]);
            total.PNL += PNL;
            if (results[i].trading_symbol.endsWith('CE')) {
                total.PEQty += parseInt(results[i].net_quantity);
            } else {
                total.CEQty += parseInt(results[i].net_quantity);
            }
            if (results[i].net_quantity < 0) {
                total.sellValue += results[i].actual_cf_sell_amount;
            } else {
                total.buyValue += results[i].actual_cf_buy_amount;
            }

        }
        total.Qty = total.Qty + 'PE:' + total.PEQty + 'CE:' + total.CEQty;
        return total;
    }


    static getPNL(value) {
        const currentValue = value.net_amount_mtm;
        const totalTradedValue = value.actual_cf_sell_amount - value.actual_cf_buy_amount;
        let PNL = 0;
        if (value.net_quantity <= 0) {
            PNL = parseInt(totalTradedValue - currentValue);
        } else {
            PNL = parseInt(totalTradedValue - currentValue);
        }
        return PNL;
    }

    static getProjectedData(startRange, endRange,results) {
        startRange = parseInt(startRange);
        endRange = parseInt(endRange);
        const values = [];
        for(let projectedStrikePrice=startRange;projectedStrikePrice<endRange;projectedStrikePrice= projectedStrikePrice+100) {
            const value = {};
            value.totalCEQty = 0;
            value.totalPEQty = 0;
            value.totalCEPNL = 0;
            value.totalPEPNL = 0;
            value.strikePrice = projectedStrikePrice;
            for (let index = 0; index < results.length; index++) {
                const element = results[index];
                const strikePrice = element.trading_symbol.substring(element.trading_symbol.length-7,element.trading_symbol.length-2);
                value.Symbol = element.trading_symbol;     
                if(element.trading_symbol.endsWith('CE')) {
                    value.totalCEQty += parseInt(element.net_quantity);
                    if(element.net_quantity <  0) {
                        if(projectedStrikePrice<=strikePrice) {
                            value.totalCEPNL +=  (-element.net_quantity)*element['actual_average_sell_price'] 
                        } else {
                            value.totalCEPNL -=  (-element.net_quantity)*((projectedStrikePrice-strikePrice) - (element['actual_average_sell_price'])) 
                        }
                    } else {
                        if(projectedStrikePrice<=strikePrice) {
                            value.totalCEPNL -=  element.net_quantity*element['actual_average_buy_price'] 
                        } else {
                            value.totalCEPNL +=  element.net_quantity*((projectedStrikePrice-strikePrice) - (element['actual_average_buy_price']))
                        }
                    }
                }  else {
                    value.totalPEQty += parseInt(element.net_quantity);
                    if(element.net_quantity <  0) {
                        if(projectedStrikePrice>=strikePrice) {
                            value.totalPEPNL +=  (-element.net_quantity)*element['actual_average_sell_price'] 
                        } else {
                            value.totalPEPNL -=  (-element.net_quantity)*((strikePrice-projectedStrikePrice) - (element['actual_average_sell_price'])) 
                        }
                    } else {
                        if(projectedStrikePrice>=strikePrice) {
                            value.totalPEPNL -=  element.net_quantity*element['actual_average_buy_price'] 
                        } else {
                            value.totalPEPNL +=  element.net_quantity*((strikePrice-projectedStrikePrice) - (element['actual_average_buy_price']))
                        }
                    }
                }   
            }
            value.totalPNL = value.totalPEPNL + value.totalCEPNL;
            values.push(value);
    
         }    

        return values;
    }

    static test = `{"data":[{"actual_average_buy_price":0.0,"actual_average_sell_price":393.15,"actual_cf_buy_amount":0.0,"actual_cf_sell_amount":9828.75,"average_buy_price":0.0,"average_price":0,"average_sell_price":0.0,"buy_amount":0.0,"buy_quantity":0,"cf_buy_amount":0.0,"cf_buy_quantity":0,"cf_sell_amount":8832.5,"cf_sell_quantity":25,"client_id":"RA108","exchange":"NFO","instrument_token":41635,"ltp":353.6,"multiplier":1,"net_amount_mtm":8832.5,"net_quantity":-25,"pro_cli":"CLIENT","prod_type":"NRML","product":"NRML","realized_mtm":0.0,"segment":null,"sell_amount":0.0,"sell_quantity":0,"symbol":"BANKNIFTY","token":41635,"trading_symbol":"BANKNIFTY2332341000PE","v_login_id":"RA108"},{"actual_average_buy_price":0.0,"actual_average_sell_price":1570.0,"actual_cf_buy_amount":0.0,"actual_cf_sell_amount":39250.0,"average_buy_price":0.0,"average_price":0,"average_sell_price":0.0,"buy_amount":0.0,"buy_quantity":0,"cf_buy_amount":0.0,"cf_buy_quantity":0,"cf_sell_amount":48490.0,"cf_sell_quantity":25,"client_id":"RA108","exchange":"NFO","instrument_token":53311,"ltp":1930.05,"multiplier":1,"net_amount_mtm":48490.0,"net_quantity":-25,"pro_cli":"CLIENT","prod_type":"NRML","product":"NRML","realized_mtm":0.0,"segment":null,"sell_amount":0.0,"sell_quantity":0,"symbol":"BANKNIFTY","token":53311,"trading_symbol":"BANKNIFTY23APR40000CE","v_login_id":"RA108"},{"actual_average_buy_price":7.1,"actual_average_sell_price":0.0,"actual_cf_buy_amount":1420.0,"actual_cf_sell_amount":0.0,"average_buy_price":0.0,"average_price":0,"average_sell_price":0.0,"buy_amount":0.0,"buy_quantity":0,"cf_buy_amount":1080.0,"cf_buy_quantity":200,"cf_sell_amount":0.0,"cf_sell_quantity":0,"client_id":"RA108","exchange":"NFO","instrument_token":47299,"ltp":4.7,"multiplier":1,"net_amount_mtm":-1080.0,"net_quantity":200,"pro_cli":"CLIENT","prod_type":"NRML","product":"NRML","realized_mtm":0.0,"segment":null,"sell_amount":0.0,"sell_quantity":0,"symbol":"NIFTY","token":47299,"trading_symbol":"NIFTY2330917900CE","v_login_id":"RA108"},{"actual_average_buy_price":0.0,"actual_average_sell_price":391.01,"actual_cf_buy_amount":0.0,"actual_cf_sell_amount":78202.0,"average_buy_price":0.0,"average_price":0,"average_sell_price":0.0,"buy_amount":0.0,"buy_quantity":0,"cf_buy_amount":0.0,"cf_buy_quantity":0,"cf_sell_amount":77830.0,"cf_sell_quantity":200,"client_id":"RA108","exchange":"NFO","instrument_token":54348,"ltp":377.2,"multiplier":1,"net_amount_mtm":77830.0,"net_quantity":-200,"pro_cli":"CLIENT","prod_type":"NRML","product":"NRML","realized_mtm":0.0,"segment":null,"sell_amount":0.0,"sell_quantity":0,"symbol":"NIFTY","token":54348,"trading_symbol":"NIFTY23APR17600CE","v_login_id":"RA108"},{"actual_average_buy_price":0.0,"actual_average_sell_price":587.15,"actual_cf_buy_amount":0.0,"actual_cf_sell_amount":29357.5,"average_buy_price":0.0,"average_price":0,"average_sell_price":0.0,"buy_amount":0.0,"buy_quantity":0,"cf_buy_amount":0.0,"cf_buy_quantity":0,"cf_sell_amount":27560.0,"cf_sell_quantity":50,"client_id":"RA108","exchange":"NFO","instrument_token":53407,"ltp":565.0,"multiplier":1,"net_amount_mtm":27560.0,"net_quantity":-50,"pro_cli":"CLIENT","prod_type":"NRML","product":"NRML","realized_mtm":0.0,"segment":null,"sell_amount":0.0,"sell_quantity":0,"symbol":"NIFTY","token":53407,"trading_symbol":"NIFTY23MAR18200PE","v_login_id":"RA108"},{"actual_average_buy_price":0.0,"actual_average_sell_price":751.25,"actual_cf_buy_amount":0.0,"actual_cf_sell_amount":37562.5,"average_buy_price":0.0,"average_price":0,"average_sell_price":0.0,"buy_amount":0.0,"buy_quantity":0,"cf_buy_amount":0.0,"cf_buy_quantity":0,"cf_sell_amount":37260.0,"cf_sell_quantity":50,"client_id":"RA108","exchange":"NFO","instrument_token":53415,"ltp":752.75,"multiplier":1,"net_amount_mtm":37260.0,"net_quantity":-50,"pro_cli":"CLIENT","prod_type":"NRML","product":"NRML","realized_mtm":0.0,"segment":null,"sell_amount":0.0,"sell_quantity":0,"symbol":"NIFTY","token":53415,"trading_symbol":"NIFTY23MAR18400PE","v_login_id":"RA108"},{"actual_average_buy_price":0.0,"actual_average_sell_price":443.2,"actual_cf_buy_amount":0.0,"actual_cf_sell_amount":22160.0,"average_buy_price":0.0,"average_price":0,"average_sell_price":0.0,"buy_amount":0.0,"buy_quantity":0,"cf_buy_amount":0.0,"cf_buy_quantity":0,"cf_sell_amount":27865.0,"cf_sell_quantity":50,"client_id":"RA108","exchange":"NFO","instrument_token":73500,"ltp":556.95,"multiplier":1,"net_amount_mtm":27865.0,"net_quantity":-50,"pro_cli":"CLIENT","prod_type":"NRML","product":"NRML","realized_mtm":0.0,"segment":null,"sell_amount":0.0,"sell_quantity":0,"symbol":"NIFTY","token":73500,"trading_symbol":"NIFTY23MAY17500CE","v_login_id":"RA108"},{"actual_average_buy_price":0.0,"actual_average_sell_price":357.6,"actual_cf_buy_amount":0.0,"actual_cf_sell_amount":17880.0,"average_buy_price":0.0,"average_price":0,"average_sell_price":0.0,"buy_amount":0.0,"buy_quantity":0,"cf_buy_amount":0.0,"cf_buy_quantity":0,"cf_sell_amount":12550.0,"cf_sell_quantity":50,"client_id":"RA108","exchange":"NFO","instrument_token":73501,"ltp":253.7,"multiplier":1,"net_amount_mtm":12550.0,"net_quantity":-50,"pro_cli":"CLIENT","prod_type":"NRML","product":"NRML","realized_mtm":0.0,"segment":null,"sell_amount":0.0,"sell_quantity":0,"symbol":"NIFTY","token":73501,"trading_symbol":"NIFTY23MAY17500PE","v_login_id":"RA108"}],"message":"","status":"success"}`

}

export default Positions;

const data = JSON.parse(Positions.test);
Positions.setData(data);
console.log(Positions.getFilteredData('NIFTY23MAR18200PE'));
console.log(data.data[0].token);