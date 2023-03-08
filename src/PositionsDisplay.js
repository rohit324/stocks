import Button from "react-bootstrap/Button";
import Positions from "./Positions";

class PositionsDisplay {

    static getTotalDisplayRow(data) {
        const total = Positions.getTotalValues(data);
        return <tr>
          <td>{total.Symbol}</td>
          <td>{total.Product}</td>
          <td>{total.Qty}</td>
          <td>{total.CEValue}</td>
          <td>{total.PEValue}</td>
          <td>{total.currentValue}</td>
          <td>{total.ltp}</td>
          <td>{total.PNL}</td>
    
        </tr>
      }

      static getDisplayRow(data, index, instance) {
        return <tr>
          <td>{data[index].trading_symbol}</td>
          <td>{data[index].symbol}</td>
          <td>{data[index].net_quantity}</td>
          <td>{Positions.getCEValue(data[index])}</td>
          <td>{Positions.getPEValue(data[index])}</td>
          <td>{Positions.getCurrentValue(data[index])}</td>
          <td>{data[index].ltp}</td>
          <td>{Positions.getPNL(data[index])}</td>
          <td><Button name={data[index].token} onClick={instance.deleteRow} variant="outline-danger" size='sm'> Delete</Button></td>
          <td><Button name={data[index].token} onClick={() => instance.sell(data[index])} variant="outline-info" size='sm'> Sell </Button></td>
          <td><Button name={data[index]} onClick={() => instance.buy(data[index])} variant="outline-info" size='sm'> Buy </Button></td>
        </tr>
      }
    
     

}

export default PositionsDisplay;