import { createSlice } from '@reduxjs/toolkit';
import gql from 'graphql-tag';
import { apolloClient } from '../utils/graphqlMiddleware';

// explained better here:
//https://stackoverflow.com/questions/60316251/how-to-use-redux-thunk-with-redux-toolkits-createslice
export const slice = createSlice({
    name: 'symptoms',
    initialState: {
        loading: 'idle',
        networkError: null,
        symptoms: []
    },
    // Only synchronous functions go in here
    reducers: {
        networkError(state, action) {
            state.networkError = action.payload;
        },
        resetNetworkError(state) {
            state.networkError = null;
        },
        symptomsLoading(state) {
            if (state.loading === 'idle') {
                state.loading = 'pending';
            }
        },
        symptomsReceived(state, action) {
            if (state.loading === 'pending') {
                state.loading = 'idle';
            }
            state.symptoms = action.payload;
        },
        updateSymptomsList(state, action) {
            if (state.loading === 'pending') {
                state.loading = 'idle';
            }

            const payload = action.payload.returning[0];
            // console.log('UPDATE', payload, JSON.stringify(state.symptoms, undefined, 2));
            if (action.payload.affected_rows === 1) {
                state.symptoms.map(symptom => {
                    symptom.symptoms_children.map(child => {
                        // console.log('child', JSON.stringify(child, undefined, 2));
                        if (child.symptoms_id === payload.symptom_answered.symptoms_id) {
                            child.results = [{
                                client_answer: payload.client_answer,
                                ...child.results
                            }]
                        }
                    });
                });
            }
        },
    },
});

///////// ASYNC reducers ////////
/* 
 * symptomId: uuid of symptom that patient is reported to have
 * answer: boolean
*/
export const updateSymptomResult = (symptomId, answer) => async dispatch => {
    console.log(symptomId, answer);
    const response = await apolloClient.mutate({
        mutation: gql`
            mutation updateResult($client_answer: Boolean = false, $symptoms_fk: uuid = "") {
                update_concussion_results(where: {symptoms_fk: {_eq: $symptoms_fk}}, 
                _set: {client_answer: $client_answer}) {
                    affected_rows
                    returning {
                        client_answer
                        symptom_answered {
                            symptoms_id
                        }
                    }
                }
            }`,
        variables: {
            "symptoms_fk": symptomId,
            "client_answer": answer
        }
    });
    response && dispatch(updateSymptomsList(response.data.update_concussion_results))
}


/*
 * symptomId: uuid of symptom that patient is reported to have
 * answer: initially defaults to true when first selected
*/
export const insertSymptomResult = (symptomId) => async dispatch => {
    console.log(symptomId);
    const response = await apolloClient.mutate({
        mutation: gql`
            mutation insertResult($symptoms_fk: uuid = "") {
                insert_concussion_results(objects: {client_answer: true, symptoms_fk: $symptoms_fk}) {
                    affected_rows
                    returning {
                        client_answer
                        symptom_answered {
                            symptoms_id
                        }
                    }
                }
            }`,
        variables: {
            "symptoms_fk": symptomId
        }
    });
    response && dispatch(updateSymptomsList(response.data.insert_concussion_results))
}

export const fetchGeneralSymptoms = () => async dispatch => {
    dispatch(symptomsLoading());
    const response = await apolloClient.query({
        query: gql`query getGeneralSymptoms {
            concussion_symptoms(where: {symptoms_level: {_eq: General}}) {
                ...sxs
                symptoms_children {
                ...sxs
                ...chunk
                symptoms_children {
                    ...sxs
                    ...chunk
                }
                }
            }
        }

        fragment sxs on concussion_symptoms {
            symptoms_id
            symptoms_level
            symptoms_title
            symptoms_description
            author {
                user_full_name
            }
        }

        fragment chunk on concussion_symptoms {
            results {
                results_id
                client_answer
                client {
                    user_full_name
                    user_email
                }
            }
            education {
                education_id
                education_title
                education_body
            }
        }`,
        fetchPolicy: 'no-cache',
    }).catch(error => {
        dispatch(networkError(error));
    });
    response && dispatch(symptomsReceived(response.data.concussion_symptoms));
};

export const selectNetworkError = state => state.symptoms.networkError;
export const selectSymptoms = state => state.symptoms.symptoms;
export const selectLoading = state => state.symptoms.loading;
export const { symptomsLoading, symptomsReceived, updateSymptomsList,
    networkError, resetNetworkError } = slice.actions;

export default slice.reducer;
