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

import cockpit from 'cockpit';
import { BorgmaticLocationsContext } from './context/borgmatic-config-files';
import Locations from './components/locations';
import Location from './components/location';

const _ = cockpit.gettext;

interface ApplicationState {
    path: string;
}

export class Application extends React.Component<object, ApplicationState> {
    static contextType = BorgmaticLocationsContext;

    constructor(props: object) {
        super(props);

        const currentPath = cockpit.location.path?.[0] || '';

        this.state = {
            path: currentPath
        };

        this.handleLocationChanged = this.handleLocationChanged.bind(this);
    }

    handleLocationChanged() {``
        this.setState({ path:  cockpit.location.path?.[0] || '' });
    }

    componentDidMount() {
        cockpit.addEventListener('locationchanged', this.handleLocationChanged);
    }

    componentWillUnmount() {
        cockpit.removeEventListener('locationchanged', this.handleLocationChanged);
    }

    render() {
        const { path } = this.state;
        if (!path) {
            return (<Locations />);
        } else if (path.startsWith('location')) {
            return (<Location />);
        }
    }
}
