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

import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import cockpit from 'cockpit';
import { LocationConfig } from './location-config';
import { BorgmaticLocationContext } from '../context/borgmatic-config-file';

const _ = cockpit.gettext;


export const Location = () => {


    const {locationName, readConfig } = useContext(BorgmaticLocationContext);

    useEffect(() => {
        readConfig();
    }, [locationName, readConfig]);



    const [activeTabKey, setActiveTabKey] = useState<string | number>(2);
    
    // Toggle currently active tab
    const handleTabClick = (
        event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
        tabIndex: string | number
    ) => {
        setActiveTabKey(tabIndex);
    };


    return (
        <>
            <h1>{locationName}</h1>
            <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
                <Tab eventKey="1" title={_("Archive")}>

                </Tab>
                <Tab eventKey={2} title={<TabTitleText>{_("Configuration")}</TabTitleText>}>
                    <LocationConfig />
                </Tab>
                <Tab eventKey="3" title={_("Schedule")}>

                </Tab>
            </Tabs>

        </>
    );
}

export default Location;
