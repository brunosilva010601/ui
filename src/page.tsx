import { createContext, useContext, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Container } from './container';
import type { ContainerWidth } from './container';
import { cn } from './lib/utils';

const PageWidth = createContext<ContainerWidth>('page');

type AppShellProps = {
    sidebar?: ReactNode;
    aside?: ReactNode;
    className?: string;
    children: ReactNode;
};

export function AppShell(props: AppShellProps) {
    return (
        <div className={cn('flex min-h-dvh', props.className)}>
            {props.sidebar}
            <div className="flex min-w-0 flex-1 lg:overflow-clip lg:border-l lg:border-border lg:bg-background lg:[--color-background:var(--color-canvas)]">
                {props.children}
                {props.aside}
            </div>
        </div>
    );
}

type PageBottomProps = {
    floating?: ReactNode;
    className?: string;
    children?: ReactNode;
};

export function PageBottom(props: PageBottomProps) {
    const root = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = root.current;
        const style = document.documentElement.style;

        if (!element) {
            return;
        }

        const observer = new ResizeObserver(() =>
            style.setProperty('--page-bottom', `${element.offsetHeight}px`),
        );
        observer.observe(element);

        return () => {
            observer.disconnect();
            style.removeProperty('--page-bottom');
        };
    }, []);

    return (
        <div
            ref={root}
            className="pointer-events-none sticky bottom-0 z-20 w-full"
        >
            {props.floating && (
                <div className="flex justify-end gap-2 px-(--gutter) pb-3 *:pointer-events-auto">
                    {props.floating}
                </div>
            )}
            <div
                className={cn(
                    'pointer-events-auto w-full pb-safe-bottom',
                    props.className,
                )}
            >
                {props.children}
            </div>
        </div>
    );
}

type PageFooterProps = {
    flush?: boolean;
    className?: string;
    children: ReactNode;
};

export function PageFooter(props: PageFooterProps) {
    const width = useContext(PageWidth);

    return (
        <PageBottom
            className={cn(
                'flex justify-center border-t border-border bg-background',
                !props.flush &&
                    'pb-[max(var(--gutter),var(--spacing-safe-bottom))]',
                props.flush && 'pb-0',
                props.className,
            )}
        >
            <Container
                width={width}
                className={cn(!props.flush && 'grid gap-2 px-(--gutter) pt-3')}
            >
                {props.children}
            </Container>
        </PageBottom>
    );
}

type PageProps = {
    header?: ReactNode;
    bottom?: ReactNode;
    width?: ContainerWidth;
    centered?: boolean;
    className?: string;
    children: ReactNode;
};

export function Page(props: PageProps) {
    const width = props.width ?? 'page';

    return (
        <PageWidth value={width}>
            <div
                className={cn(
                    'relative flex min-h-dvh min-w-0 flex-1 flex-col items-center overflow-x-clip',
                    !props.bottom && 'pb-safe-bottom',
                    props.className,
                )}
            >
                {props.header}
                <main className="flex w-full flex-1 justify-center">
                    <Container
                        width={width}
                        padded
                        className={cn(
                            'flex flex-col',
                            props.centered && 'justify-center',
                        )}
                    >
                        {props.children}
                    </Container>
                </main>
                {props.bottom}
            </div>
        </PageWidth>
    );
}
