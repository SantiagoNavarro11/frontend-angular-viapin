🚀 MANUAL DE EJECUCIÓN RÁPIDA DEL FRONTEND (ANGULAR)

Este manual asume que ya has clonado el repositorio y que tu terminal está ubicada en la carpeta raíz del proyecto Angular.

📋 Requisitos Mínimos

Asegúrate de tener instalados:

Node.js y npm (Se recomienda la versión LTS más reciente).

Angular CLI instalado globalmente (npm install -g @angular/cli).

🛠️ Comandos Esenciales de Ejecución

Sigue esta secuencia de comandos para instalar las dependencias y levantar el servidor de desarrollo.

PASO 1: Instalar Dependencias (Librerías)

Ejecuta este comando una sola vez (o cuando se actualice el package.json) para descargar todas las librerías necesarias.

npm install


PASO 2: Configurar el Endpoint de la API (Si Aplica)

IMPORTANTE: Si el Backend no está corriendo en http://localhost:8000, debes editar manualmente la URL de la API.

Ruta del Archivo a Editar: src/app/services/user.service.ts

Modificar: La variable private apiUrl para que apunte a la dirección correcta de tu Backend.

PASO 3: Iniciar el Servidor de Desarrollo

Este comando compila la aplicación, levanta el servidor de Angular y abre automáticamente la aplicación en tu navegador.

ng serve --open


✅ FINALIZADO:

La aplicación Frontend estará disponible en http://localhost:4200/.

Recuerda: Para que las operaciones CRUD funcionen, el Backend de Laravel debe estar corriendo en su terminal aparte (php artisan serve).
