import { createContext, useContext } from 'react';
import type { ComponentType, ReactNode } from 'react';

export type UiLabels = {
    optional: string;
    cancel: string;
    chooseFile: string;
    light: string;
    dark: string;
    system: string;
};

export type UiLinkProps = {
    href: string;
    className?: string;
    onClick?: () => void;
    'data-test'?: string;
    'data-layer'?: boolean;
    children?: ReactNode;
};

type UiConfig = {
    labels: UiLabels;
    link: ComponentType<UiLinkProps>;
    locale: string;
    weekStart: number;
    onLeave: (listener: () => void) => () => void;
};

const defaults: UiConfig = {
    labels: {
        optional: 'opcional',
        cancel: 'Cancelar',
        chooseFile: 'Escolher arquivo',
        light: 'Claro',
        dark: 'Escuro',
        system: 'Sistema',
    },
    link: (props) => <a {...props} />,
    locale: 'pt-BR',
    weekStart: 0,
    onLeave: () => () => {},
};

const UiContext = createContext<UiConfig>(defaults);

type Props = Partial<Omit<UiConfig, 'labels'>> & {
    labels?: Partial<UiLabels>;
    children: ReactNode;
};

export function UiProvider(props: Props) {
    const { labels, children, ...rest } = props;

    return (
        <UiContext
            value={{
                ...defaults,
                ...rest,
                labels: { ...defaults.labels, ...labels },
            }}
        >
            {children}
        </UiContext>
    );
}

export function useUi(): UiConfig {
    return useContext(UiContext);
}

export function useUiLabels(): UiLabels {
    return useUi().labels;
}
