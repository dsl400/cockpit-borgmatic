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

import React, { createContext, useState, useCallback } from 'react';
import cockpit from 'cockpit';
import { BorgmaticConfig, parseBorgmaticConfig } from '../helpers/borgmatic-config';

interface BorgmaticLocationContextType {
    locationName: string;
    config: BorgmaticConfig | null;
    readConfig: () => Promise<void>;
}

export const BorgmaticLocationContext = createContext<BorgmaticLocationContextType>({
    locationName: '',
    config: null,
    readConfig: async () => {}
});

interface BorgmaticConfigFileProviderProps {
    children: React.ReactNode;
}

export function BorgmaticConfigFileProvider({
    children,
}: BorgmaticConfigFileProviderProps) {
    const path = cockpit.location.path?.[0] || '';
    const searchParams = new URLSearchParams(path);
    const locationName = searchParams.get('location') ?? '';
    const [config, setConfig] = useState<BorgmaticConfig | null>(null);

    const readConfig = useCallback(async () => {
        try {
            const content = await cockpit.file(`/etc/borgmatic.d/${locationName}.yml`).read();
            const config: BorgmaticConfig = parseBorgmaticConfig(content || '');
            setConfig(config);
        } catch (err) {
            console.error(`Failed to read file /etc/borgmatic.d/${locationName}.yml:`, err);
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
