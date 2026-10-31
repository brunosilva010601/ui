import type { ElementType, ReactNode } from 'react';
import { cn } from './lib/utils';

export const headingClass = 'flex min-w-0 flex-col gap-2px';

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
        <Description className="ui-note text-pretty">
            {props.children}
        </Description>
    );
}

export function HeadingMeta(props: TitleProps) {
    const Meta = props.as ?? 'p';

    return (
        <Meta className="font-mono text-12px text-foreground-faint">
            {props.children}
        </Meta>
    );
}

type ItemTextProps = {
    title: ReactNode;
    secondary?: ReactNode;
    className?: string;
};

export function ItemText(props: ItemTextProps) {
    return (
        <div className={cn(headingClass, 'flex-1', props.className)}>
            <span className="ui-item-title truncate">{props.title}</span>
            {props.secondary && (
                <span className="ui-note truncate">{props.secondary}</span>
            )}
        </div>
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
