import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Address } from '../../domain/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class ViaCepService {
    private readonly API_URL = 'https://viacep.com.br/ws';

    constructor(private http: HttpClient) { }

    getAddress(cep: string): Observable<Address> {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length !== 8) {
            throw new Error('CEP inválido');
        }
        return this.http.get<any>(`${this.API_URL}/${cleanCep}/json/`).pipe(
            map(data => {
                if (data.erro) {
                    throw new Error('CEP não encontrado');
                }
                return {
                    zipCode: data.cep,
                    street: data.logradouro,
                    number: '',
                    neighborhood: data.bairro,
                    city: data.localidade,
                    state: data.uf,
                    complement: ''
                };
            })
        );
    }
}
