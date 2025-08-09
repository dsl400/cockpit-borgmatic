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
