import { Check } from 'lucide-react';
import { useId } from 'react';
import { buttonClass } from '../button';
import { cn } from '../lib/utils';
import { paletteColors, paletteText } from '../palette';
import type { PaletteColor } from '../palette';
import { Field } from './field';

type Props = {
    label: string;
    noneLabel: string;
    value: PaletteColor | null;
    error?: string;
    onChange: (color: PaletteColor | null) => void;
};

export function ColorPicker(props: Props) {
    const id = useId();
    const colors = [null, ...paletteColors];

    return (
        <Field id={id} label={props.label} error={props.error}>
            <div
                id={id}
                role="radiogroup"
                aria-label={props.label}
                className="flex flex-wrap gap-xs"
            >
                {colors.map((color) => {
                    const chosen = color === props.value;

                    return (
                        <button
                            key={color ?? 'none'}
                            type="button"
                            role="radio"
                            aria-checked={chosen}
                            aria-label={color ?? props.noneLabel}
                            onClick={() => props.onChange(color)}
                            className={cn(
                                buttonClass({
                                    variant: 'ghost',
                                    size: 'sm',
                                    square: true,
                                }),
                                'border-2',
                                paletteText(color),
                                chosen && 'border-current',
                            )}
                        >
                            <span className="flex size-icon-md items-center justify-center rounded-full bg-current">
                                {chosen && (
                                    <Check className="size-icon-xs text-background" />
                                )}
                            </span>
                        </button>
                    );
                })}
            </div>
        </Field>
    );
}
