import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit {
	isLoggedIn: boolean = false;

	ngOnInit(): void {
	  this.isLoggedIn = !!localStorage.getItem('jwtToken');
	}
}
