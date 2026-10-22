import { LoaderCircle } from 'lucide-react';
import { useUiLabels } from './provider';

export function Spinner() {
    const labels = useUiLabels();

    return (
        <LoaderCircle
            role="status"
            aria-label={labels.loading}
            className="size-icon-sm animate-spin"
        />
    );
}
