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
                'flex items-center gap-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary',
            )}
        >
            <Search className="size-icon-sm shrink-0 text-foreground-muted" />
            <Input
                type="search"
                bare
                autoFocus={props.autoFocus}
                aria-label={props.placeholder}
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
                    aria-label={labels.clearSearch}
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
