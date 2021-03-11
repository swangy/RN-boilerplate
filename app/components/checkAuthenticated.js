import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { isAuthenticated } from '../slices/userSlice';

export default CheckAuthenticated = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(isAuthenticated())
    }, []);

    return (
        <>
        </>
    )
}