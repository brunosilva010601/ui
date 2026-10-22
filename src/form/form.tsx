import { Slot } from '@radix-ui/react-slot';
import { createContext, useContext, useId } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { cn } from '../lib/utils';

const FormId = createContext<string | undefined>(undefined);

export function useFormId(): string | undefined {
    return useContext(FormId);
}

const gaps = {
    md: 'gap-md',
    lg: 'gap-lg',
};

type Props = {
    gap?: keyof typeof gaps;
    asChild?: boolean;
    onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
    className?: string;
    children: ReactNode;
};

export function Form(props: Props) {
    const Component = props.asChild ? Slot : 'form';
    const id = useId();

    return (
        <FormId.Provider value={id}>
            <Component
                id={id}
                noValidate
                onSubmit={props.onSubmit}
                className={cn(
                    'flex flex-col',
                    gaps[props.gap ?? 'md'],
                    props.className,
                )}
            >
                {props.children}
            </Component>
        </FormId.Provider>
    );
}

type FormActionsProps = {
    inline?: boolean;
    children: ReactNode;
};

export function FormActions(props: FormActionsProps) {
    return (
        <div
            className={cn(
                'mt-sm flex',
                props.inline ? 'items-center gap-sm' : 'flex-col gap-md',
            )}
        >
            {props.children}
        </div>
    );
}
