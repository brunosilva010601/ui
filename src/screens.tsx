import type { ReactNode } from 'react';
import { Container } from './container';
import { cn } from './lib/utils';

type AuthScreenProps = {
    brand: ReactNode;
    title?: ReactNode;
    description?: ReactNode;
    className?: string;
    children?: ReactNode;
};

export function AuthScreen(props: AuthScreenProps) {
    return (
        <div
            className={cn(
                'flex min-h-dvh flex-col items-center justify-center overflow-x-hidden p-24px pt-[max(var(--spacing-24px),var(--spacing-safe-top))] pb-[max(var(--spacing-24px),var(--spacing-safe-bottom))] md:p-40px',
                props.className,
            )}
        >
            <Container width="narrow">
                <div className="flex flex-col gap-20px">
                    <div className="flex flex-col items-center gap-12px">
                        {props.title ? (
                            <>
                                {props.brand}
                                <div className="flex flex-col gap-8px text-center">
                                    <h1 className="text-24px font-bold">
                                        {props.title}
                                    </h1>
                                    <p className="text-foreground-muted">
                                        {props.description}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <h1>{props.brand}</h1>
                                <p className="text-center text-18px">
                                    {props.description}
                                </p>
                            </>
                        )}
                    </div>
                    {props.children}
                </div>
            </Container>
        </div>
    );
}

type ErrorScreenProps = {
    status: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    backdrop?: ReactNode;
    className?: string;
    children?: ReactNode;
};

export function ErrorScreen(props: ErrorScreenProps) {
    return (
        <div
            className={cn(
                'relative flex min-h-dvh items-center justify-center overflow-hidden px-16px pt-safe-top pb-safe-bottom',
                props.className,
            )}
        >
            {props.backdrop}
            <div className="relative flex max-w-md flex-col items-center gap-12px text-center">
                <p className="ui-hero text-primary-text">{props.status}</p>
                <h1 className="text-24px font-bold text-balance">
                    {props.title}
                </h1>
                {props.description && (
                    <p className="text-balance text-foreground-soft">
                        {props.description}
                    </p>
                )}
                {props.children}
            </div>
        </div>
    );
}
