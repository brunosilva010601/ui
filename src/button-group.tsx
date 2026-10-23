import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import type { LucideIcon } from 'lucide-react';
import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { Button } from './button';
import type { ButtonSize } from './button';

const layouts = {
    wrap: 'flex flex-wrap gap-sm',
    row: 'flex gap-xs',
    fill: 'flex gap-xs *:min-w-0 *:flex-1',
};

type GroupVariant = 'outline' | 'ghost';

const GroupContext = createContext<{ variant: GroupVariant; size: ButtonSize }>(
    { variant: 'outline', size: 'md' },
);

type ButtonGroupItemProps = {
    value: string;
    square?: boolean;
    title?: string;
    className?: string;
    children: ReactNode;
};

export function ButtonGroupItem(props: ButtonGroupItemProps) {
    const { value, ...rest } = props;
    const group = useContext(GroupContext);

    return (
        <ToggleGroupPrimitive.Item value={value} asChild>
            <Button variant={group.variant} size={group.size} {...rest} />
        </ToggleGroupPrimitive.Item>
    );
}

export type ButtonGroupOption<T extends string> = {
    value: T;
    label: string;
    icon?: LucideIcon;
    lang?: string;
    className?: string;
};

type ButtonGroupProps<T extends string> = {
    options?: ButtonGroupOption<T>[];
    layout?: keyof typeof layouts;
    variant?: GroupVariant;
    size?: ButtonSize;
    iconOnly?: boolean;
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

export function ButtonGroup<T extends string>(props: ButtonGroupProps<T>) {
    const layout = layouts[props.layout ?? 'wrap'];
    const context = {
        variant: props.variant ?? 'outline',
        size: props.size ?? 'md',
    };
    const items =
        props.children ??
        props.options?.map((option) => (
            <ButtonGroupItem
                key={option.value}
                value={option.value}
                square={props.iconOnly}
                title={props.iconOnly ? option.label : undefined}
                className={option.className}
            >
                {option.icon && <option.icon />}
                {!props.iconOnly && (
                    <span lang={option.lang}>{option.label}</span>
                )}
            </ButtonGroupItem>
        ));

    if (props.multiple) {
        const onChange = props.onChange;

        return (
            <GroupContext value={context}>
                <ToggleGroupPrimitive.Root
                    type="multiple"
                    className={layout}
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
                value={props.value}
                onValueChange={(value) => value && onChange(value as T)}
            >
                {items}
            </ToggleGroupPrimitive.Root>
        </GroupContext>
    );
}
