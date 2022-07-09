import {GetServerSideProps} from 'next';
import Head from 'next/head';
import React, {useMemo, useState} from 'react';
import TextLabel from '../components/TextLabel';
import {PageError} from '../lib/error/error-constructor';
import {unifi} from '../services/unifi/config';
import {IWlanSettings} from '../types/unifi/unifi-types';

// @ts-ignore
export const getServerSideProps: GetServerSideProps = async ({req, res}) => {
    let errorCode: number;
    let errorMessage: string;

    try {
        if (
            !process.env.UNIFI_CONTROLLER_HOST ||
            !process.env.UNIFI_CONTROLLER_PORT ||
            !process.env.UNIFI_CONTROLLER_USERNAME ||
            !process.env.UNIFI_CONTROLLER_PASSWORD
        ) {
            errorCode = 503;
            errorMessage = encodeURIComponent(`Incomplete env variables: 
            host: ${process.env.UNIFI_CONTROLLER_HOST}
            port: ${process.env.UNIFI_CONTROLLER_PORT}
            username: ${process.env.UNIFI_CONTROLLER_USERNAME}
            password: ${process.env.UNIFI_CONTROLLER_PASSWORD}
            `);
            throw new PageError(errorCode, errorMessage);
        }

        if (process.env.UNIFI_SELECTED_NETWORK_ID) {
            return {
                notFound: true,
            };
        }

        const guestWifiState: IWlanSettings[] = (await unifi.list_wlanconf())
            .data;

        const formattedWifiArray = guestWifiState.map((wifi) => ({
            name: wifi.name,
            id: wifi._id,
            enabled: wifi.enabled,
        }));

        return {
            props: {
                allWifiId: formattedWifiArray,
            },
        };
    } catch (error) {
        if (error instanceof PageError) {
            errorCode = error.errorCode;
            errorMessage = error.errorMessage;

            console.error(`${errorCode}: ${errorMessage}`);

            return {
                redirect: {
                    destination: `/error?statusCode=${errorCode}&errorMessage=${errorMessage}`,
                },
                props: {},
            };
        }

        console.error(`${error}`);
        return {
            redirect: {
                destination: `/error?statusCode=${500}&errorMessage=${error}`,
            },
        };
    }
};

interface WifiIDListProps {
    allWifiId: {
        id: string;
        name: string;
        enabled: boolean;
    }[];
}

const WifiIDList: React.FC<WifiIDListProps> = ({allWifiId}) => {
    const [isHidenWifiShown, setIsHidenWifiShown] = useState(true);

    const filteredWifiList = useMemo(
        () =>
            allWifiId.filter((wifi) => {
                if (isHidenWifiShown) return true;
                return wifi.enabled === true;
            }),
        [allWifiId, isHidenWifiShown]
    );

    return (
        <div className="font-mono min-h-screen h-full w-screen flex justify-center items-center flex-col bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 gap-y-5 px-10  py-10 overflow-y-auto">
            <Head>
                <title>Wifi IDs</title>
                <meta name="All wifi networks and their IDs" />
            </Head>
            <h1 className="text-4xl font-semibold mb-10">Wifi IDs</h1>
            <p className="text-sm text-center italic opacity-70 hover:opacity-100 mb-2 group">
                Get guest wifi ID and add it to env variables as{' '}
                <b className="group-hover:text-emerald-500 dark:group-hover:text-emerald-400">
                    UNIFI_SELECTED_NETWORK_ID
                </b>
            </p>
            <div className="flex items-center gap-x-2 w-full mb-5 ">
                <label htmlFor="show-disabled-wifi">Show disabled wifi?</label>
                <input
                    type="checkbox"
                    className="accent-emerald-300"
                    name="show-disabled-wifi"
                    checked={isHidenWifiShown}
                    onChange={(e) => setIsHidenWifiShown(e.target.checked)}
                />
            </div>
            <div className="flex flex-col justify-center items-center w-full gap-y-5">
                {filteredWifiList.map((wifi, index) => (
                    <div
                        className={`rounded-lg px-5 py-5 w-full max-w-lg bg-slate-300 dark:bg-slate-700 h-20 flex justify-center items-center hover:scale-105 transition-all ${
                            wifi.enabled ? 'opacity-100' : 'opacity-60'
                        }`}
                        key={wifi.id}
                    >
                        <TextLabel title={wifi.name} body={wifi.id} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WifiIDList;
