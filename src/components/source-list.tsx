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

import React, { useContext, useState } from 'react';

import { Button, Card, CardBody, CardTitle, DropdownItem } from '@patternfly/react-core';
import cockpit from 'cockpit';
import { ListingTable } from 'cockpit-components-table';
import { PlusIcon } from '@patternfly/react-icons';
import AddSourceDir from './add-source-dir';
import { useLocationConfigContext } from '../context/borgmatic-config-file';
import { KebabDropdown } from 'cockpit-components-dropdown.jsx';
const _ = cockpit.gettext;


export const SourceList = () => {
    const [modalAddSourceDirOpened, setAddSourceDirModalState] = useState(false);
    const { config } = useLocationConfigContext();

    const rowActions = (sourcePath:string) => (
        <KebabDropdown
            dropdownItems={
                <DropdownItem
                    onClick={() => {
                        // Handle deletion logic here
                        console.log(`Deleting source directory: ${sourcePath}`);
                        // You would typically call an API to remove the source directory from the config
                    }}
                >
                    {_("Delete")}
                </DropdownItem>
            }
        /> 
    );


    return (
        <>
            <Card>
                <CardTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {_("Sources")}
                    <Button
                        variant="link"
                        icon={<PlusIcon />}
                        onClick={() => setAddSourceDirModalState(true)}
                        >
                        {_("Add")}
                    </Button>
                    <AddSourceDir toggleModal={setAddSourceDirModalState} isOpen={modalAddSourceDirOpened} />
                </CardTitle>
                <CardBody>
                    <ListingTable
                        aria-label={_("Sources")}
                        variant='compact'
                        columns={[
                            { title: _("Path"), header: true, props: { width: 25 } },
                            { title: "", props: { width: 25, "aria-label": _("Actions") } },
                        ]}
                        emptyCaption={_("No source directories defined.")}
                        rows={(config.sourceDirectories).map((sourcePath) => ({
                            columns: [
                                { title: sourcePath },
                                { title: rowActions(sourcePath) },
                            ],
                        }))}
                    />
                </CardBody>
            </Card>
        </>
    );
}

export default SourceList;
