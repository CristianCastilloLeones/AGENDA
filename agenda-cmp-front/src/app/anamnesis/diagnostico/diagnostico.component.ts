import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime, switchMap, finalize, tap, toArray } from 'rxjs/operators';
import { ConsultaService } from '../../services/consulta.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { generatePDF } from 'src/app/dialogs/diag-report/diag-report.component';
import { EventService } from 'src/app/services/event.service';
import { UserService } from 'src/app/services/users.service';
import { NewPatientComponent } from "src/app/dialogs/new-patient/new-patient.component";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";

@Component({
  selector: "app-diagnostico",
  templateUrl: "./diagnostico.component.html",
  styleUrls: ["./diagnostico.component.css"],
})
export class DiagnosticoComponent implements OnInit {
   pacientes: any[];
  consultaForm: FormGroup;
  recetaForm: FormGroup;
  loadCie = false;
  clearCie = false;
  products: any[];
  filteredProducts: any[];
  paciente: any;
  cie10: any;
  recipeData = [];
  recipeObs = "";
  patients: any[] = [];
  outside: boolean;
  descripciones = [
    {
      placeholder: "Descripción",
      controlText: "descripcion",
      controlPre: "pre",
      controlDef: "def",
      controlCie: "cie",
    },
  ];

  receta = [
    {
      cie10: "",
      descripcion: "",
      cantidad: "",
      prescripcion: "",
      p_unit: "",
      total: "",
    },
  ];

  patient: any;
  processing: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private consultaService: ConsultaService,
    private eventService: EventService,
    private userService: UserService,
    private dialog: MatDialog
  ) {
    this.buildForm();

    this.outside = window.location.pathname == "/receta";
    if (this.outside) {
      this.consultaForm.addControl("patient", new FormControl(null));
      this.getPatients();
    }

    this.consultaService.recipeStream().subscribe(
      (res) => {
        this.recipeData.push(res);
        this.recipeObs = res.observation;
      },
      (error) => {
        console.log(error);
      }
    );

    this.consultaService.itemDeleted().subscribe((index) => {
      this.recipeData.splice(index, 1);
    });

    this.consultaForm
      .get("descripcion")
      .valueChanges.pipe(
        debounceTime(1000),
        tap((v) => {
          this.loadCie = v.length > 3;
        }),
        switchMap((value) => {
          return value.length > 3 ? this.consultaService.filterCie(value) : [];
        }),
        finalize(() => (this.loadCie = false))
      )
      .subscribe(
        (data) => {
          this.loadCie = false;
          this.cie10 = data;
          this.clearCie = true;
        },
        (error) => {
          this.loadCie = false;
        }
      );
  }

  getPatients() {
    this.userService.getPatients().subscribe(
      (res: any[]) => {
        let patients = res;

        patients = patients.map((val) => {
          val.fullName = val.name + " " + val.surname;
          return val;
        });

        this.pacientes = patients;

        if (this.patient) {
          let p =
            patients[
              patients.findIndex((el) => {
                return el.id == this.patient.id;
              })
            ];
          //this.ecoRegForm.get("patient").setValue(p);
          document
            .getElementById("patient-text")
            .setAttribute("readonly", "readonly");
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  confirmSave() {
    if (this.recipeData.length < 0) return;
    new SwalComponent({
      type: "question",
      html: `<p>¿Desea procesar la receta?</p>`,
      showCancelButton: true,
      cancelButtonText: "NO",
      confirmButtonText: "SI",
    })
      .show()
      .then((res) => {
        if (res.dismiss) return;
        this.saveRecipe();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  saveRecipe() {
    var total:number = 0.0;

    for (let i = 0; i < this.recipeData.length; i++) {
      total += Number(this.recipeData[i]["subtotal"]);
    }

    let d = {
      recipeData: this.recipeData,
      recipeObs: this.recipeObs,
      labData: {},
      total: total,
      patient: this.consultaForm.get("patient").value,
      event: 0,
      doc: 1,
    };

    this.processing = true;
    this.consultaService.checkRecipeByPatientToday(d).subscribe(
      (res: any) => {
        this.processing = false;
        console.log(res);
        if (res != null) {
          if (res["products[]"].length > 0) {
            var productos: string = ""; //arreglo que tendrá los mensajes recorridos
            res["products[]"].forEach((element) => {
              productos +=
                "-" +
                element.product_name +
                " <small>(" +
                element.quantity +
                ")</small><br>";
            });

            return new SwalComponent({
              type: "info",
              html: `<h3>Ya se realizó una receta con información similar!</h3>
            <center><table><tr><td>Paciente:</td> <td>${res.patient}</td></tr>
            <tr><td>Fecha:</td> <td>${res.date}</td></tr>
            <tr><td>Productos:</td> <td>${productos}</td></tr></table></center>
            <hr>
            <strong>Si desea confirmar la receta haga clic en SI, caso contrario NO para cancelar.</strong>`,
              showCancelButton: true,
              confirmButtonText: "SI",
              cancelButtonText: "NO",
            })
              .show()
              .then((r) => {
                if (r.dismiss) {
                  return;
                }

                this.confirmRecipe(d);
              });
          } else {
            this.confirmRecipe(d);
          }
        } else if (res == null) {
          this.confirmRecipe(d);
        }
      },
      (error) => {
        //console.log(error);

        new SwalComponent({
          type: "error",
          html: "<p>Ha ocurrido un error.</p>",
          timer: 1500,
        }).show();
      }
    );
  }
  confirmRecipe(d) {
    console.log(d);
    this.processing = true;
    this.consultaService.saveDiagnostico(d).subscribe(
      (res) => {
        new SwalComponent({
          toast: true,
          type: "success",
          timer: 1800,
        }).show();
        this.processing = false;
        this.eventService
          .downloadRecipe(res["receta"].id)
          .subscribe(generatePDF, (error) => {
            console.log(error);
          });
      },
      (error) => {
        this.processing = false;
        new SwalComponent({
          html: "<p>Error al procesar.</p>",
          type: "error",
          position: "bottom-right",
          toast: true,
          timer: 1500,
        }).show();
      }
    );
  }
  calcTotal() {
    const e = this.recetaForm.get("receta").value;

    let match = e.match(/\d+?\./) || [""];
    let id = "0";

    if (match[0].length < 1) return;
    else id = match[0].replace(".", "");

    let value = this.products.filter((v) => {
      if (v.id == id) {
        return v;
      }
    });

    value = value[0];
    if (value === undefined) return;
    const unit_price = value ? value["unit_price"] : 0;

    this.recetaForm
      .get("quantity")
      .setValidators([Validators.max(value["quantity"])]);
    this.recetaForm.get("unit_price").setValue(unit_price);
    const quantity = this.recetaForm.get("quantity").value;

    this.recetaForm
      .get("subtotal")
      .setValue(((unit_price || 0) * quantity).toFixed(2));
    this.recetaForm.get("product").setValue(value);
  }

  searchProduct(e: string) {
    e = e.toLowerCase();

    const filter = this.products.filter((p) => {
      if (
        p.name != null &&
        p.generic != null &&
        (p.name.toLowerCase().includes(e) ||
          p.generic.toLowerCase().includes(e))
      ) {
        return p;
      }
    });

    this.filteredProducts = filter;
  }

  addRecItem() {
    if (!this.recetaForm.value.product.id) return;
    this.consultaService.pushRecItem(
      this.recetaForm.value,
      this.consultaForm.value
    );
    this.recetaForm.get("prescripcion").reset();
    this.recetaForm.get("subtotal").reset();
    this.recetaForm.get("unit_price").reset();
    this.recetaForm.get("receta").reset();
    this.recetaForm.get("quantity").reset();
    this.recetaForm.get("cie").reset();
    this.recetaForm.get("observation").reset();
    this.recetaForm.get("product").reset();
    //this.consultaForm.get('descripcion').setValue(null);
    this.recetaForm.get("facturar").setValue(true);
    this.cie10 = [];
  }

  buildForm() {
    this.consultaForm = this.formBuilder.group({
      motivo_a: new FormControl({ value: null, disabled: false }),
      motivo_b: new FormControl({ value: null, disabled: false }),
      motivo_c: new FormControl({ value: null, disabled: false }),
      motivo_d: new FormControl({ value: null, disabled: false }),

      descripcion: new FormControl({ value: null, disabled: false }),
      pre: new FormControl({ value: true, disabled: false }),
      def: new FormControl({ value: false, disabled: false }),
    });

    this.recetaForm = this.formBuilder.group({
      cie: new FormControl({ value: null, disabled: false }),
      receta: new FormControl(
        { value: null, disabled: true },
        Validators.required
      ),
      quantity: new FormControl(
        { value: null, disabled: true },
        Validators.required
      ),
      unit_price: new FormControl(
        { value: 0, disabled: true },
        Validators.required
      ),
      prescripcion: new FormControl(
        { value: null, disabled: false },
        Validators.required
      ),
      convenio: new FormControl({ value: false, disabled: false }),
      facturar: new FormControl({ value: true, disabled: true }),
      subtotal: new FormControl({ value: 0, disabled: true, readOnly: true }),
      observation: new FormControl({ value: null, disabled: false }),
      diet: new FormControl({ value: null, disabled: false }),
      product: this.formBuilder.group({
        id: new FormControl({ value: null, disabled: false }),
        generic: new FormControl({ value: null, disabled: false }),
        name: new FormControl({ value: null, disabled: false }),
        quantity: new FormControl({ value: null, disabled: false }),
        unit_price: new FormControl({ value: null, disabled: false }),
        country_tax_id: new FormControl({ value: null, disabled: false }),
      }),
    });
  }

  ngOnInit() {
    this.consultaService.getInventary().subscribe(
      (products: any[]) => {
        console.log(products)
        this.products = products;
        this.recetaForm.get("receta").enable();
        this.recetaForm.get("subtotal").enable();
        this.recetaForm.get("quantity").enable();
        this.recetaForm.get("unit_price").enable();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  clearCie10() {
    this.consultaForm.get("descripcion").setValue("");
    this.clearCie = false;
  }

  newPatient() {
    const d = this.dialog.open(NewPatientComponent, {
      width: "800px",
    });
    d.afterClosed().subscribe(
      (res) => {
        this.patients.push(res.user);
        this.patients = [...this.patients];
        res.user["fullName"] = res.user.name + " " + res.user.surname;
        this.paciente = res.user;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
