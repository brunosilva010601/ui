import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { cn } from './lib/utils';

type Props = {
    children: ReactNode;
};

type ColumnsProps = Props & {
    empty?: boolean;
};

export function Columns(props: ColumnsProps) {
    return (
        <div
            className={cn(
                'flex flex-col gap-lg',
                !props.empty && 'xl:flex-row xl:items-start xl:gap-xl',
            )}
        >
            {props.children}
        </div>
    );
}

export function MainColumn(props: Props) {
    return (
        <div className="contents xl:flex xl:min-w-0 xl:flex-1 xl:flex-col xl:gap-lg">
            {props.children}
        </div>
    );
}

type SideColumnProps = {
    children?: ReactNode;
};

function useFitsViewport() {
    const ref = useRef<HTMLDivElement>(null);
    const [fits, setFits] = useState(true);

    useEffect(() => {
        const element = ref.current;

        if (!element) {
            return;
        }

        const measure = () =>
            setFits(
                element.offsetHeight +
                    parseFloat(getComputedStyle(element).top) <=
                    window.innerHeight,
            );
        const observer = new ResizeObserver(measure);

        observer.observe(element);
        window.addEventListener('resize', measure);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', measure);
        };
    }, []);

    return { ref, fits };
}

export function SideColumn(props: SideColumnProps) {
    const { ref, fits } = useFitsViewport();

    return (
        <div
            ref={ref}
            className={cn(
                'contents xl:top-(--page-top) xl:flex xl:w-full xl:max-w-sm xl:shrink-0 xl:flex-col xl:gap-lg',
                fits && 'xl:sticky',
            )}
        >
            {props.children}
        </div>
    );
}
