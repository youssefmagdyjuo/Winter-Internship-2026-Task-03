import React, { useEffect, useState } from "react";
import axios from "axios";
import FormLayout from "./FormLayout";
import Input from "./Input";
import Button from "./Button";

export default function CategoriesManagement() {
    const [name, setName] = useState("");
    const [categories, setCategories] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const API = `${import.meta.env.VITE_API_URL}/v1/api/categories`;
    const token = localStorage.getItem('mvec_token');

    // =======================
    // GET ALL CATEGORIES
    // =======================
    // Fetch Categories
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(API);
            setCategories(data.data || data);
        } catch (err) {
            setError("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);
    // =======================
    // ADD / EDIT
    // =======================
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            if (isEditing) {
                await axios.put(
                    `${API}/${editingId}`,
                    { name }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
                );
            } else {
                await axios.post(API, { name }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }

            setName("");
            setIsEditing(false);
            setEditingId(null);
            fetchCategories();
        } catch (error) {
            console.error(error);
        }
    };

    // =======================
    // EDIT CLICK
    // =======================
    const handleEditClick = (category) => {
        setName(category.name);
        setEditingId(category._id);
        setIsEditing(true);
    };

    // =======================
    // DELETE
    // =======================
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchCategories();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-6">

            {/* ========= FORM ========= */}
            <FormLayout onSubmit={handleSubmit} full_H={false}>
                <h2 className="title">
                    {isEditing ? "Edit Category" : "Add Category"}
                </h2>

                <Input
                    type="text"
                    name="name"
                    placeholder="Category Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <Button style="btn-primary">
                    {isEditing ? "Update" : "Add"}
                </Button>
            </FormLayout>
            {/* Error */}
            {error && (
                <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading && <p>Loading...</p>}

            {/* ========= LIST ========= */}
            <div className="mt-8 space-y-3 lg:w-200  w-full m-auto">
                {categories.map((cat) => (
                    <div
                        key={cat._id}
                        className="flex justify-between items-center bg-white p-4 rounded shadow "
                    >
                        <span className="font-medium">{cat.name}</span>

                        <div className="flex gap-2">
                            <Button
                                onClick={() => handleEditClick(cat)}
                                style="btn-primary">
                                Edit
                            </Button>
                            <Button
                                onClick={() => handleDelete(cat._id)}
                                style="btn-danger">
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
