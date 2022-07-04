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
    await unifiLogin();
    const guestWifiState: IWlanSettings[] = await unifi.getWLanSettings(
        process.env.UNIFI_GUEST_NETWORK_ID
    );

    if (guestWifiState.length === 0) {
        throw new Error('Guest wifi ID could not be found in the controller');
    }

    if (guestWifiState.length > 1) {
        throw new Error('There are two APs in the controller with the same ID');
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

interface HomeProps {
    guestWifiCredentials: {
        networkName: string;
        password: string;
        isHidden: boolean;
        securityProtocol: string;
    };
}

const Home: NextPage<HomeProps> = ({
    guestWifiCredentials: {networkName, password, isHidden, securityProtocol},
}) => {
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
        <div className="font-mono h-screen w-screen flex justify-center items-center flex-col bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 overflow-hidden">
            <Head>
                <title>Guest Wifi</title>
                <meta name="Guest wifi info" />
            </Head>

            <h1 className="dark:text-slate-100 text-black text-4xl font-semibold mb-10 font-mono">
                Guest Wifi
            </h1>

            <div className="relative bg-slate-300 dark:bg-slate-700 px-5 shadow-xl py-12 h-[80vh] w-[90vw] max-w-[22rem] max-h-[33rem] flex flex-col justify-center items-center rounded-lg hover:scale-[1.02] transition-all overflow-scroll">
                <div className="w-full flex justify-center mb-10">
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
