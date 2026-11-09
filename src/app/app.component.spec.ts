import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  it('muestra la pantalla de proyección', () => {
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations(), ...environment.gatewayProviders],
    });
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-proyeccion-page')).not.toBeNull();
  });
});
