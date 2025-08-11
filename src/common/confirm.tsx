import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "@patternfly/react-core";

type ConfirmDialogProps = {
    title: string;
    message: React.ReactNode;
    onConfirm: () => void;
    onCancel: () => void;
};

export const ConfirmDialog = ({ title, message, onConfirm, onCancel }: ConfirmDialogProps) => (
    <Modal
    variant="small"
    title={title}
    isOpen
    onClose={onCancel}
    appendTo={() => document.body}
    >
        <ModalHeader title={title} />
        <ModalBody>{message}</ModalBody>
        <ModalFooter>
            <Button variant="danger" onClick={onConfirm}>Delete</Button>
            <Button variant="link" onClick={onCancel}>Cancel</Button>
        </ModalFooter>
    </Modal>
);
