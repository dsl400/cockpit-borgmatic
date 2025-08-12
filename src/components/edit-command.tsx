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

import { Button, Form, FormGroup, FormSelect, FormSelectOption, Modal, ModalBody, ModalFooter, ModalHeader, ModalVariant, TextArea } from "@patternfly/react-core";
import cockpit from 'cockpit';
import React, { Dispatch, SetStateAction } from "react";
import { useLocationConfigContext } from "../context/borgmatic-config-file";
import { BorgmaticConfigHelper } from "../helpers/borgmatic-config.helper";
import { InfoPopover } from "../common/infoPopover";
const _ = cockpit.gettext;

interface EditCommandProps {
    toggleModal: Dispatch<SetStateAction<boolean>>;
    isOpen: boolean;
}

function EditCommand({ toggleModal, isOpen }: EditCommandProps) {
    const { config, readConfig } = useLocationConfigContext();

    return (
        <EditCommandForm
        config={config}
        readConfig={readConfig}
        toggleModal={toggleModal}
        isOpen={isOpen}
        />
    );
}

interface EditCommandFormProps {
    config: BorgmaticConfigHelper;
    readConfig: () => Promise<void>;
    toggleModal: Dispatch<SetStateAction<boolean>>;
    isOpen: boolean;
}

function EditCommandForm({ config, readConfig, toggleModal, isOpen }: EditCommandFormProps) {
    const handleConfirm = () => {
        config.addCommand({
            run: [],
        }).write()
                .then(() => {
                    toggleModal(false);
                    readConfig();
                })
                .catch((err) => {
                    console.error("Failed to add repository:", err);
                });
    };

    const beforeHookOptions = [
        'action',
        'repository',
        'configuration',
        'everything'
    ];

    const whenHookOptions = [
        "create",
        "prune",
        "compact",
        "check"
    ];
    const whereHookOptions = [
        "finish",
        "fail",
        "everywhere"
    ];

    return (
        <Modal
            isOpen={isOpen}
            variant={ModalVariant.medium}
            onClose={() => toggleModal(false)}
        >
            <ModalHeader title={_("Create Command")} labelId="basic-modal-title" />
            <ModalBody>
                <Form>
                    <FormGroup
                        label={_("Command:")}
                        labelInfo={<InfoPopover bodyContent={_("CommandHelp")} />}
                        type="string"
                        fieldId="command"
                    >
                        <TextArea
                            placeholder={_("Enter Commands")}
                        />
                    </FormGroup>
                    <FormGroup
                        label={_("Run Before:")}
                        labelInfo={<InfoPopover bodyContent={_("RunBeforeHelp")} />}
                        type="string"
                        fieldId="beforeHook"
                    >
                        <FormSelect id="beforeHook" name="beforeHook" aria-label={_("Select before hook")}>
                            {beforeHookOptions.map((option, index) => (
                                <FormSelectOption key={index} value={option} label={_(option)} />
                            ))}
                        </FormSelect>
                    </FormGroup>
                    <FormGroup
                        label={_("Run After:")}
                        labelInfo={<InfoPopover bodyContent={_("RunAfterHelp")} />}
                        type="string" fieldId="afterHook"
                    >
                        <FormSelect id="afterHook" name="afterHook" aria-label={_("Select before hook")}>
                            {beforeHookOptions.map((option, index) => (
                                <FormSelectOption key={index} value={option} label={_(option)} />
                            ))}
                        </FormSelect>
                    </FormGroup>
                    <FormGroup
                        label={_("Run When:")}
                        labelInfo={<InfoPopover bodyContent={_("RunWhenHelp")} />}
                        type="string" fieldId="whenHook"
                    >
                        <FormSelect id="whenHook" name="whenHook" aria-label={_("Select When hook")}>
                            {whenHookOptions.map((option, index) => (
                                <FormSelectOption key={index} value={option} label={_(option)} />
                            ))}
                        </FormSelect>
                    </FormGroup>
                    <FormGroup
                        label={_("Run Where:")}
                        labelInfo={<InfoPopover bodyContent={_("RunWhereHelp")} />}
                        type="string" fieldId="whereHook"
                    >
                        <FormSelect id="whereHook" name="whereHook" aria-label={_("Select Where hook")}>
                            {whereHookOptions.map((option, index) => (
                                <FormSelectOption key={index} value={option} label={_(option)} />
                            ))}
                        </FormSelect>
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button
                    key="confirm"
                    variant="primary"
                    onClick={handleConfirm}
                    // isDisabled={!repositoryLabel.length || repoNameExists}
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
export default EditCommand;
