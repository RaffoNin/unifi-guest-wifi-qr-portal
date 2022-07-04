import type {GetServerSideProps, NextPage} from 'next';
import Head from 'next/head';
import {useMemo} from 'react';
import QRCode from 'react-qr-code';
import TextLabel from '../components/TextLabel';
import useDarkMode from '../custom-hooks/useDarkMode';
import generateQRValueFromWifiCredential from '../lib/unifi/generateQRValueFromWifiCredential';
import getSecurityProtocol from '../lib/unifi/getSecurityProtocol';
import {unifi, unifiLogin} from '../services/unifi/config';
import {IWlanSettings} from '../types/unifi/unifi-types';
import getTailwindColor from '../lib/tailwind/getTailwindColor';

export const getServerSideProps: GetServerSideProps = async ({req, res}) => {
    if (
        !process.env.UNIFI_CONTROLLER_HOST ||
        !process.env.UNIFI_CONTROLLER_PORT ||
        !process.env.UNIFI_CONTROLLER_USERNAME ||
        !process.env.UNIFI_CONTROLLER_PASSWORD
    ) {
        console.error(`Incomplete env variales: 
        host: ${process.env.UNIFI_CONTROLLER_HOST}
        port: ${process.env.UNIFI_CONTROLLER_PORT}
        username: ${process.env.UNIFI_CONTROLLER_USERNAME}
        password: ${process.env.UNIFI_CONTROLLER_PASSWORD}
        `);

        throw new Error(`Incomplete env variales: 
        host: ${process.env.UNIFI_CONTROLLER_HOST}
        port: ${process.env.UNIFI_CONTROLLER_PORT}
        username: ${process.env.UNIFI_CONTROLLER_USERNAME}
        password: ${process.env.UNIFI_CONTROLLER_PASSWORD}
        `);
    }

    if (!process.env.UNIFI_GUEST_NETWORK_ID) {
        return {
            props: {},
            redirect: {
                destination: '/list-wifi-id',
                permanent: true,
            },
        };
    }

    await unifiLogin();
    const guestWifiState: IWlanSettings[] = await unifi.getWLanSettings(
        process.env.UNIFI_GUEST_NETWORK_ID
    );

    if (guestWifiState.length === 0) {
        throw new Error(
            `Wifi code with ID: ${process.env.UNIFI_GUEST_NETWORK_ID} could not be found`
        );
    }

    if (guestWifiState.length > 1) {
        throw new Error(
            `Wifi code with ID: ${process.env.UNIFI_GUEST_NETWORK_ID} has conflicting IDs with the Unifi Controller. Check unifi controller`
        );
    }

    return {
        props: {
            guestWifiCredentials: {
                networkName: guestWifiState[0].name,
                password: guestWifiState[0].x_passphrase,
                isHidden: guestWifiState[0].hide_ssid,
                securityProtocol: guestWifiState[0].security,
            },
        },
    };
};

type HomeProps = {
    guestWifiCredentials: {
        networkName: string;
        password: string;
        isHidden: boolean;
        securityProtocol: string;
    };
};

const Home: NextPage<HomeProps> = ({...props}) => {
    const {
        guestWifiCredentials: {
            isHidden,
            networkName,
            password,
            securityProtocol,
        },
    } = props;

    const securityProtocolConverted = useMemo(() => {
        return getSecurityProtocol(securityProtocol);
    }, [securityProtocol]);
    const [isDarkMode] = useDarkMode();

    const qrValue = useMemo(() => {
        return generateQRValueFromWifiCredential(
            networkName,
            password,
            isHidden,
            securityProtocolConverted
        );
    }, [networkName, password, isHidden, securityProtocolConverted]);

    return (
        <div className="font-mono min-h-screen h-full w-screen flex justify-center items-center flex-col bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 overflow-hidden">
            <Head>
                <title>Guest Wifi</title>
                <meta name="Guest wifi info" />
            </Head>

            <h1 className="text-slate-800 dark:text-slate-100 text-4xl font-semibold mb-10 font-mono">
                Guest Wifi
            </h1>

            <div className="relative bg-slate-300 dark:bg-slate-700 px-5 shadow-xl py-12 h-[80vh] w-[90vw] max-w-[22rem] max-h-[33rem] flex flex-col justify-center items-center rounded-lg hover:scale-[1.02] transition-all overflow-auto">
                <div className="w-full flex justify-center mb-10 overflow-visible">
                    <QRCode
                        value={qrValue}
                        className="rounded-lg"
                        bgColor={
                            isDarkMode
                                ? getTailwindColor('slate')['200']
                                : getTailwindColor('slate')['100']
                        }
                    />
                </div>
                <div className="flex flex-col gap-y-2">
                    <TextLabel title="Wifi Name" body={networkName} />
                    <TextLabel title="Wifi Password" body={password} />
                </div>
            </div>
        </div>
    );
};

export default Home;
