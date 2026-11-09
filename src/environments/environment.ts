import { Provider } from '@angular/core';

import { proveerGatewayEnMemoria } from '../app/proyeccion/data/en-memoria/proyeccion-en-memoria.gateway';

export const environment: {
  production: boolean;
  gatewayProviders: Provider[];
  solicitudJubilacionUrl: string;
} = {
  production: false,
  gatewayProviders: proveerGatewayEnMemoria(),
  solicitudJubilacionUrl:
    'http://calidadonline2/apps/Main#/BeneficiosPrecarga/SolicitudJubilacion/Index',
};
