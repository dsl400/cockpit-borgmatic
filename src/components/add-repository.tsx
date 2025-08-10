import { Button, FormHelperText, HelperText, HelperTextItem, Modal, ModalBody, ModalFooter, ModalHeader, ModalVariant, TextInput } from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import cockpit from 'cockpit';
import { BorgmaticLocationContext } from "../context/borgmatic-config-file";
import { BrogmaticRepository, buildBorgmaticConfig } from "../helpers/borgmatic-config";

interface AddRepositoryProps {
    toggleModal: Dispatch<SetStateAction<boolean>>;
    isOpen: boolean;
}

function AddRepository({ toggleModal, isOpen }: AddRepositoryProps) {
    const { locationName, config, readConfig } = useContext(BorgmaticLocationContext);

    const [repositoryLabel, setName] = useState("");
    const [repoNameExists, setRepoLabelExists] = useState(false);
    const handleLabelChange = (event: React.FormEvent<HTMLInputElement>, repoLabel: string) => {
        const isValid = /^[a-zA-Z0-9-]+$/.test(repoLabel);
        if (!isValid) {
            repoLabel = "";
        }
        const repoLabelExists = config?.repositories?.some(
            (repo:BrogmaticRepository) => repo.label === repoLabel);

        if (repoLabel && repoLabelExists) {
            setRepoLabelExists(true);
        } else {
            setRepoLabelExists(false);
        }
        setName(repoLabel);
    };

    const [repositoryPath, setPath] = useState("");
    const [repoPathExists, setRepoPathExists] = useState(false);
    const handlePathChange = (event: React.FormEvent<HTMLInputElement>, repoPath: string) => {
        // Accepts Linux file path or SSH path (user@host:path)
        const isValid = /^([a-zA-Z0-9-]+@[\w.-]+:[\w./-]+|\/[\w./-]+)$/.test(repoPath);
        if (!isValid) {
            repoPath = "";
        }
        const repoPathExists = config?.repositories?.some(
            (repo:BrogmaticRepository) => repo.path === repoPath);
        if (repoPath && repoPathExists) {
            setRepoPathExists(true);
        } else {
            setRepoPathExists(false);
        }
        setPath(repoPath);
    };

    const handleConfirm = () => {
        const repoList = config?.repositories || [];
        repoList.push({
            label: repositoryLabel,
            path: repositoryPath
        } as BrogmaticRepository);
        const updatedConfig = {
            ...config,
            repositories: repoList
        };
        const yamlContent = buildBorgmaticConfig(updatedConfig);
        cockpit.file(`/etc/borgmatic.d/${locationName}.yml`).replace(yamlContent)
                .then(() => {
                    toggleModal(false);
                    readConfig();
                })
                .catch((err) => {
                    console.error("Failed to create repository:", err);
                });
    };

    return (
        <Modal
            isOpen={isOpen}
            variant={ModalVariant.medium}
            onClose={() => toggleModal(false)}
        >
            <ModalHeader title="Create New Repository" labelId="basic-modal-title" />
            <ModalBody>
                <TextInput
                    placeholder="Enter Repository Name"
                    onChange={handleLabelChange}
                />
                <FormHelperText>
                    <HelperText>
                        {!repositoryLabel && (
                            <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
                                Must be alphanumeric and can include hyphens.
                            </HelperTextItem>
                        )}
                        {repoNameExists && (
                            <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
                                Location name already exists.
                            </HelperTextItem>
                        )}
                    </HelperText>
                </FormHelperText>
                <TextInput
                    placeholder="Enter Repository path"
                    onChange={handlePathChange}
                />
                <FormHelperText>
                    <HelperText>
                        {!repositoryPath && (
                            <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
                                Must be alphanumeric and can include hyphens.
                            </HelperTextItem>
                        )}
                        {repoPathExists && (
                            <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
                                Repository path already exists.
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
                    isDisabled={!repositoryLabel.length || repoNameExists}
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
export default AddRepository;
