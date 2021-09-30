import { createSlice } from '@reduxjs/toolkit';
import gql from 'graphql-tag';
import { apolloClient } from '../utils/graphqlMiddleware';

// explained better here:
//https://stackoverflow.com/questions/60316251/how-to-use-redux-thunk-with-redux-toolkits-createslice
export const slice = createSlice({
    name: 'education',
    initialState: {
        loading: 'idle',
        educationItems: []
    },
    // Only synchronous functions go in here
    reducers: {
        educationLoading(state) {
            if (state.loading === 'idle') {
                state.loading = 'pending';
            }
        },
        educationReceived(state, action) {
            if (state.loading === 'pending') {
                state.loading = 'idle';
            }
            state.educationItems = action.payload;
        },
        updateEducationList(state, action) {
            if (state.loading === 'pending') {
                state.loading = 'idle';
            }
        },
    },
});

///////// ASYNC reducers ////////

export const fetchEducationItems = () => async dispatch => {
    dispatch(educationLoading());
    const response = await apolloClient.query({
        query: gql`
            query getEdItems {
                concussion_symptoms(where: {results: {client_answer: {_eq: true}}}) {
                    symptoms_id
                    symptoms_title
                    education {
                        education_id
                        education_title
                        education_body
                        }
                    }
                }
        `,
        fetchPolicy: 'no-cache',
    });
    dispatch(educationReceived(response.data.concussion_symptoms));
};

export const selectEducation = state => state.education.educationItems;
export const selectLoading = state => state.education.loading;
export const { educationLoading, educationReceived, updateEducationList } = slice.actions;

export default slice.reducer;
