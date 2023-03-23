import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-end',
  templateUrl: './end.component.html',
  styleUrls: ['./end.component.css']
})
export class EndComponent implements OnInit {
  username: string = '';
  finalScore: number;

  constructor (private quizService: QuizService) {
    this.finalScore = this.quizService.getFinalScore();
  }

  ngOnInit(): void {}

  // saveHighScore() : {
  //   alert(`Saved, ${this.username}`);
  // }
}
