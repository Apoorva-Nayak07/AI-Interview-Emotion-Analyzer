// Mock in-memory database for demo purposes
// Replace with real MongoDB connection in production

class MockDatabase {
  constructor() {
    this.users = [];
    this.sessions = [];
    this.connected = false;
  }

  async connect() {
    console.log('✅ Mock Database Connected (In-Memory Storage)');
    console.log('⚠️  Note: Data will be lost when server restarts');
    console.log('💡 To use MongoDB, install MongoDB and update MONGODB_URI in .env');
    this.connected = true;
    return this;
  }

  isConnected() {
    return this.connected;
  }

  // User methods
  findUser(query) {
    if (query.email) {
      return this.users.find(u => u.email === query.email);
    }
    if (query._id) {
      return this.users.find(u => u._id === query._id);
    }
    return null;
  }

  createUser(userData) {
    const user = {
      _id: Date.now().toString(),
      ...userData,
      sessions: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  // Session methods
  findSessions(query) {
    if (query.user) {
      return this.sessions.filter(s => s.user === query.user);
    }
    return this.sessions;
  }

  findSessionById(id) {
    return this.sessions.find(s => s._id === id);
  }

  createSession(sessionData) {
    const session = {
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...sessionData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.sessions.push(session);
    return session;
  }

  updateSession(id, updateData) {
    const index = this.sessions.findIndex(s => s._id === id);
    if (index !== -1) {
      this.sessions[index] = {
        ...this.sessions[index],
        ...updateData,
        updatedAt: new Date()
      };
      return this.sessions[index];
    }
    return null;
  }

  deleteSession(id) {
    const index = this.sessions.findIndex(s => s._id === id);
    if (index !== -1) {
      this.sessions.splice(index, 1);
      return true;
    }
    return false;
  }

  updateUser(id, updateData) {
    const index = this.users.findIndex(u => u._id === id);
    if (index !== -1) {
      this.users[index] = {
        ...this.users[index],
        ...updateData,
        updatedAt: new Date()
      };
      return this.users[index];
    }
    return null;
  }
}

export default new MockDatabase();
