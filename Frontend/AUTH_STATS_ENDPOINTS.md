# API Endpoints - Autenticación y Estadísticas

## Base URL
```
http://localhost:8000/api
```

---

## 🔐 Autenticación

### 1. Login
```http
POST /auth/login
Content-Type: application/json
```

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Respuesta exitosa (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "usuario@example.com",
    "rol": "admin"
  }
}
```

**Respuesta de error (401):**
```json
{
  "error": "Credenciales inválidas"
}
```

### 2. Logout
```http
POST /auth/logout
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Sesión cerrada exitosamente"
}
```

---

## 📊 Estadísticas

### 1. Resumen del Dashboard
```http
GET /stats/overview
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
  "totalUsers": 127,
  "adminUsers": 8,
  "regularUsers": 119,
  "recentSignups": 23
}
```

### 2. Datos para Gráfico de Barras
```http
GET /stats/chart
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
[
  {
    "name": "Enero",
    "usuarios": 45,
    "admins": 3
  },
  {
    "name": "Febrero",
    "usuarios": 52,
    "admins": 4
  },
  {
    "name": "Marzo",
    "usuarios": 61,
    "admins": 5
  },
  {
    "name": "Abril",
    "usuarios": 73,
    "admins": 6
  },
  {
    "name": "Mayo",
    "usuarios": 89,
    "admins": 7
  },
  {
    "name": "Junio",
    "usuarios": 119,
    "admins": 8
  }
]
```

---

## 🔒 Seguridad

### JWT Token
- El token debe ser incluido en el header `Authorization` con el formato: `Bearer {token}`
- El token se almacena en `localStorage` del navegador
- El token debe tener una expiración recomendada de 24 horas

### Ejemplo de configuración en Spring Boot:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors()
            .and()
            .authorizeHttpRequests()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/**").authenticated()
            .and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        
        return http.build();
    }
}
```

---

## 📝 Notas de Implementación

### Frontend
- ✅ Sistema de autenticación completo con Context API
- ✅ Rutas protegidas con ProtectedRoute
- ✅ Persistencia de sesión en localStorage
- ✅ Redirección automática según estado de autenticación
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Gráfico de barras interactivo con Recharts
- ✅ Menú de usuario con logout
- ✅ Navbar actualizada con rutas activas

### Backend (Pendiente)
- ⏳ Implementar endpoint de login con JWT
- ⏳ Implementar endpoint de logout
- ⏳ Implementar endpoints de estadísticas
- ⏳ Configurar CORS para permitir peticiones desde frontend
- ⏳ Implementar middleware de autenticación JWT

---

## 🎨 Características del Frontend

### Sistema de Login
- Diseño moderno con glassmorphism
- Validación de formularios en tiempo real
- Animaciones suaves de fondo
- Mensajes de error claros
- Opción "Recordarme"
- Link de "Olvidé mi contraseña"

### Dashboard
- 4 tarjetas de estadísticas con iconos
- Gráfico de barras interactivo
- Animaciones de entrada escalonadas
- Diseño responsive
- Acciones rápidas
- Saludo personalizado al usuario

### Navegación
- Navbar con menú de usuario
- Rutas activas resaltadas
- Dropdown de perfil
- Logout funcional
- Menú móvil responsive

---

## 🚀 Cómo Probar

### Modo Demo (Sin Backend)
El frontend funciona en modo demo sin backend:
1. Usa cualquier email válido
2. Usa cualquier contraseña (mínimo 6 caracteres)
3. El sistema simulará un login exitoso
4. Verás datos mock en el dashboard

### Con Backend
1. Implementa los endpoints listados arriba
2. Asegúrate de configurar CORS
3. El frontend se conectará automáticamente
4. Los datos reales reemplazarán los datos mock

---

## 📦 Dependencias Instaladas

```json
{
  "react-router-dom": "^6.x.x",
  "recharts": "^2.x.x",
  "react-icons": "^5.5.0"
}
```

---

## 🔄 Flujo de Autenticación

```
1. Usuario ingresa credenciales en /login
2. Frontend envía POST a /api/auth/login
3. Backend valida credenciales
4. Backend genera JWT token
5. Backend responde con token y datos de usuario
6. Frontend guarda token y usuario en localStorage
7. Frontend actualiza AuthContext
8. Usuario es redirigido a /dashboard
9. Todas las peticiones subsecuentes incluyen el token
10. Al hacer logout, se limpia localStorage y se redirige a /login
```