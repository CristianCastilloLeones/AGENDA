import { Component, OnInit, Injectable } from '@angular/core';
import { SchedulesService } from '../../../services/schedules.service';
import { UserService } from '../../../services/users.service';
import { TimeBlock, Schedule } from "../../../interfaces/models";
import { FormControl } from '@angular/forms';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schedule-config',
  templateUrl: './schedule-config.component.html',
  styleUrls: ['./schedule-config.component.css']
})

@Injectable()
export class ScheduleConfigComponent implements OnInit {

	timeblocks : TimeBlock[];
	dow : string[] = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];
  weekSchedule = {1:[],2:[],3:[],4:[],5:[],6:[],7:[]};
  user = new FormControl(null);
  users;
  processing : boolean = false;
  selectCount:number=0;

  constructor(
  	private scheduleService : SchedulesService,
    private userService : UserService,
    private router: Router
  	) { 
      this.users = [];
  	 }

  ngOnInit() {
  	this.getTimeTables();
    this.getDocs();
  }

	updateSchedule(event){
    let ws = [];
		ws = event.schedule;
		ws.sort((a,b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0));
	  this.weekSchedule[event.id] = ws;
  }

  getTimeTables(){
    let blocks = localStorage.getItem("timeblocks");
    if(blocks){
      this.timeblocks = JSON.parse(blocks);
      return;
    }
  	this.scheduleService.getTimeBlocks()
  		.subscribe((tb:TimeBlock[]) => {
  			this.timeblocks = tb;
        localStorage.setItem("timeblocks", JSON.stringify(tb));
  		});
  }

  getDocs(){
    this.processing = true;
    this.userService.getAllDocs()
      .subscribe(res => {
        this.users = res;
        this.processing = false;
      }, error => {
        console.log(error);
        this.processing = false;
      });
  }

  search(){
    this.processing = true;
    if(!this.user.value.id) return;
    this.weekSchedule = {1:[],2:[],3:[],4:[],5:[],6:[],7:[]};
    this.scheduleService.getSchedule(this.user.value.id)
      .subscribe((res:any) => {
        this.processing = false;
        if(res.length > 0){
          for (let object of res) {
            this.weekSchedule[object.dow].push({time:object.time.id, dow:object.dow});
          }
        }else{
          this.weekSchedule = {1:[],2:[],3:[],4:[],5:[],6:[],7:[]};
        }
      },
       error => {
        this.processing = false;
      });
  }

  save(){
    this.processing = true;
    if(!this.user.value) return;
    if(JSON.stringify(this.weekSchedule) == "{1:[],2:[],3:[],4:[],5:[],6:[],7:[]}") return;
    this.scheduleService.saveSchedule(this.weekSchedule, this.user.value)
    .subscribe(res => {
      this.processing = false;
      new SwalComponent({type:'success', html:'<p>Horario actualizado.</p>', timer:2500}).show();
    }, error => {
      this.processing = false;
      new SwalComponent({type:'error', html:'<p>Ha ocurrido un error al actualizar.</p>', timer:3000}).show();
    });    
  }

  fakeReload(){
    if(this.selectCount < 2){
      console.log(this.selectCount);
      this.selectCount++;
      return;
    }else{
      this.router.navigateByUrl('/home', {skipLocationChange: true}).then(()=>
      this.router.navigate(["/horario"]));
    }
  }

}
