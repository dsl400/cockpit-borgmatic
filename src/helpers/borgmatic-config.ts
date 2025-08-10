import yaml from 'js-yaml';

export interface BorgmaticConfig {
    location?: {
        source_directories?: string[];
        repositories?: string[];
    };
    storage?: {
        encryption_passphrase?: string;
        archive_name_format?: string;
    };
    retention?: {
        keep_daily?: number;
        keep_weekly?: number;
        keep_monthly?: number;
        keep_yearly?: number;
    };
    hooks?: {
        before_backup?: string[];
        after_backup?: string[];
    };
    [key: string]: any;
}

/**
 * Parses a Borgmatic YAML configuration string into a BorgmaticConfig object.
 * @param yamlStr The YAML configuration string.
 */
export function parseBorgmaticConfig(yamlStr: string): BorgmaticConfig {
    return yaml.load(yamlStr) as BorgmaticConfig;
}

/**
 * Builds a Borgmatic YAML configuration string from a BorgmaticConfig object.
 * @param config The BorgmaticConfig object.
 */
export function buildBorgmaticConfig(config: BorgmaticConfig): string {
    return yaml.dump(config, { noRefs: true, indent: 2 });
}
