import React from 'react';

interface ModalProps
    extends React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
    > {}

const Modal: React.FC<ModalProps> = ({className, ...props}) => {
    return (
        <div
            className={`bg-slate-400 dark:bg-slate-600 dark:text-slate-200 py-4 px-4 rounded-md fixed bottom-10 shadow-xl ${className}`}
            {...props}
        />
    );
};

export default Modal;
