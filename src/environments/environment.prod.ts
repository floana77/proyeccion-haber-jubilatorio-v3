import { Provider } from '@angular/core';

import { proveerGatewayHttp } from '../app/proyeccion/data/proyeccion-http.gateway';

export const environment: {
  production: boolean;
  gatewayProviders: Provider[];
  solicitudJubilacionUrl: string;
} = {
  production: true,
  gatewayProviders: proveerGatewayHttp(),
  solicitudJubilacionUrl:
    'https://www.cpbaonline.com.ar/apps/Main#/BeneficiosPrecarga/SolicitudJubilacion/Index',
};
