import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterViewComponent } from './master-view/master-view.component';
import { MasterComponent } from './master/master.component';
import { MasterEditComponent } from './master-edit/master-edit.component';

const routes: Routes = [
  
  {
    path: '',
    component: MasterViewComponent
  },
  {
    path: 'masterdetails',
    component: MasterViewComponent
  },
  {
    path: 'masterdetails/add',
    component: MasterComponent
  },
  {
    path: 'masterdetails/edit/:id',
    component: MasterEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
