import { Component } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';

export interface Month {
	id: number;
	name: string;
}

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.css']
})
export class HolidayComponent{

	selectedMonth : Month;
	monthDays : any;
	days : any;
	processing: boolean = false;

  constructor(private configService : ConfigService) { 
  	this.processing = true;
  	this.configService.getHolidays()
  	.subscribe((res:any) => {
  		this.processing = false;
  		this.days = res;
  	}, error => {
  		this.processing = false;
  		console.log(error);
  	});
  }

  save(){
  	if(this.days.length < 0 ) return;
  	let data = this.days.map((v) => {
  		return v.value;
  	});
  	this.processing = true;
  	this.configService.setHolidays(data)
  		.subscribe(res => {
  			this.processing = false;
  			new SwalComponent({type:'success', position:'bottom-right', html:'<p>Guardado.<p>', toast:true, timer:3000}).show();
  		}, error => {
  			this.processing = false;
  			new SwalComponent({type:'error', position:'bottom-right', html:'<p>Ha ocurrido un error.<p>', toast:true, timer:4500}).show();
  		});
  }

  monthChanged(event){
  	this.daysInMonth(event.id);
  }

	daysInMonth(iMonth)
	{
		let totalDays = 32 - new Date(2018, iMonth, 32).getDate();
		let days = [];
		for (var i = 0; i < totalDays; ++i) {
			days.push({value: {day: i+1, month:iMonth}, label: `${this.months[iMonth].name}-${i+1}`});
		}
		this.monthDays = days;
	}

	months : Month[] = [
		{id:0, name:'Enero'},
		{id:1, name:'Febrero'},
		{id:2, name:'Marzo'},
		{id:3, name:'Abril'},
		{id:4, name:'Mayo'},
		{id:5, name:'Junio'},
		{id:6, name:'Julio'},
		{id:7, name:'Agosto'},
		{id:8, name:'Septiembre'},
		{id:9, name:'Octubre'},
		{id:10, name:'Noviembre'},
		{id:11, name:'Diciembre'}
	];

}
