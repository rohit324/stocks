class SASConstants {
    static accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJibGFja2xpc3Rfa2V5IjoiUkExMDg6STRrV3pscStSS0lRWGFKT0o5YTh5dyIsImNsaWVudF9pZCI6IlJBMTA4IiwiY2xpZW50X3Rva2VuIjoiYzBoTnRHUDlSUFdKSVNjMFpQZEVyZyIsImRldmljZSI6IndlYiIsImV4cCI6MTY3ODMzOTA1ODkzNn0.Ioc5wh9Q_yKThfUzZkwurveIkJANdVTjgD90KK0pRhc';
    static fetchedData = [];
    static currentPositionsData = [];
    static projectedData = [];
    static debug = '';
    static status = '';
    static message = '';

    static processResponse(response) {
        this.status = response.status;
        this.message = response.message;
    }
}

export default SASConstants;