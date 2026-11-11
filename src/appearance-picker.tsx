import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { appearances } from './appearance';
import type { Appearance } from './appearance';
import { cn } from './lib/utils';
import { useUiLabels } from './provider';

function Preview(props: { scheme: 'light' | 'dark' }) {
    return (
        <span
            aria-hidden
            className={cn(
                props.scheme,
                'flex flex-1 flex-col gap-2 rounded bg-background p-3 text-foreground',
            )}
        >
            <span className="flex items-center gap-2 rounded border border-border bg-surface p-2">
                <span className="h-8 w-6 shrink-0 rounded border border-border bg-surface-raised" />
                <span className="flex flex-1 flex-col gap-2">
                    <span className="h-1.5 w-3/4 rounded-full bg-foreground" />
                    <span className="h-1.5 w-1/2 rounded-full bg-foreground-muted" />
                </span>
            </span>
            <span className="h-6 rounded-full border border-primary bg-primary" />
        </span>
    );
}

type Props = {
    value: Appearance;
    onChange: (value: Appearance) => void;
};

export function AppearancePicker(props: Props) {
    const labels = useUiLabels();

    return (
        <div className="@container">
            <ToggleGroupPrimitive.Root
                type="single"
                value={props.value}
                onValueChange={(value) =>
                    value && props.onChange(value as Appearance)
                }
                className="grid grid-cols-[repeat(2,minmax(0,192px))] gap-3 @min-[804px]:grid-cols-[192px_192px_396px]"
            >
                {appearances.map((appearance) => (
                    <ToggleGroupPrimitive.Item
                        key={appearance}
                        value={appearance}
                        className={cn(
                            'flex cursor-pointer flex-col gap-2 rounded border border-border bg-control p-2 text-left text-sm text-foreground transition hover:bg-control-hover active:bg-control-hover data-[state=on]:border-primary data-[state=on]:ring-1 data-[state=on]:ring-primary',
                            appearance === 'system' &&
                                'col-span-full @min-[804px]:col-span-1',
                        )}
                    >
                        <span className="flex gap-1">
                            {appearance === 'system' ? (
                                <>
                                    <Preview scheme="light" />
                                    <Preview scheme="dark" />
                                </>
                            ) : (
                                <Preview scheme={appearance} />
                            )}
                        </span>
                        <span>{labels[appearance]}</span>
                    </ToggleGroupPrimitive.Item>
                ))}
            </ToggleGroupPrimitive.Root>
        </div>
    );
}
