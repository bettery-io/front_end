import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-events-templates',
  templateUrl: './events-templates.component.html',
  styleUrls: ['./events-templates.component.sass']
})
export class EventsTemplatesComponent implements OnInit {
  whichEvent = "makeRules"
  formData = {
    question: 'Who will be the next president of the US?',
    answers: [{ name: "Donald Trump" }, { name: "Joe Biden" }, { name: "Hilary Clinton" }],
    resolutionDetalis: 'www.cnn.com',
    whichRoom: "new",
    roomName: '',
    roomColor: 'linear-gradient(228.16deg, #54DD96 -1.47%, #6360F7 97.79%)',
    eventType: 'public',
    tokenType: "token",
    winner: "Free dinner",
    losers: "Share the bill",
    privateEndTime: "",
    publicEndTime: "",
    expertsCountType: "company",
    expertsCount: '',
    exactMinutes: new Date().getMinutes(),
    exactHour: new Date().getHours(),
    exactDay: new Date().getDate(),
    exactMonth: new Date().getMonth(),
    exactYear: new Date().getFullYear(),
    exactTimeBool: false
  }

  constructor() { }

  ngOnInit(): void {
  }

  swithToSetQuestion(data) {
    this.whichEvent = "setQuestion";
    this.formData.whichRoom = data.createNewRoom;
    this.formData.roomName = data.roomName;
    this.formData.roomColor = data.roomColor;
    this.formData.eventType = data.eventType;
  }

  swithToCreateRoom(data) {
    this.whichEvent = "createRoom";
    this.formData.question = data.question;
    this.formData.answers = data.answers;
    this.formData.resolutionDetalis = data.details;
    console.log(data);
  }

  switchToMakeRules(data) {
    this.whichEvent = "makeRules"
    this.formData.whichRoom = data.createNewRoom;
    this.formData.roomName = data.roomName;
    this.formData.roomColor = data.roomColor;
    this.formData.eventType = data.eventType;
  }

  swithToCreateRoomTab(data) {
    console.log(data);
    this.whichEvent = "createRoom";
    this.formData.exactDay = data.day;
    this.formData.exactTimeBool = data.exactTimeBool;
    this.formData.expertsCount = data.expertsCount;
    this.formData.expertsCountType = data.expertsCountType;
    this.formData.exactHour = data.hour;
    this.formData.exactMinutes = data.minute;
    this.formData.exactMonth = data.month;
    this.formData.exactYear = data.year;
    this.formData.publicEndTime = data.publicEndTime;
    this.formData.tokenType = data.tokenType;
    this.formData.winner = data.winner;
    this.formData.losers = data.losers;
    this.formData.privateEndTime = data.privateEndTime;
  }

  switchToPrivateEvent(data) {
    this.formData.winner = data.winner;
    this.formData.losers = data.losers;
    this.formData.privateEndTime = data.privateEndTime;
    this.whichEvent = "createPrivateEvent";
  }

  switchToPublicEvent(data) {
    this.formData.tokenType = data.tokenType;
    this.formData.publicEndTime = data.publicEndTime;
    this.formData.expertsCountType = data.expertsCountType;
    this.formData.expertsCount = data.expertsCount;
    this.formData.exactDay = data.day;
    this.formData.exactTimeBool = data.exactTimeBool;
    this.formData.exactHour = data.hour;
    this.formData.exactMinutes = data.minute;
    this.formData.exactMonth = data.month;
    this.formData.exactYear = data.year;
    this.whichEvent = "createPublicEvent";
  }

  switchToMakeRuleTab() {
    this.whichEvent = "makeRules";
  }

  getCircleOneStyle() {
    if (this.whichEvent === "setQuestion") {
      return { "background-color": "#FFD300" }
    } else {
      return { "background-color": "#FFFFFF" }
    }
  }

  getNumberOneStyle() {
    if (this.whichEvent === "setQuestion") {
      return { "color": "#FFFFFF" }
    } else {
      return { "color": "#FFD300" }
    }
  }

  getCircleTwoStyle() {
    if (this.whichEvent === "setQuestion") {
      return { "background-color": "#3E3E3E" }
    } else if (this.whichEvent === "createRoom") {
      return { "background-color": "#FFD300" }
    } else {
      return { "background-color": "#FFFFFF" }
    }
  }

  getNumberTwoStyle() {
    if (this.whichEvent === "setQuestion") {
      return { "color": "#7D7D7D" }
    } else if (this.whichEvent === "createRoom") {
      return { "color": "#FFFFFF" }
    } else {
      return { "color": "#FFD300" }
    }
  }

  getCircleThreeStyle() {
    if (this.whichEvent === "makeRules") {
      return { "background-color": "#FFD300" }
    } else {
      return { "background-color": "#3E3E3E" }
    }
  }

  getNumberThreeStyle() {
    if (this.whichEvent === "makeRules") {
      return { "color": "#FFFFFF" }
    } else {
      return { "color": "#7D7D7D" }
    }
  }

  vectorStyle() {
    if (this.whichEvent != "setQuestion") {
      return { "border-color": "#FFD300" }
    } else {
      return { "border-color": "#FFFFFF" }
    }
  }

}
