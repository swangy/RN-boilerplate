import Config from "react-native-config";

const env = process.env.NODE_ENV;
let GRAPHQL_ENDPOINT;
let AUTH_CONFIG;

switch (env) {
    case 'development':
        GRAPHQL_ENDPOINT = Config.GRAPHQL_ENDPOINT_ENV_DEV;
        AUTH_CONFIG = {
            clientId: Config.AUTH_CONFIG_CLIENTID_ENV_DEV,
            audience: Config.AUDIENCE_DEV,
            domain: Config.DOMAIN_DEV,
        };
        break;
    case 'staging':
        GRAPHQL_ENDPOINT = Config.GRAPHQL_ENDPOINT_ENV_STAGING;
        AUTH_CONFIG = {
            clientId: Config.AUTH_CONFIG_CLIENTID_ENV_STAGING,
            audience: Config.AUDIENCE_STAGING,
            domain: Config.DOMAIN_STAGING,
        };
        break;
    case 'production':
        GRAPHQL_ENDPOINT = Config.GRAPHQL_ENDPOINT_ENV_PROD;
        AUTH_CONFIG = {
            clientId: Config.AUTH_CONFIG_CLIENTID_ENV_PROD,
            audience: Config.AUDIENCE_PROD,
            domain: Config.DOMAIN_PROD,
        };
        break;
    default:
}
console.log(env, AUTH_CONFIG, GRAPHQL_ENDPOINT)

export { GRAPHQL_ENDPOINT, AUTH_CONFIG };
