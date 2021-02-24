const DEV_CONFIG = {
    GRAPHQL_ENDPOINT: 'https://XXXXX.com/v1/graphql',
    AUTH_CONFIG: {
        clientId: 'XXXXX',
        audience: 'XXXXX',
        domain: "XXXXX.auth0.com",
    },
};

const STAGING_CONFIG = {
    GRAPHQL_ENDPOINT: 'https://XXXXX.com/v1/graphql',
    AUTH_CONFIG: {
        clientId: 'XXXXX',
        audience: 'xxxxxxxx',
        domain: "xxxxx.auth0.com"
    },
};

const PRODUCTION_CONFIG = {
    GRAPHQL_ENDPOINT: 'https://XXXXXX.com/v1/graphql',
    AUTH_CONFIG: {
        clientId: 'XXXXX',
        audience: 'xxxxxxxx',
        domain: "xxxxx.auth0.com"
    },
};

const env = process.env.NODE_ENV;

let GRAPHQL_ENDPOINT;
let AUTH_CONFIG;

switch (env) {
    case 'dev':
        GRAPHQL_ENDPOINT = DEV_CONFIG.GRAPHQL_ENDPOINT;
        AUTH_CONFIG = DEV_CONFIG.AUTH_CONFIG;
        break;
    case 'staging':
        GRAPHQL_ENDPOINT = STAGING_CONFIG.GRAPHQL_ENDPOINT;
        AUTH_CONFIG = STAGING_CONFIG.AUTH_CONFIG;
        break;
    case 'production':
        GRAPHQL_ENDPOINT = PRODUCTION_CONFIG.GRAPHQL_ENDPOINT;
        AUTH_CONFIG = PRODUCTION_CONFIG.AUTH_CONFIG;
        break;
    default:
        GRAPHQL_ENDPOINT = DEV_CONFIG.GRAPHQL_ENDPOINT;
        AUTH_CONFIG = DEV_CONFIG.AUTH_CONFIG;
}

export { GRAPHQL_ENDPOINT, AUTH_CONFIG };
