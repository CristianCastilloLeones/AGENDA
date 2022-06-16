import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ConfigService } from "../../services/config.service";
import { SwalComponent } from "@toverux/ngx-sweetalert2";

@Component({
  selector: "app-insurance-edit",
  templateUrl: "./insurance-edit.component.html",
  styleUrls: ["./insurance-edit.component.css"]
})
export class InsuranceEditComponent{
  canEdit: boolean = false;
  processing: boolean = false;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public insuranceData: any,
    private dialogRef: MatDialogRef<InsuranceEditComponent>,
    private configService: ConfigService,
  ) {
    
  }

}
