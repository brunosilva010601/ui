import { Slot } from '@radix-ui/react-slot';
import { LoaderCircle } from 'lucide-react';
import type { ComponentProps } from 'react';
import { useFormId } from './form/form';
import { cn } from './lib/utils';
import { palette } from './palette';
import type { PaletteColor } from './palette';
import { tones } from './tones';
import type { Tone } from './tones';

const markClass =
    'border-current bg-current/10 hover:bg-current/10 active:bg-current/10';

export type ButtonMark = Tone | PaletteColor;

function markText(mark: ButtonMark): string {
    return mark in tones
        ? tones[mark as Tone].text
        : palette[mark as PaletteColor].text;
}

export const ghostHoverClass = 'hover:bg-foreground/5 active:bg-foreground/5';

export const touchClass =
    'relative after:absolute after:top-1/2 after:left-1/2 after:size-touch after:-translate-1/2';

const variants = {
    primary:
        'cursor-pointer transition border border-primary bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-hover',
    outline:
        'cursor-pointer transition border border-border bg-control text-foreground hover:bg-control-hover active:bg-control-hover data-[state=on]:border-foreground data-[state=on]:bg-foreground data-[state=on]:text-background',
    ghost: `border border-transparent text-foreground-muted ${ghostHoverClass} hover:text-foreground active:text-foreground cursor-pointer transition-colors data-[state=on]:bg-foreground/5 data-[state=on]:text-foreground data-[state=open]:bg-foreground/5 data-[state=open]:text-foreground`,
    danger: 'cursor-pointer transition border border-danger bg-danger text-danger-foreground hover:bg-danger-hover active:bg-danger-hover',
    link: 'text-primary-text cursor-pointer underline-offset-4 hover:underline active:underline',
};

const shapes = {
    box: 'inline-flex shrink-0 items-center justify-center rounded-full whitespace-nowrap select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
    link: 'has-[svg]:inline-flex has-[svg]:shrink-0 has-[svg]:items-center has-[svg]:gap-8px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
};

const variantShapes: Record<keyof typeof variants, keyof typeof shapes> = {
    primary: 'box',
    outline: 'box',
    ghost: 'box',
    danger: 'box',
    link: 'link',
};

const bleedSides =
    'px-6px -mx-[calc(var(--spacing-6px)_+_1px)] -my-[calc(var(--pad-y)_+_1px)]';

const bleedBackdrop =
    'relative isolate before:absolute before:inset-y-0 before:-inset-x-[calc(var(--pad)_-_var(--spacing-6px))] before:-z-10 before:rounded-full before:transition-colors hover:bg-transparent active:bg-transparent data-[state=open]:bg-transparent hover:before:bg-foreground/5 active:before:bg-foreground/5 data-[state=open]:before:bg-foreground/5';

const sizes = {
    md: {
        text: '[--pad:var(--spacing-16px)] [--pad-y:var(--spacing-10px)] px-(--pad) py-(--pad-y) text-14px',
        square: "[--pad:var(--spacing-10px)] [--pad-y:var(--spacing-10px)] p-(--pad) [&_svg:not([class*='size-'])]:size-icon-20px",
        link: 'text-14px',
        icon: "gap-8px [&_svg:not([class*='size-'])]:size-icon-16px",
    },
    sm: {
        text: '[--pad:var(--spacing-12px)] [--pad-y:var(--spacing-6px)] px-(--pad) py-(--pad-y) text-12px',
        square: "[--pad:var(--spacing-6px)] [--pad-y:var(--spacing-6px)] p-(--pad) [&_svg:not([class*='size-'])]:size-icon-16px",
        link: 'text-12px',
        icon: "gap-4px [&_svg:not([class*='size-'])]:size-icon-14px",
    },
};

export type ButtonVariant = keyof typeof variants;

export type ButtonSize = keyof typeof sizes;

type ButtonProps = Omit<ComponentProps<'button'>, 'type'> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    square?: boolean;
    bleed?: boolean;
    busy?: boolean;
    mark?: ButtonMark;
    asChild?: boolean;
    type?: 'button' | 'submit';
    'data-test'?: string;
};

type ButtonClassOptions = {
    variant?: keyof typeof variants;
    size?: keyof typeof sizes;
    square?: boolean;
    bleed?: boolean;
    className?: string;
};

export function buttonClass({
    variant = 'primary',
    size,
    square = false,
    bleed = false,
    className,
}: ButtonClassOptions = {}) {
    const shape = variantShapes[variant];
    const isBox = shape === 'box';
    const box = sizes[size ?? 'md'];

    return cn(
        shapes[shape],
        variants[variant],
        box.icon,
        shape === 'link' && size && sizes[size].link,
        isBox && (square ? box.square : box.text),
        bleed && isBox && bleedSides,
        bleed && isBox && bleedBackdrop,
        className,
    );
}

export function Button(props: ButtonProps) {
    const {
        variant,
        size,
        square,
        bleed,
        busy,
        mark,
        asChild = false,
        type = 'button',
        className,
        children,
        ...rest
    } = props;
    const Component = asChild ? Slot : 'button';
    const formId = useFormId();
    const submit = !asChild && type === 'submit';
    const working = !asChild && busy;

    return (
        <Component
            type={asChild ? undefined : type}
            form={submit ? formId : undefined}
            aria-busy={working || undefined}
            className={buttonClass({
                variant,
                size,
                square,
                bleed,
                className: cn(
                    working && '[&>svg]:hidden',
                    mark && [markClass, markText(mark)],
                    className,
                ),
            })}
            {...rest}
            disabled={rest.disabled || working || undefined}
        >
            {working ? (
                <>
                    <span className="contents">
                        <LoaderCircle className="animate-spin" />
                    </span>
                    {children}
                </>
            ) : (
                children
            )}
        </Component>
    );
}

export function FloatingButton(props: ButtonProps) {
    const { className, ...rest } = props;

    return (
        <Button
            square
            className={cn(
                "p-12px shadow-floating [&_svg:not([class*='size-'])]:size-icon-24px",
                className,
            )}
            {...rest}
        />
    );
}
