import { Button, FormGroup, FormHelperText, HelperText, HelperTextItem, Modal, ModalBody, ModalFooter, ModalHeader, ModalVariant, TextInput } from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import cockpit from 'cockpit';
import React, { Dispatch, SetStateAction, useState } from "react";
import { useLocationConfigContext } from "../context/borgmatic-config-file";
import { BorgmaticConfigHelper } from "../helpers/borgmatic-config.helper";
import { FileAutoComplete } from "cockpit-components-file-autocomplete.jsx";

const _ = cockpit.gettext;

interface AddSourceProps {
    toggleModal: Dispatch<SetStateAction<boolean>>;
    isOpen: boolean;
}

function AddSourceDir({ toggleModal, isOpen }: AddSourceProps) {
    const { config, readConfig } = useLocationConfigContext();

    return (
        <AddSourceDirForm
        config={config}
        readConfig={readConfig}
        toggleModal={toggleModal}
        isOpen={isOpen}
        />
    );
}

interface AddSourceDirFormProps {
    config: BorgmaticConfigHelper;
    readConfig: () => Promise<void>;
    toggleModal: Dispatch<SetStateAction<boolean>>;
    isOpen: boolean;
}

function AddSourceDirForm({ config, readConfig, toggleModal, isOpen }: AddSourceDirFormProps) {
    const [sourceDirPath, setSourcePath] = useState("");
    const [sourcePathExists, setSourceDirExists] = useState(false);
    const handleSourceDirChange = (sourceDirPath: string) => {
        console.log("Source directory changed:", sourceDirPath);
        const isValid = /^\/([a-zA-Z0-9._-]+\/?)*$/.test(sourceDirPath);
        if (!isValid) {
            sourceDirPath = "";
        }
        const sourceDirExists = config.sourceDirectories?.some(
            (sourceDir:string) => sourceDir === sourceDirPath);

        if (sourceDirPath && sourceDirExists) {
            setSourceDirExists(true);
        } else {
            setSourceDirExists(false);
        }
        setSourcePath(sourceDirPath);
    };

    const handleConfirm = () => {
        config.addSourceDirectory(sourceDirPath).write()
                .then(() => {
                    toggleModal(false);
                    readConfig();
                })
                .catch((err) => {
                    console.error("Failed to add source directory:", err);
                });
    };

    return (
        <Modal
            isOpen={isOpen}
            variant={ModalVariant.medium}
            onClose={() => toggleModal(false)}
        >
            <ModalHeader title={_("Add source directory")} labelId="basic-modal-title" />
            <ModalBody>
                {/* <TextInput
                    placeholder={_("Enter Source Directory Path")}
                    onChange={handleSourceDirChange}
                /> */}
                <FileAutoComplete
                    placeholder={_("Select Source Directory")}
                    superuser="try"
                    onChange={handleSourceDirChange}
                />
                <FormHelperText>
                    <HelperText>
                        {!sourceDirPath && (
                            <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
                                {_("Must be a valid Linux file path.")}
                            </HelperTextItem>
                        )}
                        {sourcePathExists && (
                            <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
                                {_("Source directory already added.")}
                            </HelperTextItem>
                        )}
                    </HelperText>
                </FormHelperText>

            </ModalBody>
            <ModalFooter>
                <Button
                    key="confirm"
                    variant="primary"
                    onClick={handleConfirm}
                    isDisabled={!sourceDirPath.length || sourcePathExists}
                >
                    {_("Confirm")}
                </Button>
                <Button key="cancel" variant="link" onClick={() => toggleModal(false)}>
                    {_("Cancel")}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
export default AddSourceDir;
