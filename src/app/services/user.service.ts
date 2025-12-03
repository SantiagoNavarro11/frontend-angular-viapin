import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.interface';

/**
 * @service UserService
 * @description Servicio que maneja toda la lógica de comunicación con la API REST.
 * Encapsula las peticiones HTTP (CRUD) y el manejo reactivo de errores, cumpliendo con el
 * principio de Responsabilidad Única.
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  /**
   * @private
   * @property apiUrl
   * @description URL base del servicio API REST de Laravel para la entidad 'users'.
   */
  private apiUrl = 'http://localhost:8000/api/users';

  /**
   * @constructor
   * @description Inyección del módulo HttpClient para realizar peticiones.
   * @param http El cliente HTTP de Angular.
   */
  constructor(private http: HttpClient) {}

  /**
   * @private
   * @method handleError
   * @description Función utilitaria para manejar y formatear errores HTTP de forma centralizada.
   * Intercepta la respuesta del Backend (ej. errores de validación 422) y lanza un Observable de error.
   * @param error Objeto HttpErrorResponse del error.
   * @returns Observable que lanza un objeto Error.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido.';

    if (error.status === 0) {
      // Error del lado del cliente o de red
      errorMessage = 'Error de conexión. ¿Está el Backend (Laravel) encendido en el puerto 8000?';
    } else if (error.status === 422 && error.error?.errors) {
      // Error de Validación (Laravel 422 - Unprocessable Entity)
      // Se extraen los mensajes de error del cuerpo de la respuesta.
      const validationErrors = Object.values(error.error.errors).flat();
      errorMessage = `Error de validación: ${validationErrors.join(' | ')}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error del Servidor (Código ${error.status}): ${error.message}`;
    }

    console.error('API Error:', error);
    // throwError crea un Observable que lanza el error, que es capturado por el componente.
    return throwError(() => new Error(errorMessage));
  }

  /**
   * @method getUsers
   * @description Obtiene el listado completo de colaboradores.
   * @returns Observable de la respuesta de la API (generalmente { data: User[] }).
   */
  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(catchError(this.handleError));
  }

  /**
   * @method getUser
   * @description Obtiene un solo colaborador por su ID.
   * @param id Identificador del colaborador.
   * @returns Observable de la respuesta de la API.
   */
  getUser(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  /**
   * @method createUser
   * @description Envía los datos para registrar un nuevo colaborador.
   * @param data Los datos del nuevo colaborador.
   * @returns Observable de la respuesta de la API (el objeto creado).
   */
  createUser(data: Partial<User>): Observable<any> {
    return this.http.post<any>(this.apiUrl, data).pipe(catchError(this.handleError));
  }

  /**
   * @method updateUser
   * @description Envía los datos para actualizar un colaborador existente.
   * @param id El ID del colaborador a actualizar.
   * @param data Los datos actualizados (sin el ID).
   * @returns Observable de la respuesta de la API.
   */
  updateUser(id: number, data: Partial<User>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data).pipe(catchError(this.handleError));
  }

  /**
   * @method deleteUser
   * @description Elimina un colaborador por su ID.
   * @param id El ID del colaborador a eliminar.
   * @returns Observable de la respuesta de la API.
   */
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }
}
