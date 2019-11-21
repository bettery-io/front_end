import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateQuizeComponent } from './components/create-quize/create-quize.component';
import { HomeComponent } from './components/home/home.component';
import { AnswerComponent } from './components/answer/answer.component';
import { ValidateComponent } from './components/validate/validate.component';
import { MyActivitesComponent } from './components/my-activites/my-activites.component';
import { QuestionComponent } from './components/question/question.component';


const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "create-quize", component: CreateQuizeComponent },
  { path: "answer", component: AnswerComponent },
  { path: "validate", component: ValidateComponent },
  { path: "my-activites", component: MyActivitesComponent },
  { path: 'question/:id', component: QuestionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
