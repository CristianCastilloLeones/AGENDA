import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FullCalendarModule } from 'ng-fullcalendar';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material';
import { ChartsModule } from 'ng2-charts';

import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material/material.module';
import { ConsultasComponent } from './consultas/consultas.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ScheduleComponent } from './config/schedules/schedule/schedule.component';
import { ScheduleConfigComponent } from './config/schedules/schedule-config/schedule-config.component';
import { ConsultasCreateComponent } from './consultas/consultas.create/consultas.create.component';
import { NewPatientComponent } from './dialogs/new-patient/new-patient.component';
import { EventDetailComponent } from './dialogs/event-detail/event-detail.component';
import { NewDoctorComponent } from './dialogs/new-doctor/new-doctor.component';
import { UsersComponent } from './config/users/users.component';
import { UserOptionsComponent } from './dialogs/user-options/user-options.component';
import { UsersMenuComponent } from './config/users/users-menu/users-menu.component';
import { HolidayComponent } from './config/holiday/holiday.component';
import { SpecialtiesComponent } from './config/specialties/specialties.component';
import { NewAssistantComponent } from './dialogs/new-assistant/new-assistant.component';
import { SpecialtyDetailComponent } from './dialogs/specialty-detail/specialty-detail.component';
import { HomeComponent } from './home/home.component';
import { AnamnesisComponent } from './anamnesis/anamnesis/anamnesis.component';
import { DiagnosticoComponent } from './anamnesis/diagnostico/diagnostico.component';
import { RecipeComponent } from './anamnesis/recipe/recipe.component';
import { LaboratoryComponent } from './laboratory/laboratory.component';
import { HistoryComponent } from './consultas/history/history.component';
import { DiagReportComponent } from './dialogs/diag-report/diag-report.component';
import { ReadonlyComponent } from './anamnesis/readonly/readonly.component';
import { ReadRecipeComponent } from './anamnesis/recipe/read-recipe/read-recipe.component';
import { EcografiasComponent } from './ecografias/ecografias.component';
import { EcosComponent } from './config/ecos/ecos.component';
import { EcoCreateComponent } from './ecografias/eco-create/eco-create.component';
import { EcografEditComponent } from './dialogs/ecograf-edit/ecograf-edit.component';
import { ExlabComponent } from './anamnesis/exlab/exlab.component';
import { ListLabsComponent } from './laboratory/list-labs/list-labs.component';
import { PapanicolaouComponent } from './papanicolaou/papanicolaou.component';
import { PapanicolaouCreateComponent } from './papanicolaou/papanicolaou-create/papanicolaou-create.component';
import { LabEditComponent } from './dialogs/lab-edit/lab-edit.component';
import { PapnicolaouDetailComponent } from './dialogs/papnicolaou-detail/papnicolaou-detail.component';
import { CertificadoComponent } from './anamnesis/certificado/certificado.component';
import { LabCatComponent } from './dialogs/lab-cat/lab-cat.component';
import { DietComponent } from './anamnesis/diet/diet.component';
import { InsurancesComponent } from './config/insurances/insurances.component';
import { InsuranceEditComponent } from './dialogs/insurance-edit/insurance-edit.component';
import { NewInsuranceComponent } from './dialogs/new-insurance/new-insurance.component';

import { NewAdmEmpresaComponent } from './dialogs/new-adm-empresa/new-adm-empresa.component';
import { NewAdmSucursalComponent } from './dialogs/new-adm-sucursal/new-adm-sucursal.component';
import { DerivationComponent } from './anamnesis/derivation/derivation/derivation.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'horario', component: ScheduleConfigComponent, canActivate: [AuthGuard] },
  { path: 'citas', component: ConsultasComponent, canActivate: [AuthGuard] },
  { path: 'consulta', component: AnamnesisComponent, canActivate: [AuthGuard] },
  { path: 'citas/nueva', component: ConsultasCreateComponent, canActivate: [AuthGuard] },
  { path: 'usuarios', component: UsersMenuComponent, canActivate: [AuthGuard] },
  { path: 'receta', component: DiagnosticoComponent, canActivate: [AuthGuard] },
  { path: 'ecografias', component: EcografiasComponent, canActivate: [AuthGuard] },
  { path: 'ecografia', component: EcosComponent, canActivate: [AuthGuard] },
  { path: 'ecografia/crear', component: EcoCreateComponent, canActivate: [AuthGuard] },
  { path: 'laboratorio/crear', component: ExlabComponent, canActivate: [AuthGuard] },
  { path: 'papanicolaou/crear', component: PapanicolaouCreateComponent, canActivate: [AuthGuard] },
  { path: 'usuarios/consultas', component: HistoryComponent, canActivate: [AuthGuard] },
  { path: 'historia', component: ReadonlyComponent, canActivate: [AuthGuard] },
  { path: 'laboratorios', component: LaboratoryComponent, canActivate: [AuthGuard] },
  { path: 'laboratorios/add', component: ExlabComponent, canActivate: [AuthGuard] },
  { path: 'laboratorios/list', component: ListLabsComponent, canActivate: [AuthGuard] },
  { path: 'papanicolaou', component: PapanicolaouComponent, canActivate: [AuthGuard] },
  { path: 'receta', component: ReadRecipeComponent, canActivate: [AuthGuard] },
  { path: 'no-laborables', component: HolidayComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'especialidades', component: SpecialtiesComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'convenios', component: InsurancesComponent, canActivate: [AuthGuard] },
  { path: '**', component: ConsultasComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ConsultasComponent,
    ScheduleComponent,
    ScheduleConfigComponent,
    ConsultasCreateComponent,
    NewPatientComponent,
    EventDetailComponent,
    NewDoctorComponent,
    UsersComponent,
    UserOptionsComponent,
    UsersMenuComponent,
    HolidayComponent,
    SpecialtiesComponent,
    NewAssistantComponent,
    SpecialtyDetailComponent,
    AnamnesisComponent,
    DiagnosticoComponent,
    RecipeComponent,
    LaboratoryComponent,
    HistoryComponent,
    DiagReportComponent,
    ReadonlyComponent,
    ReadRecipeComponent,
    EcografiasComponent,
    EcosComponent,
    EcoCreateComponent,
    EcografEditComponent,
    ExlabComponent,
    ListLabsComponent,
    PapanicolaouComponent,
    PapanicolaouCreateComponent,
    LabEditComponent,
    PapnicolaouDetailComponent,
    CertificadoComponent,
    LabCatComponent,
    DietComponent,
    InsurancesComponent,
    InsuranceEditComponent,
    NewInsuranceComponent,
    NewAdmEmpresaComponent,
    NewAdmSucursalComponent,
    DerivationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule,
    ChartsModule,
    FullCalendarModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    ),

    ReactiveFormsModule,
    MatNativeDateModule,
  ],
  entryComponents: [
    NewPatientComponent,
    EventDetailComponent,
    NewDoctorComponent,
    UserOptionsComponent,
    ConsultasCreateComponent,
    NewAssistantComponent,
    SpecialtyDetailComponent,
    DiagReportComponent,
    EcografEditComponent,
    LabEditComponent,
    PapnicolaouDetailComponent,
    LabCatComponent,
    PapanicolaouCreateComponent,
    InsuranceEditComponent,
    NewInsuranceComponent,
    NewAdmEmpresaComponent,
    NewAdmSucursalComponent
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-VE' }, AuthGuard, RoleGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
