# 🧩 Full Stack App: .NET + React

Aplicación full stack de comercio electrónico con un robusto backend en **ASP.NET Core** y un moderno frontend en **React**.

## 🛠️ Tecnologías Principales

### Backend
* **.NET 8** (o la versión que tengas en tu `.csproj`, por ejemplo `net8.0`)
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
    * Direcciones de Usuario
    * Carrito de Compras (con ítems)
    * Pedidos (con ítems)
* **Documentación de API**: Interfaz interactiva con Swagger UI.
* **Seeding Inicial de Datos**: Roles predefinidos ("Admin", "User"), usuario administrador y datos de ejemplo para categorías, marcas y productos.
* **Filtrado y Paginación de Productos**.
* **Actualización de Stock de Productos**.
* **CORS** configurado para permitir comunicación entre frontend y backend.

## 🚀 Cómo Iniciar la Aplicación

Sigue estos pasos para poner en marcha tanto el backend como el frontend.

### 📋 Prerrequisitos

Asegúrate de tener instalado lo siguiente:

* **.NET SDK** (Versión 8.0 o superior, compatible con tu proyecto)
* **Node.js** (LTS recomendado) y **npm** (o Yarn)
* **SQL Server LocalDB** (generalmente viene con Visual Studio)
* **Visual Studio 2022** (recomendado para desarrollo backend) o **Visual Studio Code**
* **Editor de código** (VS Code, WebStorm, etc.) para el frontend

### ⚙️ Configuración del Backend

1.  **Navega al directorio del backend:**
    Abre tu terminal (o la Consola del Administrador de Paquetes en Visual Studio) y navega a la carpeta de tu proyecto backend. Asumiendo la estructura:
    ```bash
    cd D:\Repositories\fullstack-net-react\backend\fullstack-net-react\fullstack-net-react
    ```
    (Asegúrate de que esta es la carpeta que contiene el archivo `fullstack-net-react.csproj`).

2.  **Restaura las dependencias de NuGet:**
    ```bash
    dotnet restore
    ```

3.  **Configura la Base de Datos y las Migraciones:**
    Es crucial que tu base de datos esté en un estado limpio para aplicar las migraciones de Identity.

    * **Instala las herramientas de EF Core (si no lo has hecho):**
        Si aún no puedes ejecutar comandos `dotnet ef` o los cmdlets de la Consola de NuGet, instala las herramientas globales:
        ```bash
        dotnet tool install --global dotnet-ef --version 8.0.0
        ```
        Y para la Consola del Administrador de Paquetes (dentro de Visual Studio), asegúrate de que el paquete esté instalado en tu proyecto `fullstack-net-react`:
        ```powershell
        # En la Consola del Administrador de Paquetes
        Install-Package Microsoft.EntityFrameworkCore.Tools -Version 8.0.0
        ```

    * **Elimina la base de datos existente (si la tienes y quieres un inicio limpio):**
        La forma más segura es eliminarla manualmente a través del **Explorador de Objetos de SQL Server** en Visual Studio.
        1.  Ve a **View** > **SQL Server Object Explorer**.
        2.  Expande `(localdb)\MSSQLLocalDB` > **Databases**.
        3.  Haz clic derecho en `EcommerceDb` y selecciona **Delete**. Marca "Close existing connections" y confirma.
        * *(Opcional: Si lo haces desde la Consola del Administrador de Paquetes y `Remove-Database` funciona para ti ahora: `Remove-Database -Force`)*

    * **Elimina y genera tus migraciones (para asegurar un estado limpio):**
        1.  En el Explorador de Soluciones de Visual Studio, elimina la carpeta `Migrations` dentro de tu proyecto `fullstack-net-react`.
        2.  En la Consola del Administrador de Paquetes (asegurándote de que `fullstack-net-react` esté seleccionado como proyecto predeterminado), genera una nueva migración:
            ```powershell
            Add-Migration InitialSetupWithIdentity
            ```
            Esto creará una nueva carpeta `Migrations` y un archivo de migración que contiene todo el esquema de la base de datos (incluidas las tablas de Identity y tus modelos de la aplicación).
        3.  Aplica la migración a la base de datos:
            ```powershell
            Update-Database
            ```
            Este comando creará la base de datos `EcommerceDb` (si no existe) y aplicará el esquema definido en la migración `InitialSetupWithIdentity`.

4.  **Ejecuta el Backend:**
    Desde la carpeta raíz de tu proyecto backend (`D:\Repositories\fullstack-net-react\backend\fullstack-net-react\fullstack-net-react`), ejecuta:
    ```bash
    dotnet run
    ```
    Esto iniciará la API. Si es la primera vez que la ejecutas con una base de datos recién creada, la lógica de *seeding* en `Program.cs` se ejecutará para poblar roles, un usuario administrador y productos de ejemplo.
    La API estará disponible en `https://localhost:7224` (o el puerto que se muestre en tu consola). La interfaz de Swagger UI estará en `https://localhost:7224/swagger`.

### 💻 Configuración del Frontend

1.  **Navega al directorio del frontend:**
    Abre una **nueva terminal** y navega a la carpeta de tu proyecto frontend (ej. `D:\Repositories\fullstack-net-react\frontend`).

    ```bash
    cd D:\Repositories\fullstack-net-react\frontend
    ```

2.  **Instala las dependencias de Node.js:**
    ```bash
    npm install
    # o si usas yarn: yarn install
    ```

3.  **Inicia el Frontend:**
    ```bash
    npm run dev
    # o si usas yarn: yarn dev
    ```
    Esto iniciará la aplicación React. Normalmente se abrirá en `http://localhost:5173`.

## 🔒 Autenticación y Uso

Al iniciar el backend por primera vez con la base de datos vacía, se creará un usuario administrador y roles predefinidos gracias a la lógica de *seeding* en tu `Program.cs`.

### Credenciales del Usuario Administrador (por defecto):

* **Usuario (Username):** `admin`
* **Contraseña (Password):** `AdminPassword123!`
    * **¡Importante!** Verifica estas credenciales en tu archivo `Program.cs` para asegurarte de que son las correctas, ya que podrían haber sido modificadas.

### Cómo Probar el Login y Acceder a la API

1.  **Accede a Swagger UI:**
    Abre tu navegador y ve a `https://localhost:7224/swagger`.

2.  **Realiza el Login:**
    * Busca el endpoint `POST /api/Auth/login`.
    * Haz clic en **"Try it out"**.
    * En el campo `Request body`, introduce las credenciales del usuario administrador:
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
    * Ahora puedes probar cualquier endpoint de tu API que requiera autenticación (por ejemplo, `GET /api/Products` si lo tienes protegido, o un `POST`/`PUT`).
    * Haz clic en "Try it out" y luego en "Execute".
    * Si la autorización fue exitosa, deberías obtener una respuesta `200 OK` o el resultado esperado, en lugar de un `401 Unauthorized` o `403 Forbidden`.
````
