//Raimundo Fenoll Albaladejo

import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { VotesService } from '../../services/votes.service';
import { User } from '../../../auth/interfaces';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent implements OnInit{

  equipoSeleccionado: string | null = null;
  haVotado: boolean = false;
  private authService = inject(AuthService);
  private votesService = inject(VotesService);
  email = '';
  private idUsuario = '';

   // Variables para el porcentaje de votos
   percentageA: number = 0;
   percentageB: number = 0;

  //OnInit
  ngOnInit(): void {

    this.email = this.authService.currentUser()?.email!;
    this.idUsuario = this.authService.currentUser()?._id!;

    //Se comprueba si el usuario ha votado ya o no
    this.authService.getUser(this.idUsuario).
    subscribe({
      next: (user: User) => {

        if(user.haVotado) {
          this.getResults(); // Actualizar los resultados después de votar
          this.haVotado = true;
        }
        console.log(this.haVotado);
      },
      error: (err) => {
        console.error('Error al obtener el usuario:', err);
      }

    });
  }

  seleccionarEquipo(equipo: string) {
    this.equipoSeleccionado = equipo;
    console.log(`Equipo: ${this.equipoSeleccionado}`);
  }

  votar(event: Event) {
    event.preventDefault(); // Evita la recarga de la página
    if (this.equipoSeleccionado) {

      //Primero se vota
      this.votesService.votar(this.email, this.equipoSeleccionado).
      subscribe({
        next: () => {
          // Luego se marca como votado en el localStorage
          localStorage.setItem('haVotado', 'true');
          this.getResults(); // Actualizar los resultados después de votar
        },
        error: (err) => {
          console.error('Error al obtener los objetivos actualizados:', err);
        }
      });

      //Segundo se pone la propiedad haVotado a true
      this.authService.usuarioVotado(this.idUsuario, true).
      subscribe({
        next: () => {console.log("bien")},
        error: (err) => {
          console.error('Error al obtener los objetivos actualizados:', err);
        }
      });

      this.haVotado = this.authService.currentUser()?.haVotado!;
    }
  }

  getResults(): void {
    this.votesService.getResults().subscribe({
      next: (results) => {
        // Calculamos los porcentajes de votos para cada equipo
        const totalVotes = results.totalVotes;
        const votesA = results.equipoA.votos;
        const votesB = results.equipoB.votos;

        // Calculamos los porcentajes para cada equipo
        this.percentageA = totalVotes > 0 ? (votesA / totalVotes) * 100 : 0;
        this.percentageB = totalVotes > 0 ? (votesB / totalVotes) * 100 : 0;

        console.log("Resultados de la votación:");
        console.log("Equipo A:", this.percentageA, "%");
        console.log("Equipo B:", this.percentageB, "%");
      },
      error: (err) => {
        console.error('Error al obtener los resultados de la votación:', err);
      }
    });
  }
}
