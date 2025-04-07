import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

// ahora configurar un post request para recibir un objeto y devolverlo
// en el mismo formato
// para eso se necesita un dto
// y un controller
// y un service
// el dto es un objeto que se usa para transferir datos entre el cliente y el servidor
// el controller es el encargado de recibir la peticion y devolver la respuesta
// el service es el encargado de hacer la logica de negocio
// el dto es una clase que tiene las propiedades del objeto que se va a recibir
// el controller es una clase que tiene los metodos que se van a usar para recibir las peticiones
// el service es una clase que tiene los metodos que se van a usar para hacer la logica de negocio
// el dto es una clase que tiene las propiedades del objeto que se va a recibir
