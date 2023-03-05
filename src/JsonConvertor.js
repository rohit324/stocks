class JsonConvertor {

     convertJson(csvFilePath) {
        const fs = require('fs');
        const data = fs.readFileSync('./my-app/src/positions.csv',
            { encoding: 'utf8', flag: 'r' });
        console.log(data);

    }
}

export default JsonConvertor;