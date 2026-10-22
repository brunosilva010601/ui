import * as TabsPrimitive from '@radix-ui/react-tabs';
import { useEffect, useRef, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { ghostHoverClass } from './button';
import { useEdgeFade } from './lib/edge-fade';
import { cn } from './lib/utils';

type TabsProps<T extends string> = {
    value: T;
    onValueChange?: (value: T) => void;
    children: ReactNode;
};

export function Tabs<T extends string>(props: TabsProps<T>) {
    const onValueChange = props.onValueChange;

    return (
        <TabsPrimitive.Root
            value={props.value}
            onValueChange={
                onValueChange && ((value) => onValueChange(value as T))
            }
        >
            {props.children}
        </TabsPrimitive.Root>
    );
}

type TabsListProps = {
    fit?: boolean;
    children: ReactNode;
};

function revealInList(
    list: HTMLElement,
    tab: HTMLElement | null,
    smooth: boolean,
) {
    if (!tab) {
        return;
    }

    const inset = parseFloat(getComputedStyle(list).paddingLeft) || 0;
    const start = tab.offsetLeft - inset;
    const end = tab.offsetLeft + tab.offsetWidth + inset;
    const left =
        start < list.scrollLeft
            ? start
            : end > list.scrollLeft + list.clientWidth
              ? end - list.clientWidth
              : null;

    if (left === null) {
        return;
    }

    list.scrollTo({
        left,
        behavior:
            smooth &&
            !window.matchMedia('(prefers-reduced-motion: reduce)').matches
                ? 'smooth'
                : 'auto',
    });
}

export function TabsList(props: TabsListProps) {
    const { fit, ...rest } = props;
    const [list, setList] = useState<HTMLDivElement | null>(null);
    const revealed = useRef<HTMLElement | null>(null);
    const fade = useEdgeFade(list);

    useEffect(() => {
        const active = list?.querySelector<HTMLElement>(
            '[data-state="active"]',
        );

        if (list && active && active !== revealed.current) {
            revealed.current = active;
            revealInList(list, active, false);
        }
    });

    const reveal = (event: MouseEvent<HTMLDivElement>) =>
        revealInList(
            event.currentTarget,
            (event.target as HTMLElement).closest<HTMLElement>('[role="tab"]'),
            true,
        );

    return (
        <div
            className={cn(
                'flex w-full rounded-full border border-border bg-control p-xs text-foreground-soft',
                fit && 'sm:w-fit',
            )}
        >
            <TabsPrimitive.List
                ref={setList}
                onClick={reveal}
                className={cn(
                    'relative flex w-full [scrollbar-width:none] items-center gap-xs overflow-x-auto rounded-full',
                    fit && 'sm:*:flex-none sm:*:px-md',
                    fade,
                )}
                {...rest}
            />
        </div>
    );
}

type TabsTriggerProps = {
    value: string;
    asChild?: boolean;
    children: ReactNode;
};

export function TabsTrigger(props: TabsTriggerProps) {
    return (
        <TabsPrimitive.Trigger
            className={cn(
                'inline-flex flex-1 cursor-pointer items-center justify-center gap-sm rounded-full border border-transparent px-sm py-sm text-sm whitespace-nowrap transition-colors hover:text-foreground focus-visible:-outline-offset-2 active:text-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-foreground data-[state=active]:text-background [&_svg]:size-icon-sm [&_svg]:shrink-0',
                ghostHoverClass,
            )}
            {...props}
        />
    );
}
