import mockDB from '../config/mockDatabase.js';

class MockSession {
  static async create(sessionData) {
    const session = mockDB.createSession({
      ...sessionData,
      status: sessionData.status || 'completed'
    });
    return session;
  }

  static async find(query) {
    return mockDB.findSessions(query);
  }

  static async findById(id) {
    return mockDB.findSessionById(id);
  }

  static async findByIdAndUpdate(id, update, options = {}) {
    return mockDB.updateSession(id, update);
  }

  static async findByIdAndDelete(id) {
    mockDB.deleteSession(id);
    return { _id: id };
  }
}

export default MockSession;
