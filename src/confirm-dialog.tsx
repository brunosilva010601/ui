import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Button } from './button';
import { Form } from './form/form';
import { Modal, ModalClose, ModalFooter } from './modal';
import { useUiLabels } from './provider';

type Props = {
    open: boolean;
    title: ReactNode;
    description: ReactNode;
    confirmLabel: string;
    cancelLabel?: string;
    tone?: 'danger' | 'primary';
    blocked?: boolean;
    onConfirm: () => void | Promise<unknown>;
    onClose: () => void;
    onClosed?: () => void;
    children?: ReactNode;
};

export function ConfirmDialog(props: Props) {
    const labels = useUiLabels();
    const [sending, setSending] = useState(false);

    const submit = (event: FormEvent) => {
        event.preventDefault();
        const result = props.onConfirm();

        if (result instanceof Promise) {
            setSending(true);
            result.finally(() => setSending(false));
        }
    };

    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
            onClosed={props.onClosed}
            title={props.title}
            description={props.description}
        >
            <Form className="flex-1" onSubmit={submit}>
                {props.children}
                <ModalFooter>
                    <ModalClose asChild>
                        <Button variant="outline">
                            {props.cancelLabel ?? labels.cancel}
                        </Button>
                    </ModalClose>
                    <Button
                        type="submit"
                        variant={props.tone ?? 'danger'}
                        disabled={sending || props.blocked}
                    >
                        {props.confirmLabel}
                    </Button>
                </ModalFooter>
            </Form>
        </Modal>
    );
}
