import { ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { toast, Toaster as Sonner } from 'sonner';
import { Button } from './button';
import { cn } from './lib/utils';
import { tones } from './tones';
import type { Tone } from './tones';

const DURATION_MS = 5000;

const abovePageBottom = {
    bottom: 'calc(var(--page-bottom, var(--spacing-safe-bottom)) + var(--spacing-2))',
};

type Notice = {
    tone?: Tone;
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
            <tone.icon className={cn('size-5 shrink-0', tone.text)} />
            <span className="flex min-w-0 flex-1 flex-col text-left">
                <span className="text-sm font-semibold">{props.title}</span>
                {props.description && (
                    <span className="text-xs text-foreground-muted">
                        {props.description}
                    </span>
                )}
            </span>
            {props.onOpen && (
                <ChevronRight className="size-4 shrink-0 text-foreground-muted" />
            )}
        </>
    );
    const contentClass = 'flex min-w-0 flex-1 items-center gap-3 p-3';

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
                <div className="pointer-events-none relative shrink-0 pe-3 *:pointer-events-auto">
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
                        'pointer-events-auto w-full overflow-hidden rounded border border-border bg-surface text-foreground shadow-floating',
                    ),
                },
            }}
        />
    );
}
