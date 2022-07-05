import {getReasonPhrase} from 'http-status-codes';
import Link from 'next/link';
import CustomButton from '../components/CustomButton';

interface ErrorProps {
    statusCode: number;
    errorMessage: string | null;
}

const Error: React.FC<ErrorProps> = () => {
    return (
        <div className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 w-screen h-full min-h-screen flex flex-col justify-center items-center font-mono ">
            <div className="px-10 py-10 rounded-lg w-[80vw] max-w-2xl justify-center bg-slate-300 dark:bg-slate-700 flex flex-col gap-y-4 shadow-lg hover:scale-[1.02] transition-all group">
                <h1 className="text-9xl self-center">{404}</h1>
                <h1 className="text-red-600 font-semibold text-2xl">
                    Ooops! {getReasonPhrase(404)}
                </h1>
                <Link href="/">
                    <a className="self-center">
                        <CustomButton className="w-40">
                            Go Back Home
                        </CustomButton>
                    </a>
                </Link>
            </div>
        </div>
    );
};

export default Error;
