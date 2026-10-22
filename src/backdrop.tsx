import { createPortal } from 'react-dom';
import { cn } from './lib/utils';

export const backdropClass = 'bg-overlay backdrop-blur-xs';

type Props = {
    open: boolean;
    onClose: () => void;
};

export function Backdrop(props: Props) {
    return (
        props.open &&
        createPortal(
            <div
                className={cn(
                    'pointer-events-auto fixed inset-0 z-50 animate-fade-in',
                    backdropClass,
                )}
                onClick={props.onClose}
            />,
            document.body,
        )
    );
}
