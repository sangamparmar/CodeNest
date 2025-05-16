const mongoose = require('mongoose');
const FormDataModel = require('../models/FormData');

describe('FormData Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase(); // Clear the test database
    await mongoose.connection.close();
  });

  test('should create a new user with valid data', async () => {
    const user = new FormDataModel({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
    });

    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe('John Doe');
    expect(savedUser.email).toBe('johndoe@example.com');
    expect(savedUser.password).not.toBe('password123'); // Password should be hashed
  });

  test('should not create a user without required fields', async () => {
    const user = new FormDataModel({
      email: 'johndoe@example.com',
    });

    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
    expect(error.errors.password).toBeDefined();
  });

  test('should not create a user with a duplicate email', async () => {
    const user1 = new FormDataModel({
      name: 'John Doe',
      email: 'duplicate@example.com',
      password: 'password123',
    });

    const user2 = new FormDataModel({
      name: 'Jane Doe',
      email: 'duplicate@example.com',
      password: 'password456',
    });

    await user1.save();

    let error;
    try {
      await user2.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.code).toBe(11000); // MongoDB duplicate key error code
  });

  test('should hash the password before saving', async () => {
    const user = new FormDataModel({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: 'mypassword',
    });

    const savedUser = await user.save();

    expect(savedUser.password).not.toBe('mypassword'); // Password should be hashed
    const isMatch = await require('bcrypt').compare('mypassword', savedUser.password);
    expect(isMatch).toBe(true); // Verify the hashed password
  });
});