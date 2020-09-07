import {Component, OnInit} from '@angular/core';
import {PostService} from "../../../../../services/post.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-private-main',
  templateUrl: './private-main.component.html',
  styleUrls: ['./private-main.component.sass']
})
export class PrivateMainComponent implements OnInit {
  data: any;

  answerForm: FormGroup;

  condition: boolean = false;
  counts: any = 1;
  expert: boolean = false;

  fakeAnswer: string = '';
  fakeEndDate: number = 1;

  constructor(private postService: PostService, private formBuilder: FormBuilder) {
    this.postService.post('privateEvents/get_by_id', {id: 457396837154828}).subscribe(value => this.data = value);

    this.answerForm = formBuilder.group({
      answer: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  changePage() {
    // this.data.endTime <= 0 ? this.expert = true : this.expert = false;
    this.fakeEndDate <= 0 ? this.expert = true : this.expert = false;

    this.condition = true;
  }

  sendAnswer(answerForm: any) {
    console.log(answerForm.value);
    this.counts = 3;
    this.fakeAnswer = answerForm.value.answer;
  }

  prevPage() {
    this.counts = 1;
  }

  nextPage() {
    this.counts = 2;
  }
}
