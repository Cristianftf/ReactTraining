import { useState, useEffect } from "react";
import {User} from "../../types";

// 2️⃣ Componente principal
export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 3️⃣ useEffect para cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // 4️⃣ Función para obtener usuarios desde el backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/users");
      const data = await response.json(); // <- Aquí debe venir JSON del backend
      setUsers(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  // 5️⃣ Renderizamos la tabla
  return (
    <div style={{ padding: "20px" }}>
      <h2>Lista de Usuarios</h2>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table border={1} cellPadding={8} style={{ marginTop: "10px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}