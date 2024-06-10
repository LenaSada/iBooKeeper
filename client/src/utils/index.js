import axios from "axios";

export const signIn = async (email, password) => {
    try {
        const response = await axios.post('http://localhost:3100/signin', {
            email: email,
            password: password
        }, {
            withCredentials: true
        });
        if (response.data.error) {
            console.log(response.data.error);
        }

        return response.data;
    } catch (error) {
        console.error('Error Signing in:', error);
    }
}