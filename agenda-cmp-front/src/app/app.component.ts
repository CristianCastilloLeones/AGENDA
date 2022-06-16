import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatDialog } from '@angular/material';
import { UserOptionsComponent } from './dialogs/user-options/user-options.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
    .pipe(
      map(result => result.matches)
    );
  loggedIn: Observable<boolean>;

  items: { link: string, name: string, icon: string, menuLabel: boolean }[] = [];
  user: { name: string, surname: string };
  role: string | number;
  constructor(private breakpointObserver: BreakpointObserver,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog) {

    this.router.events.subscribe(res => {
      if (res instanceof NavigationEnd) {
        this.loggedIn = new Observable((obs) => {
          obs.next(res.url === '/login');
          obs.complete();
          // return {unsubscribe() {}};
        });
      }
      this.loadSidenav();
    });
  }

  loadSidenav() {
    const role = localStorage.getItem('role');
    this.role = role;
    if (role === '3' || role === '5') {
      this.items = [
        { link: '#', name: 'Procesos', icon: 'arrow_right', menuLabel: true },
        { link: '/citas', name: 'Citas', icon: 'assignment', menuLabel: false },
        { link: '/usuarios/consultas', name: 'Historial', icon: 'history', menuLabel: false },
        { link: '/papanicolaou', name: 'Ver Papanicolaou', icon: 'list', menuLabel: false }
      ];
    } else if (role === '2') {
      this.items = [
        { link: "#", name: "Procesos", icon: "arrow_right", menuLabel: true },
        { link: "/citas", name: "Citas", icon: "assignment", menuLabel: false },
        {
          link: "/usuarios/consultas",
          name: "Historial",
          icon: "history",
          menuLabel: false,
        },
        {
          link: "/papanicolaou/crear",
          name: "Papanicolaou",
          icon: "list",
          menuLabel: false,
        },
        // { link: "/receta", name: "Receta", icon: "receipt", menuLabel: false },
        { link: "#", name: "Usuarios", icon: "arrow_right", menuLabel: true },
        {
          link: "/usuarios",
          name: "Pacientes",
          icon: "person",
          menuLabel: false,
        },
      ];
    } else if (role === '4') {
      this.items = [
        { link: "#", name: "Procesos", icon: "arrow_right", menuLabel: true },
        {
          link: "/home",
          name: "Reportes",
          icon: "dashboard",
          menuLabel: false,
        },
        { link: "/citas", name: "Citas", icon: "assignment", menuLabel: false },
        {
          link: "/ecografia/crear",
          name: "Ecografias",
          icon: "personal_video",
          menuLabel: false,
        },
        {
          link: "/laboratorio/crear",
          name: "Laboratorios",
          icon: "biotech",
          menuLabel: false,
        },
        /* {
          link: "/papanicolaou/crear",
          name: "Papanicolaou",
          icon: "list",
          menuLabel: false,
        }, */
        { link: "/receta", name: "Receta", icon: "receipt", menuLabel: false },
        { link: "#", name: "Usuarios", icon: "arrow_right", menuLabel: true },
        {
          link: "/usuarios",
          name: "Usuarios",
          icon: "person",
          menuLabel: false,
        },
        {
          link: "#",
          name: "Configuración",
          icon: "arrow_right",
          menuLabel: true,
        },
        {
          link: "/horario",
          name: "Horarios",
          icon: "add_alarm",
          menuLabel: false,
        },
      ];
    } else if (role === '6') {
      this.items = [
        {
          link: "/ecografias",
          name: "Ecografias",
          icon: "personal_video",
          menuLabel: false,
        },
      ];
    }
    else if (role === '7') {
      this.items = [
        {
          link: "/laboratorios/list",
          name: "Laboratorios",
          icon: "biotech",
          menuLabel: false,
        },
      ];
    } else {
      this.items = [

        { link: '#', name: 'Procesos', icon: 'arrow_right', menuLabel: true },
        { link: '/home', name: 'Dashboard', icon: 'dashboard', menuLabel: false },
        { link: '/citas', name: 'Citas', icon: 'assignment', menuLabel: false },
        { link: '/usuarios/consultas', name: 'Historial', icon: 'history', menuLabel: false },
        { link: '/ecografia/crear', name: 'Ecografias', icon: 'personal_video', menuLabel: false },
        { link: '/receta', name: 'Receta', icon: 'receipt', menuLabel: false },
        { link: '/laboratorios/list', name: 'Laboratorios', icon: 'biotech', menuLabel: false },
        // { link: '/papanicolaou/crear', name: 'Papanicolaou', icon: 'list', menuLabel: false },
        { link: '#', name: 'Usuarios', icon: 'arrow_right', menuLabel: true },
        { link: '/usuarios', name: 'Usuarios', icon: 'person', menuLabel: false },
        { link: '#', name: 'Configuración', icon: 'arrow_right', menuLabel: true },
        { link: '/horario', name: 'Horarios', icon: 'add_alarm', menuLabel: false },
        { link: '/no-laborables', name: 'No laborables', icon: 'event_busy', menuLabel: false },
       // { link: '/convenios', name: 'Convenios', icon: 'layers', menuLabel: false },
        { link: '/especialidades', name: 'Especialidades', icon: 'category', menuLabel: false },

      ];
    }
  }

  userName() {
    const u = localStorage.getItem('user');
    if (u) {
      const user = JSON.parse(localStorage.getItem('user'));
      return `${user.name} ${user.surname}`;
    }
    return '';
  }

  editUser() {
    const userData: Object = JSON.parse(localStorage.getItem('user'));
    const d = this.dialog.open(UserOptionsComponent, {
      data: userData,
      width: '450px'
    });
    d.afterClosed()
      .subscribe(res => {
        console.log(res);
      }, error => {
        console.log(error);
      });
  }

  logout() {
    this.authService.logout()
      .subscribe(res => {
        this.router.navigate(['/login']);
        localStorage.clear();
      }, error => {
        this.router.navigate(['/login']);
        localStorage.clear();
      });
  }

}

