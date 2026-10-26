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
                'flex flex-1 flex-col gap-sm rounded bg-background p-md text-foreground',
            )}
        >
            <span className="flex items-center gap-sm rounded border border-border bg-surface p-sm">
                <span className="h-8 w-6 shrink-0 rounded border border-border bg-surface-raised" />
                <span className="flex flex-1 flex-col gap-sm">
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
        <ToggleGroupPrimitive.Root
            type="single"
            value={props.value}
            onValueChange={(value) => value && props.onChange(value as Appearance)}
            className="flex gap-md max-sm:grid max-sm:grid-cols-2"
        >
            {appearances.map((appearance) => (
                <ToggleGroupPrimitive.Item
                    key={appearance}
                    value={appearance}
                    className={cn(
                        'flex w-full flex-1 cursor-pointer flex-col gap-sm rounded border border-border bg-control p-sm text-left text-sm text-foreground transition hover:bg-control-hover active:bg-control-hover data-[state=on]:border-primary data-[state=on]:ring-1 data-[state=on]:ring-primary sm:max-w-48',
                        appearance === 'system' &&
                            'max-sm:order-last max-sm:col-span-full',
                    )}
                >
                    <span className="relative flex">
                        <Preview
                            scheme={appearance === 'system' ? 'light' : appearance}
                        />
                        {appearance === 'system' && (
                            <span className="absolute inset-0 flex [clip-path:inset(0_0_0_50%)]">
                                <Preview scheme="dark" />
                            </span>
                        )}
                    </span>
                    <span>{labels[appearance]}</span>
                </ToggleGroupPrimitive.Item>
            ))}
        </ToggleGroupPrimitive.Root>
    );
}
