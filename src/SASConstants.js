class SASConstants {
    static accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJibGFja2xpc3Rfa2V5IjoiUkExMDg6L2xpZFkzVVM0di9aV3ZTS3FDd2dpdyIsImNsaWVudF9pZCI6IlJBMTA4IiwiY2xpZW50X3Rva2VuIjoiZzh5bC9HaTBVVkdDMWFFanV2c3FJdyIsImRldmljZSI6IndlYiIsImV4cCI6MTY4MTEwMzUwNDY1OH0.8GOAg86DsEMVczry1PRK1J9NWhSgPtr1AdklY3AsMe4'
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