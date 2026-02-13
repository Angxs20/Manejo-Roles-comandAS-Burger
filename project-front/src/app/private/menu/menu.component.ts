import { Component, ViewChild, inject, viewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ProviderService } from '../../services/provider.service';
import { Product } from '../../interfaces/product.model';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { CurrencyPipe, KeyValuePipe, NgClass, NgStyle } from '@angular/common';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Ingredient } from '../../interfaces/ingredient.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OrderService } from '../../services/order.service';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    KeyValuePipe,
    MatSelectModule,
    MatCheckboxModule,
    NgStyle,
    CurrencyPipe,
    NgClass,
    RouterLink,
    MatButtonModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  private _provider: ProviderService = inject(ProviderService)
  private _form_builder: FormBuilder = inject(FormBuilder)
  public _order: OrderService = inject(OrderService)
  private _localstorage: LocalstorageService = inject(LocalstorageService);

  @ViewChild('barraComentarios') barraComentarios!: MatDrawer;

  menu: Product[] = [];
  favorites: any[] = [];
  userId: string = '';

  async ngOnInit() {
    
    this.userId = this._localstorage.getItem('user').idusers;
    
    
    const [menuData, favData] = await Promise.all([
        this._provider.request('GET', 'menu/viewIngredients'),
        this._provider.request('GET', 'favorites/list', { iduser: this.userId })
    ]);
    
    
    const categoryNames: any = {
        'da99cc44-03a0-457a-8711-4660c3b5b45b': 'Hamburguesas',
        '64afaea8-be6c-49ae-8e99-32132dd89630': 'Alitas',
        '4716bb4e-0793-4c76-9b48-3dd8e7a9ba9a': 'Snacks',
        'cat-drinks-001': 'Bebidas'
    };

    
    this.menu = (menuData as any[]).map(p => ({
        ...p,
        name_category: categoryNames[p.category_idcategory] || 'General' 
    }));

    this.favorites = ((favData as any) || []).map((p: any) => ({
        ...p,
        name_category: categoryNames[p.category_idcategory] || 'General' 
    }));

   
    this._order.formOrder.controls['order_details'].valueChanges.subscribe(
      (value: any) => {
        if (!value.length) this.barraComentarios.close();
      }
    );

    if (this.orderDetailsArray().value.length && !this.orderEmpty()) {
      this.barraComentarios.open();
    }
  }

  filterByCategory(id_category: string): Product[] {

    return this.menu.filter(
      (product: Product) => product.category_idcategory == id_category
    );
  }

  filterByProduct(id_product: string): Product {

    return (
      this.menu.find((product: Product) => product.idproducts == id_product) ||
      ({} as Product)
    );
  }

  filterByIngredient(
    key: 'required' | 'extra',
    value: 0 | 1,
    ingredients: Ingredient[] | undefined,
    idproduct: string,
    amount: number
  ): Ingredient[] | undefined {
    const type = value == 0 ? 1 : 0;

    return ingredients?.filter(
      (ingredient: Ingredient) =>
        ingredient[key] == value &&
        !this.filterExtraExceptions(idproduct, amount, type).includes(
          ingredient.idingredients
        )
    );
  }

  addProduct(
    products_idproducts: string,
    price: number,
    name: string,
    name_category: string
  ) {
    this.barraComentarios.open();

    (this._order.formOrder.controls['order_details'] as FormArray).push(
      this._order.orderDetails(products_idproducts, price, name, name_category)
    );
    console.log(this._order.formOrder.value);
  }

  removeProduct(idproduct: string) {
    console.log(idproduct);

    const index = this._order.formOrder.controls[
      'order_details'
    ].value.findIndex(
      (product: any) => product.products_idproducts == idproduct
    );
    if (index != -1)
      (this._order.formOrder.controls['order_details'] as FormArray).removeAt(
        index
      );
    console.log(this._order.formOrder.value);
  }

  addIngredient(
    idproduct: string,
    idingredient: string,
    type: 0 | 1,
    event: any,
    amount: number,
    name: string,
    price: number
  ) {

    const index = this._order.formOrder.controls[
      'order_details'
    ].value.findIndex(
      (product: any) =>
        product.products_idproducts == idproduct && product.amount == amount
    );
    if (event) {
  
      (
        (
          (this._order.formOrder.controls['order_details'] as FormArray).at(
            index
          ) as FormGroup
        ).controls['not_ingredient'] as FormArray
      ).push(this._order.notIngredients(idingredient, type, name, price));
    } else {
  
      const indexIngredient = (
        (this._order.formOrder.controls['order_details'] as FormArray).at(
          index
        ) as FormGroup
      ).controls['not_ingredient'].value.findIndex(
        (ingredient: any) =>
          ingredient.ingredients_idingredients == idingredient
      );
      if (indexIngredient != -1)
        (
          (
            (this._order.formOrder.controls['order_details'] as FormArray).at(
              index
            ) as FormGroup
          ).controls['not_ingredient'] as FormArray
        ).removeAt(indexIngredient);
    }
  }

  filterExtraExceptions(
    idproduct: string,
    amount: number,
    type: 0 | 1
  ): string[] {
    const index = this._order.formOrder.controls[
      'order_details'
    ].value.findIndex(
      (product: any) =>
        product.products_idproducts == idproduct && product.amount == amount
    );

    return (
      (
        (this._order.formOrder.controls['order_details'] as FormArray).at(
          index
        ) as FormGroup
      ).controls['not_ingredient'] as FormArray
    ).value
      .filter((ingredient: any) => ingredient.type == type)
      .map((ingredient: any) => ingredient.ingredients_idingredients);
  }

  amount(id: string): number {
    return this._order.formOrder.controls['order_details'].value.filter(
      (product: any) => product.products_idproducts == id
    ).length;
  }

  orderDetailsArray() {
    return this._order.formOrder.controls['order_details'] as FormArray;
  }

  ingredientsSelected(index: number, type: 0 | 1, name: string) {
    return (
      (this.orderDetailsArray().at(index) as FormGroup)?.controls[
        'not_ingredient'
      ] as FormArray
    )?.value
      ?.map((ingredientSelected: any) => {
        if (ingredientSelected.type == type) return ingredientSelected.name;
        return;
      })
      .filter((id: any) => id != undefined)
      .includes(name);
  }

  orderEmpty() {
    return this.orderDetailsArray()
      .value.map((order: any) => Object.values(order))
      .flat()
      .filter((item: any) => !Array.isArray(item))
      .every((item: any) => item == null);
  }

  isFavorite(idproduct: string): boolean {
    return this.favorites.some((fav: any) => fav.idproducts === idproduct);
  }

  async toggleFavorite(idproduct: string) {
    const action = this.isFavorite(idproduct) ? 'remove' : 'add';
    
    await this._provider.request('POST', 'favorites/toggle', {
        iduser: this.userId,
        idproduct: idproduct,
        action: action
    });

   
    if (action === 'add') {
       
        const product = this.menu.find(p => p.idproducts === idproduct);
        if(product) this.favorites.push(product);
    } else {
        this.favorites = this.favorites.filter((fav: any) => fav.idproducts !== idproduct);
    }
}
}


