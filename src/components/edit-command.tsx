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

import { Button, Form, FormGroup, FormHelperText, FormSelect, FormSelectOption, HelperText, HelperTextItem, Modal, ModalBody, ModalFooter, ModalHeader, ModalVariant, TextArea } from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import cockpit from 'cockpit';
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { InfoPopover } from "../common/infoPopover";
import { BorgmaticAfterAction, BorgmaticBeforeAction, BorgmaticStatesFilter, BorhgmaticWhenFilter, CommandHook } from "../helpers/borgmatic-config.model";
const _ = cockpit.gettext;

interface EditCommandProps {
    closeModal:() => void;
    command?: CommandHook | undefined;
    onSave?: (command: CommandHook) => void;
}

function EditCommand({ closeModal, command, onSave }: EditCommandProps) {
    return (
        <EditCommandForm
        closeModal={closeModal}
        command={command}
        onSave={onSave}
        />
    );
}

interface EditCommandFormProps {
    closeModal: () => void;
    command?: CommandHook | undefined;
    onSave?: ((command: CommandHook) => void) | undefined;
}

interface CommandHookViewModel {
    before?: BorgmaticBeforeAction;
    after?: BorgmaticAfterAction;
    when?: BorhgmaticWhenFilter;
    states?: BorgmaticStatesFilter;
    hookAction: string;
}

function EditCommandForm({ closeModal, command, onSave }: EditCommandFormProps) {
    const commandRef = useRef<HTMLTextAreaElement>(null);

    const [formState, setFormState] = useState(() => {
        const defaultCommand: CommandHookViewModel = {
            after: BorgmaticAfterAction.Action,
            states: BorgmaticStatesFilter.Finish,
            hookAction: 'after:action',
        };
        if (command !== undefined) {
            if (command.before) {
                defaultCommand.hookAction = `before:${command.before}`;
            } else if (command.after) {
                defaultCommand.hookAction = `after:${command.after}`;
            }
            if (command.when) {
                defaultCommand.when = command.when;
            }
            if (command.states) {
                defaultCommand.states = command.states;
            }
        }
        return defaultCommand;
    });

    useEffect(() => {
        if (command?.run && commandRef.current) {
            commandRef.current.value = command.run.join('\n');
        }
    }, [command]);

    const [isFormValid, setIsFormValid] = useState(command !== undefined);

    const handleInput = () => {
        setIsFormValid(!!commandRef.current?.value.trim());
    };

    const updateWhenValue = (event: FormEvent<HTMLSelectElement>, value: string) => {
        setFormState((prevState) => {
            const nextState = { ...prevState, when: value as BorhgmaticWhenFilter };
            return nextState;
        });
    };
    const updateStatesValue = (event: FormEvent<HTMLSelectElement>, value: string) => {
        setFormState((prevState) => {
            const nextState = { ...prevState, states: value as BorgmaticStatesFilter };
            return nextState;
        });
    };

    const updateAction = (
        event: FormEvent<HTMLSelectElement>,
        value: string
    ) => {
        const [hookType, hook] = value.split(':');
        setFormState((prevState) => {
            const nextState = { ...prevState };
            if (hookType === 'before') {
                delete nextState.after;
                nextState.before = hook as BorgmaticBeforeAction;
            } else if (hookType === 'after') {
                delete nextState.before;
                nextState.after = hook as BorgmaticAfterAction;
            }
            nextState.hookAction = value;
            return nextState;
        });
    };

    const formSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const commandValue = commandRef.current?.value.trim() || "";
        const payload: CommandHook = {
            run: commandValue.split('\n').map(line => line.trim())
                    .filter(line => line),
        };
        if (formState.before) {
            payload.before = formState.before;
        }
        if (formState.after) {
            payload.after = formState.after;
        }
        if (formState.when) {
            payload.when = formState.when;
        }
        if (formState.states) {
            payload.states = formState.states;
        }
        onSave?.(payload);
    };

    return (
        <Modal
            isOpen
            variant={ModalVariant.medium}
            onClose={closeModal}
        >
            <ModalHeader title={_(command ? "Edit Command" : "Create Command")} labelId="basic-modal-title" />
            <ModalBody>
                {formState.hookAction} {JSON.stringify(command)}
                <Form id="edit-command-form" onSubmit={formSubmit}>
                    <FormGroup
                        label={_("Hook:")}
                        labelInfo={<InfoPopover bodyContent={_("RunHookHelp")} />}
                        type="string"
                        fieldId="hookAction"
                    >
                        <FormSelect
                            id="hookAction"
                            name="hookAction"
                            value={formState.hookAction}
                            onChange={updateAction}
                            aria-label={_("Select hook")}
                        >
                            {[
                                { label: 'after every action', action:  'after:action' },
                                { label: 'after configuration', action:  'after:configuration' },
                                { label: 'after everything', action:  'after:everything' },
                                { label: 'after repository', action:  'after:repository' },
                                { label: 'after error', action:  'after:error' },
                                { label: 'before every action', action:  'before:action' },
                                { label: 'before configuration', action:  'before:configuration' },
                                { label: 'before everything', action:  'before:everything' },
                                { label: 'before repository', action:  'before:repository' },
                            ].map((option, index) => (
                                <FormSelectOption key={index} value={option.action} label={_(option.label)} />
                            ))}
                        </FormSelect>
                    </FormGroup>
                    <FormGroup
                        label={_("Command:")}
                        labelInfo={<InfoPopover bodyContent={_("CommandHelp")} />}
                        type="string"
                        fieldId="run"
                    >
                        <TextArea
                            id="run"
                            name="run"
                            rows={5}
                            ref={commandRef}
                            onInput={handleInput}
                            placeholder={_("Enter Commands")}
                        />
                        <FormHelperText>
                            <HelperText>
                                {!isFormValid && (
                                    <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
                                        {_("Command is required.")}
                                    </HelperTextItem>
                                )}
                            </HelperText>
                        </FormHelperText>
                    </FormGroup>
                    <FormGroup
                        label={_("Run When:")}
                        labelInfo={<InfoPopover bodyContent={_("RunWhenHelp")} />}
                        type="string" fieldId="when"
                    >
                        <FormSelect
                            id="when"
                            name="when"
                            onChange={updateWhenValue}
                            value={formState.when}
                            aria-label={_("Select When hook")}
                        >
                            {[
                                { label:"for all actions", value:"" },
                                { label:"create", value:"create" },
                                { label:"prune", value:"prune" },
                                { label:"compactvalue", value:"compactvalue" },
                                { label:"check", value:"check" },
                            ].map((option, index) => (
                                <FormSelectOption key={index} value={option.value} label={_(option.label)} />
                            ))}
                        </FormSelect>
                    </FormGroup>
                    <FormGroup
                        label={_("Run where State is:")}
                        labelInfo={<InfoPopover bodyContent={_("RunWhereHelp")} />}
                        type="string" fieldId="states"
                    >
                        <FormSelect
                            id="states"
                            name="states"
                            onChange={updateStatesValue}
                            value={formState.states}
                            aria-label={_("Select States filter")}
                        >
                            {[
                                { label:"fail", value: BorgmaticStatesFilter.Fail },
                                { label: "finish", value: BorgmaticStatesFilter.Finish }
                            ].map((option, index) => (
                                <FormSelectOption key={index} value={option.value} label={_(option.label)} />
                            ))}
                        </FormSelect>
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button
                    key="confirm"
                    variant="primary"
                    type="submit"
                    form="edit-command-form"
                    isDisabled={!isFormValid}
                >
                    {_("Confirm")}
                </Button>
                <Button key="cancel" variant="link" onClick={() => closeModal()}>
                    {_("Cancel")}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
export default EditCommand;
