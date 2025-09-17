import { User } from '../types';

const USERS_STORAGE_KEY = 'love_dialect_users';
const SESSION_STORAGE_KEY = 'love_dialect_session';

// Helper to get all users
const getUsers = (): Record<string, User> => {
  const users = localStorage.getItem(USERS_STORAGE_KEY);
  return users ? JSON.parse(users) : {};
};

// Helper to save all users
const saveUsers = (users: Record<string, User>) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const signUp = async (username: string, password: string): Promise<User> => {
  const users = getUsers();
  if (Object.values(users).some(u => u.username.toLowerCase() === username.toLowerCase())) {
    throw new Error('이미 사용 중인 아이디입니다.');
  }

  const newUser: User = {
    id: `user_${Date.now()}`,
    username,
    // VERY INSECURE: In a real app, never store plain text passwords.
    // This should be a securely generated hash.
    passwordHash: password, 
    dictionaryCode: undefined,
  };

  users[newUser.id] = newUser;
  saveUsers(users);
  
  // Automatically log in after sign up
  localStorage.setItem(SESSION_STORAGE_KEY, newUser.id);

  return newUser;
};

export const login = async (username: string, password: string): Promise<User> => {
  const users = getUsers();
  const user = Object.values(users).find(
    u => u.username.toLowerCase() === username.toLowerCase() && u.passwordHash === password
  );

  if (!user) {
    throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
  }

  localStorage.setItem(SESSION_STORAGE_KEY, user.id);
  return user;
};

export const loginWithKakao = async (): Promise<User> => {
  // --- This is a mock implementation of Kakao Login ---
  // In a real app, you would use the Kakao SDK to get an auth token and user profile.
  const mockKakaoProfile = {
    id: 'kakao_123456789',
    username: '카카오러버',
  };
  // --- End of mock ---

  const users = getUsers();
  let user = Object.values(users).find(u => u.kakaoId === mockKakaoProfile.id);

  // If user doesn't exist (first time Kakao login), create a new account
  if (!user) {
    const newKakaoUser: User = {
        id: `user_${Date.now()}`,
        username: mockKakaoProfile.username,
        passwordHash: `kakao_auth_${Date.now()}`, // Not used for login
        kakaoId: mockKakaoProfile.id,
        dictionaryCode: undefined,
    };
    users[newKakaoUser.id] = newKakaoUser;
    saveUsers(users);
    user = newKakaoUser;
  }
  
  // Log the user in
  localStorage.setItem(SESSION_STORAGE_KEY, user.id);
  return user;
}


export const logout = (): void => {
  localStorage.removeItem(SESSION_STORAGE_KEY);
};

export const getCurrentUser = (): User | null => {
  const userId = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!userId) {
    return null;
  }
  const users = getUsers();
  return users[userId] || null;
};

export const updateUserDictionaryCode = async (userId: string, code: string): Promise<User> => {
    const users = getUsers();
    if (!users[userId]) {
        throw new Error("User not found");
    }
    users[userId].dictionaryCode = code;
    saveUsers(users);
    return users[userId];
}

export const removeDictionaryCodeFromUsers = async (code: string): Promise<void> => {
    const users = getUsers();
    let updated = false;
    for (const userId in users) {
        if (users[userId].dictionaryCode === code) {
            users[userId].dictionaryCode = undefined;
            updated = true;
        }
    }
    if (updated) {
        saveUsers(users);
    }
}