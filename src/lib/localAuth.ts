export interface LocalUser {
  id: string;
  email: string;
  fullName: string;
  password: string;
  createdAt: string;
}

export interface Session {
  userId: string;
  email: string;
  fullName: string;
}

const USERS_KEY = 'readmind-users';
const SESSION_KEY = 'readmind-session';

// Get all users from localStorage
function getUsers(): LocalUser[] {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

// Save users to localStorage
function saveUsers(users: LocalUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Get current session
export function getSession(): Session | null {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
}

// Save session
function saveSession(session: Session): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

// Clear session
export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

// Sign up new user
export function signUp(email: string, password: string, fullName: string): { success: boolean; error?: string; user?: Session } {
  const users = getUsers();
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return { success: false, error: 'Пользователь с таким email уже существует' };
  }

  // Validate inputs
  if (!email || !password || !fullName) {
    return { success: false, error: 'Все поля обязательны для заполнения' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Пароль должен содержать минимум 6 символов' };
  }

  // Create new user
  const newUser: LocalUser = {
    id: Date.now().toString(),
    email,
    password, // In real app, this should be hashed
    fullName,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  // Create session
  const session: Session = {
    userId: newUser.id,
    email: newUser.email,
    fullName: newUser.fullName,
  };
  saveSession(session);

  return { success: true, user: session };
}

// Sign in existing user
export function signIn(email: string, password: string): { success: boolean; error?: string; user?: Session } {
  const users = getUsers();
  
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return { success: false, error: 'Неверный email или пароль' };
  }

  // Create session
  const session: Session = {
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
  };
  saveSession(session);

  return { success: true, user: session };
}

// Sign out
export function signOut(): void {
  clearSession();
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getSession() !== null;
}
