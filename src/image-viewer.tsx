import { Modal } from './modal';

type Props = {
    src: string;
    alt: string;
    open: boolean;
    onClose: () => void;
};

export function ImageViewer(props: Props) {
    return (
        <Modal open={props.open} onClose={props.onClose} title={props.alt} bare>
            <img
                src={props.src}
                alt={props.alt}
                className="max-h-full max-w-full object-contain"
                onClick={props.onClose}
            />
        </Modal>
    );
}
