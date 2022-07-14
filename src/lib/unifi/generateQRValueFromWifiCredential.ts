import {wifiSecurityProtocol} from '../../types/unifi/unifi-types';

const generateQRValueFromWifiCredential = (
    wifiName: string,
    wifiPassword: string,
    hidden: boolean = false,
    securityProtocol: wifiSecurityProtocol = 'none'
) => {
    const isTherePassword = securityProtocol === 'none';

    return `WIFI:T:${
        isTherePassword ? 'nopass' : securityProtocol
    };S:${wifiName};P:${isTherePassword ? '' : wifiPassword};${
        hidden ? 'H:true;;' : ';'
    }`;
};

export default generateQRValueFromWifiCredential;
