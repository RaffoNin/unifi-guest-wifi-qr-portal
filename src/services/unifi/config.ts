// @ts-ignore
// import * as Unifi from 'node-unifi';
// @ts-ignore
import Unifi from 'node-unifiapi';

export const unifi = Unifi({
    baseUrl: `https://${process.env.UNIFI_CONTROLLER_HOST}:${process.env.UNIFI_CONTROLLER_PORT}`,
    username: process.env.UNIFI_CONTROLLER_USERNAME,
    password: process.env.UNIFI_CONTROLLER_PASSWORD,
    debug: process.env.DEBUG?.toLowerCase() === 'true' ? true : false, // More debug of the API (uses the debug module)
    // debugNet: true, // Debug of the network requests (uses request module)
});

// export const unifi = new Unifi.Controller({
//     host: process.env.UNIFI_CONTROLLER_HOST,
//     port: process.env.UNIFI_CONTROLLER_PORT,
//     username: process.env.UNIFI_CONTROLLER_USERNAME,
//     password: process.env.UNIFI_CONTROLLER_PASSWORD,
//     sslverify: false,
// });

export const unifiLogin = async () => {
    return await unifi.login(
        process.env.UNIFI_CONTROLLER_USERNAME,
        process.env.UNIFI_CONTROLLER_PASSWORD
    );
};

export const unifiLogout = async () => {
    return await unifi.logout();
};
