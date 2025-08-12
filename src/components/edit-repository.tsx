/*
 * This file is part of Cockpit.
 *
 * Copyright (C) 2017 Red Hat, Inc.
 *
 * Cockpit is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or
 * (at your option) any later version.
 *
 * Cockpit is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Cockpit; If not, see <http://www.gnu.org/licenses/>.
 */

import { Button, FormHelperText, HelperText, HelperTextItem, Modal, ModalBody, ModalFooter, ModalHeader, ModalVariant, TextInput } from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useLocationConfigContext } from "../context/borgmatic-config-file";
import { BorgmaticConfigHelper } from "../helpers/borgmatic-config.helper";
import { BrogmaticRepository } from "../helpers/borgmatic-config.model";
import cockpit from 'cockpit';
const _ = cockpit.gettext;

interface AddRepositoryProps {
    toggleModal: Dispatch<SetStateAction<boolean>>;
    isOpen: boolean;
}

function AddRepository({ toggleModal, isOpen }: AddRepositoryProps) {
    const { config, readConfig } = useLocationConfigContext();

    return (
        <AddRepositoryForm
        config={config}
        readConfig={readConfig}
        toggleModal={toggleModal}
        isOpen={isOpen}
        />
    );
}

interface AddRepositoryFormProps {
    config: BorgmaticConfigHelper;
    readConfig: () => Promise<void>;
    toggleModal: Dispatch<SetStateAction<boolean>>;
    isOpen: boolean;
}

function AddRepositoryForm({ config, readConfig, toggleModal, isOpen }: AddRepositoryFormProps) {
    const [repositoryLabel, setName] = useState("");
    const [repoNameExists, setRepoLabelExists] = useState(false);
    const handleLabelChange = (event: React.FormEvent<HTMLInputElement>, repoLabel: string) => {
        const isValid = /^[a-zA-Z0-9-]+$/.test(repoLabel);
        if (!isValid) {
            repoLabel = "";
        }
        const repoLabelExists = config.repositories.some(
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
        config.addRepository({
            label: repositoryLabel,
            path: repositoryPath
        }).write()
                .then(() => {
                    toggleModal(false);
                    readConfig();
                })
                .catch((err) => {
                    console.error("Failed to add repository:", err);
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
                                {_("Must be alphanumeric and can include hyphens.")}
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
                    {_("Confirm")}
                </Button>
                <Button key="cancel" variant="link" onClick={() => toggleModal(false)}>
                    {_("Cancel")}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
export default AddRepository;
