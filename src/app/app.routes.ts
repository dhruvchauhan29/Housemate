import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { CustomerLoginComponent } from './components/customer-login/customer-login.component';
import { ExpertLoginComponent } from './components/expert-login/expert-login.component';
import { CustomerRegistrationComponent } from './components/customer-registration/customer-registration.component';
import { ExpertRegistrationComponent } from './components/expert-registration/expert-registration.component';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { ExpertDashboardComponent } from './components/expert-dashboard/expert-dashboard.component';
import { BookServiceComponent } from './components/book-service/book-service.component';
import { SelectServiceComponent } from './components/select-service/select-service.component';
import { SelectExpertComponent } from './components/select-expert/select-expert.component';
import { SelectDatetimeComponent } from './components/select-datetime/select-datetime.component';
import { SelectAddressComponent } from './components/select-address/select-address.component';
import { BookingSummaryComponent } from './components/booking-summary/booking-summary.component';
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
  {
    path: 'book-service',
    component: BookServiceComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'CUSTOMER' },
    children: [
      { path: '', redirectTo: 'select-service', pathMatch: 'full' },
      { path: 'select-service', component: SelectServiceComponent },
      { path: 'select-expert', component: SelectExpertComponent },
      { path: 'select-datetime', component: SelectDatetimeComponent },
      { path: 'select-address', component: SelectAddressComponent },
      { path: 'booking-summary', component: BookingSummaryComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
