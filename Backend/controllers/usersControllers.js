const user = require('../models/userModel');
const bcrypt = require('bcryptjs');
//function to get user role
const getUserRole = async (req, res) => {
    try {
        const userRole = req.user.role
        res.send(userRole)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// Function to get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await user.find();
        res.json({
            resulte: users.length,
            status: 'success',
            message: 'Users fetched successfully',
            data: users,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// New function to get a specific user by ID
const getSpecificUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const foundUser = await user.findById(userId);
        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            status: 'success',
            message: 'User fetched successfully',
            data: foundUser,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// Function to add a new user
const addUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = { name, email, password: hashedPassword, role };
        const savedUser = await user.create(userData);
        res.status(201).json({
            status: 'success',
            message: 'User added successfully',
            data: savedUser,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
        };
        const updatedUser = await user.findByIdAndUpdate(userId, updateData);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        const foundUser = await user.findById(userId);

        res.json({
            status: 'success',
            message: 'User updated successfully',
            data: foundUser,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// New function to update user password
const updatePassword = async (req, res) => {
    try {
        const userId = req.params.id;
        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await user.findByIdAndUpdate(userId, { password: hashedPassword, passwordChangedAt: Date.now() });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            status: 'success',
            message: 'Password updated successfully',
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// New function to delete a user by ID
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await user.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            status: 'success',
            message: 'User deleted successfully',
            data: deletedUser,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {getUserRole, getAllUsers, addUser, getSpecificUser, updateUser, deleteUser, updatePassword };