import React, {LegacyRef, useRef} from 'react';

interface TextLabelProps
    extends React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
    > {
    title: string;
    body: string;
}

const TextLabel: React.FC<TextLabelProps> = ({
    title,
    body,
    className,
    ...props
}) => {
    const bodyRef: LegacyRef<HTMLHeadingElement> | undefined = useRef(null);

    return (
        <div
            className={`flex w-full gap-x-1 justify-center flex-wrap ${className}`}
            {...props}
        >
            <h3 className="">{title + ':'}</h3>
            <h4
                ref={bodyRef}
                onMouseOver={() => bodyRef.current?.focus()}
                className="font-semibold hover:text-emerald-600 dark:hover:text-emerald-400"
            >
                {body}
            </h4>
        </div>
    );
};

export default TextLabel;
