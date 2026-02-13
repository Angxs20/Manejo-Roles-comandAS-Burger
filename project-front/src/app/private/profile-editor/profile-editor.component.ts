import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProviderService } from '../../services/provider.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-editor',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './profile-editor.component.html',
  styleUrl: './profile-editor.component.scss'
})
export class ProfileEditorComponent {
  private _fb = inject(FormBuilder);
  private _provider = inject(ProviderService);
  private _localStorage = inject(LocalstorageService);
  private _snackBar = inject(MatSnackBar);
  
  public dialogRef = inject(MatDialogRef<ProfileEditorComponent>);

  formProfile: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {

    // Inicializamos el formulario con los datos que recibimos del usuario actual
    this.formProfile = this._fb.group({
      name: [data.name, [Validators.required, Validators.minLength(3)]],
      phone: [data.phone, [Validators.required, Validators.pattern('^[0-9]*$')]]
    });
  }

  async saveChanges() {
    if (this.formProfile.valid) {
      try {
        const iduser = this.data.idusers;
        const body = {
          iduser: iduser,
          ...this.formProfile.value
        };

        const response = await this._provider.request('PUT', 'user/updateProfile', body);

        if (response) {
         
          const currentUser = this._localStorage.getItem('user');
          currentUser.name = this.formProfile.value.name;
          currentUser.phone = this.formProfile.value.phone;
          this._localStorage.setItem('user', currentUser);

          this._snackBar.open('Perfil actualizado correctamente', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        }
      } catch (error) {
        console.error(error);
        this._snackBar.open('Error al actualizar perfil', 'Cerrar', { duration: 3000 });
      }
    }
  }

  close() {
    this.dialogRef.close();
  }
}