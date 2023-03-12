class SASConstants {
    static accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJibGFja2xpc3Rfa2V5IjoiU0ozNDM6a08wVGx4b3hrYloydWJ0MnlUU0lodyIsImNsaWVudF9pZCI6IlNKMzQzIiwiY2xpZW50X3Rva2VuIjoiR2hCUm1FbldGZk5ZOVdlMHZTRENTdyIsImRldmljZSI6IndlYiIsImV4cCI6MTY3ODUxMzI3MzUzMX0.nrrhM_m3C-xJ4STrdPPQgjVemJbB3_sxLXLSfRqbxzE'
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