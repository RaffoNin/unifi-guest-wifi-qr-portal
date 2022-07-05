interface ErrorProps {
    statusCode: number;
    errorMessage: string | null;
}

const Error: React.FC<ErrorProps> = () => {
    return <Error statusCode={404} errorMessage={null} />;
};

export default Error;
