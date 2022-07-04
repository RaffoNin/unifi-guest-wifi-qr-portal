import React from 'react';

interface CustomButtonProp
    extends React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {}

const CustomButton: React.FC<CustomButtonProp> = ({className, ...props}) => {
    return (
        <button
            className={`py-2 px-4 rounded-lg bg-emerald-400 dark:bg-emerald-600 dark:hover:text-slate-300 hover:text-slate-100 dark:text-slate-900 hover:scale-105 transition-all active:scale-[1.02] ${className}`}
            {...props}
        />
    );
};

export default CustomButton;
