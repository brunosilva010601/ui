import { cn } from './lib/utils';
import { useUi } from './provider';

type Props = {
    href?: string;
    external?: boolean;
    onClick?: () => void;
    className?: string;
    'aria-expanded'?: boolean;
    'data-layer'?: boolean;
};

export function Cover(props: Props) {
    const { link: Link } = useUi();
    const { href, external, onClick, className, ...rest } = props;
    const coverClass = cn('absolute cursor-pointer', className ?? 'inset-0');

    if (href && external) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener"
                className={coverClass}
                {...rest}
            />
        );
    }

    if (href) {
        return <Link href={href} className={coverClass} {...rest} />;
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className={coverClass}
            {...rest}
        />
    );
}
