import { Routes } from '@angular/router';
import {DestinationsPageComponent} from './layout/pages/destinations-page/destinations-page.component'
import {HomePageComponent} from './layout/home-page/home-page.component'

import {SigninPageComponent} from './layout/pages/account-pages/signin-page/signin-page.component'
import {LoginPageComponent} from './layout/pages/account-pages/login-page/login-page.component';
import {MyaccountPageComponent} from './layout/pages/account-pages/myaccount-page/myaccount-page.component';
import {AttractionsPageComponent} from './layout/pages/attractions-page/attractions-page.component';
import {EachAttractionPageComponent} from './layout/pages/each-attraction-page/each-attraction-page.component';
import {EachDestinationPageComponent} from './layout/pages/each-destination-page/each-destination-page.component';
import {
  SearchResultPageComponentComponent
} from './layout/pages/search-result-page-component/search-result-page-component.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent }, // Default route
  { path: 'destinations', component: DestinationsPageComponent },
  {path:'register', component: SigninPageComponent},
  {path:'login', component:LoginPageComponent},
  {path:'my-account', component:MyaccountPageComponent},
  {path:'attractions', component:AttractionsPageComponent},
  { path: 'attraction/:id', component: EachAttractionPageComponent },
  {path:'destination/:id',component: EachDestinationPageComponent},
  { path: 'search/:query', component: SearchResultPageComponentComponent }
];
