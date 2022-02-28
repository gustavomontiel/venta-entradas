import { Component } from '@angular/core';
import { EntradasService } from '../services/entradas.service';
import { Entrada, Jornada } from '../models/entradas.model';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  jornada: Jornada;
  entradasHombres: Entrada;
  entradasMujeres: Entrada;

  cantHombreVender: number;
  cantMujerVender: number;

  constructor(
    public entradasService: EntradasService
  ) {
    this.iniciarlizarCantidades();

    this.entradasService.jornadaSubject.subscribe(
      res => {
        if (res) {
          this.jornada = JSON.parse(JSON.stringify(res));
          this.entradasHombres = this.jornada.entradas.find(entrada => entrada.titulo === 'Hombres');
          this.entradasMujeres = this.jornada.entradas.find(entrada => entrada.titulo === 'Mujeres');
        }
      }
    )
  }

  iniciarlizarCantidades() {
    this.cantHombreVender = 1;
    this.cantMujerVender = 1;
  }

  venderEntradasHombres(cantidad: number){
    this.entradasService.restarEntrada('Hombres', cantidad);
    this.cantHombreVender = 1;
  }

  venderEntradasMujeres(cantidad: number){
    this.entradasService.restarEntrada('Mujeres', cantidad);
    this.cantMujerVender = 1;
  }

  devolverEntradasHombres(cantidad: number){
    this.entradasService.sumarEntrada('Hombres', cantidad);
    this.cantHombreVender = 1;
  }

  devolverEntradasMujeres(cantidad: number){
    this.entradasService.sumarEntrada('Mujeres', cantidad);
    this.cantMujerVender = 1;
  }

}
