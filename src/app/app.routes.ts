import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { CustomerLoginComponent } from './components/customer-login/customer-login.component';
import { ExpertLoginComponent } from './components/expert-login/expert-login.component';
import { CustomerRegistrationComponent } from './components/customer-registration/customer-registration.component';
import { ExpertRegistrationComponent } from './components/expert-registration/expert-registration.component';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { ExpertDashboardComponent } from './components/expert-dashboard/expert-dashboard.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'customer/login', component: CustomerLoginComponent },
  { path: 'expert/login', component: ExpertLoginComponent },
  { path: 'customer/register', component: CustomerRegistrationComponent },
  { path: 'expert/register', component: ExpertRegistrationComponent },
  { 
    path: 'customer/dashboard', 
    component: CustomerDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'CUSTOMER' }
  },
  { 
    path: 'expert/dashboard', 
    component: ExpertDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'EXPERT' }
  },
  { path: '**', redirectTo: '' }
];
