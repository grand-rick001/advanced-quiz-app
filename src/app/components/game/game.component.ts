import { Component, OnInit, Renderer2, ElementRef  } from '@angular/core';
import { QuizService } from 'src/app/services/quiz.service';
import { Question } from 'src/app/models/Question';
import { rawQuestion } from 'src/app/models/rawQuestion';
import { Choice } from 'src/app/models/Choice';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements OnInit {
  questions: Question[] = [];
  availableQuestions: Question[] = [];
  currentQuestion: Question;

  //CONSTANTS
  NUM_OF_QUESTIONS: number = 10;
  CORRECT_BONUS: number = 10;
  MAX_QUESTIONS: number = 3;

  acceptingAnswers: boolean = false;
  score: number = 0;
  questionCounter: number = 0;
  scoreText: string = '0';

  constructor (private quizService: QuizService, private renderer: Renderer2, private elementRef: ElementRef) {
      this.currentQuestion = {
        category: '',
        difficulty: '',
        question: '',
        answer: 0,
        choices: [],
        correct_answer: '',
        incorrect_answers: []
      }
    }

  ngOnInit(): void {
    this.quizService.getQuestions().subscribe(data => {
      let loadedQuestions: rawQuestion[] = data;

      this.questions = this.questionsFormatter(loadedQuestions);

      this.startGame();
    });
  }

  choiceFormatter(choice: string, index: number): Choice {
    let prefixAsciiValue = 65; // A
    let formattedChoice = {
        prefix: String.fromCharCode(prefixAsciiValue + index),
        choice,
        data_number:  index+1
      }
    return formattedChoice;
  }
  
  questionsFormatter(loadedQuestions: rawQuestion[]): Question[] {
    let neatQuestions: Question[] = [];
    
    loadedQuestions.forEach((loadedQuestion: rawQuestion) => {
      const formattedQuestion: Question = {
        category: loadedQuestion.category,
        difficulty: loadedQuestion.difficulty,
        question: loadedQuestion.question,
        correct_answer: loadedQuestion.correct_answer,
        incorrect_answers: loadedQuestion.incorrect_answers,
        answer: 0,
        choices: []
      };

      const answerChoices: string[] = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
      // Add the correct answer to the index with the answer value
      answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);

      answerChoices.forEach((choice: string, index: number) => {
        // Formatting each choice
        formattedQuestion.choices[index] = this.choiceFormatter(choice, index);
      });

      neatQuestions.push(formattedQuestion);
    });

    return neatQuestions;
  }

  startGame(): void {
    this.questionCounter = 0;
    this.score = 0;
    this.availableQuestions = [...questions].slice(0, NUM_OF_QUESTIONS);
    this.getNewQuestion();

    const game = this.elementRef.nativeElement.querySelector('#game');
    const loader = this.elementRef.nativeElement.querySelector('#loader');

    this.renderer.removeClass(game, 'hidden');
    this.renderer.addClass(loader, 'hidden');
  }

  getNewQuestion = () => {
    if (this.availableQuestions.length === 0 || this.questionCounter >= this.MAX_QUESTIONS) {
      localStorage.setItem('mostRecentScore', this.score);
      //go to the end page
      return window.location.assign('/end');
    }
    this.questionCounter++;

    // progressText.innerText = `Question ${questionCounter}  /  ${MAX_QUESTIONS}`;
    // Update the progress bar
    // progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS)* 100}%`;

    const questionIndex = Math.floor(Math.random() * this.availableQuestions.length);
    this.currentQuestion = this.availableQuestions[questionIndex];

    // choices.forEach((choice) => {
    //     const number = choice.dataset['number'];
    //     choice.innerText = currentQuestion['choice' + number];
    // });

    this.availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
  };

  onChoiceClick(event: MouseEvent): void {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = event.target;
    const selectedAnswer = selectedChoice.id;

    const classToApply = (selectedAnswer == this.currentQuestion.answer) ? "correct" : "incorrect";

    if(classToApply === 'correct') {
        this.incrementScore(this.CORRECT_BONUS);
    }

    // selectedChoice.parentElement.classList.add(classToApply);

    // setTimeout(() => {
    // selectedChoice.parentElement.classList.remove(classToApply);
    // getNewQuestion();
    // }, 1000);
  }

  incrementScore = (num: number) => {
    this.score += num;
    this.scoreText = score as unknown as string;
};
}