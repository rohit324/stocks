
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

function login() {
    const options = getRequestOptions();
    options.body = JSON.stringify(loginPayload);
    let response: any = await HTTPHandler.post(loginURL, options);
    const questionIds = JSON.parse(response).data.question_ids;
    Requestor.quesAns.question_ids = questionIds;
    console.log(Requestor.quesAns);
    options.body = JSON.stringify(Requestor.quesAns);
    response = await HTTPHandler.post(Requestor.checkQuestionsURL, options);
    Requestor.accessToken = JSON.parse(response).data.auth_token;
    console.log("got the access token " + Requestor.accessToken);
}

function getRequestOptions() {
    const options = {} ;
    options.headers = { 'Content-type': 'application/json' };
    if (accessToken) {
        options.headers = { 'Content-type': 'application/json', 'X-Authorization-Token': accessToken };
    }
    return options;
}