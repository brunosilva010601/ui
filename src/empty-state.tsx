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
    icon: LucideIcon;
    title: string;
    description?: string;
    action?: EmptyAction;
    className?: string;
};

function ActionButton(props: EmptyAction) {
    const { link: Link } = useUi();
    const content = (
        <>
            <props.icon />
            {props.label}
        </>
    );

    return props.href ? (
        <Button asChild>
            <Link href={props.href}>{content}</Link>
        </Button>
    ) : (
        <Button onClick={props.onClick}>{content}</Button>
    );
}

export function EmptyState(props: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center gap-md py-xl text-center',
                props.className,
            )}
        >
            <IconBadge icon={props.icon} size="lg" />
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
