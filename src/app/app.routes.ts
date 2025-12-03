import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },

  {
    path: 'users',
    loadComponent: () =>
      import('./components/users-list/users-list.component').then((c) => c.UsersListComponent),
  },
];
