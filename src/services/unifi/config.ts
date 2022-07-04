// @ts-ignore
import * as Unifi from 'node-unifi';

export const unifi = new Unifi.Controller({
    host: process.env.UNIFI_CONTROLLER_HOST,
    port: process.env.UNIFI_CONTROLLER_PORT,
    username: process.env.UNIFI_CONTROLLER_USERNAME,
    password: process.env.UNIFI_CONTROLLER_PASSWORD,
    sslverify: false,
});

export const unifiLogin = async () => {
    return await unifi.login(
        process.env.UNIFI_CONTROLLER_USERNAME,
        process.env.UNIFI_CONTROLLER_PASSWORD
    );
};

export const unifiLogout = async () => {
    return await unifi.logout();
};
