import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import { EventService } from '../services/event.service';
import { Options, BusinessHours } from 'fullcalendar';
import { MatDialog } from '@angular/material';
import { EventDetailComponent } from '../dialogs/event-detail/event-detail.component';
import { Router } from '@angular/router';
import { duration } from 'moment';

@Component({
	selector: 'app-consultas',
	templateUrl: './consultas.component.html',
	styleUrls: ['./consultas.component.css']
})
export class ConsultasComponent implements OnInit {

	calendarOptions: Options;
	events: any = [];
	@ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
	dateSelected: any;
	canSearch = false;
	search = '';
	processing = false;
	role = localStorage.getItem('role');

	constructor(
		private eventService: EventService,
		private router: Router,
		private dialog: MatDialog
	) {

		const role = localStorage.getItem('role');
		if (role === '1' || role === '4' || role === '5') {
			this.canSearch = true;
			this.getAll();
		} else {
			this.search = JSON.parse(localStorage.getItem('user')).dni;
			this.getFilteredEvents(this.search);
		}
		if (role === '6') this.router.navigate(['ecografias']);
		if (role === '7') this.router.navigate(['laboratorios/list']);
	}

	eventClick(e) {
		const d = this.dialog.open(EventDetailComponent, {
			data: e,
			width: '750px'
		});
		d.afterClosed()
			.subscribe(function (res: any) {
				if (res.reload) {
					this.getAll();
				}
			}.bind(this), error => {
				console.log(error);
			});
	}

	eventSelect(e) {
		this.dateSelected = e.detail;
	}

	ngOnInit() {
		this.getFilteredEvents();
	}

	setOptions(events) {
		const availableSlots: BusinessHours[] = [
			{ dow: [1, 2, 3, 4, 5, 6, 0], start: '07:00', end: '21:00' },
		];
  console.log(events)
		this.calendarOptions = {
			editable: false,
			selectable: true,
			eventLimit: false,
			locale: 'es',
			minTime: duration('07:00:00'),
			maxTime: duration('21:00:00'),
			allDaySlot: true,
			allDayText: 'Hoy',
      defaultView: 'listDay',
			businessHours: availableSlots,
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,listDay'
			},
			buttonText: {
				today: 'Hoy',
				list: 'Diario',
				month: 'Mes',
				week: 'Semanal',
				day: 'Día'
			},
			noEventsMessage: 'No hay citas este día.',
			height: 550,
      events: events,
      eventRender: function(event, element) {

        // To append if is assessment
        if(event.description != '' && typeof event.description  !== "undefined")
        {
            element.find(".fc-event-title").append("<br/><b>"+event.description+"</b>");
        }
    }
		};
	}

	filterEvents(hex) {
		let events = this.events.filter(e => {
			if(e.color === hex) console.log(e.status);
			return e.color === hex;
		});
		if (events.length < 1) { events = this.events; }
		this.ucCalendar.renderEvents(events);
	}

	add() {
		this.router.navigate(['/citas/nueva']);
	}

	getAll() {
		this.calendarOptions = undefined;
		this.processing = true;
		this.eventService.allToday()
			.subscribe((res: any) => {
        this.events = res;
        //console.log(res);
				this.setOptions(res);
				this.processing = false;
			}, error => {
				console.log(error);
				this.processing = false;
			});
	}

	getFilteredEvents(forceSearch?) {
		let ced = '';
		if (this.search.length < 3 && !forceSearch) { return; }

		ced = forceSearch || this.search;

		this.calendarOptions = undefined;
		this.processing = true;
		this.eventService.getByUsers(ced)
			.subscribe((res: any) => {
        console.log(res);
				this.setOptions(res);
				this.events = res;
				this.processing = false;
			}, error => {
				console.log(error);
				this.processing = false;
			});

	}

}
