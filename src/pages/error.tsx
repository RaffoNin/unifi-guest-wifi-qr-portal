/* eslint-disable react-hooks/rules-of-hooks */
import {GetServerSideProps, NextPage} from 'next';
import {useRouter} from 'next/router';
import React, {useEffect} from 'react';
import Error, {ErrorProps} from '../components/Error';

interface errorPageProps extends ErrorProps {}

export const getServerSideProps: GetServerSideProps<errorPageProps> = async ({
    req,
    res,
    query,
}) => {
    const {statusCode, errorMessage} = query;
    if (!statusCode) {
        return {
            redirect: {
                destination: '/',
                permanent: true,
            },
        };
    }

    return {
        props: {
            statusCode: parseInt(statusCode as string) || null,
            errorMessage: (errorMessage as string) || null,
        },
    };
};

const error: NextPage<errorPageProps> = ({errorMessage, statusCode}) => {
    const Router = useRouter();

    useEffect(() => {
        if (statusCode) {
            Router.push(
                {
                    pathname: `/error`,
                    query: undefined,
                },
                undefined,
                {
                    shallow: true,
                }
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusCode]);

    return <Error statusCode={statusCode} errorMessage={errorMessage} />;
};

export default error;
