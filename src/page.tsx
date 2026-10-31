import { ArrowLeft } from 'lucide-react';
import { createContext, useContext, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Button } from './button';
import { Container } from './container';
import type { ContainerWidth } from './container';
import { ControlStrut } from './control-strut';
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

type PageHeaderProps = {
    title?: ReactNode;
    detail?: ReactNode;
    description?: ReactNode;
    icon?: ReactNode;
    onBack?: () => void;
    backLabel?: string;
    start?: ReactNode;
    center?: ReactNode;
    actions?: ReactNode;
    overlay?: ReactNode;
    className?: string;
};

export function PageHeader(props: PageHeaderProps) {
    const width = useContext(PageWidth);

    return (
        <header
            className={cn(
                'sticky top-0 z-20 flex w-full justify-center border-b border-border bg-background/95 pt-safe-top backdrop-blur lg:relative lg:bg-transparent lg:backdrop-blur-none',
                props.className,
            )}
        >
            <Container width={width}>
                <div className="flex items-center px-(--gutter) py-4px lg:py-8px">
                    <ControlStrut />
                    <div className="flex min-w-0 flex-1 items-center gap-12px">
                        {props.onBack ? (
                            <Button
                                square
                                bleed
                                variant="ghost"
                                aria-label={props.backLabel}
                                onClick={props.onBack}
                            >
                                <ArrowLeft />
                            </Button>
                        ) : (
                            props.start
                        )}
                        {props.title ? (
                            <div className="flex min-w-0 flex-1 flex-col gap-4px">
                                <div className="flex min-w-0 items-center gap-8px">
                                    {props.icon}
                                    <h1 className="ui-page-title truncate">
                                        {props.title}
                                    </h1>
                                    {props.detail && (
                                        <span className="ui-note shrink-0">
                                            {props.detail}
                                        </span>
                                    )}
                                    <ControlStrut />
                                </div>
                                {props.description && (
                                    <p className="hidden text-foreground-muted lg:block">
                                        {props.description}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="flex min-w-0 flex-1 items-center gap-20px">
                                {props.center}
                            </div>
                        )}
                        {props.actions && (
                            <div className="flex shrink-0 items-center gap-12px">
                                {props.actions}
                            </div>
                        )}
                    </div>
                </div>
            </Container>
            {props.overlay}
        </header>
    );
}

type PageBottomProps = {
    className?: string;
    children: ReactNode;
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
            className={cn(
                'sticky bottom-0 z-20 w-full pb-safe-bottom',
                props.className,
            )}
        >
            {props.children}
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
                className={cn(
                    !props.flush && 'grid gap-8px px-(--gutter) pt-12px',
                )}
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
