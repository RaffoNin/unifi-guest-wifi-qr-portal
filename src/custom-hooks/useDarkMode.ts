import {useEffect, useState} from 'react';

const useDarkMode = () => {
    const [isDarkMode, setIsDarkMode] = useState<null | boolean>(null);

    useEffect(() => {
        // Initial check
        if (
            window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches
        ) {
            setIsDarkMode(true);
        } else {
            setIsDarkMode(false);
        }

        // listen for changes
        window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (event) => {
                event.matches ? setIsDarkMode(true) : setIsDarkMode(false);
            });
    }, []);

    return [isDarkMode] as const;
};

export default useDarkMode;
