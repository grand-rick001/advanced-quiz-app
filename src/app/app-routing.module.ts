import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GameComponent } from './components/game/game.component';
import { HighScoresComponent } from './components/high-scores/high-scores.component';
import { EndComponent } from './components/end/end.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game', component: GameComponent },
  { path: 'high-scores', component: HighScoresComponent },
  { path: 'end', component: EndComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
