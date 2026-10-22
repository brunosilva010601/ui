import type { ElementType, ReactNode } from 'react';
import { cn } from './lib/utils';

export const headingClass = 'flex min-w-0 flex-col gap-2xs';

type TitleProps = {
    as?: ElementType;
    children: ReactNode;
};

export function HeadingTitle(props: TitleProps) {
    const Title = props.as ?? 'h2';

    return <Title className="min-w-0 font-semibold">{props.children}</Title>;
}

export function HeadingDescription(props: TitleProps) {
    const Description = props.as ?? 'p';

    return (
        <Description className="text-sm text-pretty text-foreground-muted">
            {props.children}
        </Description>
    );
}

export function HeadingMeta(props: TitleProps) {
    const Meta = props.as ?? 'p';

    return (
        <Meta className="font-mono text-xs text-foreground-faint">
            {props.children}
        </Meta>
    );
}

type Props = {
    title?: ReactNode;
    description?: ReactNode;
    meta?: ReactNode;
    as?: ElementType;
    className?: string;
};

export function Heading(props: Props) {
    return (
        <div className={cn(headingClass, 'flex-1', props.className)}>
            {props.title && (
                <HeadingTitle as={props.as}>{props.title}</HeadingTitle>
            )}
            {props.description && (
                <HeadingDescription>{props.description}</HeadingDescription>
            )}
            {props.meta && <HeadingMeta>{props.meta}</HeadingMeta>}
        </div>
    );
}
