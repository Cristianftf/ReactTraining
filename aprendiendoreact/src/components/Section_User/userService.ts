// src/services/userService.ts

import { User,UserDto } from "../../types";

const API_BASE_URL = 'http://localhost:8000/api/';

// Función auxiliar para obtener el token
const getAuthToken = () => {
    // Reemplaza esto con la lógica real de tu Auth Context o localStorage
    return localStorage.getItem('authToken') || ''; 
};

// =========================================================
// R: READ (Listar Usuarios)
// =========================================================
export async function fetchUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
        },
    });

    if (!response.ok) {
        throw new Error('No se pudo obtener la lista de usuarios.');
    }

    return response.json();
}

// =========================================================
// C: CREATE (Crear Usuario - Solo la estructura del fetch)
// =========================================================
export async function createUser(user: UserDto): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el usuario.');
    }
    return response.json();
}

// =========================================================
// D: DELETE (Eliminar Usuario)
// =========================================================
export async function deleteUser(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
        },
    });

    if (!response.ok) {
        throw new Error('Error al eliminar el usuario.');
    }
    // No retorna nada si la eliminación fue exitosa
}

// =========================================================
// U: UPDATE (Actualizar Usuario - Necesitarías una función similar)
// =========================================================
// export async function updateUser(id: number, user: UserDto): Promise<User> { ... }