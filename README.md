# 🧩 Full Stack App: .NET + React

Aplicación full stack de comercio electrónico con un robusto backend en **ASP.NET Core** y un moderno frontend en **React**.

## 🛠️ Tecnologías Principales

### Backend
* **.NET 8** 
* **C#**
* **ASP.NET Core Web API**
* **Entity Framework Core** para ORM
* **SQL Server LocalDB** como base de datos
* **ASP.NET Core Identity** para gestión de usuarios y roles
* **Autenticación JWT** (JSON Web Tokens)
* **AutoMapper** para mapeo de objetos
* **Swagger/OpenAPI** para documentación de la API

### Frontend
* **React** (con Vite)
* **Redux Toolkit** para gestión de estado
* **Axios** para peticiones HTTP
* **Material UI** para componentes de UI
* **React Router DOM** para navegación

## 🎯 Funcionalidades Implementadas

* **Autenticación y Autorización JWT**: Registro, inicio de sesión y protección de rutas/endpoints.
* **Gestión de Usuarios y Roles**: Implementación de ASP.NET Core Identity.
* **CRUD completo de Entidades**:
    * Productos
    * Categorías
    * Marcas
    * Direcciones de usuarios
    * Carritos de compra y sus ítems
    * Pedidos y sus ítems
* **Paginación, búsqueda, filtrado y ordenación**: Para productos, mejorando la experiencia de usuario.
* **Manejo de errores centralizado**: Respuestas de API consistentes.
* **Validación de modelos**: Asegurando la integridad de los datos.

## 🚀 Cómo Empezar (Setup Local)

Sigue estos pasos para poner en marcha el proyecto en tu máquina local.

### 1. Requisitos Previos

Asegúrate de tener instalado lo siguiente:

* **.NET SDK 8** (o la versión que uses para el backend)
* **Node.js** (LTS recomendado) y **npm** o **Yarn**
* **SQL Server LocalDB** (generalmente viene con Visual Studio) o una instancia de SQL Server.
* **Visual Studio 2022** (recomendado para el backend) o VS Code.

### 2. Configuración del Backend (.NET API)

1.  **Navega a la carpeta del backend:**
    ```bash
    cd backend/
    ```
2.  **Abre la solución en Visual Studio:**
    Abre el archivo `fullstack-net-react.sln` con Visual Studio.

3.  **Configura la cadena de conexión a la base de datos:**
    * Abre el archivo `appsettings.json` (y `appsettings.Development.json`) en tu proyecto de backend.
    * Asegúrate de que la sección `ConnectionStrings` apunte a tu instancia de SQL Server LocalDB (o la que uses). Por ejemplo:
        ```json
        "ConnectionStrings": {
          "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=EcommerceDb;Trusted_Connection=True;MultipleActiveResultSets=true"
        }
        ```
        `EcommerceDb` es el nombre de la base de datos que se creará.

4.  **Aplica Migraciones de Entity Framework Core:**
    * Abre la **Consola del Administrador de Paquetes (Package Manager Console)** en Visual Studio (View > Other Windows > Package Manager Console).
    * Asegúrate de que el "Default project" sea `fullstack-net-react`.
    * Ejecuta los siguientes comandos para crear la base de datos y las tablas:
        ```powershell
        Update-Database
        ```
    * Si es la primera vez que creas migraciones, deberías hacer:
        ```powershell
        Add-Migration InitialCreate
        Update-Database
        ```

5.  **Ejecuta el Backend:**
    * Desde Visual Studio, presiona `F5` o el botón "IIS Express" para iniciar la API.
    * La API se ejecutará en `https://localhost:7224` (por defecto). La documentación de Swagger UI estará disponible en `https://localhost:7224/swagger`.

    **Alternativa (desde la terminal):**
    ```bash
    cd backend/
    dotnet run
    ```

### 3. Configuración del Frontend (React App)

1.  **Navega a la carpeta del frontend:**
    ```bash
    cd frontend/
    ```
2.  **Instala las dependencias:**
    ```bash
    npm install
    # o
    yarn install
    ```
3.  **Configura la URL de la API:**
    * Crea un archivo `.env` en la raíz de la carpeta `frontend/`.
    * Añade la URL de tu API backend:
        ```
        VITE_API_BASE_URL=https://localhost:7224/api
        ```
    * **Nota:** Si tu API se ejecuta en un puerto diferente, asegúrate de actualizar esta URL.

4.  **Ejecuta el Frontend:**
    ```bash
    npm run dev
    # o
    yarn dev
    ```
    La aplicación de React se abrirá en tu navegador (normalmente en `http://localhost:5173`).

### Cómo Probar el Login y Acceder a la API (Usando Swagger UI)

Para probar la autenticación y los endpoints protegidos:

1.  **Accede a Swagger UI:**
    Abre tu navegador y ve a `https://localhost:7224/swagger`.

2.  **Realiza el Login (Regístrate si no tienes cuenta):**
    * Busca el endpoint `POST /api/Auth/register` y crea un nuevo usuario.
    * Luego, busca el endpoint `POST /api/Auth/login`.
    * Haz clic en **"Try it out"**.
    * En el campo `Request body`, introduce las credenciales de un usuario existente (ej. el que acabas de registrar o, si ya configuraste seed data, el usuario administrador):
        ```json
        {
          "username": "admin",
          "password": "AdminPassword123!"
        }
        ```
    * Haz clic en **"Execute"**.
    * Deberías recibir una respuesta `200 OK` que contiene un **token JWT** en el campo `token`. Copia este token (la cadena larga).

3.  **Autoriza Solicitudes a la API:**
    * En la parte superior de la página de Swagger UI, haz clic en el botón **"Authorize"**.
    * En la ventana emergente, en el campo de texto, pega el token JWT que copiaste, precedido de `Bearer ` (incluyendo el espacio):
        ```
        Bearer TU_TOKEN_JWT_AQUI
        ```
    * Haz clic en "Authorize" y luego en "Close".

4.  **Prueba un Endpoint Protegido:**
    * Ahora puedes probar cualquier endpoint de tu API que requiera autenticación (por ejemplo, `GET /api/Products` si lo tienes protegido, o cualquier endpoint con `[Authorize]` en el controlador). Deberías recibir una respuesta `200 OK` en lugar de `401 Unauthorized`.

---

## 🔜 En desarrollo...

Este proyecto está en etapa de desarrollo activo. Próximamente se añadirán más funcionalidades y mejoras. 🚧
