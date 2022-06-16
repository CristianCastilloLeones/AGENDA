import { Component, OnInit, Input } from '@angular/core';
import { ConsultaService } from '../../services/consulta.service';
import { EventService } from '../../services/event.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { generatePDF } from '../../dialogs/diag-report/diag-report.component';

@Component({
  selector: 'app-diet',
  templateUrl: './diet.component.html',
  styleUrls: ['./diet.component.css']
})
export class DietComponent implements OnInit {

  diet: string;
  @Input() patient: any;
  disableButton = false;

  constructor(
    private consultaService: ConsultaService,
    private eventService: EventService
  ) {}

  save() {
    console.log(this.diet);
    this.disableButton = true;
    this.diet = this.diet.replace(/\r?\n/g, '<br />');
    this.consultaService.setDiet({
      diet: this.diet,
      patient: this.patient.id
    }).subscribe(res => {
      new SwalComponent({ type: 'success', toast: true, html: '<p>Procesado correctamente</p>', timer: 2000 })
        .show();
        this.printDiet(res["id"]);
        this.diet = '';
        this.disableButton = false;
    }, error => {
      this.disableButton = false;
      new SwalComponent({ type: 'error', toast: true, html: '<p>Ha ocurrido un error</p>', timer: 3000 })
        .show();
    });
  }

  printDiet(id: number | string) {
    this.eventService.downloadDiet(id)
      .subscribe(res => generatePDF(res, 'diet'),
        error => {
          console.log(error);
        });
  }

  ngOnInit() {
  }

}
