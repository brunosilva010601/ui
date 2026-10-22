import { Info } from 'lucide-react';
import type { ReactNode } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    useBlockingPopover,
} from './popover';
import { useUiLabels } from './provider';

type Props = {
    children: ReactNode;
};

export function Hint(props: Props) {
    const labels = useUiLabels();
    const [open, setOpen] = useBlockingPopover();

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                type="button"
                aria-label={labels.moreInfo}
                className="inline-flex cursor-pointer rounded-full align-middle text-foreground-muted transition-colors hover:text-foreground active:text-foreground"
            >
                <Info className="size-icon-sm" />
            </PopoverTrigger>
            <PopoverContent
                align="end"
                className="max-w-xs p-md text-sm text-foreground-muted"
            >
                {props.children}
            </PopoverContent>
        </Popover>
    );
}
