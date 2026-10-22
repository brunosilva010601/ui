import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import type { LucideIcon } from 'lucide-react';
import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { ghostHoverClass } from './button';
import { cn } from './lib/utils';

const layouts = {
    wrap: 'flex flex-wrap gap-sm',
    row: 'flex gap-xs',
    fill: 'flex gap-xs *:min-w-0 *:flex-1 *:px-sm',
    cards: 'flex gap-md max-sm:grid max-sm:grid-cols-2',
};

const variants = {
    pill: {
        shape: 'rounded-full',
        choice: 'border-border bg-control text-foreground hover:bg-control-hover active:bg-control-hover data-[state=on]:border-foreground data-[state=on]:bg-foreground data-[state=on]:text-background data-[state=on]:outline-none',
    },
    ghost: {
        shape: 'rounded-full',
        choice: `border-transparent text-foreground-muted ${ghostHoverClass} data-[state=on]:bg-foreground/5 data-[state=on]:text-foreground`,
    },
    icon: {
        shape: 'rounded-full',
        choice: `border-transparent text-foreground-muted ${ghostHoverClass} data-[state=on]:bg-current/10`,
    },
    card: {
        shape: 'h-auto flex-col items-stretch gap-sm rounded p-sm text-left',
        choice: 'border-border bg-control text-foreground hover:bg-control-hover active:bg-control-hover data-[state=on]:border-primary data-[state=on]:ring-1 data-[state=on]:ring-primary',
    },
};

const tones = {
    neutral: 'border-border bg-control text-foreground',
    accent: 'border-primary bg-primary text-primary-foreground',
    selected: 'border-foreground bg-foreground text-background',
};

const sizes = {
    sm: {
        text: 'gap-xs px-sm py-2xs text-xs font-semibold [&_svg]:size-icon-xs',
        round: 'p-xs [&_svg]:size-icon-xs',
        count: 'px-xs py-2xs text-xs font-semibold tabular-nums',
    },
    md: {
        text: 'gap-sm px-md py-sm text-sm [&_svg]:size-icon-sm',
        round: 'p-sm [&_svg]:size-icon-md',
        count: 'px-md py-sm text-sm tabular-nums',
    },
};

type Variant = keyof typeof variants;

type Size = keyof typeof sizes;

const GroupContext = createContext<{ variant: Variant; size: Size } | null>(
    null,
);

function chipClass(variant: Variant, size: Size, count: boolean) {
    const round = variant === 'icon';

    return cn(
        'inline-flex shrink-0 items-center justify-center border transition [&_svg]:shrink-0',
        variants[variant].shape,
        variant === 'card'
            ? 'text-sm'
            : count
              ? sizes[size].count
              : round
                ? sizes[size].round
                : sizes[size].text,
    );
}

type ChipProps = {
    value?: string;
    variant?: Variant;
    size?: Size;
    tone?: keyof typeof tones;
    count?: boolean;
    title?: string;
    'aria-label'?: string;
    className?: string;
    onClick?: () => void;
    children: ReactNode;
};

export function Chip(props: ChipProps) {
    const group = useContext(GroupContext);
    const variant = props.variant ?? group?.variant ?? 'pill';
    const size = props.size ?? group?.size ?? 'md';
    const base = chipClass(variant, size, props.count ?? false);
    const choice = cn(
        base,
        'cursor-pointer disabled:pointer-events-none disabled:opacity-50',
        variants[variant].choice,
        props.className,
    );

    if (props.onClick) {
        return (
            <button
                type="button"
                title={props.title}
                aria-label={props['aria-label']}
                onClick={props.onClick}
                className={choice}
            >
                {props.children}
            </button>
        );
    }

    if (group) {
        return (
            <ToggleGroupPrimitive.Item
                value={props.value ?? ''}
                title={props.title}
                aria-label={props['aria-label']}
                className={choice}
            >
                {props.children}
            </ToggleGroupPrimitive.Item>
        );
    }

    return (
        <span
            title={props.title}
            className={cn(
                base,
                'w-fit whitespace-nowrap',
                tones[props.tone ?? 'neutral'],
                props.className,
            )}
        >
            {props.children}
        </span>
    );
}

export type ChipOption<T extends string> = {
    value: T;
    label: string;
    icon?: LucideIcon;
    lang?: string;
    className?: string;
};

type ChipGroupProps<T extends string> = {
    options?: ChipOption<T>[];
    layout?: keyof typeof layouts;
    variant?: Variant;
    size?: Size;
    iconOnly?: boolean;
    'aria-label'?: string;
    children?: ReactNode;
} & (
    | {
          multiple?: false;
          value: T;
          onChange: (value: T) => void;
      }
    | {
          multiple: true;
          value: T[];
          onChange: (value: T[]) => void;
      }
);

export function ChipGroup<T extends string>(props: ChipGroupProps<T>) {
    const layout = layouts[props.layout ?? 'wrap'];
    const items =
        props.children ??
        props.options?.map((option) => (
            <Chip
                key={option.value}
                value={option.value}
                className={option.className}
                aria-label={props.iconOnly ? option.label : undefined}
                title={props.iconOnly ? option.label : undefined}
            >
                {option.icon && <option.icon />}
                {!props.iconOnly && (
                    <span lang={option.lang}>{option.label}</span>
                )}
            </Chip>
        ));
    const context = {
        variant: props.variant ?? 'pill',
        size: props.size ?? 'md',
    };

    if (props.multiple) {
        const onChange = props.onChange;

        return (
            <GroupContext value={context}>
                <ToggleGroupPrimitive.Root
                    type="multiple"
                    className={layout}
                    aria-label={props['aria-label']}
                    value={props.value}
                    onValueChange={(value) => onChange(value as T[])}
                >
                    {items}
                </ToggleGroupPrimitive.Root>
            </GroupContext>
        );
    }

    const onChange = props.onChange;

    return (
        <GroupContext value={context}>
            <ToggleGroupPrimitive.Root
                type="single"
                className={layout}
                aria-label={props['aria-label']}
                value={props.value}
                onValueChange={(value) => value && onChange(value as T)}
            >
                {items}
            </ToggleGroupPrimitive.Root>
        </GroupContext>
    );
}
