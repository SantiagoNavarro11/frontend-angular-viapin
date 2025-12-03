/**
 * @interface User
 * @description Define la estructura estricta del objeto Colaborador.
 * Exportada para ser utilizada en cualquier componente que interactúe con estos datos.
 */
export interface User {
  /** Identificador único del colaborador. Es 0 para nuevos registros. */
  id: number;
  /** Nombre completo del colaborador. */
  nombre_completo: string;
  /** Correo electrónico del colaborador. */
  email: string;
  /** Departamento o área de trabajo. */
  departamento: string;
  /** Estado del colaborador: 'Activo' o 'Inactivo'. */
  estado: string;
  /** Número de teléfono. */
  telefono: string;
  /** Fecha de ingreso o registro (YYYY-MM-DD). */
  fecha_registro: string;
}
