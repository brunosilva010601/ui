import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Button } from './button';
import { Form } from './form/form';
import { Modal, ModalClose, ModalFooter } from './modal';
import { useUi, useUiLabels } from './provider';

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
    const { onSettle } = useUi();
    const [sending, setSending] = useState(false);
    const stopSettle = useRef<(() => void) | null>(null);

    const release = () => {
        stopSettle.current?.();
        stopSettle.current = null;
    };

    useEffect(() => {
        if (props.open) {
            return release;
        }
    }, [props.open]);

    if (!props.open && sending) {
        setSending(false);
    }

    const submit = (event: FormEvent) => {
        event.preventDefault();
        setSending(true);
        const result = props.onConfirm();

        if (result instanceof Promise) {
            result.finally(() => setSending(false));

            return;
        }

        release();
        stopSettle.current = onSettle(() => {
            release();
            setSending(false);
        });
    };

    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
            onClosed={props.onClosed}
            mobile="dialog"
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
                        busy={sending}
                        disabled={props.blocked}
                    >
                        {props.confirmLabel}
                    </Button>
                </ModalFooter>
            </Form>
        </Modal>
    );
}
