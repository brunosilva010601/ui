import { buttonClass } from './button';
import { cn } from './lib/utils';

export function ControlStrut() {
    return (
        <span
            aria-hidden
            className={cn(
                buttonClass({ variant: 'ghost', square: true }),
                'invisible w-0 overflow-hidden border-x-0 px-0',
            )}
        >
            <span className="block size-icon-md" />
        </span>
    );
}
