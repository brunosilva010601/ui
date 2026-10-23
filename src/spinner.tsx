import { LoaderCircle } from 'lucide-react';

export function Spinner() {
    return (
        <LoaderCircle role="status" className="size-icon-sm animate-spin" />
    );
}
