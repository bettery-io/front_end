import { Component, OnInit } from '@angular/core';
import Contract from '../../services/contract';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }


  async test(){
    let contract = new Contract();
    let contr = await contract.initContract()
    let validator = await contr.methods.getFullAmount().call();
    console.log(validator)
  }

}
