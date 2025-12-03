🚀 MANUAL DE EJECUCIÓN RÁPIDA DEL FRONTEND (ANGULAR)

Este manual asume que ya has clonado el repositorio y que tu terminal está ubicada en la carpeta raíz del proyecto Angular.

#Este repo lo puede poner en la misma carpeta donde ubico el back.. 

📋 Requisitos Mínimos

Asegúrate de tener instalados:

Node.js y npm (Se recomienda la versión LTS más reciente).

Angular CLI instalado globalmente (npm install -g @angular/cli).

🛠️ Comandos Esenciales de Ejecución

Sigue esta secuencia de comandos para instalar las dependencias y levantar el servidor de desarrollo.

PASO 1: Instalar Dependencias (Librerías)

Ejecuta este comando una sola vez (o cuando se actualice el package.json) para descargar todas las librerías necesarias.

#abre una terminal dentro del proyecto y ejecuta el comando 
npm install


PASO 2: Configurar el Endpoint de la API (Si Aplica)

IMPORTANTE: Si el Backend no está corriendo en http://localhost:8000, debes editar manualmente la URL de la API.

Ruta del Archivo a Editar: src/app/services/user.service.ts

Modificar: La variable private apiUrl para que apunte a la dirección correcta de tu Backend.

#En este caso no creo que aplique.

PASO 3: Iniciar el Servidor de Desarrollo

Este comando compila la aplicación, levanta el servidor de Angular y abre automáticamente la aplicación en tu navegador.

ng serve --open


✅ FINALIZADO:

La aplicación Frontend estará disponible en http://localhost:4200/.

Recuerda: Para que las operaciones CRUD funcionen, el Backend de Laravel debe estar corriendo en su terminal aparte (php artisan serve).

📝 Nota Súper Importante: La Lógica de "Eliminar" Colaboradores

 En la aplicación tenemos dos formas de sacar a alguien del listado, y son muy diferentes a nivel de base de datos. Esto lo decidimos para no borrar la historia.

1. Desactivación (Mi Opción Favorita: Ocultar)

Yo lo llamo Borrado Lógico. Esto es como "mover a la papelera".

¿Cuándo lo uso? Cuando estoy editando a un colaborador y cambio su Estado de Activo a Inactivo.

¿Qué hace realmente?

En la Base de Datos: El registro NO se borra. Simplemente queda marcado con la etiqueta Inactivo.

En la Tabla/Lista: El sistema (la consulta del Backend) solo trae a los que están Activos. Por eso, el colaborador desaparece de la vista principal.

Conclusión: Esto es ideal para el dearrollo y control. Si necesito saber quién estuvo en la empresa hace dos años, la información sigue ahí, aunque no moleste en el listado diario.

2. Eliminación Definitiva (¡Borrar para Siempre!)

Esto es el Borrado Físico.

¿Cuándo lo uso? Cuando doy clic en el botón ❌ Eliminar en la tabla.

¿Qué hace realmente?

En la Base de Datos: ¡El registro se va para siempre! No hay marcha atrás.

Conclusión: Solo debemos usarlo si estamos 100% seguros de que esa información no la vamos a necesitar nunca más. 

Gracias , ahora si no hay mas aclaraciones. 
