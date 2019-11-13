import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CreateQuizeComponent} from './components/create-quize/create-quize.component';
import {QuizeBoardComponent} from './components/quize-board/quize-board.component';


const routes: Routes = [
  {path: "create-quize", component: CreateQuizeComponent},
  {path: "quize-board", component: QuizeBoardComponent},
  {path: "", redirectTo :"/quize-board", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
