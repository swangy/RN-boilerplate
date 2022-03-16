import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import promiseToObservable from './promiseToObservable';

import { GRAPHQL_ENDPOINT, AUTH_CONFIG } from './config.env';
import SInfo from "react-native-sensitive-info";
import Auth0 from 'react-native-auth0';

// can't get redux to work cause of hook call errors
// import { useSelector, useDispatch } from 'react-redux';
// import { selectIdToken, refreshToken } from '../slices/userSlice';

const httpLink = new HttpLink({ uri: GRAPHQL_ENDPOINT });

const authLink = setContext(async () => {
    const idToken = await SInfo.getItem("idToken", {});
    // can't get redux to work cause of hook call errors
    // const idToken = selectIdToken && useSelector(selectIdToken);

    if (idToken) {
        return {
            headers: { authorization: 'Bearer ' + idToken }
        };
    } else {
        throw new Error('No idToken');
    }
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
        for (let err of graphQLErrors) {
            switch (err.extensions.code) {
                case 'invalid-jwt':
                    // https://github.com/apollographql/apollo-link/issues/646#issuecomment-423279220
                    return promiseToObservable(renewIdToken()).flatMap((value) => {
                        operation.setContext(({ headers = {} }) => ({
                            headers: {
                                // re-add old headers
                                ...headers,
                                authorization: `Bearer ${value}`
                            }
                        }));

                        console.log('RETRYING: ', JSON.stringify(operation.getContext().headers.authorization))
                        return forward(operation)
                    });

                    break;

                case 'UNAUTHENTICATED':
                    console.log('Not authenticated');
                    break;
            }
        }
    }
    if (networkError) {
        console.log(`[Network error]: ${networkError}`);
    }
});

// duplicate code from redux store cause we cant do hooks in middleware... :/
const renewIdToken = async () => {
    const auth0 = new Auth0(AUTH_CONFIG);
    const refreshToken = await SInfo.getItem("refreshToken", {});
    const credentials = await auth0.auth.refreshToken({ refreshToken });

    if (credentials) {
        console.log('TOKEN REFRESHED', credentials.idToken);
        SInfo.setItem("accessToken", credentials.accessToken, {});
        SInfo.setItem("idToken", credentials.idToken, {});

        return credentials.idToken
    }
}

export const apolloClient = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache()
});
