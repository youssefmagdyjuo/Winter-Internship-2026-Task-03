const user = require('../../models/userModel');
const bcrypt = require('bcryptjs');
const { createToken } = require('../../utils/auth');
// Function for user signup
const signup = async (req, res) => {
    try {
        let { name, email, password, role } = req.body;
        // Check if user with the same email already exists
        const exists = await user.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "Email already exists" });
        }
        if(role!=='provider' && role!=='customer'){
            role='customer'
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = { name, email, password: hashedPassword, role };
        const newUser = await user.create(userData);
        // Generate JWT token upon successful signup
        const token = createToken(newUser._id,newUser.role);
        res.status(201).json({
            status: 'success',
            message: 'User signed up successfully',
            data: newUser,
            token: token
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const login = async (req, res) => {
    // Login functionality to be implemented
    try {
        const { email, password } = req.body;
        //check if user exists
        const existingUser = await user.findOne({ email });
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!existingUser || !isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        // Generate JWT token upon successful login
        const token = createToken(existingUser._id,existingUser.role);
        //send response
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: existingUser,
            token: token
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

}
module.exports = {
    signup,
    login
}