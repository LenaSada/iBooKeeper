import React, { useContext } from 'react';
import { UserContext } from '../userContext';

const UserRoleChecker = () => {
    const { user } = useContext(UserContext);

    return (
        <>
            {
                !!user && user.role === 'customer' && 
                <h1>User Homepage</h1>
            }
            {
                !!user && user.role === 'accountant' && 
                <h1>Accountant Homepage</h1>
            }
        </>
    )
}

export default UserRoleChecker