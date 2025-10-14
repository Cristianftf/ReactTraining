# API Endpoints para el Backend

El frontend está completamente funcional y listo para conectarse con tu backend. Aquí están los endpoints que necesitas implementar:

## Base URL
```
http://localhost:8000/api
```

## Endpoints

### 1. Obtener todos los usuarios
```http
GET /users
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": 1,
    "name": "Ana García",
    "email": "ana.garcia@example.com",
    "password": "hashed_password",
    "rol": "admin"
  },
  {
    "id": 2,
    "name": "Carlos Rodríguez",
    "email": "carlos.r@example.com",
    "password": "hashed_password",
    "rol": "user"
  }
]
```

### 2. Crear un nuevo usuario
```http
POST /users
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Nuevo Usuario",
  "email": "nuevo@example.com",
  "password": "password123",
  "rol": "user"
}
```

**Respuesta exitosa (201):**
```json
{
  "id": 3,
  "name": "Nuevo Usuario",
  "email": "nuevo@example.com",
  "password": "hashed_password",
  "rol": "user"
}
```

### 3. Actualizar un usuario
```http
PUT /users/{id}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Usuario Actualizado",
  "email": "actualizado@example.com",
  "password": "newpassword123",
  "rol": "admin"
}
```

**Nota:** Si el campo `password` está vacío o no se envía, no actualices la contraseña.

**Respuesta exitosa (200):**
```json
{
  "id": 3,
  "name": "Usuario Actualizado",
  "email": "actualizado@example.com",
  "password": "hashed_password",
  "rol": "admin"
}
```

### 4. Eliminar un usuario
```http
DELETE /users/{id}
```

**Respuesta exitosa (200 o 204):**
```json
{
  "message": "Usuario eliminado exitosamente"
}
```

## Tipos TypeScript

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  rol: 'admin' | 'user';
}

type UserDto = Omit<User, 'id'>;
```

## Validaciones Recomendadas

### Backend
- **name**: Requerido, mínimo 3 caracteres
- **email**: Requerido, formato de email válido, único en la base de datos
- **password**: Requerido en creación, mínimo 6 caracteres, debe ser hasheada
- **rol**: Requerido, solo valores 'admin' o 'user'

### Frontend (ya implementado)
- Validación de campos requeridos
- Validación de formato de email
- Validación de longitud mínima
- Mensajes de error claros
- Confirmación antes de eliminar

## CORS

Asegúrate de configurar CORS en tu backend para permitir peticiones desde:
```
http://localhost:5173
http://localhost:5174
```

## Ejemplo de configuración CORS en Spring Boot

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:5173", "http://localhost:5174")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*");
            }
        };
    }
}
```

## Funcionalidades del Frontend

✅ **Crear Usuario**: Modal con formulario completo y validaciones
✅ **Editar Usuario**: Modal pre-llenado con datos del usuario
✅ **Eliminar Usuario**: Modal de confirmación antes de eliminar
✅ **Buscar Usuarios**: Búsqueda en tiempo real por nombre o email
✅ **Notificaciones Toast**: Feedback visual para todas las acciones
✅ **Estados de carga**: Spinners durante operaciones asíncronas
✅ **Manejo de errores**: Mensajes claros cuando algo falla
✅ **Diseño responsive**: Funciona en móvil, tablet y desktop
✅ **UI moderna**: Glassmorphism, animaciones suaves, gradientes

## Notas

- El frontend usa datos mock si el backend no está disponible
- Todas las operaciones muestran notificaciones de éxito/error
- El password puede dejarse vacío al editar (no se actualiza)
- Los modales se cierran automáticamente después de guardar
- Las notificaciones desaparecen automáticamente después de 5 segundos