import yaml from 'js-yaml';
import { BorgmaticConfig, BrogmaticRepository } from './borgmatic-config.model';
import cockpit from 'cockpit';

/**
 * Class to handle reading and writing Borgmatic YAML configuration.
 */
export class BorgmaticConfigHelper {
    private config: BorgmaticConfig | null = null;

    private readonly configPath: string;

    constructor(public readonly locationName: string) {
        this.configPath = `/etc/borgmatic.d/${locationName}.yml`;
    }

    async read() {
        const fileContent = await cockpit.file(this.configPath).read();
        if (!fileContent) {
            this.config = {} as BorgmaticConfig;
        }
        this.config = yaml.load(fileContent) as BorgmaticConfig;
    }

    /**
     * Builds a Borgmatic YAML configuration string from a BorgmaticConfig object.
     * @param config The BorgmaticConfig object.
     */
    write(config: BorgmaticConfig): string {
        return yaml.dump(config, { noRefs: true, indent: 2 });
    }

    /**
     * Returns the current Borgmatic configuration.
     * @returns The BorgmaticConfig object.
     */
    public get repositories(): BrogmaticRepository[] {
        if (!this.config) {
            throw new Error("Configuration not loaded");
        }
        return this.config.repositories || [];
    }

    /**
     * Adds a repository to the Borgmatic configuration.
     * @param repo The repository object containing path and optional label.
     */
    public addRepository(repo: BrogmaticRepository): void {
        if (!this.config) {
            throw new Error("Configuration not loaded");
        }
        if (!this.config.repositories) {
            this.config.repositories = [];
        }
        this.config.repositories.push(repo);
    }

    /**
     * Removes a repository from the Borgmatic configuration by path.
     * @param repoPath The path of the repository to remove.
     */
    public removeRepository(repoPath: string): void {
        if (!this.config) {
            throw new Error("Configuration not loaded");
        }
        if (!this.config.repositories) {
            throw new Error("No repositories defined in the configuration");
        }
        this.config.repositories = this.config.repositories.filter(repo => repo.path !== repoPath);
    }

    /**
     * Retrieves the source directories from the Borgmatic configuration.
     */
    public get sourceDirectories(): string[] {
        if (!this.config) {
            throw new Error("Configuration not loaded");
        }
        return this.config.source_directories || [];
    }

    /**
     * Adds a source directory to the Borgmatic configuration.
     * @param sourcePath The path of the source directory to add.
     */
    public addSourceDirectory(sourcePath: string): void {
        if (!this.config) {
            throw new Error("Configuration not loaded");
        }
        if (!this.config.source_directories) {
            this.config.source_directories = [];
        }
        this.config.source_directories.push(sourcePath);
    }

    /**
     * Removes a source directory from the Borgmatic configuration by path.
     * @param sourcePath The path of the source directory to remove.
     */
    public removeSourceDirectory(sourcePath: string): void {
        if (!this.config) {
            throw new Error("Configuration not loaded");
        }
        if (!this.config.source_directories) {
            throw new Error("No source directories defined in the configuration");
        }
        this.config.source_directories = this.config.source_directories.filter(path => path !== sourcePath);
    }
}
