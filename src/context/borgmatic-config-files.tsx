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

import React, { createContext, useState, useEffect, useCallback } from 'react';
import cockpit from 'cockpit';

// Update the context type to include the reload function
interface BorgmaticLocationsContextType {
    existingLocations: string[];
    reloadLocations: () => Promise<void>;
}

export const BorgmaticLocationsContext = createContext<BorgmaticLocationsContextType>({
    existingLocations: [],
    reloadLocations: async () => {}
});

export function BorgmaticConfigFilesProvider({ children }: React.PropsWithChildren<object>) {
    const [existingLocations, setFiles] = useState<string[]>([]);

    // Create a reusable function to load files
    const reloadLocations = useCallback(async () => {
        try {
            let output = await cockpit.spawn(['ls', '-1', '/etc/borgmatic.d'],
                                             { superuser: 'require', err: 'message' });
            output = output.trim();
            let locations:string[] = [];
            const outputlines = output.split('\n');
            if (outputlines.length) {
                locations = outputlines
                        .filter(line => line.endsWith('.yml'))
                        .map(line => line.replace(/\.yml$/, ''));
            }
            setFiles(locations);
        } catch (err) {
            console.error('Failed to list borgmatic.d:', err);
        }
    }, []);

    // Load files initially on mount
    useEffect(() => {
        console.log('Loading initial borgmatic.d files...');
        reloadLocations();
    }, [reloadLocations]);

    return (
        <BorgmaticLocationsContext.Provider value={{ existingLocations, reloadLocations }}>
            {children}
        </BorgmaticLocationsContext.Provider>
    );
}
