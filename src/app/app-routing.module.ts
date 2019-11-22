import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateQuizeComponent } from './components/create-quize/create-quize.component';
import { HomeComponent } from './components/home/home.component';
import { AnswerComponent } from './components/answer/answer.component';
import { ValidateComponent } from './components/validate/validate.component';
import { MyActivitesComponent } from './components/my-activites/my-activites.component';
import { QuestionComponent } from './components/question/question.component';


const routes: Routes = [
  { path: "~ki339203/home", component: HomeComponent },
  { path: "", redirectTo: "~ki339203/home", pathMatch: "full" },
  { path: "~ki339203/create-quize", component: CreateQuizeComponent },
  { path: "~ki339203/questions", component: AnswerComponent },
  { path: "~ki339203/validate", component: ValidateComponent },
  { path: "~ki339203/my-activites", component: MyActivitesComponent },
  { path: '~ki339203/question/:id', component: QuestionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
