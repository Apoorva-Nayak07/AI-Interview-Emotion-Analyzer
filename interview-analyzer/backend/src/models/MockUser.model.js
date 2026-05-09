import bcrypt from 'bcryptjs';
import mockDB from '../config/mockDatabase.js';

class MockUser {
  static async create(userData) {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = mockDB.createUser({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      avatar: userData.avatar || ''
    });

    return user;
  }

  static async findOne(query) {
    return mockDB.findUser(query);
  }

  static async findById(id) {
    return mockDB.findUser({ _id: id });
  }

  static async findByIdAndUpdate(id, update) {
    return mockDB.updateUser(id, update);
  }

  static async comparePassword(enteredPassword, hashedPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }
}

export default MockUser;
