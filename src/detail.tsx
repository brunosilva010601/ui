import type { ReactNode } from 'react';

type Props = {
    label: string;
    inline?: boolean;
    children: ReactNode;
};

export function Detail(props: Props) {
    return (
        <div className={props.inline ? 'contents' : 'flex flex-col gap-xs'}>
            <dt className="text-sm text-foreground-muted">{props.label}</dt>
            <dd className="text-sm">{props.children}</dd>
        </div>
    );
}
