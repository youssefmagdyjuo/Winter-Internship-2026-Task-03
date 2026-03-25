import axios from 'axios';

export const getUserRole = async () => {
    const token = localStorage.getItem('ssbms_token')
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/v1/api/users/userRole`,
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
