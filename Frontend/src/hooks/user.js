import axios from 'axios';

export const getUserRole = async () => {
    const token = localStorage.getItem('mvec_token')
    try {
        const response = await axios.get(
            `${import.meta.env.BACKEND_BASEURL}/v1/api/users/userRole`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.log(error);
        return null
    }
};
