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

import React, { useContext, useEffect, useState } from 'react';

import { ListingTable } from "cockpit-components-table.jsx";

import { Button, Card, CardBody, CardTitle, Flex, FormSelect, FormSelectOption } from '@patternfly/react-core';
import {
    Table,
    Tbody,
    Thead, Th, Td, Tr,
    TableVariant,
} from '@patternfly/react-table';
import cockpit from 'cockpit';
import { PlusIcon } from '@patternfly/react-icons';
import AddRepo from './components/add-repo';
import RepoActions from './components/repo-actions';
import { BorgmaticFilesContext } from './context/borgmatic-config-files';

const _ = cockpit.gettext;

export const Application = () => {
    const [modalAddRepoOpened, setAddRepoModalState] = useState(false);

    const files = useContext(BorgmaticFilesContext);
    console.log("Borgmatic files context:", files);

    const options = [
        { value: '', label: 'Repository', disabled: false, isPlaceholder: true },
        { value: '1', label: 'One', disabled: false, isPlaceholder: false },
        { value: '2', label: 'Two', disabled: false, isPlaceholder: false },
        { value: '3', label: 'Three - the only valid option', disabled: false, isPlaceholder: false }
    ];

    useEffect(() => {
        const hostname = cockpit.file('/etc/hostname');
        // hostname.watch(content => setHostname(content?.trim() ?? ""));
        return hostname.close;
    }, []);

    return (
        <>
            <Flex>
                <Flex grow={{ default: 'grow' }}>
                    <FormSelect>
                        {options.map((option, index) => (
                            <FormSelectOption
                            isDisabled={option.disabled}
                            key={index}
                            value={option.value}
                            label={option.label}
                            isPlaceholder={option.isPlaceholder}
                            />
                        ))}
                    </FormSelect>
                </Flex>
                <Flex>
                    <Button variant="stateful" state="read" icon={<PlusIcon />} onClick={() => setAddRepoModalState(true)}>
                        {_("Add Repository")}
                    </Button>
                    <AddRepo toggleModal={setAddRepoModalState} isOpen={modalAddRepoOpened} existingLocations={["22"]} />
                </Flex>
            </Flex>
            <Flex grow={{ default: 'grow' }}>
                {/* <Card isFullHeight style={{ width: '100%' }}>
                    <CardTitle>Backup Locations</CardTitle>
                    <CardBody>
                        <Table variant={TableVariant.compact} aria-label="Backup Locations Table">
                            <Thead>
                                <Tr>
                                    <Th>{_("Name")}</Th>
                                    <Th>{_("Status")}</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td>{_("Location 1")}</Td>
                                    <Td>{_("Active")}</Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </CardBody>
                </Card> */}
                <ListingTable
                    aria-label={_("Virtual machines")}
                    variant='compact'
                    columns={[
                        { title: _("Name"), header: true, props: { width: 25 } },
                        { title: _("Connection"), props: { width: 25 } },
                        { title: _("State"), props: { width: 25 } },
                        { title: "", props: { width: 25, "aria-label": _("Actions") } },
                    ]}
                    emptyCaption={_("No Backup Locations defined.")}
                    rows={[
                        {
                            columns: [
                                {
                                    title: (
                                        <Button
                                            variant="link"
                                            isInline
                                            component="a"
                                            href={"#" + _("Location 1")}
                                        >
                                            {_("Location 1")}
                                        </Button>
                                    )
                                },
                                { title: _("Active") },
                                { title: _("Running") },
                                { title: <RepoActions /> }
                            ]
                        }
                    ]}
                />
            </Flex>
        </>
    );
};
