import {wifiSecurityProtocol} from '../../types/unifi/unifi-types';

const getSecurityProtocol = (
    unifiSecurityMode: string
): wifiSecurityProtocol => {
    if (unifiSecurityMode.toLowerCase().includes('wpa')) {
        return 'WPA';
    }

    if (unifiSecurityMode.toLowerCase().includes('wep')) {
        return 'WEP';
    }

    if (unifiSecurityMode.toLowerCase().includes('open')) {
        return 'none';
    }

    throw new Error(`Unknown security type: ${unifiSecurityMode}`);
};

export default getSecurityProtocol;
