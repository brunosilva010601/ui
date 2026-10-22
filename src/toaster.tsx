import {
    ChevronRight,
    CircleCheck,
    CircleX,
    Info,
    TriangleAlert,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { toast, Toaster as Sonner } from 'sonner';
import { Button } from './button';
import { cn } from './lib/utils';

const DURATION_MS = 5000;

const abovePageBottom = {
    bottom: 'calc(var(--page-bottom, env(safe-area-inset-bottom)) + var(--gap-sm))',
};

export type NoticeTone = 'success' | 'info' | 'warning' | 'error';

const tones: Record<NoticeTone, { icon: LucideIcon; className: string }> = {
    success: { icon: CircleCheck, className: 'text-success' },
    info: { icon: Info, className: 'text-primary-text' },
    warning: { icon: TriangleAlert, className: 'text-warning' },
    error: { icon: CircleX, className: 'text-danger' },
};

type Notice = {
    tone?: NoticeTone;
    title: ReactNode;
    description?: ReactNode;
    onOpen?: () => void;
    action?: { label: string; icon?: LucideIcon; onClick: () => void };
};

type ToastCardProps = Notice & {
    id: string | number;
};

function ToastCard(props: ToastCardProps) {
    const tone = tones[props.tone ?? 'success'];
    const content = (
        <>
            <tone.icon
                className={cn('size-icon-md shrink-0', tone.className)}
            />
            <span className="flex min-w-0 flex-1 flex-col text-left">
                <span className="text-sm font-semibold">{props.title}</span>
                {props.description && (
                    <span className="text-xs text-foreground-muted">
                        {props.description}
                    </span>
                )}
            </span>
            {props.onOpen && (
                <ChevronRight className="size-icon-sm shrink-0 text-foreground-muted" />
            )}
        </>
    );
    const contentClass = 'flex min-w-0 flex-1 items-center gap-md px-md py-md';

    return (
        <div className="relative flex w-full items-center transition-colors has-[>[data-layer]:active]:bg-surface-hover [@media(hover:hover)]:has-[>[data-layer]:hover]:bg-surface-hover">
            {props.onOpen ? (
                <button
                    data-layer
                    type="button"
                    onClick={() => {
                        props.onOpen?.();
                        toast.dismiss(props.id);
                    }}
                    className={cn(
                        contentClass,
                        'cursor-pointer after:absolute after:inset-0',
                    )}
                >
                    {content}
                </button>
            ) : (
                <div className={contentClass}>{content}</div>
            )}
            {props.action && (
                <div className="pointer-events-none relative shrink-0 pe-md *:pointer-events-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            props.action?.onClick();
                            toast.dismiss(props.id);
                        }}
                    >
                        {props.action.icon && <props.action.icon />}
                        {props.action.label}
                    </Button>
                </div>
            )}
        </div>
    );
}

export function notify(notice: Notice): void {
    const id = toast.custom((id) => <ToastCard id={id} {...notice} />, {
        duration: Infinity,
    });

    window.setTimeout(() => toast.dismiss(id), DURATION_MS);
}

type ToasterProps = {
    scheme: 'light' | 'dark';
};

export function Toaster(props: ToasterProps) {
    const inverse = props.scheme === 'dark' ? 'light' : 'dark';

    return (
        <Sonner
            position="bottom-right"
            offset={abovePageBottom}
            mobileOffset={abovePageBottom}
            toastOptions={{
                unstyled: true,
                classNames: {
                    toast: cn(
                        inverse,
                        'pointer-events-auto w-full overflow-hidden rounded border border-border bg-surface text-foreground shadow-lg',
                    ),
                },
            }}
        />
    );
}
