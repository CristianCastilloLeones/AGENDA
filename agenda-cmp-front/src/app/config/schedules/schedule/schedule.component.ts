import { Component, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { TimeBlock, Schedule} from '../../../interfaces/models';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements DoCheck{

	@Input()
	timeblocks : TimeBlock[];
  @Input()
  id : number;
  @Input()
  inSchedule;
  @Output()
  schedule : EventEmitter<any> = new EventEmitter<any>();
  _schedule;
  cantPreset : boolean = false;

  constructor() { 
  	
  }

  ngDoCheck(){
    if(this.inSchedule.length > 0){
      this.setSchedule();
      this.cantPreset = false;
    }else{
      this._schedule = [];
    }
  }

  setSchedule(){
    this.inSchedule.forEach((b) => {
      let el = document.getElementById(`block-${this.id}-${b.time - 1}`);
      this._schedule = this.inSchedule;
      el.classList.add('taken');
    });   
  }

  preset(val){
    this._schedule = val < 3 ? [] : this._schedule;
    let filter = this.timeblocks.filter((b) => {
      let el = document.getElementById(`block-${this.id}-${b.id-1}`);
      if(b.inning == val){
        !el.classList.contains('taken') ? el.classList.add('taken') : el.classList.toggle('taken');
      }else if(val == 3){
        el.classList.add('taken');
      }else{
        el.classList.remove('taken');
      }
      if(val == 3) return true;
      return  (b.inning == val);
    });

    let filterx = this._schedule;
    filterx = filter.map((arr) => {
      let idx = this.containsHour(filterx, {time : arr.id, dow : this.id});
      if(idx < 0 || val == 3){
        return {time : arr.id, dow : this.id};
      }else{
        filter.splice(idx, 1);
        return null;
      }
    });
    this._schedule = filterx;

    this._schedule = this._schedule.filter((el) => {
      return el != null || el != undefined;
    });

    this.schedule.emit({schedule : this._schedule, id : this.id});
  }

  setHour(block, id){
    document.getElementById(id).classList.toggle('taken');
    let idx = this.containsHour(this._schedule, {time : block.id, dow : this.id});
    if (idx < 0) {
      this._schedule.push({time : block.id, dow : this.id});
    }else{
      this._schedule.splice(idx, 1);
    }
    this.schedule.emit({schedule : this._schedule, id : this.id});
  }

  containsHour(a, obj) {
    var i = a.length;
    while (i--) {
       if (JSON.stringify(a[i]) == JSON.stringify(obj)) {
           return i;
       }
    }
    return -1;
}

}