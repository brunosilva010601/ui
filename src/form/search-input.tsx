import { Search, X } from 'lucide-react';
import { Button } from '../button';
import { cn } from '../lib/utils';
import { useUiLabels } from '../provider';
import { fieldClass } from './field';
import { Input } from './input';

type Props = {
    value: string;
    placeholder: string;
    autoFocus?: boolean;
    selectOnFocus?: boolean;
    onChange: (value: string) => void;
    onClear?: () => void;
};

export function SearchInput(props: Props) {
    const labels = useUiLabels();

    return (
        <div
            className={cn(
                fieldClass,
                'flex items-center gap-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary',
            )}
        >
            <Search className="size-4 shrink-0 text-foreground-muted" />
            <Input
                type="search"
                bare
                autoFocus={props.autoFocus}
                value={props.value}
                onChange={(event) => props.onChange(event.target.value)}
                onFocus={(event) => {
                    const input = event.currentTarget;

                    if (props.selectOnFocus) {
                        window.setTimeout(() => input.select());
                    }
                }}
                placeholder={props.placeholder}
            />
            {props.value && (
                <Button
                    variant="ghost"
                    size="sm"
                    square
                    bleed
                    aria-label={labels.clear}
                    onClick={() => {
                        props.onChange('');
                        props.onClear?.();
                    }}
                >
                    <X />
                </Button>
            )}
        </div>
    );
}
