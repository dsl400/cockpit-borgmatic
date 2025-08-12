import yaml from 'js-yaml';

// Repository configuration
export interface BrogmaticRepository {
    path: string;
    label?: string;
    encryption?: string;
    append_only?: boolean;
    storage_quota?: string;
    make_parent_directories?: boolean;
}

// Exit code configuration
interface BorgExitCode {
    code: number;
    treat_as: 'error' | 'warning';
}

// Consistency check configuration
interface Check {
    name: 'repository' | 'archives' | 'data' | 'spot' | 'extract';
    frequency?: string;
    only_run_on?: string[];
    max_duration?: number;
    count_tolerance_percentage?: number;
    data_sample_percentage?: number;
    data_tolerance_percentage?: number;
    xxh64sum_command?: string;
}

// Command hook configuration
export interface CommandHook {
    before?: 'action' | 'repository' | 'configuration' | 'everything';
    after?: 'action' | 'repository' | 'configuration' | 'everything' | 'error';
    when?: string[];
    where?: 'finish' | 'fail' | 'everywhere';
    run: string[];
    states?: ('finish' | 'fail')[];
}

// Database configurations
interface PostgreSQLDatabase {
    name: string;
    hostname?: string;
    restore_hostname?: string;
    port?: number;
    restore_port?: number;
    username?: string;
    restore_username?: string;
    password?: string;
    restore_password?: string;
    no_owner?: boolean;
    format?: 'plain' | 'custom' | 'directory' | 'tar';
    compression?: string;
    ssl_mode?: 'disable' | 'allow' | 'prefer' | 'require' | 'verify-ca' | 'verify-full';
    ssl_cert?: string;
    ssl_key?: string;
    ssl_root_cert?: string;
    ssl_crl?: string;
    pg_dump_command?: string;
    pg_restore_command?: string;
    psql_command?: string;
    options?: string;
    list_options?: string;
    restore_options?: string;
    analyze_options?: string;
}

interface MariaDBDatabase {
    name: string;
    hostname?: string;
    restore_hostname?: string;
    port?: number;
    restore_port?: number;
    username?: string;
    restore_username?: string;
    password?: string;
    restore_password?: string;
    password_transport?: 'pipe' | 'environment';
    tls?: boolean;
    restore_tls?: boolean;
    mariadb_dump_command?: string;
    mariadb_command?: string;
    format?: string;
    add_drop_database?: boolean;
    options?: string;
    list_options?: string;
    restore_options?: string;
}

interface MySQLDatabase {
    name: string;
    hostname?: string;
    restore_hostname?: string;
    port?: number;
    restore_port?: number;
    username?: string;
    restore_username?: string;
    password?: string;
    restore_password?: string;
    password_transport?: 'pipe' | 'environment';
    tls?: boolean;
    restore_tls?: boolean;
    mysql_dump_command?: string;
    mysql_command?: string;
    format?: string;
    add_drop_database?: boolean;
    options?: string;
    list_options?: string;
    restore_options?: string;
}

interface SQLiteDatabase {
    name: string;
    path: string;
    restore_path?: string;
    sqlite_command?: string;
    sqlite_restore_command?: string;
}

interface MongoDBDatabase {
    name: string;
    hostname?: string;
    restore_hostname?: string;
    port?: number;
    restore_port?: number;
    username?: string;
    restore_username?: string;
    password?: string;
    restore_password?: string;
    authentication_database?: string;
    format?: 'archive' | 'directory';
    options?: string;
    restore_options?: string;
    mongodump_command?: string;
    mongorestore_command?: string;
}

// Monitoring configurations
interface MonitoringState {
    title?: string;
    message?: string;
    body?: string;
    value?: string;
    priority?: string | number;
    expire?: number;
    retry?: number;
    device?: string;
    html?: boolean;
    sound?: string;
    ttl?: number;
    url?: string;
    url_title?: string;
    tags?: string | string[];
}

interface NtfyConfig {
    topic: string;
    server?: string;
    username?: string;
    password?: string;
    access_token?: string;
    start?: MonitoringState;
    finish?: MonitoringState;
    fail?: MonitoringState;
    states?: string[];
}

interface PushoverConfig {
    token: string;
    user: string;
    start?: MonitoringState;
    finish?: MonitoringState;
    fail?: MonitoringState;
    states?: string[];
}

interface ZabbixConfig {
    itemid?: number;
    host?: string;
    key?: string;
    server: string;
    username?: string;
    password?: string;
    api_key?: string;
    start?: { value: string };
    finish?: { value: string };
    fail?: { value: string };
    states?: string[];
}

interface AppriseService {
    url: string;
    label?: string;
}

interface AppriseConfig {
    services: AppriseService[];
    send_logs?: boolean;
    logs_size_limit?: number;
    start?: MonitoringState;
    finish?: MonitoringState;
    fail?: MonitoringState;
    log?: MonitoringState;
    states?: string[];
}

interface HealthchecksConfig {
    ping_url: string;
    verify_tls?: boolean;
    send_logs?: boolean;
    ping_body_limit?: number;
    states?: string[];
    create_slug?: boolean;
}

interface UptimeKumaConfig {
    push_url: string;
    states?: string[];
    verify_tls?: boolean;
}

interface CronitorConfig {
    ping_url: string;
}

interface PagerDutyConfig {
    integration_key: string;
    send_logs?: boolean;
}

interface CronhubConfig {
    ping_url: string;
}

interface LokiConfig {
    url: string;
    labels: Record<string, string>;
}

interface SentryConfig {
    data_source_name_url: string;
    monitor_slug: string;
    states?: string[];
}

// Filesystem integrations
interface ZFSConfig {
    zfs_command?: string;
    mount_command?: string;
    umount_command?: string;
}

interface BtrfsConfig {
    btrfs_command?: string;
    findmnt_command?: string;
}

interface LVMConfig {
    snapshot_size?: string;
    lvcreate_command?: string;
    lvremove_command?: string;
    lvs_command?: string;
    lsblk_command?: string;
    mount_command?: string;
    umount_command?: string;
}

interface ContainerConfig {
    secrets_directory?: string;
}

interface KeePassXCConfig {
    keepassxc_cli_command?: string;
    key_file?: string;
    yubikey?: string;
}

export interface BorgmaticConfig {
    // Constants
    constants?: Record<string, string>;

    // Source directories and repositories
    source_directories?: string[];
    repositories?: BrogmaticRepository[];
    working_directory?: string;

    // Filesystem and backup behavior options
    one_file_system?: boolean;
    numeric_ids?: boolean;
    atime?: boolean;
    ctime?: boolean;
    birthtime?: boolean;
    read_special?: boolean;
    flags?: boolean;
    files_cache?: string;
    local_path?: string;
    remote_path?: string;

    // Patterns
    patterns?: string[];
    patterns_from?: string[];
    exclude_patterns?: string[];
    exclude_from?: string[];
    exclude_caches?: boolean;
    exclude_if_present?: string[];
    keep_exclude_tags?: boolean;
    exclude_nodump?: boolean;

    // Directories
    borgmatic_source_directory?: string;
    user_runtime_directory?: string;
    user_state_directory?: string;
    source_directories_must_exist?: boolean;

    // Encryption and security
    encryption_passcommand?: string;
    encryption_passphrase?: string;

    // Backup behavior
    checkpoint_interval?: number;
    checkpoint_volume?: number;
    chunker_params?: string;
    compression?: string;
    recompress?: 'if-different' | 'always' | 'never';

    // Network settings
    upload_rate_limit?: number;
    upload_buffer_size?: number;
    retries?: number;
    retry_wait?: number;

    // Paths and directories
    temporary_directory?: string;
    ssh_command?: string;
    borg_base_directory?: string;
    borg_config_directory?: string;
    borg_cache_directory?: string;
    use_chunks_archive?: boolean;
    borg_files_cache_ttl?: number;
    borg_security_directory?: string;
    borg_keys_directory?: string;

    // Error handling
    borg_exit_codes?: BorgExitCode[];
    umask?: number | string;

    // Archive settings
    lock_wait?: number;
    archive_name_format?: string;
    match_archives?: string;
    relocated_repo_access_is_ok?: boolean;
    unknown_unencrypted_repo_access_is_ok?: boolean;
    debug_passphrase?: boolean;
    display_passphrase?: boolean;
    check_i_know_what_i_am_doing?: boolean;

    // Extra options
    extra_borg_options?: {
        init?: string;
        create?: string;
        prune?: string;
        compact?: string;
        check?: string;
    };

    // Retention settings
    keep_within?: string;
    keep_secondly?: number;
    keep_minutely?: number;
    keep_hourly?: number;
    keep_daily?: number;
    keep_weekly?: number;
    keep_monthly?: number;
    keep_yearly?: number;
    keep_13weekly?: number;
    keep_3monthly?: number;
    prefix?: string;
    compact_threshold?: number;

    // Consistency checks
    checks?: Check[];
    check_repositories?: string[];
    check_last?: number;

    // Output settings
    color?: boolean;
    verbosity?: number;
    syslog_verbosity?: number;
    log_file_verbosity?: number;
    log_file?: string;
    log_file_format?: string;
    monitoring_verbosity?: number;
    log_json?: boolean;
    progress?: boolean;
    statistics?: boolean;
    list_details?: boolean;
    default_actions?: boolean;
    skip_actions?: string[];

    // Hooks (deprecated)
    before_actions?: string[];
    before_backup?: string[];
    before_prune?: string[];
    before_compact?: string[];
    before_check?: string[];
    before_extract?: string[];
    after_backup?: string[];
    after_compact?: string[];
    after_prune?: string[];
    after_check?: string[];
    after_extract?: string[];
    after_actions?: string[];
    on_error?: string[];
    before_everything?: string[];
    after_everything?: string[];

    // Command hooks
    commands?: CommandHook[];

    // Bootstrap settings
    bootstrap?: {
        store_config_files?: boolean;
    };

    // Database hooks
    postgresql_databases?: PostgreSQLDatabase[];
    mariadb_databases?: MariaDBDatabase[];
    mysql_databases?: MySQLDatabase[];
    sqlite_databases?: SQLiteDatabase[];
    mongodb_databases?: MongoDBDatabase[];

    // Monitoring integrations
    ntfy?: NtfyConfig;
    pushover?: PushoverConfig;
    zabbix?: ZabbixConfig;
    apprise?: AppriseConfig;
    healthchecks?: HealthchecksConfig;
    uptime_kuma?: UptimeKumaConfig;
    cronitor?: CronitorConfig;
    pagerduty?: PagerDutyConfig;
    cronhub?: CronhubConfig;
    loki?: LokiConfig;
    sentry?: SentryConfig;

    // Filesystem integrations
    zfs?: ZFSConfig;
    btrfs?: BtrfsConfig;
    lvm?: LVMConfig;

    // Other integrations
    container?: ContainerConfig;
    keepassxc?: KeePassXCConfig;

    // Allow for any other properties
    [key: string]: unknown;
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
