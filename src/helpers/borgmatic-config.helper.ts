import yaml from 'js-yaml';
import { BorgmaticConfig, BrogmaticRepository, CommandHook } from './borgmatic-config.model';
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
    write(): Promise<string> {
        const yamlContent = yaml.dump(this.config, { noRefs: true, indent: 2 });
        console.log("Writing Borgmatic config to:", this.configPath, yamlContent);
        return cockpit.file(this.configPath, { superuser: 'require' }).replace(yamlContent);
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
    public addRepository(repo: BrogmaticRepository): BorgmaticConfigHelper {
        if (!this.config) {
            throw new Error("Configuration not loaded");
        }
        if (!this.config.repositories) {
            this.config.repositories = [];
        }
        this.config.repositories.push(repo);
        return this;
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
    public addSourceDirectory(sourcePath: string): BorgmaticConfigHelper {
        if (!this.config) {
            throw new Error("Configuration not loaded");
        }
        if (!this.config.source_directories) {
            this.config.source_directories = [];
        }
        this.config.source_directories.push(sourcePath);
        return this;
    }

    /**
     * Removes a source directory from the Borgmatic configuration by path.
     * @param sourcePath The path of the source directory to remove.
     */
    public removeSourceDirectory(sourcePath: string): BorgmaticConfigHelper {
        if (!this.config) {
            throw new Error("Configuration not loaded");
        }
        if (!this.config.source_directories) {
            throw new Error("No source directories defined in the configuration");
        }
        this.config.source_directories = this.config.source_directories.filter(path => path !== sourcePath);
        return this;
    }

    public get commands(): CommandHook[] {
        if (!this.config) {
            throw new Error("Configuration not loaded");
        }
        return this.config.commands || [];
    }

    /**
     * Adds a command to the Borgmatic configuration.
     * @param command
     * @returns
     */
    public addCommand(command: CommandHook): BorgmaticConfigHelper {
        if (!this.config) {
            throw new Error("Configuration not loaded");
        }
        if (!command.before && !command.after) {
            throw new Error("Command must have either 'before' or 'after' defined");
        }
        if (!this.config.commands) {
            this.config.commands = [];
        }

        const finalCommand = {} as CommandHook;
        if (command.before) {
            finalCommand.before = command.before;
        } else if (command.after) {
            finalCommand.after = command.after;
        }
        if (command.when) {
            finalCommand.when = command.when;
        }
        if (command.states) {
            finalCommand.states = command.states;
        }
        finalCommand.run = command.run;

        this.config.commands.push(finalCommand);
        return this;
    }

    /**
     * Removes a repository from the Borgmatic configuration by path.
     * @param repoPath The path of the repository to remove.
     */
    public removeCommand(index: number): BorgmaticConfigHelper {
        if (!this.config) {
            throw new Error("Configuration not loaded");
        }
        if (!this.config.commands || index < 0 || index >= this.config.commands.length) {
            throw new Error("Invalid command index or no commands defined in the configuration");
        }
        this.config.commands.splice(index, 1);
        return this;
    }
}
