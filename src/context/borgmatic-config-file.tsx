import React, { createContext, useState, useCallback } from 'react';
import cockpit from 'cockpit';
import { BorgmaticConfig, parseBorgmaticConfig } from '../helpers/borgmatic-config';

interface BorgmaticLocationContextType {
    config: BorgmaticConfig | null;
    readConfig: (locationName:string) => Promise<void>;
}

export const BorgmaticLocationContext = createContext<BorgmaticLocationContextType>({
    config: null,
    readConfig: async () => {}
});

interface BorgmaticConfigFileProviderProps {
    children: React.ReactNode;
}

export function BorgmaticConfigFileProvider({
    children,
}: BorgmaticConfigFileProviderProps) {
    const [config, setConfig] = useState<BorgmaticConfig | null>(null);

    const readConfig = useCallback(async (locationName:string) => {
        try {
            const content = await cockpit.file(`/etc/borgmatic.d/${locationName}.yml`).read();
            const config: BorgmaticConfig = parseBorgmaticConfig(content || '');
            setConfig(config);
        } catch (err) {
            console.error(`Failed to read file /etc/borgmatic.d/${locationName}.yml:`, err);
            setConfig(null);
        }
    }, []);

    return (
        <BorgmaticLocationContext.Provider value={{
            config,
            readConfig
        }}
        >
            {children}
        </BorgmaticLocationContext.Provider>
    );
}
