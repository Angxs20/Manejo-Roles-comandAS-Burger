
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MenuComponent } from './menu/menu.component';
import {MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { LocalstorageService } from '../services/localstorage.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileEditorComponent } from './profile-editor/profile-editor.component'; 

@Component({
  selector: 'app-private',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './private.component.html',
  styleUrl: './private.component.scss'
})
export class PrivateComponent {
  private _localstorage: LocalstorageService = inject(LocalstorageService);
  private _router: Router = inject(Router);
  private _dialog: MatDialog = inject(MatDialog); 

  user: string = '';
  rol: number = 0;

  ngOnInit() {
    const userData = this._localstorage.getItem('user');
    this.user = userData.name;
    this.rol = userData.rol;
  }

  logOut() {
    this._localstorage.removeItem('user');
    this._router.navigate(['auth/sign-in']);
  }

  // Función para abrir el modal de perfil
  openProfile() {
    const userData = this._localstorage.getItem('user');
    const dialogRef = this._dialog.open(ProfileEditorComponent, {
      data: userData, 
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Si guardó cambios, actualizamos el nombre en la barra superior
        this.user = this._localstorage.getItem('user').name;
      }
    });
  }
}