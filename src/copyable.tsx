import { Slot } from '@radix-ui/react-slot';
import type { ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

export function Copyable(props: Props) {
    return (
        <Slot tabIndex={-1} className="select-text">
            {props.children}
        </Slot>
    );
}
