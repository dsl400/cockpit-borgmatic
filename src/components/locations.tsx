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

import { ListingTable } from "cockpit-components-table.jsx";

import { Button, Flex } from '@patternfly/react-core';

import { PlusIcon } from '@patternfly/react-icons';
import cockpit from 'cockpit';
import { BorgmaticLocationsContext } from '../context/borgmatic-config-files';
import AddLocation from './add-location';
import RepoActions from './repo-actions';

const _ = cockpit.gettext;

export const Locations = () => {

    const [modalAddLocationOpened, setAddRepoModalState] = useState(false);

    const { existingLocations } = useContext(BorgmaticLocationsContext);

        return (
            <>
                <Flex>
                    <Flex grow={{ default: 'grow' }} />
                    <Flex>
                        <Button variant="stateful" state="read" icon={<PlusIcon />} onClick={() => setAddRepoModalState(true)}>
                            {_("Add Location")}
                        </Button>
                        <AddLocation toggleModal={setAddRepoModalState} isOpen={modalAddLocationOpened} />
                    </Flex>
                </Flex>
                <Flex grow={{ default: 'grow' }}>
                    <ListingTable
                        aria-label={_("Backup Locations")}
                        variant='compact'
                        columns={[
                            { title: _("Name"), header: true, props: { width: 25 } },
                            { title: _("Connection"), props: { width: 25 } },
                            { title: _("State"), props: { width: 25 } },
                            { title: "", props: { width: 25, "aria-label": _("Actions") } },
                        ]}
                        emptyCaption={_("No Backup Locations defined.")}
                        rows={
                            existingLocations.map((location) => ({
                                columns: [
                                    {
                                        title: (
                                            <Button
                                                variant="link"
                                                isInline
                                                component="a"
                                                href={"#location="+ encodeURIComponent(location)}
                                            >
                                                {_(location)}
                                            </Button>
                                        )
                                    },
                                    { title: _("Active") },
                                    { title: _("Running") },
                                    { title: <RepoActions /> }
                                ]
                            }))
                        }
                    />
                </Flex>
            </>
        );
    }

export default Locations;
