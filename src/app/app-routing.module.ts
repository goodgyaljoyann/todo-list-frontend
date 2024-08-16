import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListManagerComponent } from './task-list-manager/task-list-manager.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: '', component: TaskListManagerComponent, pathMatch: 'full' }, // Main route
  { path: 'login', component: LoginComponent }, // Fixed route path for login
  { path: 'register', component: RegisterComponent }, // Fixed route path for register
  { path: '**', redirectTo: '' } // Redirect to main route if not found
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
