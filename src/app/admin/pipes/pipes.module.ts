import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NameFilterPipe } from './name-filter.pipe';
import { RoleFilterPipe } from './role-filter.pipe';



@NgModule({
   imports: [
      CommonModule
   ],
   declarations: [
      NameFilterPipe,
      RoleFilterPipe
   ],
   exports: [
      NameFilterPipe,
      RoleFilterPipe
   ]
})
export class PipesModule { }
