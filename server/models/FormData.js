const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define schema for the form data (registration)
const FormDataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,  // Make name a required field
    },
    email: {
        type: String,
        required: true,  // Make email a required field
        unique: true,    // Ensure the email is unique
        lowercase: true, // Store email in lowercase
        trim: true,      // Trim spaces
    },
    password: {
        type: String,
        required: true,  // Make password a required field
    },
});

// Before saving the user, hash the password
FormDataSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        try {
            const hashedPassword = await bcrypt.hash(this.password, 10);
            this.password = hashedPassword;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

// Model creation
const FormDataModel = mongoose.model('log_reg_form', FormDataSchema);

module.exports = FormDataModel;
