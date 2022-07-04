import {wifiSecurityProtocol} from '../../types/unifi/unifi-types';

const getSecurityProtocol = (
    unifiSecurityMode: string
): wifiSecurityProtocol => {
    switch (unifiSecurityMode) {
        case 'wpapsk':
            return 'WPA';
        default:
            throw new Error(`unknown securit type: ${unifiSecurityMode}`);
    }
};

export default getSecurityProtocol;
