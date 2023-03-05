export class Requestor {

    loginId = "SJ343";
    password = "Welcome!1";
    loginURL = 'https://alpha.sasonline.in/api/v2/login';
    checkQuestionsURL = 'https://alpha.sasonline.in/api/v2/checktwofa';
    ordersURL = 'https://alpha.sasonline.in/api/v2/order';
    nifty50URL = 'https://alpha.sasonline.in/api/v1/screeners/gainerslosers?index=nifty_50';
    positionsURL = 'https://alpha.sasonline.in/api/v2/positions?type=netwise';
    holdings = 'https://alpha.sasonline.in/api/v2/holdings';
    cancelOrder = 'https://alpha.sasonline.in/api/v2/order?oms_order_id=%orderId%&order_status=open';
    quotesURL = 'https://alpha.sasonline.in/api/v2/marketdata?exchange=NSE&instrument_token=%token%&type=snapquote';
    loginPayload = { "login_id": Requestor.loginId, "password": Requestor.password, "device": "browser" };
    quesAns = { "answers": ["1", "1"], "login_id": Requestor.loginId, "question_ids": [1, 51], "device": "browser", "count": 2 };
    accessToken;

    async login() {
        const options = Requestor.getRequestOptions();
        options.body = JSON.stringify(Requestor.loginPayload);
        let response: any = await HTTPHandler.post(Requestor.loginURL, options);
        const questionIds = JSON.parse(response).data.question_ids;
        Requestor.quesAns.question_ids = questionIds;
        console.log(Requestor.quesAns);
        options.body = JSON.stringify(Requestor.quesAns);
        response = await HTTPHandler.post(Requestor.checkQuestionsURL, options);
        Requestor.accessToken = JSON.parse(response).data.auth_token;
        console.log("got the access token " + Requestor.accessToken);
    }

    async getLTP(instrumentCode: string): Promise<number> {
        const url = Requestor.quotesURL.replace('%token%', instrumentCode);
        const response: IQuote = JSON.parse(await HTTPHandler.get(url, Requestor.getRequestOptions())).data;
        let bidPrice: number = response.bid_prices[0];
        if (bidPrice === 0) {
            console.log(' bid price is 0 trying for selling price.');
            bidPrice = response.ask_prices[0];
        }
        return Promise.resolve(bidPrice);
    }

    async getOpenPositions(): Promise<Array<IPosition>> {
        if (!Requestor.accessToken) {
            await Requestor.login();
        }
        const response: any = JSON.parse(await HTTPHandler.get(Requestor.positionsURL, Requestor.getRequestOptions()));
        return Promise.resolve(response.data.positions);
    }

    async placeOrder(order: IOrder) {
        const options = Requestor.getRequestOptions();
        options.body = JSON.stringify(order);
        const response = await HTTPHandler.post(Requestor.ordersURL, options);
        console.log(response);
    }

    async getHoldings() {
        if (!Requestor.accessToken) {
            await Requestor.login();
        }
        const response: any = JSON.parse(await HTTPHandler.get(Requestor.holdings, Requestor.getRequestOptions()));
        console.log(response);
        return Promise.resolve(response.data.holdings);
    }

    fetchEquitiesInstrumentCode(symbol: string) {
        const response: any = JSON.parse(readFileSync('./src/samples/quotes.json', 'utf8'));
        let values: any[] = response.data;
        for (let valueElement of values) {
            values = valueElement.value.filter(data => data.symbol === symbol);
            if (values.length > 0) {
                return values[0];
            }
        }
        throw new Error('Not able to find instrument details for symbol ' + symbol);
    }

    async cancelAllOrders() {
        try {
            let iOrders: IOrder[] = await this.fetchOrders();
            if (!iOrders || iOrders.length === 0) {
                console.log('No orders to cancel for now ');
                return;
            }
            for (let iOrder of iOrders) {
                console.log('cancelling order with id ' + iOrder.oms_order_id);
                const uri = Requestor.cancelOrder.replace('%orderId%', iOrder.oms_order_id);
                const response = await HTTPHandler.delete(uri, Requestor.getRequestOptions());
                console.log(response);
            }
        } catch (e) {
            console.log('Error cancelling order, ignored exception ' + e);
        }
        console.log('Keep looping till all orders are not cancelled');
        await this.cancelAllOrders();
    }

    async fetchOrders(): Promise<IOrder[]> {
        if (!Requestor.accessToken) {
            await Requestor.login();
        }
        const response: any = await HTTPHandler.get(Requestor.ordersURL, Requestor.getRequestOptions());
        return Promise.resolve(JSON.parse(response).data.pending_orders);
    }

    getRequestOptions(): RequestPromiseOptions {
        const options = {} as RequestPromiseOptions;
        options.headers = { 'Content-type': 'application/json' };
        if (Requestor.accessToken) {
            options.headers = { 'Content-type': 'application/json', 'X-Authorization-Token': Requestor.accessToken };
        }
        return options;
    }


}

