import { Trash2 } from 'lucide-react';
import { Button } from './button';

type Props = {
    label: string;
    onClick: () => void;
};

export function RemoveButton(props: Props) {
    return (
        <Button
            variant="ghost"
            square
            bleed
            aria-label={props.label}
            onClick={props.onClick}
        >
            <Trash2 className="size-icon-md" />
        </Button>
    );
}
