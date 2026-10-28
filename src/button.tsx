import { Slot } from '@radix-ui/react-slot';
import type { ReactNode } from 'react';
import { useFormId } from './form/form';
import { cn } from './lib/utils';

export const ghostHoverClass = 'hover:bg-foreground/5 active:bg-foreground/5';

export const touchClass =
    'relative after:absolute after:top-1/2 after:left-1/2 after:size-touch after:-translate-1/2';

const variants = {
    primary:
        'cursor-pointer transition border border-primary bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-hover',
    outline:
        'cursor-pointer transition border border-border bg-control text-foreground hover:bg-control-hover active:bg-control-hover data-[state=on]:border-foreground data-[state=on]:bg-foreground data-[state=on]:text-background',
    ghost: `border border-transparent text-foreground-muted ${ghostHoverClass} hover:text-foreground active:text-foreground cursor-pointer transition-colors data-[state=on]:bg-foreground/5 data-[state=on]:text-foreground`,
    danger: 'cursor-pointer transition border border-danger bg-danger text-danger-foreground hover:bg-danger-hover active:bg-danger-hover',
    link: 'text-primary-text cursor-pointer underline-offset-4 hover:underline active:underline',
};

const shapes = {
    box: 'inline-flex shrink-0 items-center justify-center rounded-full whitespace-nowrap select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
    link: 'has-[svg]:inline-flex has-[svg]:shrink-0 has-[svg]:items-center has-[svg]:gap-sm disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
};

const variantShapes: Record<keyof typeof variants, keyof typeof shapes> = {
    primary: 'box',
    outline: 'box',
    ghost: 'box',
    danger: 'box',
    link: 'link',
};

const blockClass =
    'w-full justify-start rounded px-(--row-inset) text-left whitespace-normal';

const bleedSides =
    'px-[calc(var(--gap-md)/2)] -mx-[calc(var(--gap-md)/2_+_var(--spacing)*0.25)]';

const bleedBackdrop =
    'relative isolate before:absolute before:inset-y-0 before:-inset-x-[calc(var(--pad)_-_var(--gap-md)/2)] before:-z-10 before:rounded-full before:transition-colors hover:bg-transparent active:bg-transparent hover:before:bg-foreground/5 active:before:bg-foreground/5';

const sizes = {
    md: {
        text: '[--pad:--spacing(4)] px-(--pad) py-2.5 text-sm',
        textBleed: '-my-2.75',
        square: '[--pad:--spacing(3)] p-(--pad)',
        squareBleed: '-my-3.25',
        link: 'text-sm',
        icon: "gap-sm [&_svg:not([class*='size-'])]:size-icon-sm",
    },
    sm: {
        text: '[--pad:--spacing(3)] px-(--pad) py-1.5 text-xs',
        textBleed: '-my-1.75',
        square: '[--pad:--spacing(1.5)] p-(--pad)',
        squareBleed: '-my-1.75',
        link: 'text-xs',
        icon: "gap-xs [&_svg:not([class*='size-'])]:size-icon-xs",
    },
};

export type ButtonVariant = keyof typeof variants;

export type ButtonSize = keyof typeof sizes;

type ButtonProps = (
    | { variant: 'outline' | 'ghost'; selected?: boolean }
    | {
          variant?: Exclude<ButtonVariant, 'outline' | 'ghost'>;
          selected?: never;
      }
) & {
    size?: ButtonSize;
    square?: boolean;
    block?: boolean;
    bleed?: boolean;
    asChild?: boolean;
    type?: 'button' | 'submit';
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
    title?: string;
    'data-test'?: string;
    children: ReactNode;
};

type ButtonClassOptions = {
    variant?: keyof typeof variants;
    size?: keyof typeof sizes;
    square?: boolean;
    block?: boolean;
    bleed?: boolean;
    className?: string;
};

export function buttonClass({
    variant = 'primary',
    size,
    square = false,
    block = false,
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
        block && isBox && blockClass,
        bleed && isBox && bleedSides,
        bleed && isBox && bleedBackdrop,
        bleed && isBox && (square ? box.squareBleed : box.textBleed),
        className,
    );
}

export function Button(props: ButtonProps) {
    const {
        variant,
        size,
        square,
        block,
        bleed,
        selected,
        asChild = false,
        type = 'button',
        className,
        ...rest
    } = props;
    const Component = asChild ? Slot : 'button';
    const formId = useFormId();
    const submit = !asChild && type === 'submit';

    return (
        <Component
            type={asChild ? undefined : type}
            form={submit ? formId : undefined}
            aria-pressed={asChild ? undefined : selected}
            aria-current={asChild ? selected || undefined : undefined}
            data-state={selected === undefined ? undefined : selected ? 'on' : 'off'}
            className={buttonClass({
                variant,
                size,
                square,
                block,
                bleed,
                className,
            })}
            {...rest}
            disabled={rest.disabled || undefined}
        />
    );
}
