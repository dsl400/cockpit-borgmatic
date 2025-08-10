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

import React from 'react';

import { Button, Card, CardBody, CardTitle } from '@patternfly/react-core';
import cockpit from 'cockpit';
import { ListingTable } from 'cockpit-components-table';
import { PlusIcon } from '@patternfly/react-icons';
const _ = cockpit.gettext;


export const SourceList = () => {   

    return (
        <>
            <Card>
                <CardTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    Sources
                    <Button variant="link" icon={<PlusIcon />}>
                        {_("Add")}
                    </Button>
                </CardTitle>
                <CardBody>
                    <ListingTable
                        aria-label={_("Sources")}
                        variant='compact'
                        columns={[
                            { title: _("Name"), header: true, props: { width: 25 } },
                            { title: "", props: { width: 25, "aria-label": _("Actions") } },
                        ]}
                        emptyCaption={_("No sources defined.")}
                        rows={[]}
                    />
                </CardBody>
            </Card>
        </>
    );
}

export default SourceList;
