import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service'; // Asumiendo que User se exporta desde el servicio
import { User } from '../../models/user.interface';

/**
 * @component UsersListComponent
 * @description Componente Contenedor principal que maneja la vista de la tabla de colaboradores
 * y el formulario de edición/creación (CRUD). Es responsable de gestionar el estado local (mensajes,
 * visibilidad del modal) y orquestar las llamadas a la API a través del UserService.
 */
@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit {
  /** @property users Array que almacena la lista completa de colaboradores obtenida del Backend. */
  users: User[] = [];

  /** @property currentUser Objeto que mantiene el estado del colaborador que se está editando o creando. */
  currentUser: User = this.resetUserForm();

  /** @property isEditing Bandera que controla la visibilidad del formulario de edición/creación en el template. */
  isEditing: boolean = false;

  /** @property successMessage Mensaje de éxito a mostrar tras una operación CRUD (temporal o en el modal). */
  successMessage: string = '';

  /** @property errorMessage Mensaje de error a mostrar si una petición a la API falla. */
  errorMessage: string = '';

  /** @property operationSuccess Bandera crucial que controla la visibilidad del modal de éxito grande. */
  operationSuccess: boolean = false;

  /**
   * @constructor
   * @description Inyección de dependencias.
   * @param userService Servicio de la capa de datos para manejar peticiones HTTP.
   * @param cd ChangeDetectorRef para forzar la actualización de la vista en casos específicos (ej. alerts).
   */
  constructor(private userService: UserService, private cd: ChangeDetectorRef) {}

  /**
   * @method ngOnInit
   * @description Método de ciclo de vida llamado al iniciar el componente. Carga la lista inicial de colaboradores.
   */
  ngOnInit(): void {
    this.consultar();
  }

  /**
   * @method clearMessages
   * @description Limpia los mensajes de error/éxito después de un breve temporizador.
   * Esto evita que las alertas temporales permanezcan en la pantalla.
   */
  clearMessages() {
    setTimeout(() => {
      this.errorMessage = '';
      // Limpiamos successMessage solo si NO está activo el modal grande de éxito
      if (!this.operationSuccess) {
        this.successMessage = '';
      }
    }, 3000);
  }

  /**
   * @method cerrarModalYFormulario
   * @description Función que ejecuta la limpieza total del estado: oculta el modal de éxito,
   * limpia el mensaje y cierra/resetea el formulario.
   */
  cerrarModalYFormulario() {
    this.operationSuccess = false; // Oculta el modal de éxito
    this.successMessage = ''; // Limpia el mensaje
    this.cancelarEdicion(); // Cierra y limpia el formulario
    this.consultar(); // Refresca el listado después de cerrar el modal
  }

  /**
   * @method resetUserForm
   * @description Genera un objeto User inicial con valores por defecto (ID=0 para indicar creación).
   * @returns {User} Objeto User vacío y tipado.
   */
  resetUserForm(): User {
    return {
      id: 0,
      nombre_completo: '',
      email: '',
      departamento: '',
      estado: 'Activo',
      telefono: '',
      // Formato YYYY-MM-DD requerido por el input type="date"
      fecha_registro: new Date().toISOString().slice(0, 10),
    };
  }

  /**
   * @method consultar
   * @description Llama al servicio para obtener la lista de colaboradores.
   * Implementa el manejo de error para mostrar el mensaje en la interfaz.
   */
  consultar() {
    this.errorMessage = ''; // Limpiamos errores previos

    this.userService.getUsers().subscribe({
      next: (resp: any) => {
        // Lógica de éxito: asignar datos
        this.users = resp.data || [];
        this.cd.detectChanges();
      },
      error: (err) => {
        // ✅ CORRECCIÓN CLAVE: Asignamos el mensaje legible del servicio (Status 0 o 4xx).
        this.errorMessage =
          err instanceof Error && err.message
            ? err.message // <--- ESTO toma el mensaje: "Error de conexión..."
            : '❌ Error desconocido al cargar usuarios.';

        this.cd.detectChanges(); // Aseguramos que el banner se actualice
        this.clearMessages(); // Limpiamos el mensaje después de un tiempo
        console.error('Error al consultar usuarios:', err);
      },
    });
  }

  /**
   * @method eliminar
   * @description Solicita confirmación y llama al servicio para eliminar un usuario por ID.
   * @param id Identificador del usuario a eliminar.
   */
  eliminar(id: number) {
    // Uso de confirm() nativo como placeholder para una alerta modal
    if (!window.confirm('⚠️ ¿Eliminar este usuario? Esta acción es irreversible.')) return;

    this.userService.deleteUser(id).subscribe({
      next: () => {
        // Actualización optimista de la UI: eliminamos el usuario del array local
        this.users = this.users.filter((u) => u.id !== id);
        this.successMessage = `✅ Usuario ID ${id} eliminado correctamente.`;

        // Forzamos la detección de cambios para asegurar que la alerta temporal se muestre inmediatamente.
        this.cd.detectChanges();
        this.clearMessages();
        console.log(`Usuario con ID ${id} eliminado.`);
      },
      error: (err) => {
        this.errorMessage = '❌ Error al eliminar usuario. Revisa la consola para más detalles.';
        this.clearMessages();
        console.error('Error al eliminar:', err);
      },
    });
  }

  /**
   * @method iniciarCreacion
   * @description Prepara el estado para mostrar el formulario de creación.
   */
  iniciarCreacion() {
    this.currentUser = this.resetUserForm();
    this.isEditing = true;
    this.operationSuccess = false;
  }

  /**
   * @method seleccionarUsuario
   * @description Carga un usuario existente en el formulario para su edición.
   * Se utiliza el operador spread ({...user}) para crear una copia y no modificar el objeto en la lista 'users'.
   * @param user El objeto User a editar.
   */
  seleccionarUsuario(user: User) {
    this.currentUser = { ...user };
    this.isEditing = true;
    this.operationSuccess = false;
  }

  /**
   * @method cancelarEdicion
   * @description Oculta el formulario y resetea el objeto 'currentUser'.
   */
  cancelarEdicion() {
    this.isEditing = false;
    this.currentUser = this.resetUserForm();
    this.errorMessage = '';
  }

  /**
   * @method guardarUsuario
   * @description Función de control que decide si llamar al método de creación o edición.
   */
  guardarUsuario() {
    if (this.currentUser.id === 0) {
      this.crearUsuario();
    } else {
      this.editarUsuario();
    }
  }

  /**
   * @method crearUsuario
   * @description Llama al servicio para registrar un nuevo colaborador.
   */
  crearUsuario() {
    // Se extraen los datos relevantes, aunque User.id será ignorado por el Backend.
    const newUser = {
      nombre_completo: this.currentUser.nombre_completo,
      email: this.currentUser.email,
      departamento: this.currentUser.departamento,
      estado: this.currentUser.estado,
      telefono: this.currentUser.telefono,
      fecha_registro: this.currentUser.fecha_registro,
    };

    this.userService.createUser(newUser).subscribe({
      next: (resp: any) => {
        // Se añade el nuevo ID asignado por el Backend al objeto local antes de insertarlo en la lista.
        const userCreated: User = { ...this.currentUser, id: resp.id || resp.data.id };
        this.users.push(userCreated);

        this.successMessage = '✅ ¡Usuario creado exitosamente!';
        this.operationSuccess = true; // Activa el modal de éxito

        // Se usa ChangeDetectorRef para asegurar que los *ngIf se actualicen inmediatamente.
        this.cd.detectChanges();

        console.log('Usuario creado exitosamente:', userCreated);
      },
      error: (err) => {
        // ⬅️ Antes: this.errorMessage = 'Error al crear usuario...';
        // ⬅️ Ahora: Captura el mensaje detallado (ej. 'Error de validación: El campo X es requerido')
        this.errorMessage =
          err instanceof Error && err.message ? err.message : '❌ Error al crear usuario.';
        this.cd.detectChanges();
        this.clearMessages();
        console.error('Error al crear usuario:', err);
      },
    });
  }

  /**
   * @method editarUsuario
   * @description Llama al servicio para actualizar los datos de un colaborador existente.
   */
  editarUsuario() {
    const idToUpdate = this.currentUser.id;
    // Se usa destructuring para separar el 'id' del resto del cuerpo de la petición (userData).
    const { id, ...userData } = this.currentUser;

    this.userService.updateUser(idToUpdate, userData).subscribe({
      next: () => {
        // Actualización del objeto en el array 'users' para reflejar el cambio en la tabla inmediatamente.
        const index = this.users.findIndex((u) => u.id === idToUpdate);
        if (index !== -1) {
          this.users[index] = this.currentUser;
        }

        this.successMessage = `✅ ¡Usuario ID ${idToUpdate} actualizado correctamente!`;
        this.operationSuccess = true; // Activa el modal de éxito

        // Forzamos la detección de cambios.
        this.cd.detectChanges();

        console.log(`Usuario con ID ${idToUpdate} actualizado.`);
      },
      error: (err) => {
        // ⬅️ Mismo principio: Muestra el mensaje de validación o el error de la API.
        this.errorMessage =
          err instanceof Error && err.message ? err.message : '❌ Error al actualizar usuario.';
        this.cd.detectChanges();
        this.clearMessages();
        console.error('Error al editar usuario:', err);
      },
    });
  }
}
