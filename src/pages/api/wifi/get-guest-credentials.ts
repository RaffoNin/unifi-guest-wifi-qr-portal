import type {NextApiRequest, NextApiResponse} from 'next';
import {unifi, unifiLogin} from '../../../services/unifi/config';
import {IWlanSettings} from '../../../types/unifi/unifi-types';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        await unifiLogin();
        const guestWifiState: IWlanSettings[] = await unifi.getWLanSettings(
            process.env.UNIFI_SELECTED_NETWORK_ID
        );

        if (guestWifiState.length === 0) {
            res.status(404).send(
                'Guest wifi ID could not be found in the controller'
            );
        }

        if (guestWifiState.length > 1) {
            res.status(409).send(
                'There are two APs in the controller with the same ID'
            );
        }

        res.status(200).json({
            networkName: guestWifiState[0].name,
            password: guestWifiState[0].x_passphrase,
        });
    } catch (error) {
        res.status(400).send(`${error}`);
    }
}
