import { Component, inject } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CurrencyPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ProviderService } from '../../services/provider.service';
import { Router, RouterLink } from '@angular/router';
import { WebSocketsService } from '../../services/web-sockets.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalstorageService } from '../../services/localstorage.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-order-view',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatFormFieldModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterLink,
    MatIconModule
  ],
  templateUrl: './order-view.component.html',
  styleUrl: './order-view.component.scss',
})
export class OrderViewComponent {

  private _provider: ProviderService = inject(ProviderService);
  private _router: Router = inject(Router);
  public _order: OrderService = inject(OrderService);
  private _wsService: WebSocketsService = inject(WebSocketsService);
  private _snackBar: MatSnackBar = inject(MatSnackBar);
  private _localStorage: LocalstorageService = inject(LocalstorageService);

  async ngOnInit() {
  }


  generateUUID() {
    var d = new Date().getTime();
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16;
      if (d > 0) {
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }
  

  filterExtras(item: any, type: 0 | 1) {
    return item.not_ingredient.filter(
      (ingredient: any) => ingredient.type == type
    );
  }

  totalProducts() {
    return this.eachProduct()
      .value.map((product: any) => product.unit_price)
      .reduce((previous: number, current: number) => previous + current, 0);
  }

  totalExtras() {
    return this.eachProduct()
      .value.map((product: any) =>
        product.not_ingredient
          .map((ingredient: any) => ingredient.price)
          .reduce((previous: number, current: number) => previous + current, 0)
      )
      .reduce((previous: number, current: number) => previous + current, 0);
  }

  totalOrder() {
    this._order.formOrder.controls['total'].patchValue(this.totalProducts() + this.totalExtras());
    return this.totalProducts() + this.totalExtras();
  }

  radioForm() {
    return this._order.formOrder.controls['order_details'] as FormGroup;
  }

  eachProduct() {
    return this._order.formOrder.controls['order_details'] as FormArray;
  }

  selected(event: MatRadioChange) {
    this.eachProduct().controls.forEach((product: AbstractControl) => {
      const productAux: FormGroup = product as FormGroup;
      productAux.controls['order_type'].patchValue(event.value);
    });
  }

  //En este metodo declaro las opciones dentro del formulario para rellenar la orden mas alla de los espacios elegidos
async placeOrder() {
    console.log('--- INTENTANDO ORDENAR (DEBUG AVANZADO) ---');
    
    // 1. ASEGURAR DATOS DE USUARIO Y ORIGEN
    this._order.formOrder.controls['users_idusers'].patchValue(this._localStorage.getItem('user').idusers);
    this._order.formOrder.controls['origin'].patchValue('Web');
    
    // 2. FORZAR CÁLCULO DEL TOTAL 
    const calculatedTotal = this.totalProducts() + this.totalExtras();
    this._order.formOrder.controls['total'].patchValue(calculatedTotal);

    // 3. GENERAR UUIDs Y FECHA
    const orderUUID = this.generateUUID();
    this._order.formOrder.controls['idorder'].patchValue(orderUUID);
    this._order.formOrder.controls['date'].patchValue(new Date().toISOString().slice(0, 19).replace('T', ' '));
    this._order.formOrder.controls['status'].patchValue(0);

    // 4. GENERAR IDs PARA DETALLES
    const detailsControl = this._order.formOrder.controls['order_details'] as FormArray;
    detailsControl.controls.forEach((control: AbstractControl) => {
        const group = control as FormGroup;
        group.controls['idorderdetail'].patchValue(this.generateUUID());
        group.controls['order_idorder'].patchValue(orderUUID);
    });

    // 5. DIAGNÓSTICO PROFUNDO o ALERTAS EN LA CONSOLA
    const isFormValid = this._order.formOrder.valid;
    const isSocketConnected = this._wsService.socketStatus;

    console.log('Estado del Formulario:', isFormValid ? 'VALIDO' : 'INVALIDO');
    console.log('Valor Total Calculado:', this._order.formOrder.get('total')?.value);
    
    if (!isFormValid) {
       
        Object.keys(this._order.formOrder.controls).forEach(key => {
            const errors = this._order.formOrder.get(key)?.errors;
            if (errors) console.error(`Error en campo principal [${key}]:`, errors);
        });

        // Revisar Array de Productos 
        const products = this._order.formOrder.get('order_details') as FormArray;
        products.controls.forEach((productGroup: AbstractControl, index) => {
            const group = productGroup as FormGroup;
            if (group.invalid) {
                console.error(`Error en Producto #${index + 1} (${group.get('name')?.value}):`);
                Object.keys(group.controls).forEach(key => {
                    if (group.get(key)?.errors) {
                        console.error(` - Campo [${key}]:`, group.get(key)?.errors);
                    }
                });
            }
        });
        
        this._snackBar.open("Faltan datos en el formulario. Revisa la consola (F12).", "", { duration: 4000 });
        return; 
    }

   
    if (isSocketConnected) {
      try {
        var data = await this._provider.request('POST', 'order/createOrder', this._order.formOrder.value);
        
        if (data) {
          let nStatus: object = {
             "idorder": orderUUID,
             "client": this._order.formOrder.get('client')?.value,
             "total": this._order.formOrder.get('total')?.value,
             "mes": new Date().getMonth() + 1,
             "comments": this._order.formOrder.get('comments')?.value,
             "status": 0,
             "users_idusers": this._localStorage.getItem('user').idusers
           };

          await this._wsService.request('comandas', nStatus);
          
          this._snackBar.open("Orden realizada con éxito", "", { duration: 3000, verticalPosition: 'top' });
          
          const rol = this._localStorage.getItem('user').rol;
          

          if(rol === 3) {
             this._router.navigate(['private/client-orders']);
          } else {
             this._router.navigate(['private/orders-view']);
          }
          
        
          this._order.formOrder.reset();
          while (this.orderDetailsArray().length !== 0) {
            this.orderDetailsArray().removeAt(0);
          }
        } else {
          this._snackBar.open("Error al guardar en base de datos", "", { duration: 3000, verticalPosition: 'top' });
        }

    } catch (error) {
    console.error("EL BACKEND RESPONDIÓ UN ERROR:", error); 
    this._snackBar.open("Error al procesar la orden. Revisa la consola.", "", { duration: 3000 });
    } 
    
    } else {
      this._snackBar.open("No hay conexión con el servidor (Socket)", "", { duration: 3000, verticalPosition: 'top' });
    }
  }

  orderDetailsArray() {
    return this._order.formOrder.controls['order_details'] as FormArray;
  }

  deleteProduct(index: number) {
    this.eachProduct().removeAt(index);
  }
}