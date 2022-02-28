import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Jornada, Entrada } from '../models/entradas.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class EntradasService {

  jornadaSubject: BehaviorSubject<Jornada>;
  jornada: Jornada;


  constructor(
    private storageService: StorageService
  ) {

    this.jornadaSubject = new BehaviorSubject( undefined );

    this.storageService.get('entradas').then(
      res => {
        let entradas = []
        if(res){
          entradas = (typeof res === 'string') ? JSON.parse(res).entradas : res.entradas ;
          if( !Array.isArray(entradas)  || entradas.length === 0 ) {
            entradas = this.getEntradasDefault();
          } 
          this.iniciarJornada(entradas);
        } else {
          entradas = this.getEntradasDefault();
          this.iniciarJornada(entradas);
        }
      },
      err => { 
        console.log(err);
      }
    );

   }


   getEntradasDefault(){
    return [
      {
        titulo: 'Hombres',
        precio: 300,
        recibido: 0,
        vendido: 0
      },
      {
        titulo: 'Mujeres',
        precio: 200,
        recibido: 0,
        vendido: 0
      }
    ]
   }

   reiniciarJornada(){
     const entradas = this.getEntradasDefault();
     this.iniciarJornada(entradas);
   }


   iniciarJornada(entradas: Entrada[]){

    this.jornada = {
      efectivo: 0,
      entradas: entradas
    }

    this.guardarEntradas();
   }


   calcularEfectivo() {
     let efectivo = 0;
     this.jornada.entradas.forEach(
       entrada=>{
        efectivo = efectivo + (entrada.vendido * entrada.precio);
        entrada.quedan = entrada.vendido < entrada.recibido ? entrada.recibido - entrada.vendido : 0;
       }
     )
     this.jornada.efectivo = efectivo;
   }

   restarEntrada(titulo: string, cantidad: number) {
    const entradaEncontrada = this.jornada.entradas.find(entrada => entrada.titulo === titulo);
    entradaEncontrada.vendido = entradaEncontrada.vendido + cantidad;
    this.guardarEntradas();
   }

   sumarEntrada(titulo: string, cantidad: number) {
    const entradaEncontrada = this.jornada.entradas.find(entrada => entrada.titulo === titulo);
    entradaEncontrada.vendido = entradaEncontrada.vendido >= cantidad ? entradaEncontrada.vendido - cantidad : entradaEncontrada.vendido;
    this.guardarEntradas();
   }

   setEntrada(titulo: string, recibido: number, precio: number) {

    let entradaEncontrada = this.jornada.entradas.find(entrada => entrada.titulo === titulo);
    
    if (entradaEncontrada) {
      entradaEncontrada.recibido = recibido;
      entradaEncontrada.precio = precio;
    } else {
      entradaEncontrada = {
        titulo: titulo,
        precio: precio,
        recibido: recibido,
        vendido: 0
      };
      this.jornada.entradas.push(entradaEncontrada);
    }

    this.guardarEntradas();

   }


   guardarEntradas() {
    this.calcularEfectivo();
    this.storageService.set('entradas', this.jornada).then(
      res=>{ 
        this.jornadaSubject.next(this.jornada) 
      }
    );
   }


   async borrarEntradas() {
    this.iniciarJornada([]);
    await this.storageService.set('entradas', this.jornada) ;
    this.jornadaSubject.next(this.jornada);
  }

}
