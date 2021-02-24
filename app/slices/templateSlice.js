import { createSlice } from '@reduxjs/toolkit';
import gql from 'graphql-tag';
import { apolloClient } from '../utils/graphqlMiddleware';

// explained better here:
//https://stackoverflow.com/questions/60316251/how-to-use-redux-thunk-with-redux-toolkits-createslice
export const slice = createSlice({
    name: 'XXX',
    initialState: {
        loading: 'idle',
        XXX: []
    },
    // Only synchronous functions go in here
    reducers: {
        XXXLoading(state) {
            if (state.loading === 'idle') {
                state.loading = 'pending';
            }
        },
        XXXReceived(state, action) {
            if (state.loading === 'pending') {
                state.loading = 'idle';
            }
            state.XXXX = action.payload;
        },
        updateXXXList(state, action) {
            if (state.loading === 'pending') {
                state.loading = 'idle';
            }
        },
    },
});

///////// ASYNC reducers ////////

export const fetchXXX = () => async dispatch => {
    dispatch(XXXLoading());
    const response = await apolloClient.query({
        query: gql`query getUsers {
            concussion_users {
                auth0Id
                user_full_name
                user_note
                updated_at
            }
        }`,
        fetchPolicy: 'no-cache',
    });
    dispatch(XXXReceived(response.data.concussion_users));
};

export const selectXXX = state => state.XXX.XXX;
export const selectLoading = state => state.XXX.loading;
export const { XXXLoading, XXXReceived, updateXXXList } = slice.actions;

export default slice.reducer;
