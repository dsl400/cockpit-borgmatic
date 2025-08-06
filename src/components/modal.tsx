import { Modal, ModalBody, ModalVariant } from "@patternfly/react-core";
import React from "react";
// import { Modal } from "@patternfly/react-core";

interface AddRepoProps {
    toggleModal: () => void;
    isOpen: boolean;
}

function ModalDialog({ toggleModal, isOpen }: AddRepoProps) {
    return (
        <Modal
            isOpen={isOpen}
            variant={ModalVariant.medium}
            onClose={toggleModal}
        >
            {/* Add your modal content here */}
            <ModalBody>
                <div>Add repository form goes here.</div>
            </ModalBody>
        </Modal>
    );
}

export default ModalDialog;
