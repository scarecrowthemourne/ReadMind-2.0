// Локальная система авторизации без внешних зависимостей

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthSession {
  user: User;
  token: string;
}

const USERS_KEY = 'readmind_users';
const SESSION_KEY = 'readmind_session';

// Получить всех пользователей
function getUsers(): Record<string, { email: string; password: string; name: string }> {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : {};
}

// Сохранить пользователей
function saveUsers(users: Record<string, { email: string; password: string; name: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Регистрация
export async function signUp(email: string, password: string, name: string): Promise<{ user: User; session: AuthSession } | null> {
  const users = getUsers();
  
  if (users[email]) {
    throw new Error('Пользователь с таким email уже существует');
  }
  
  const userId = `user_${Date.now()}`;
  users[email] = { email, password, name };
  saveUsers(users);
  
  const user: User = { id: userId, email, name };
  const token = `token_${Date.now()}`;
  const session: AuthSession = { user, token };
  
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  
  return { user, session };
}

// Вход
export async function signIn(email: string, password: string): Promise<{ user: User; session: AuthSession } | null> {
  const users = getUsers();
  
  if (!users[email] || users[email].password !== password) {
    throw new Error('Неверный email или пароль');
  }
  
  const userId = `user_${Date.now()}`;
  const user: User = { id: userId, email, name: users[email].name };
  const token = `token_${Date.now()}`;
  const session: AuthSession = { user, token };
  
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  
  return { user, session };
}

// Выход
export async function signOut(): Promise<void> {
  localStorage.removeItem(SESSION_KEY);
}

// Получить текущую сессию
export function getSession(): AuthSession | null {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
}

// Получить текущего пользователя
export function getCurrentUser(): User | null {
  const session = getSession();
  return session ? session.user : null;
}
