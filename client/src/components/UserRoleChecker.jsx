import React, { useContext } from 'react';
import HomepageUser from './HomepageUser';
import { UserContext } from '../userContext';
import { getBookedDays } from '../utils';

const UserRoleChecker = () => {
    const { user } = useContext(UserContext);

    const getBookedDaysHelper = async (setBookedDays) => {
        try {
            const data = await getBookedDays();
            console.log(data);
            setBookedDays(data);
        } catch (error) {
            console.error('Error in getting booked days:', error);
        }
    }

    // Format date to the following format: "YYYY-MM-DDT21:00:00.000Z"
    const formatDate = (date) => {
        const year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();
        let month_str = month, day_str = day;
        if (month < 10) {
            month_str = "0" + month;
        }
        if (day < 10) {
            day_str = "0" + day;
        }

        const temp = `${year}-${month_str}-${day_str}T21:00:00.000Z`;
        return temp;
    }

    return (
        <>
            {
                !!user && user.role === 'customer' && 
                <HomepageUser user={user} formatDate={formatDate} getBookedDaysHelper={getBookedDaysHelper} />
            }
            {
                !!user && user.role === 'accountant' && 
                <h1>Accountant Homepage</h1>
            }
        </>
    )
}

export default UserRoleChecker