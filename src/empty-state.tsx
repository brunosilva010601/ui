import type { LucideIcon } from 'lucide-react';
import { Button } from './button';
import { Heading } from './heading';
import { IconBadge } from './icon-badge';
import { cn } from './lib/utils';
import { useUi } from './provider';

type EmptyAction = {
    label: string;
    icon: LucideIcon;
    href?: string;
    onClick?: () => void;
};

export type EmptyStateProps = {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: EmptyAction;
    compact?: boolean;
    className?: string;
};

function ActionButton(props: EmptyAction & { size?: 'sm' }) {
    const { link: Link } = useUi();
    const content = (
        <>
            <props.icon />
            {props.label}
        </>
    );

    return props.href ? (
        <Button asChild size={props.size}>
            <Link href={props.href}>{content}</Link>
        </Button>
    ) : (
        <Button size={props.size} onClick={props.onClick}>
            {content}
        </Button>
    );
}

export function EmptyState(props: EmptyStateProps) {
    if (props.compact) {
        return (
            <div
                className={cn(
                    'flex items-center gap-12px p-12px',
                    props.className,
                )}
            >
                <p className="ui-note min-w-0 flex-1">
                    {props.title}
                    {props.description && ` ${props.description}`}
                </p>
                {props.action && <ActionButton {...props.action} size="sm" />}
            </div>
        );
    }

    return (
        <div
            className={cn(
                'flex flex-col items-center gap-12px py-32px text-center',
                props.className,
            )}
        >
            {props.icon && <IconBadge icon={props.icon} size="lg" />}
            <Heading
                as="p"
                title={props.title}
                description={props.description}
                className="max-w-sm flex-none"
            />
            {props.action && <ActionButton {...props.action} />}
        </div>
    );
}
