import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  phone: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => void;
  updateProfile: (user: User) => void;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedUsers = localStorage.getItem('users');
    if (!savedUsers) {
      const defaultAdmin = {
        name: 'Администратор',
        email: 'admin@customsound.ru',
        password: 'admin123',
        phone: '+7 (999) 000-00-00',
        isAdmin: true,
      };
      localStorage.setItem('users', JSON.stringify([defaultAdmin]));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const savedUsers = localStorage.getItem('users');
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    
    const foundUser = users.find(
      (u: { email: string; password: string }) => 
        u.email === email && u.password === password
    );

    if (!foundUser) {
      throw new Error('Неверный email или пароль');
    }

    const userData = {
      name: foundUser.name,
      email: foundUser.email,
      phone: foundUser.phone,
      isAdmin: foundUser.isAdmin || false,
    };

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const register = async (name: string, email: string, password: string, phone: string) => {
    const savedUsers = localStorage.getItem('users');
    const users = savedUsers ? JSON.parse(savedUsers) : [];

    const existingUser = users.find((u: { email: string }) => u.email === email);
    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует');
    }

    const newUser = { name, email, password, phone, isAdmin: false };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const userData = { name, email, phone, isAdmin: false };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    const savedUsers = localStorage.getItem('users');
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    const userIndex = users.findIndex((u: { email: string }) => u.email === userData.email);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...userData };
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  const resetPassword = async (email: string) => {
    const savedUsers = localStorage.getItem('users');
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    
    const foundUser = users.find((u: { email: string }) => u.email === email);
    if (!foundUser) {
      throw new Error('Пользователь с таким email не найден');
    }

    const tempPassword = Math.random().toString(36).slice(-8);
    foundUser.password = tempPassword;
    localStorage.setItem('users', JSON.stringify(users));

    alert(`Временный пароль отправлен на ${email}\n\nВаш новый пароль: ${tempPassword}\n\nСкопируйте его для входа`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        login,
        register,
        logout,
        updateProfile,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}