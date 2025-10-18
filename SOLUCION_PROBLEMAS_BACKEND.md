# 🔧 Solución de Problemas - Backend No Responde

## ✅ Cambios Realizados

Se ha actualizado el archivo `demo/src/main/java/com/spring_boot_training/demo/config/securityConfig.java` con:

1. **Configuración de CORS** - Permite peticiones desde el frontend (puertos 5173, 5174, 3000)
2. **Rutas públicas actualizadas**:
   - `/apiu/auth/**` - Para login
   - `/api/users/add` - Para registro
   - `/api/users/**` - Para gestión de usuarios (temporal)
   - `/api/stats/**` - Para estadísticas (temporal)

## 🔍 Cómo Verificar si el Backend Está Funcionando

### Opción 1: Usar el archivo de prueba HTML

1. Abre el archivo `aprendiendoreact/test-backend.html` en tu navegador
2. Haz clic en cada botón de prueba
3. Verifica que las respuestas sean exitosas (fondo verde)

### Opción 2: Usar la consola del navegador

1. Abre el frontend en `http://localhost:5174`
2. Abre las DevTools (F12)
3. Ve a la pestaña "Console"
4. Ejecuta este código:

```javascript
// Test simple
fetch('http://localhost:8000/api/users')
  .then(r => r.json())
  .then(data => console.log('✅ Backend responde:', data))
  .catch(err => console.error('❌ Error:', err));
```

### Opción 3: Usar PowerShell/CMD

```powershell
# Test con curl (si está instalado)
curl http://localhost:8000/api/users

# O con Invoke-WebRequest en PowerShell
Invoke-WebRequest -Uri "http://localhost:8000/api/users" -Method GET
```

## 🐛 Problemas Comunes y Soluciones

### Problema 1: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Causa**: El backend no está permitiendo peticiones desde el frontend.

**Solución**:
1. Verifica que el archivo `securityConfig.java` tenga la configuración de CORS
2. Reinicia el backend:
   ```powershell
   cd demo
   .\mvnw.cmd spring-boot:run
   ```

### Problema 2: "Failed to fetch" o "Network Error"

**Causa**: El backend no está corriendo o está en un puerto diferente.

**Solución**:
1. Verifica que el backend esté corriendo en el puerto 8000:
   ```powershell
   netstat -ano | findstr :8000
   ```
2. Si no hay nada, inicia el backend:
   ```powershell
   cd demo
   .\mvnw.cmd spring-boot:run
   ```
3. Espera a ver el mensaje: "Started DemoApplication in X seconds"

### Problema 3: "401 Unauthorized" en endpoints protegidos

**Causa**: El endpoint requiere autenticación pero no se está enviando el token.

**Solución**:
1. Primero haz login para obtener un token
2. El servicio API (`src/services/api.ts`) ya maneja esto automáticamente
3. Si el problema persiste, verifica que el token esté en localStorage:
   ```javascript
   console.log('Token:', localStorage.getItem('token'));
   ```

### Problema 4: Base de datos no conecta

**Causa**: PostgreSQL no está corriendo o las credenciales son incorrectas.

**Solución**:
1. Verifica que PostgreSQL esté corriendo
2. Verifica las credenciales en `demo/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/trainingdb
   spring.datasource.username=postgres
   spring.datasource.password=postgres
   ```
3. Crea la base de datos si no existe:
   ```sql
   CREATE DATABASE trainingdb;
   ```

### Problema 5: "Bad credentials" al hacer login

**Causa**: El usuario no existe o la contraseña es incorrecta.

**Solución**:
1. Primero registra un usuario usando la página de registro
2. O inserta un usuario directamente en la base de datos:
   ```sql
   -- La contraseña debe estar encriptada con BCrypt
   -- Para "123456" el hash es: $2a$10$...
   INSERT INTO users (username, email, password, rol, created_at) 
   VALUES ('Test User', 'test@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user', NOW());
   ```

## 📝 Checklist de Verificación

Antes de reportar un problema, verifica:

- [ ] PostgreSQL está corriendo
- [ ] La base de datos `trainingdb` existe
- [ ] El backend está corriendo en el puerto 8000
- [ ] No hay errores en la consola del backend
- [ ] El frontend está corriendo en el puerto 5174
- [ ] No hay errores de CORS en la consola del navegador
- [ ] Las credenciales de la base de datos son correctas

## 🚀 Reinicio Completo

Si nada funciona, intenta un reinicio completo:

1. **Detén todo**:
   - Cierra el backend (Ctrl+C en la terminal)
   - Cierra el frontend (Ctrl+C en la terminal)

2. **Limpia y reconstruye el backend**:
   ```powershell
   cd demo
   .\mvnw.cmd clean install
   ```

3. **Inicia el backend**:
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```
   Espera a ver: "Started DemoApplication in X seconds"

4. **Inicia el frontend**:
   ```powershell
   cd aprendiendoreact
   npm run dev
   ```

5. **Prueba la conexión**:
   - Abre `http://localhost:5174`
   - Intenta registrar un usuario
   - Intenta hacer login

## 📞 Logs Útiles

### Ver logs del backend
Los logs aparecen en la terminal donde ejecutaste `mvnw spring-boot:run`

### Ver logs del frontend
1. Abre DevTools (F12)
2. Ve a la pestaña "Console"
3. Ve a la pestaña "Network" para ver las peticiones HTTP

### Logs importantes a buscar:

**Backend exitoso**:
```
Started DemoApplication in X seconds
Tomcat started on port 8000
```

**Frontend exitoso**:
```
VITE ready in X ms
Local: http://localhost:5174/
```

**Error de CORS**:
```
Access to fetch at 'http://localhost:8000/api/users' from origin 'http://localhost:5174' 
has been blocked by CORS policy
```

## 🎯 Próximos Pasos

Una vez que el backend responda correctamente:

1. Registra un usuario en `/register`
2. Haz login en `/login`
3. Verifica que puedas ver el dashboard
4. Verifica que puedas ver la lista de usuarios
5. Prueba crear, editar y eliminar usuarios

---

**Última actualización**: 2025-01-16