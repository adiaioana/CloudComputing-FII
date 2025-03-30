import { Routes } from '@angular/router';
import {DestinationsPageComponent} from './layout/pages/destinations-page/destinations-page.component'
import {HomePageComponent} from './layout/home-page/home-page.component'

import {SigninPageComponent} from './layout/pages/account-pages/signin-page/signin-page.component'
import {LoginPageComponent} from './layout/pages/account-pages/login-page/login-page.component';
import {MyaccountPageComponent} from './layout/pages/account-pages/myaccount-page/myaccount-page.component';
import {AttractionsPageComponent} from './layout/pages/attractions-page/attractions-page.component';
export const routes: Routes = [
  { path: '', component: HomePageComponent }, // Default route
  { path: 'destinations', component: DestinationsPageComponent },
  {path:'sign-in', component: SigninPageComponent},
  {path:'log-in', component:LoginPageComponent},
  {path:'my-account', component:MyaccountPageComponent},
  {path:'attractions', component:AttractionsPageComponent}
];
