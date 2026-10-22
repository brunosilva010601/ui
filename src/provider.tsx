import { createContext, useContext } from 'react';
import type { ComponentType, ReactNode } from 'react';

export type UiLabels = {
    optional: string;
    previous: string;
    next: string;
    today: string;
    cancel: string;
    close: string;
    loading: string;
    moreInfo: string;
    chooseFile: string;
    clearSearch: string;
    increase: string;
    decrease: string;
};

export type UiLinkProps = {
    href: string;
    className?: string;
    onClick?: () => void;
    'aria-label'?: string;
    'data-test'?: string;
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
        previous: 'Anterior',
        next: 'Próximo',
        today: 'Hoje',
        cancel: 'Cancelar',
        close: 'Fechar',
        loading: 'Carregando',
        moreInfo: 'Mais informações',
        chooseFile: 'Escolher arquivo',
        clearSearch: 'Limpar busca',
        increase: 'Aumentar',
        decrease: 'Diminuir',
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
