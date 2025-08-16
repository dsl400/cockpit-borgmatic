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

import React, { useState } from 'react';
import { Button, Card, CardBody, CardTitle, DropdownItem } from '@patternfly/react-core';
import { PlusIcon } from '@patternfly/react-icons';
import { ListingTable } from 'cockpit-components-table';
import { useLocationConfigContext } from '../context/borgmatic-config-file';
import cockpit from 'cockpit';
import { KebabDropdown } from 'cockpit-components-dropdown';
import { ConfirmDialog } from '../common/confirm';
import { CommandHook } from '../helpers/borgmatic-config.model';
import EditCommand from './edit-command';

const _ = cockpit.gettext;


export const CommandsList = () => {

    const [modalAddCommandOpened, setEditCommandState] = useState(false);

    const { config, readConfig } = useLocationConfigContext();
    const [ commandToRemove, setCommandToRemove ] = useState(-1);
    const [ commandToEdit, setCommandToEdit ] = useState<number | undefined>(undefined);

    const handleDeleteCommand = () => {
    config.removeCommand(commandToRemove).write()
            .then(() => {
                setCommandToRemove(-1);
                readConfig()
            })
            .catch((error) => {
                console.error(`Failed to delete repository ${commandToRemove}:`, error);
            });
    }

    const closeModal = () =>{
        setEditCommandState(false);
        setCommandToEdit(undefined);
    }

    const rowActions = (commandIndex:number) => (
            <KebabDropdown
                dropdownItems={[
                    <DropdownItem
                        key="edit"
                        onClick={() => setCommandToEdit(commandIndex)}
                    >
                        {_("Edit")}
                    </DropdownItem>,
                    <DropdownItem
                        key="delete"
                        onClick={() => setCommandToRemove(commandIndex)}
                    >
                        {_("Delete")}
                    </DropdownItem>
                ]}
            /> 
        );

    const rowTitle = (c: CommandHook) => {
        let result = "";
        if (c.before) {
            result = `${_("Before")} ${_(c.before)}`;
        }else if (c.after) {
            result = `${_("After")} ${_(c.after)}`;
        }
        
        if (c.when) {
            result += ` when action is ${_(c.when)}`;
        }

        if (c.states) {
            result += ` if state is ${_(c.states)}`;
        }

        return result;
    }

    const onModalSave = (payload: CommandHook) => {

        config.upsertCommand(payload,commandToEdit).write()
            .then(() => {
                closeModal();
                readConfig();
            })
            .catch((err) => {
                console.error("Failed to upsert command:", err);
            });
        
    }


    return (
        <>
            {commandToRemove != -1 && (<ConfirmDialog
                    title={_("Delete Command?")}
                    message={rowTitle(config.commands[commandToRemove])}
                    onConfirm={() => handleDeleteCommand()}
                    onCancel={() => setCommandToRemove(-1)}
                />
                )}
            
            <Card>
                <CardTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{_("Commands")}</span>
                    <Button 
                        variant="link" 
                        icon={<PlusIcon />}
                        onClick={() => setEditCommandState(true)}
                    >
                        {_("Add")}
                    </Button>
                    {(modalAddCommandOpened || commandToEdit != undefined) && 
                    <EditCommand 
                        closeModal={closeModal} 
                        command={config.commands[commandToEdit!]}
                        onSave={onModalSave}
                    />}
                </CardTitle>
                <CardBody>
                    <ListingTable
                        aria-label={_("Commands")}
                        variant='compact'
                        columns={[
                            { title: _("Hook"), header: true, props: { width: 100 } },
                            { title: "", props: { width: 25, "aria-label": _("Actions") } },
                        ]}
                        emptyCaption={_("No commands defined.")}
                        rows={(config?.commands ?? []).map((c,index) => ({
                            columns: [
                                { title: rowTitle(c) },
                                { title: rowActions(index) },
                            ],
                        }))}
                    />
                </CardBody>
            </Card>
        </>
    );
}

export default CommandsList;
