import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Vote } from '../interfaces/vote.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VotesService {

  private readonly baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  //Votar por equipo
  votar(correo: string, equipo: string) {
    const url = `${this.baseUrl}/votes/vote`;
    const body = { correo, equipo };

    console.log('Request Body:', body); // Log para verificar la solicitud};

    return this.http.post<{ vote: Vote }>(url, body)
      .pipe(
        map((response) => {
          console.log('Response:', response); // Verifica la respuesta
          return true;
        }),
        catchError(err => {
          console.error('Error:', err); // Log de errores
          return throwError(() => new Error(err.error?.message || 'No se ha podido guardar correctamente el objetivo'));
        })
      );
  }

  //me devuelve en el servicio el recuento total de votos
  getResults(): Observable<any> {
    const url = `${this.baseUrl}/votes/results`;  // Endpoint de resultados en el backend
    return this.http.get<any>(url);
  }
}
