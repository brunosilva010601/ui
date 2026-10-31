import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { cn } from './lib/utils';
import { useUiLabels } from './provider';

export type Appearance = 'light' | 'dark' | 'system';

const appearances: Appearance[] = ['light', 'dark', 'system'];

function Preview(props: { scheme: 'light' | 'dark' }) {
    return (
        <span
            aria-hidden
            className={cn(
                props.scheme,
                'flex flex-1 flex-col gap-8px rounded bg-background p-12px text-foreground',
            )}
        >
            <span className="flex items-center gap-8px rounded border border-border bg-surface p-8px">
                <span className="h-32px w-24px shrink-0 rounded border border-border bg-surface-raised" />
                <span className="flex flex-1 flex-col gap-8px">
                    <span className="h-6px w-3/4 rounded-full bg-foreground" />
                    <span className="h-6px w-1/2 rounded-full bg-foreground-muted" />
                </span>
            </span>
            <span className="h-24px rounded-full border border-primary bg-primary" />
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
        <ToggleGroupPrimitive.Root
            type="single"
            value={props.value}
            onValueChange={(value) =>
                value && props.onChange(value as Appearance)
            }
            className="grid grid-cols-[repeat(2,minmax(0,192px))] gap-12px"
        >
            {appearances.map((appearance) => (
                <ToggleGroupPrimitive.Item
                    key={appearance}
                    value={appearance}
                    className={cn(
                        'flex cursor-pointer flex-col gap-8px rounded border border-border bg-control p-8px text-left text-14px text-foreground transition hover:bg-control-hover active:bg-control-hover data-[state=on]:border-foreground data-[state=on]:bg-foreground data-[state=on]:text-background',
                        appearance === 'system' && 'col-span-full',
                    )}
                >
                    <span className="flex gap-4px">
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
    );
}
