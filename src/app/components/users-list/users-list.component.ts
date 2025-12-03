import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // ⬅️ Importación de ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  currentUser: User | any = this.resetUserForm();
  isEditing: boolean = false; // VARIABLES DE ESTADO PARA MENSAJES Y MODAL

  successMessage: string = '';
  errorMessage: string = '';
  operationSuccess: boolean = false; // Controla la visibilidad del modal de éxito // ➡️ INYECCIÓN del servicio y del detector de cambios

  constructor(private userService: UserService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.consultar();
  } // Función para limpiar los mensajes de error/éxito temporal

  clearMessages() {
    setTimeout(() => {
      this.errorMessage = ''; // Limpiamos successMessage solo si no estamos en el modal grande
      if (!this.operationSuccess) {
        this.successMessage = '';
      }
    }, 3000);
  } // Cierra el modal y el formulario

  cerrarModalYFormulario() {
    this.operationSuccess = false; // Oculta el modal
    this.successMessage = ''; // Limpia el mensaje de éxito
    this.cancelarEdicion(); // Cierra y limpia el formulario
  }

  resetUserForm(): User {
    return {
      id: 0,
      nombre_completo: '',
      email: '',
      departamento: '',
      estado: 'Activo',
      telefono: '',
      fecha_registro: new Date().toISOString().slice(0, 10),
    };
  }

  consultar() {
    this.userService.getUsers().subscribe({
      next: (resp: any) => {
        this.users = resp.data;
      },
      error: (err) => console.error('Error al consultar usuarios:', err),
    });
  }

  eliminar(id: number) {
    if (!confirm('⚠️ ¿Eliminar este usuario? Esta acción es irreversible.')) return;

    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== id);
        this.successMessage = `✅ Usuario ID ${id} eliminado correctamente.`;
        // Mensaje flotante temporal para la eliminación
        setTimeout(() => (this.successMessage = ''), 3000);
        this.cd.detectChanges(); // Forzar vista de la alerta temporal
        console.log(`Usuario con ID ${id} eliminado.`);
      },
      error: (err) => {
        this.errorMessage = '❌ Error al eliminar usuario. Revisa la consola para más detalles.';
        this.clearMessages();
        console.error('Error al eliminar:', err);
      },
    });
  }

  iniciarCreacion() {
    this.currentUser = this.resetUserForm();
    this.isEditing = true;
  }

  seleccionarUsuario(user: User) {
    this.currentUser = { ...user };
    this.isEditing = true;
  }

  cancelarEdicion() {
    this.isEditing = false;
    this.currentUser = this.resetUserForm();
  }

  guardarUsuario() {
    if (this.currentUser.id === 0) {
      this.crearUsuario();
    } else {
      this.editarUsuario();
    }
  } // --- CREAR USUARIO (Corregido con ChangeDetectorRef) ---

  crearUsuario() {
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
        const userCreated: User = { ...this.currentUser, id: resp.id || resp.data.id };
        this.users.push(userCreated); // 🚀 Muestra el Modal de Éxito

        this.successMessage = '✅ ¡Usuario creado exitosamente!';
        this.operationSuccess = true; // ➡️ CLAVE: Forzar la detección para que el modal aparezca inmediatamente

        this.cd.detectChanges();

        console.log('Usuario creado exitosamente:', userCreated);
      },
      error: (err) => {
        this.errorMessage = '❌ Error al crear usuario. Revisa la consola para más detalles.';
        this.clearMessages();
        console.error('Error al crear usuario:', err);
      },
    });
  } // --- EDITAR USUARIO (Corregido con ChangeDetectorRef) ---

  editarUsuario() {
    const idToUpdate = this.currentUser.id;
    const { id, ...userData } = this.currentUser;

    this.userService.updateUser(idToUpdate, userData).subscribe({
      next: () => {
        const index = this.users.findIndex((u) => u.id === idToUpdate);
        if (index !== -1) {
          this.users[index] = this.currentUser;
        } // 🚀 Muestra el Modal de Éxito

        this.successMessage = `✅ ¡Usuario ID ${idToUpdate} actualizado correctamente!`;
        this.operationSuccess = true; // ➡️ CLAVE: Forzar la detección para que el modal aparezca inmediatamente

        this.cd.detectChanges();

        console.log(`Usuario con ID ${idToUpdate} actualizado.`);
      },
      error: (err) => {
        this.errorMessage = '❌ Error al actualizar usuario. Revisa la consola para más detalles.';
        this.clearMessages();
        console.error('Error al editar usuario:', err);
      },
    });
  }
}
