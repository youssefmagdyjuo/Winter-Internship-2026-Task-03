import axios from 'axios';

export const fetchAllProducts = async () => {
    try {
        const token = localStorage.getItem('mvec_token')
        //fetch products
        const response = await axios.get(
            'http://localhost:5000/v1/api/products',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        const products = response.data.data;
        //fetch seller name for each product
        const productsWithSellerName = await Promise.all(
            products.map(async (product) => {
                const sellerRes = await axios.get(
                    `http://localhost:5000/v1/api/users/${product.sellerId}`
                );
                const categoryRes = await axios.get(
                    `http://localhost:5000/v1/api/categories/${product.categoryId}`
                );
                return {
                    ...product,
                    sellerName: sellerRes.data.data.name,
                    categoryName: categoryRes.data.data.name
                };
            })
        );
        return productsWithSellerName;

    } catch (error) {
        console.log(error);
        return [];
    }
};
export const fetchApprovedProductsData = async () => {
    try {
        //fetch products
        const response = await axios.get(
            'http://localhost:5000/v1/api/products/approved'
        );
        const products = response.data.data;
        //fetch seller name for each product
        const productsWithSellerName = await Promise.all(
            products.map(async (product) => {
                const sellerRes = await axios.get(
                    `http://localhost:5000/v1/api/users/${product.sellerId}`
                );
                const categoryRes = await axios.get(
                    `http://localhost:5000/v1/api/categories/${product.categoryId}`
                );
                return {
                    ...product,
                    sellerName: sellerRes.data.data.name,
                    categoryName: categoryRes.data.data.name
                };
            })
        );
        return productsWithSellerName;

    } catch (error) {
        console.log(error);
        return [];
    }
};
export const fetchCategories = async () => {
    try {
        //fetch categories
        const response = await axios.get(
            'http://localhost:5000/v1/api/categories'
        );
        const categories = response.data.data;
        return categories;

    } catch (error) {
        console.log(error);
        return [];
    }
};
