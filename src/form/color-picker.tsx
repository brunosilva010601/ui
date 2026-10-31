import { Check } from 'lucide-react';
import { useId } from 'react';
import { buttonClass } from '../button';
import { cn } from '../lib/utils';
import { paletteColors, paletteText } from '../palette';
import type { PaletteColor } from '../palette';
import { Field } from './field';
import type { FieldProps } from './field';

type Props = FieldProps & {
    value: PaletteColor | null;
    onChange: (color: PaletteColor | null) => void;
};

export function ColorPicker(props: Props) {
    const id = useId();
    const colors = [null, ...paletteColors];

    return (
        <Field
            id={id}
            label={props.label}
            hideLabel={props.hideLabel}
            description={props.description}
            hint={props.hint}
            optional={props.optional}
            error={props.error}
        >
            <div id={id} role="radiogroup" className="flex flex-wrap gap-4px">
                {colors.map((color) => {
                    const chosen = color === props.value;

                    return (
                        <button
                            key={color ?? 'none'}
                            type="button"
                            role="radio"
                            aria-checked={chosen}
                            disabled={props.disabled}
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
                            <span className="flex size-icon-20px items-center justify-center rounded-full bg-current">
                                {chosen && (
                                    <Check className="size-icon-14px text-background" />
                                )}
                            </span>
                        </button>
                    );
                })}
            </div>
        </Field>
    );
}
