import { Info } from 'lucide-react';
import type { ReactNode } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    useBlockingPopover,
} from './popover';

type Props = {
    children: ReactNode;
};

export function Hint(props: Props) {
    const [open, setOpen] = useBlockingPopover();

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                type="button"
                className="inline-flex cursor-pointer rounded-full align-middle text-foreground-muted transition-colors hover:text-foreground active:text-foreground"
            >
                <Info className="size-4" />
            </PopoverTrigger>
            <PopoverContent align="end" className="ui-note max-w-xs p-3">
                {props.children}
            </PopoverContent>
        </Popover>
    );
}
