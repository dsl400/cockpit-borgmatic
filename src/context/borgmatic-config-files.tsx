import React, { createContext, useState, useEffect } from 'react';
import cockpit from 'cockpit';

export const BorgmaticFilesContext = createContext<string[]>([]);

export function BorgmaticConfigFilesProvider({ children }: React.PropsWithChildren<object>) {
    const [files, setFiles] = useState<string[]>([]);

    useEffect(() => {
        cockpit
                .spawn(['ls', '-1', '/etc/borgmatic.d'], { superuser: 'require', err: 'message' })
                .then(output => setFiles(output.trim().split('\n')))
                .catch(err => console.error('Failed to list borgmatic.d:', err));
    }, []);

    return (
        <BorgmaticFilesContext.Provider value={files}>
            {children}
        </BorgmaticFilesContext.Provider>
    );
}
