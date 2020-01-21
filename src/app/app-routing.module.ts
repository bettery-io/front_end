import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateQuizeComponent } from './components/create-quize/create-quize.component';
import { HomeComponent } from './components/home/home.component';
import { EventFeedComponent } from './components/eventFeed/eventFeed.component';
import { ValidateComponent } from './components/validate/validate.component';
import { MyActivitesComponent } from './components/my-activites/my-activites.component';
import { QuestionComponent } from './components/question/question.component';
import { InvitationComponent} from './components/invitation/invitation.component';


const routes: Routes = [
  { path: "~ki339203/home", component: HomeComponent },
  { path: "~ki339203", redirectTo: "~ki339203/home", pathMatch: "full" },
  { path: "~ki339203/create-quize", component: CreateQuizeComponent },
  { path: "~ki339203/eventFeed", component: EventFeedComponent },
  { path: "~ki339203/validate", component: ValidateComponent },
  { path: "~ki339203/my-activites", component: MyActivitesComponent },
  { path: '~ki339203/question/:id', component: QuestionComponent },
  { path: '~ki339203/invitation', component: InvitationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
