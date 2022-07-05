/* eslint-disable react-hooks/rules-of-hooks */
import axios, {AxiosError} from 'axios';
import isReachable from 'is-reachable';
import Head from 'next/head';
import React, {useEffect, useState} from 'react';
import CustomButton from '../components/CustomButton';
import TextLabel from '../components/TextLabel';
import {PageError} from '../lib/error/error-constructor';
import {unifi, unifiLogin} from '../services/unifi/config';
import {IWlanSettings} from '../types/unifi/unifi-types';

// @ts-ignore
export const getServerSideProps: GetServerSideProps = async ({req, res}) => {
    let errorCode: number;
    let errorMessage: string;

    try {
        if (!process.env.CHANGE_WIFI_TOKEN) {
            return {
                notFound: true,
            };
        }

        if (!process.env.UNIFI_SELECTED_NETWORK_ID) {
            return {
                notFound: true,
            };
        }

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

        if (
            (await isReachable(
                `${process.env.UNIFI_CONTROLLER_HOST}:${process.env.UNIFI_CONTROLLER_PORT}`
            )) === false
        ) {
            throw new PageError(
                502,
                'Could not access host. Check env variable or firewall.'
            );
        }

        await unifiLogin();
        const guestWifiState: IWlanSettings[] = await unifi.getWLanSettings(
            process.env.UNIFI_SELECTED_NETWORK_ID
        );

        if (guestWifiState.length === 0) {
            errorCode = 500;
            errorMessage = encodeURIComponent(
                `Wifi code with ID: ${process.env.UNIFI_SELECTED_NETWORK_ID} could not be found`
            );

            throw new PageError(errorCode, errorMessage);
        }

        if (guestWifiState.length > 1) {
            errorCode = 500;
            errorMessage = encodeURIComponent(
                `Wifi code with ID: ${process.env.UNIFI_SELECTED_NETWORK_ID} has conflicting IDs with the Unifi Controller. Check unifi controller or correct the UNIFI_SELECTED_NETWORK_ID env variable`
            );

            throw new PageError(errorCode, errorMessage);
        }

        return {
            props: {
                guestWifiCredentials: {
                    networkName: guestWifiState[0].name,
                    password: guestWifiState[0].x_passphrase,
                },
            },
        };
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.code === 'ECONNREFUSED') {
                errorCode = 502;
                errorMessage =
                    'Could not access host. Check env variable or firewall.';
            } else {
                errorCode = error.response?.status || 502;
                errorMessage = error.response?.data
                    ? typeof error.response.data === 'object'
                        ? JSON.stringify(error.response.data)
                        : error.response.data
                    : 'Could not log in to unifi controller';
            }

            console.error(`${errorCode}: ${errorMessage}`);
            return {
                redirect: {
                    destination: `/error?statusCode=${errorCode}&errorMessage=${errorMessage}`,
                },
                props: {},
            };
        }

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

interface ChangePasswordProps {
    guestWifiCredentials: {
        networkName: string;
        password: string;
    };
}

const change: React.FC<ChangePasswordProps> = ({
    guestWifiCredentials: {networkName, password},
}) => {
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isTokenShown, setIsTokenShown] = useState(false);
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [modalContent, setModalContent] = useState<{
        type: 'error' | 'success' | null;
        message: string;
    }>({
        type: null,
        message: '',
    });

    const handleFormSubmission = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        try {
            await axios.post('/api/wifi/change-password', {
                token: token,
                newPassword: newPassword,
            });
            setNewPassword('');
            setToken('');
            setModalContent({
                type: 'success',
                message: 'Wifi password changed',
            });
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error(error.response?.status, error.response?.data);
                setModalContent({
                    type: 'error',
                    message: `Error: ${error.response?.data}`,
                });
            }
            console.error(error);
        }
    };

    useEffect(() => {
        if (!modalContent.type) return;

        const interval = setInterval(() => {
            setModalContent({
                type: null,
                message: '',
            });
        }, 6000);

        return () => clearInterval(interval);
    }, [modalContent]);

    useEffect(() => {
        if (!token) return;
        if (!newPassword) return;

        setModalContent({
            type: null,
            message: '',
        });
    }, [token, newPassword]);

    return (
        <div
            className="relative font-mono h-screen w-screen flex justify-center items-center flex-col bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 overflow-hidden
    "
        >
            <Head>
                <title>Change Wifi Password</title>
                <meta name="Change Wifi Password" />
            </Head>

            <div className="relative bg-slate-300 dark:bg-slate-700 px-5 shadow-xl py-12 h-[80vh] w-[80vw] max-w-[20rem] max-h-[34rem] flex flex-col justify-center items-center rounded-lg hover:scale-[1.02] transition-all overflow-auto gap-y-4">
                <h1 className="mb-10 text-2xl font-semibold">
                    Change Password
                </h1>
                <TextLabel title={'Wifi name'} body={networkName} />
                <TextLabel title={'Current password'} body={password} />

                <form
                    className="relative flex flex-col gap-y-4"
                    onSubmit={(e) => handleFormSubmission(e)}
                >
                    <div className="relative">
                        <input
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                            }}
                            type={isPasswordShown ? 'text' : 'password'}
                            className="px-3 py-2 pr-11 rounded-lg border-2 invalid:border-red-400 border-emerald-500 focus:outline-none dark:text-slate-800 mt-5"
                            placeholder="New Password"
                            // pattern=''
                            minLength={9}
                            maxLength={60}
                            required
                        />
                        {newPassword.length > 0 && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    setIsPasswordShown((prevVal) => !prevVal);
                                }}
                                className="absolute text-slate-800 text-xs opacity-80 font-semibold top-8 right-2 hover:text-emerald-500"
                            >
                                {isPasswordShown ? 'Hide' : 'Show'}
                            </button>
                        )}
                    </div>

                    <div className="relative">
                        <input
                            value={token}
                            onChange={(e) => {
                                setToken(e.target.value);
                            }}
                            type={isTokenShown ? 'text' : 'password'}
                            className="px-3 py-2 pr-11 rounded-lg border-2 invalid:border-red-400 border-emerald-500 focus:outline-none dark:text-slate-800 mb-5"
                            placeholder="Authentication token"
                            required
                            min={1}
                        />
                        {token.length > 0 && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    setIsTokenShown((prevVal) => !prevVal);
                                }}
                                className="absolute text-slate-800 text-xs opacity-80 font-semibold top-4 right-2 hover:text-emerald-500"
                            >
                                {isTokenShown ? 'Hide' : 'Show'}
                            </button>
                        )}
                    </div>

                    <CustomButton
                        className={`max-w-32 self-center capitalize`}
                        type="submit"
                        disabled={modalContent.type ? true : false}
                    >
                        {modalContent.type || 'Submit'}
                    </CustomButton>
                </form>
                {modalContent.type && (
                    <p
                        className={`absolute self-center bottom-7 ${
                            modalContent.type === 'error'
                                ? 'text-red-500'
                                : 'text-emerald-500'
                        }`}
                    >
                        {modalContent.message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default change;
