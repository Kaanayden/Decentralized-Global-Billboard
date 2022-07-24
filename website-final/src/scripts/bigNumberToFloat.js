import {ethers} from 'ethers';

export default function bigNumberToFloat(val, decimals) {
    const DECIMAL_NUMBER = decimals;
    let decimalsNew = ethers.BigNumber.from( 10 ).pow( ethers.BigNumber.from( 18 - DECIMAL_NUMBER ) );
    let floatValue = val.div( decimalsNew ).toNumber() / 10 ** DECIMAL_NUMBER;
    return floatValue;
}