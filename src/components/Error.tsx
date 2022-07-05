import {getReasonPhrase} from 'http-status-codes';
import Link from 'next/link';
import CustomButton from '../components/CustomButton';

export interface ErrorProps {
    statusCode: number | null;
    errorMessage: string | null;
}

const Error: React.FC<ErrorProps> = ({statusCode, errorMessage}) => {
    return (
        <div className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 w-screen h-full min-h-screen flex flex-col justify-center items-center font-mono ">
            <div className="px-10 py-10 rounded-lg w-[80vw] max-w-2xl justify-center bg-slate-300 dark:bg-slate-700 flex flex-col gap-y-4 shadow-lg hover:scale-[1.02] transition-all group">
                <h1 className="text-9xl self-center">{statusCode}</h1>
                {statusCode && (
                    <h1 className="text-red-600 font-semibold text-2xl">
                        Ooops! {getReasonPhrase(statusCode)}
                    </h1>
                )}
                {statusCode === 404 ? (
                    <Link href="/">
                        <CustomButton className="w-40 self-center">
                            Go Back Home
                        </CustomButton>
                    </Link>
                ) : (
                    <p>Contact system administrator.</p>
                )}
                {errorMessage && (
                    <p className="italic text-sm opacity-80 group-hover:opacity-100">
                        {errorMessage}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Error;
