import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users-menu',
  templateUrl: './users-menu.component.html',
  styleUrls: ['./users-menu.component.css']
})
export class UsersMenuComponent implements OnInit {

	role: number = <number><any>localStorage.getItem("role");

  constructor() { }

  ngOnInit() {
  }

}
