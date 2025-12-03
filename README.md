🚀 Colaboradores App - Frontend (Angular)

Este repositorio contiene el código fuente del Frontend de la aplicación de gestión de colaboradores. El proyecto está construido con Angular 17+ y requiere que un servicio de Backend RESTful esté operativo para funcionar correctamente.

📋 Requisitos del Sistema

Para poder instalar y ejecutar este proyecto, el desarrollador debe tener instalado en su máquina:

Node.js y npm: Se recomienda la versión LTS más reciente.

Angular CLI: El cliente de línea de comandos de Angular debe estar instalado de forma global:

npm install -g @angular/cli



Git: Para la clonación del repositorio.

🛠️ Pasos de Instalación y Configuración - Guía de Consola

Sigue esta secuencia de comandos, ejecutándolos directamente en tu terminal o consola, para poner el proyecto en marcha:

Paso 1: Clonar y Acceder al Repositorio

Abre tu terminal (CMD, PowerShell, Bash, etc.) y ejecuta los siguientes comandos:

# 1. CLONAR: Descarga el código fuente del proyecto.
#    ***IMPORTANTE: Reemplaza [URL_DEL_REPOSITORIO] con la dirección HTTPS o SSH real de tu proyecto.***
git clone [URL_DEL_REPOSITORIO]

# 2. ACCEDER: Navega al directorio recién creado.
#    ***EJEMPLO: Si tu repositorio se llama 'colaboradores-frontend', ejecuta:***
cd [nombre-del-proyecto-frontend]


Paso 2: Instalar Dependencias (Librerías)

Una vez dentro de la carpeta del proyecto, ejecuta el siguiente comando para descargar todas las dependencias de Angular, Tailwind CSS, RxJS, etc.

# Instala todas las dependencias listadas en package.json
npm install


Paso 3: Configurar el Endpoint de la API (Solo si es necesario)

Si el Backend de la aplicación no está corriendo en http://localhost:8000, debes ajustar la URL del API en el servicio principal.

Ruta del Archivo a Editar: src/app/services/user.service.ts

Localiza y modifica la línea de la URL para que apunte al host y puerto correcto de tu Backend:

// En user.service.ts, busca y edita esta línea si tu API no está en el puerto 8000
private apiUrl = 'http://[HOST_DE_TU_API]:[PUERTO]/api/users';


Paso 4: Ejecutar el Servidor de Desarrollo

Ahora, compila y levanta el servidor de desarrollo de Angular. Esto abrirá la aplicación en tu navegador.

# Compila el proyecto, inicia el servidor en http://localhost:4200/ y abre el navegador
ng serve --open


Si la compilación es exitosa, el navegador se abrirá mostrando la aplicación, y ya podrás interactuar con el CRUD de colaboradores. Recuerda: El Backend debe estar corriendo para que las operaciones de Guardar, Actualizar y Eliminar funcionen.
