// src/services/userService.ts
import { User } from '../../types';

const STORAGE_KEY = 'users_db';

// Simula la base de datos local
const getStoredUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

// CREATE
export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  const users = getStoredUsers();
  const newUser: User = { ...user, id: Date.now() };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

// READ
export const fetchUsers = async (): Promise<User[]> => {
  return getStoredUsers();
};

// UPDATE
export const updateUser = async (updatedUser: User): Promise<User> => {
  const users = getStoredUsers();
  const index = users.findIndex((u) => u.id === updatedUser.id);
  if (index === -1) throw new Error('Usuario no encontrado');
  users[index] = updatedUser;
  saveUsers(users);
  return updatedUser;
};

// DELETE
export const deleteUser = async (id: number): Promise<void> => {
  const users = getStoredUsers().filter((u) => u.id !== id);
  saveUsers(users);
};
