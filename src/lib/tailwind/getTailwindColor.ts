// @ts-ignore
import resolveConfig from 'tailwindcss/resolveConfig';
// @ts-ignore
import tailwindConfigRaw from '../../../tailwind.config';

const getTailwindColor = (colorName: string): string => {
    const tailwindConfig = resolveConfig(tailwindConfigRaw);
    // @ts-ignore
    return tailwindConfig.theme.colors[colorName];
};

export default getTailwindColor;
