import { Button, FormHelperText, HelperText, HelperTextItem, Modal, ModalBody, ModalFooter, ModalHeader, ModalVariant, TextInput } from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import React, { Dispatch, SetStateAction, useState } from "react";
// import { Modal } from "@patternfly/react-core";

interface AddRepoProps {
    toggleModal: Dispatch<SetStateAction<boolean>>;
    isOpen: boolean;
    existingLocations: string[];
}

function AddRepo({ toggleModal, isOpen, existingLocations }: AddRepoProps) {
    const [locationName, setName] = useState("");
    const [locationExists, setLocationExists] = useState(false);

    const handleNameChange = (event: React.FormEvent<HTMLInputElement>, name: string) => {
        const isValid = /^[a-zA-Z0-9-]+$/.test(name);
        if (!isValid) {
            name = "";
        }
        if (name && existingLocations.includes(name)) {
            setLocationExists(true);
        } else {
            setLocationExists(false);
        }

        setName(name);
    };

    return (
        <Modal
            isOpen={isOpen}
            variant={ModalVariant.medium}
            onClose={() => toggleModal(false)}
        >
            <ModalHeader title="Create New Backup Location" labelId="basic-modal-title" />
            <ModalBody>
                <TextInput
                    placeholder="Enter Location Name"
                    onChange={handleNameChange}
                />
                <FormHelperText>
                    <HelperText>
                        {!locationName && (
                            <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
                                Must be alphanumeric and can include hyphens.
                            </HelperTextItem>
                        )}
                        {locationExists && (
                            <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
                                Location name already exists.
                            </HelperTextItem>
                        )}
                    </HelperText>
                </FormHelperText>
            </ModalBody>
            <ModalFooter>
                <Button
                    key="confirm"
                    variant="primary"
                    onClick={() => toggleModal(false)}
                    isDisabled={!locationName.length || locationExists}
                >
                    Confirm
                </Button>
                <Button key="cancel" variant="link" onClick={() => toggleModal(false)}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    );
}
export default AddRepo;
