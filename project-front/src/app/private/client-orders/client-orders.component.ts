import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { ProviderService } from '../../services/provider.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { WebSocketsService } from '../../services/web-sockets.service';
import { DatePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-client-orders',
  standalone: true,
  imports: [MatTabsModule, MatTableModule, DatePipe, CurrencyPipe],
  templateUrl: './client-orders.component.html',
  styleUrl: './client-orders.component.scss'
})
export class ClientOrdersComponent {
  private _provider: ProviderService = inject(ProviderService);
  private _localstorage: LocalstorageService = inject(LocalstorageService);
  private _wsService: WebSocketsService = inject(WebSocketsService);

  myOrders: any[] = [];
  userId: string = '';

  
  statusTabs = [
    { name: "Solicitadas", value: 0 },   // Registrada
    { name: "En Cocina", value: 1 },     // En proceso
    { name: "Listas para recoger", value: 2 }, // Lista
    { name: "Historial (Completadas)", value: 3 }, // Completada
    { name: "Canceladas", value: 4 }
  ];

  displayedColumns: string[] = ['date', 'total', 'comments', 'status'];

  async ngOnInit() {
    this.userId = this._localstorage.getItem('user').idusers;
    await this.loadOrders();
    this.listenSocket();
  }

  async loadOrders() {
    try {
      //Consulta al endpoint declarado en el backend
      this.myOrders = await this._provider.request('GET', 'order/viewOrdersByUser', { iduser: this.userId });
    } catch (error) {
      console.error("Error cargando órdenes", error);
    }
  }


  filterByStatus(status: number) {
    return this.myOrders.filter((order: any) => order.status == status);
  }

  // Mapear el número de estado a texto para la tabla
  getStatusName(status: number): string {
    const found = this.statusTabs.find(s => s.value == status);
    return found ? found.name : 'Desconocido';
  }

  listenSocket() {
    this._wsService.listen('comanda').subscribe((data) => {
      
      if (data.users_idusers == this.userId || !data.users_idusers) {
        
         this.myOrders = this.myOrders.filter(o => o.idorder != data.idorder);
         this.myOrders.unshift(data); 
      }
    });
  }
}