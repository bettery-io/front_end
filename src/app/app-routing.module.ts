import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicEventFormComponent } from './components/public-event-form/public-event-form.component';
import { PrivateEventFormComponent } from './components/private-event-form/private-event-form.component';
import { EventsTemplatesComponent } from './components/events-templates/events-templates.component';
import { HomeComponent } from './components/home/home.component';
import { EventFeedComponent } from './components/eventFeed/eventFeed.component';
import { MyActivitesComponent } from './components/my-activites/my-activites.component';
import { QuestionComponent } from './components/question/question.component';
import { InvitationComponent } from './components/invitation/invitation.component';
import { HistoryComponent } from './components/history/history.component';
import { ErcCoinSaleComponent } from './components/erc-coin-sale/erc-coin-sale.component';


const routes: Routes = [
  // ~ki339203 only for test hosting
  // remove before deploy to production
  { path: "~ki339203/home", component: HomeComponent },
  { path: "~ki339203", redirectTo: "~ki339203/home", pathMatch: "full" },
  { path: "~ki339203/choose-event", component: EventsTemplatesComponent },
  { path: "~ki339203/public-event", component: PublicEventFormComponent },
  { path: "~ki339203/private-event", component: PrivateEventFormComponent },
  { path: "~ki339203/eventFeed", component: EventFeedComponent },
  { path: "~ki339203/my-activites", component: MyActivitesComponent },
  { path: '~ki339203/question/:id', component: QuestionComponent },
  { path: '~ki339203/invitation', component: InvitationComponent },
  { path: '~ki339203/history', component: HistoryComponent },
  { path: '~ki339203/erc20', component: ErcCoinSaleComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
