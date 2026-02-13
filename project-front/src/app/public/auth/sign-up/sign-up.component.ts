import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ProviderService } from '../../../services/provider.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatIconModule,
    RouterLink 
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);
  private _provider = inject(ProviderService);
  private _snackBar = inject(MatSnackBar);

  // Formulario con validaciones
  formSignUp: FormGroup = this._formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    
    rol: [3] 
  });

  async register() {
    if (this.formSignUp.invalid) {
      this.formSignUp.markAllAsTouched();
      return;
    }

    try {

      // Llamo al servicio de registro (backend)
      const response = await this._provider.request('POST', 'auth/signup', this.formSignUp.value);
      
      if (response) {
        this._snackBar.open('¡Registro exitoso! Por favor inicia sesión.', 'Cerrar', { duration: 3000 });
        this._router.navigate(['/auth/sign-in']);
      }
    } catch (error) {
      console.error(error);
      this._snackBar.open('Error al registrarse. Intenta con otro nombre.', 'Cerrar', { duration: 3000 });
    }
  }
}