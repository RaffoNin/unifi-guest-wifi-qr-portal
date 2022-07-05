import {AxiosError} from 'axios';
import type {NextApiRequest, NextApiResponse} from 'next';
import {unifi, unifiLogin} from '../../../services/unifi/config';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method not allowed');
    }

    if (!process.env.CHANGE_WIFI_TOKEN) {
        return res
            .status(503)
            .send(
                'This functionality is not enabled. Set the appropriate env variable.'
            );
    }

    const {token, newPassword}: {token: string; newPassword: string} = req.body;

    if (!token || !newPassword) {
        return res.status(400).send('Request body is not complete');
    }

    if (token !== process.env.CHANGE_WIFI_TOKEN) {
        return res.status(401).send('Incorrect token');
    }

    if (newPassword.length < 8) {
        return res
            .status(401)
            .send(
                'Password with length of' +
                    ' ' +
                    newPassword.length.toString() +
                    ' ' +
                    'is less than 8'
            );
    }

    if (newPassword.length > 63) {
        return res
            .status(401)
            .send(
                'Password with length of' +
                    ' ' +
                    newPassword.length.toString() +
                    ' ' +
                    'is more than 63'
            );
    }

    try {
        await unifiLogin();
        await unifi.setWLanSettings(
            process.env.UNIFI_SELECTED_NETWORK_ID,
            newPassword
        );

        return res.status(201).send('Password changed');
    } catch (error) {
        if (error instanceof AxiosError) {
            return res
                .status(error.response?.status || 500)
                .send(error.response);
        }

        return res.status(500).send(`${error}`);
    }
}
