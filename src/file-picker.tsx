import { useRef } from 'react';
import type { ReactElement } from 'react';

type FilePicker = {
    open: () => void;
    picker: ReactElement;
};

export function useFilePicker(onPick: (files: File[]) => void): FilePicker {
    const input = useRef<HTMLInputElement>(null);

    return {
        open: () => input.current?.click(),
        picker: (
            <input
                ref={input}
                type="file"
                multiple
                hidden
                onChange={(event) => {
                    const files = Array.from(event.target.files ?? []);
                    event.target.value = '';

                    if (files.length > 0) {
                        onPick(files);
                    }
                }}
            />
        ),
    };
}
