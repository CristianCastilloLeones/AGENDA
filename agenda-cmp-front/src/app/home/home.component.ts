import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ChartService } from '../services/chart.service';
import { UserService } from '../services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit{
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Citas', cols: 2, rows: 1 },
          { title: 'Tipos de Ingresos', cols: 2, rows: 1 },
          { title: 'Especialidades más solicitadas', cols: 2, rows: 1 }
        ];
      }

      return [
        { title: 'Citas', cols: 2, rows: 1 },
        { title: 'Tipos de Ingresos', cols: 1, rows: 2 },
        { title: 'Especialidades más solicitadas', cols: 1, rows: 2 }
      ];
    })
  );

  avg: any = 0;
  users: any;
  canSearch: boolean = true;
  user: any;
  downloading: boolean = false;
  eventCounter = {
    done: 0,
    todo: 0,
    canceled: 0
  };

  constructor(
    private breakpointObserver: BreakpointObserver,
    private chartService: ChartService,
    private userService: UserService) {
    
  }

  ngOnInit() {
    this.getAvg();
    this.getOrigin();
    this.getMonthlyEvts();
    this.getDocs();
    this.getHotSpecialties();
    this.eventsByStatus();
  }

  search() {
    let usr = this.user;
    if (!usr) {
      this.getAvg();
      this.getMonthlyEvts();
      return;
    }
    this.getAvg(usr.id);
    this.getMonthlyEvts(usr.id);
  }

  getOrigin() {
    this.chartService.usersOrigin()
      .subscribe((res: any[]) => {
        res.forEach(val => {
          if (val.origin == 5) this.doughnutChartData[0] = val.total;
          if (val.origin == 2) this.doughnutChartData[1] = val.total;
          if (val.origin == 4) this.doughnutChartData[2] = val.total;
        });
        this.doughnutChartData = [...this.doughnutChartData];
      }, error => {
        console.log(error);
      });
  }

  getAvg(user = null) {
    this.avg = 0;

    this.chartService.getAverage(user)
      .subscribe((res: { avg: number }) => {
        this.avg = res.avg.toFixed(2);
      }, error => {
        console.log(error);
      });
  }

  eventsByStatus() {
    this.chartService.eventCountByStatus()
      .subscribe(res => {
        this.eventCounter = {
          todo: res["todo"].total,
          done: res["done"].total,
          canceled: res["cancelled"].total
        };
      }, error => {
        console.log(error)
      });
  }

  getMonthlyEvts(user = null) {

    this.chartService.getMonthlyEvents(user)
      .subscribe((res: any[]) => {

        let lineData = this.lineChartData;
        let labels = [];

        lineData[0].data = [];
        lineData[1].data = [];
        lineData[2].data = [];

        res.forEach(val => {
          if (val.status == 4) {
            let elpos = labels.indexOf(val.day);
            if (elpos > -1) {
              lineData[0].data[elpos] = val.data;
            } else {
              lineData[0].data.push(val.data);
              lineData[1].data.push(0);
              lineData[2].data.push(0);
            }
          }

          if (val.status == 2) {
            let elpos = labels.indexOf(val.day);
            if (elpos > -1) {
              lineData[1].data[elpos] = val.data;
            } else {
              lineData[0].data.push(0);
              lineData[1].data.push(val.data);
              lineData[2].data.push(0);
            }
          }

          if (val.status == 5) {
            let elpos = labels.indexOf(val.day);
            if (elpos > -1) {
              lineData[2].data[elpos] = val.data;
            } else {
              lineData[0].data.push(0);
              lineData[1].data.push(0);
              lineData[2].data.push(val.data);
            }
          }

          if (!labels.includes(val.day))
            labels.push(val.day);

        });

        this.lineChartData = lineData;
        this.lineChartLabels = labels;
      }, error => {
        console.log(error);
      });
  }

  getHotSpecialties() {

    this.chartService.hotSpecialties()
      .subscribe((res: any[]) => {
        let labels = [];
        let xdata = this.radarChartData;
        res.forEach(value => {
          labels.push(value.sp);
          xdata[0].data.push(value.data);
        });
        this.radarChartData = xdata;
        this.radarChartLabels = labels;
      }, error => {
        console.log(error);
      });

  }

  getDocs() {

    this.userService.getAllDocs()
      .subscribe(res => {
        this.users = res;
      }, error => {
        console.log(error);
      });
      
  }

  // Doughnut
  public doughnutChartLabels: string[] = ['Auto registro', 'Registrado por medico', 'Registrado por asistente'];;
  public doughnutChartData: number[] = [0, 0, 0];
  public doughnutChartType: string = 'doughnut';

  //Radar
  public radarChartLabels: string[] = [];

  public radarChartData: any = [
    { data: [], label: 'Citas agendadas' },
  ];
  public radarChartType: string = 'radar';

  public lineChartData: Array<any> = [
    {
      data: [],
      label: 'Atendidas',
      fill: false
    },
    {
      data: [],
      label: 'Canceladas',
      fill: false
    },
    {
      data: [],
      label: 'Paciente no asistió',
      fill: false
    }
  ];

  public lineChartColors: Array<any> = [
    {
      backgroundColor: '#5fa910',
      borderColor: '#5fa910'
    },
    {
      backgroundColor: '#a10050',
      borderColor: '#a10050'
    },
    {
      backgroundColor: '#ff0000',
      borderColor: '#ff0000'
    }
  ];

  public lineChartLabels: Array<any> = [];

  public lineChartType: string = 'line';

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  switchReport(type) {
    switch (type) {
      case 0: this.evntsReport(); break;
      case 1: this.usersReport(); break;
      default: this.evntsReport(); break;
    }
  }

  usersReport() {
    this.downloading = true;
    this.chartService.usersReport(3)
      .subscribe((res: any) =>
        this.generateXls(res, 'pacientes')
        , error => {
          console.log(error);
          this.downloading = false;
        });
  }

  evntsReport() {
    this.downloading = true;
    this.chartService.eventsReport(this.user)
      .subscribe((res: any) =>
        this.generateXls(res, 'citas')
        , error => {
          console.log(error);
          this.downloading = false;
        });
  }

  generateXls(res: any, filename: string, _this = this) {
    let _blob = new Blob([res], { type: 'application/vnd.ms-excel' });
    var url = window.URL.createObjectURL(_blob);
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = `r-${filename}.xls`;
    a.click();
    window.URL.revokeObjectURL(url);
    _this.downloading = false;
  }
}
