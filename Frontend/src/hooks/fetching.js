import axios from 'axios';

export const fetchAllServices = async () => {
    try {

        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/v1/api/services`
        );
        const services = response.data.data;
        //fetch seller name for each product
        const servicesWithSellerName = await Promise.all(
            services.map(async (service) => {
                const providerRes = await axios.get(
                    `${import.meta.env.VITE_API_URL}/v1/api/users/${service.providerId}`
                );

                return {
                    ...service,
                    providerName: providerRes.data.data.name,
                };
            })
        );
        return servicesWithSellerName;

    } catch (error) {
        console.log(error);
        return [];
    }
};
