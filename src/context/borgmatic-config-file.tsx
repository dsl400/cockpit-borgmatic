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

import React, { createContext, useState, useCallback, useContext } from 'react';
import cockpit from 'cockpit';
import { BorgmaticConfigHelper } from '../helpers/borgmatic-config.helper';

interface BorgmaticLocationContextType {
    locationName: string;
    config: BorgmaticConfigHelper | null;
    readConfig: () => Promise<void>;
}

export const BorgmaticLocationContext = createContext<BorgmaticLocationContextType>({
    locationName: '',
    config: null,
    readConfig: async () => {}
});

export function useLocationConfigContext() {
    const { config, locationName, readConfig } = useContext(BorgmaticLocationContext);
    if (!locationName) {
        throw new Error("Borgmatic config is not available in the context");
    }
    if (!config) {
        throw new Error(`Borgmatic config for location "${locationName}" is not available`);
    }

    return { config, locationName, readConfig };
}

interface BorgmaticConfigFileProviderProps {
    children: React.ReactNode;
}

export function BorgmaticConfigFileProvider({
    children,
}: BorgmaticConfigFileProviderProps) {
    const path = cockpit.location.path?.[0] || '';
    const searchParams = new URLSearchParams(path);
    const locationName = searchParams.get('location') ?? '';
    const [config, setConfig] = useState<BorgmaticConfigHelper | null>(new BorgmaticConfigHelper(locationName));

    const readConfig = useCallback(async () => {
        try {
            const config = new BorgmaticConfigHelper(locationName);
            await config.read();
            setConfig(config);
        } catch (err) {
            console.error(`Failed to read config for ${locationName}: `, err);
            setConfig(null);
        }
    }, [locationName]);

    return (
        <BorgmaticLocationContext.Provider value={{
            locationName,
            config,
            readConfig
        }}
        >
            {children}
        </BorgmaticLocationContext.Provider>
    );
}
