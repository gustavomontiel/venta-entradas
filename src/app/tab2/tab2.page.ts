import { Component } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Entrada, Jornada } from '../models/entradas.model';
import { EntradasService } from '../services/entradas.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  jornada: Jornada;

  entradasHombres: Entrada;
  entradasMujeres: Entrada;

  constructor(
    public entradasService: EntradasService,
    public toastController: ToastController,
    public alertController: AlertController
  ) {
    this.entradasService.jornadaSubject.subscribe((res) => {
      if (res) {
        this.jornada = JSON.parse(JSON.stringify(res));
        this.entradasHombres = this.jornada.entradas.find(
          (entrada) => entrada.titulo === 'Hombres'
        );
        this.entradasMujeres = this.jornada.entradas.find(
          (entrada) => entrada.titulo === 'Mujeres'
        );
      }
    });
  }

  guardar() {
    this.grabar(this.entradasHombres);
    this.grabar(this.entradasMujeres);
    this.presentToast('Datos guardados', 'success');
  }

  grabar({ titulo, recibido, precio }) {
    this.entradasService.setEntrada(titulo, recibido, precio);
  }

  async borrarVendidos() {
    const alert = await this.alertController.create({
      header: 'Desea borrar?',
      message: 'Confima borrar todo y empezar de nuevo?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Ok',
          role: 'ok',
          cssClass: 'primary',
        }
      ]
    });

    await alert.present();
    const {role} = await alert.onDidDismiss();
    if (role === 'ok') {
      this.entradasService.reiniciarJornada();
      this.presentToast('Se eliminaros los datos.');
    } else {
      this.presentToast('Eliminación cancelada.', 'warning');
    }
  }

  async presentToast(msg: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: color,
      position: 'top',
    });
    toast.present();
  }
}
