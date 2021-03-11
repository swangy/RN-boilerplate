import { createSlice } from '@reduxjs/toolkit';
import SInfo from "react-native-sensitive-info";
import Auth0 from 'react-native-auth0';
import RNRestart from "react-native-restart";
import { AUTH_CONFIG } from '../utils/config';

import gql from 'graphql-tag';
import { apolloClient } from '../utils/graphqlMiddleware';
import jwt_decode from 'jwt-decode';

// explained better here:
//https://stackoverflow.com/questions/60316251/how-to-use-redux-thunk-with-redux-toolkits-createslice

const auth0 = new Auth0(AUTH_CONFIG);
export const slice = createSlice({
  name: 'user',
  initialState: {
    loading: 'idle',
    networkError: null,
    accessToken: null,
    idToken: null,
    user: null
  },
  // Only synchronous functions go in here
  reducers: {
    networkError(state, action) {
      state.networkError = action.payload;
    },
    resetNetworkError(state) {
      state.networkError = null;
    },
    userLoading(state) {
      if (state.loading === 'idle') {
        state.loading = 'pending';
      }
    },
    userReceived(state, action) {
      state.user = action.payload;
      if (state.loading === 'pending') {
        state.loading = 'idle';
      }
    },
    updateUserList(state, action) {
      if (state.loading === 'pending') {
        state.loading = 'idle';
      }
    },
    updateAccessToken(state, action) {
      state.accessToken = action.payload
    },
    updateIdToken(state, action) {
      state.idToken = action.payload
    },
    renewIdToken(state, action) {
      const refreshToken = SInfo.getItem("refreshToken", {});
      const credentials = auth0.auth.refreshToken({ refreshToken });

      if (credentials) {
        SInfo.setItem("accessToken", credentials.accessToken, {});
        SInfo.setItem("idToken", credentials.idToken, {});

        state.accessToken = credentials.accessToken;
        state.idToken = credentials.idToken;
        RNRestart.Restart();
      } else {
        console.log('id Token renewal failed', credentials)
        state.accessToken = null;
        state.idToken = null;
      }

    },
    upsertToHasura: (state, action) => {
      // auth0Id is taken from JWT when upsert occurs on backend
      // action.payload must be in JWT format
      const decoded = action.payload && jwt_decode(action.payload);

      apolloClient.mutate({
        mutation: gql`
          mutation upsert($avatar:String, $email:String, $name:String) {
            insert_concussion_users(
              objects: {
                user_avatar: $avatar,
                user_email: $email,
                user_full_name: $name,
                user_note: $name
              },
              on_conflict: {
                constraint: users_pkey,
                update_columns: [updated_at, user_avatar]
              }) {
              affected_rows
            }
          }`,
        variables: {
          "avatar": decoded.picture,
          "email": decoded.email,
          "name": decoded.name
        },
        fetchPolicy: 'no-cache',
      }).then((response) => {
        console.log('Successfully upserted: ', response.data.insert_concussion_users.affected_rows);
      }).catch(err => {
        console.log('Error upserting: :', err);
      });
    },
  },
});

///////// ASYNC reducers ////////

export const isAuthenticated = payload => async dispatch => {
  const accessToken = await SInfo.getItem("accessToken", {});
  const idToken = await SInfo.getItem("idToken", {});
  dispatch(userLoading());

  console.log('Authenticated: ', accessToken);
  // https://blog.pusher.com/react-native-auth0/
  // By default, Auth0’s access tokens are only valid for 24 hours after it was first received when the user logged in. If this happens, we can request a new access token by using the refresh token which we also receive when the user logged in

  if (accessToken) {
    try {
      const userInfo = await auth0.auth.userInfo({ token: accessToken });

      if (userInfo) {
        dispatch(updateAccessToken(accessToken));
      }
    } catch (err) {
      SInfo.deleteItem("accessToken", {});
      SInfo.deleteItem("idToken", {});
      dispatch(updateAccessToken(null));
      dispatch(updateIdToken(null));
      console.log('Authentication failed, renewing token', err)
      dispatch(renewIdToken(accessToken));
    }
  }

  if (idToken) {
    // TODO: do we need to check if expired
    // if 
    //     dispatch(renewIdToken);
    // else
    dispatch(updateIdToken(idToken));
  }
}

export const getUserProfile = (accessToken) => async dispatch => {
  try {
    const userInfo = await auth0.auth.userInfo({ token: accessToken });
    console.log('User profile: ', userInfo);
    return userInfo;
  } catch (err) {
    console.log('Error retrieving uuser profile: ', err);
  }
}

export const handleLoginPress = () => async dispatch => {
  try {
    const credentials = await auth0.webAuth
      .authorize({ scope: 'openid profile email offline_access' });

    SInfo.setItem("accessToken", credentials.accessToken, {});
    SInfo.setItem("idToken", credentials.idToken, {});
    SInfo.setItem("refreshToken", credentials.refreshToken, {});

    dispatch(updateAccessToken(credentials.accessToken));
    dispatch(updateIdToken(credentials.idToken));
    dispatch(upsertToHasura(credentials.idToken));
  } catch (error) {
    console.log("Login error: ", error)
  }
}

export const handleLogoutPress = payload => async dispatch => {
  auth0.webAuth.clearSession().catch(error => console.log(error));
  dispatch(updateAccessToken(null));
  dispatch(updateIdToken(null));

  SInfo.deleteItem("accessToken", {});
  SInfo.deleteItem("idToken", {});
  SInfo.deleteItem("refreshToken", {});
}

// export const updateUser = () => async dispatch => {
//   dispatch(usersLoading());
//   const response = await apolloClient.mutate({
//     mutation: gql`mutation MyMutation($user: concussion_users_set_input) {
//       update_concussion_users
//       (where: {},
//         _set: $user) {
//         affected_rows
//         returning {
//           auth0Id
//           user_full_name
//           user_note
//           update_at
//         }
//       }
//     }`,
//     variables: {
//       "user": {
//         "user_note": payload.user_note
//       }
//     },
//     fetchPolicy: 'no-cache',
//   }).catch(error => {
//     dispatch(networkError(error));
//   });

//   const updatedUser = response && response.data.update_concussion_users.returning[0];
//   dispatch(updateUserList(updatedUser));
// };

// export const fetchUsers = () => async dispatch => {
//   dispatch(usersLoading());
//   const response = await apolloClient.query({
//     query: gql`query getUsers {
//       concussion_users {
//         auth0Id
//         user_full_name
//         user_note
//         updated_at
//       }
//     }`,
//     fetchPolicy: 'no-cache',
//   }).catch(error => {
//     dispatch(networkError(error));
//   });

//   response && dispatch(usersReceived(response.data.concussion_users));
// };

export const selectNetworkError = state => state.user.networkError;
export const selectLoading = state => state.user.loading;
export const selectUser = state => state.user.user;
export const selectAccessToken = state => state.user.accessToken;
export const selectIdToken = state => state.user.idToken;
export const {
  renewIdToken,
  updateAccessToken,
  updateIdToken,
  upsertToHasura,
  userLoading,
  userReceived,
  updateUserList,
  networkError,
  resetNetworkError } = slice.actions;

export default slice.reducer;
