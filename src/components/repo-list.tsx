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
import AddRepository from './add-repository';
import cockpit from 'cockpit';
import { KebabDropdown } from 'cockpit-components-dropdown';
import { ConfirmDialog } from '../common/confirm';

const _ = cockpit.gettext;


export const RepoList = () => {

    const [modalAddRepoOpened, setAddRepoModalState] = useState(false);

    const { config, readConfig } = useLocationConfigContext();
    const [ repoToRemove, setRepoToRemove] = useState("");

    const handleDeleteSourceDirectory = () => {
    config.removeRepository(repoToRemove).write()
            .then(() => {
                setRepoToRemove("");
                readConfig()
            })
            .catch((error) => {
                console.error(`Failed to delete repository ${repoToRemove}:`, error);
            });
    }


    const rowActions = (repoPath:string) => (
            <KebabDropdown
                dropdownItems={[
                    <DropdownItem
                        key="delete"
                        onClick={() => setRepoToRemove(repoPath)}
                    >
                        {_("Delete")}
                    </DropdownItem>
                ]}
            /> 
        );

    return (
        <>
            {repoToRemove && (<ConfirmDialog
                    title={_("Delete Repository?")}
                    message={repoToRemove}
                    onConfirm={() => handleDeleteSourceDirectory()}
                    onCancel={() => setRepoToRemove("")}
                />
                )}
            <Card>
                <CardTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Repositories</span>
                    <Button 
                        variant="link" 
                        icon={<PlusIcon />}
                        onClick={() => setAddRepoModalState(true)}
                    >
                        {_("Add")}
                    </Button>
                    {modalAddRepoOpened && <AddRepository toggleModal={setAddRepoModalState} isOpen={true} />}
                </CardTitle>
                <CardBody>
                    <ListingTable
                        aria-label={_("Repositories")}
                        variant='compact'
                        columns={[
                            { title: _("Name"), header: true, props: { width: 50 } },
                            { title: _("Path"), header: true, props: { width: 50 } },
                            { title: "", props: { width: 25, "aria-label": _("Actions") } },
                        ]}
                        emptyCaption={_("No repositories defined.")}
                        rows={(config?.repositories ?? []).map((repo) => ({
                            columns: [
                                { title: repo.label ?? repo.path },
                                { title: repo.path },
                                { title: rowActions(repo.path) },
                            ],
                        }))}
                    />
                </CardBody>
            </Card>
        </>
    );
}

export default RepoList;
