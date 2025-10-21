import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Svg } from './svg';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { signal } from '@angular/core';

describe('Svg Component', () => {
  let component: Svg;
  let fixture: ComponentFixture<Svg>;
  let httpMock: HttpTestingController;
  let sanitizer: DomSanitizer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Svg, HttpClientTestingModule],
      providers: [
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: (value: string) => value,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Svg);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    sanitizer = TestBed.inject(DomSanitizer);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar el SVG correctamente', () => {
    const mockSvg = '<svg><circle cx="50" cy="50" r="40" /></svg>';

    fixture.componentRef.setInput('src', '/assets/icon.svg');
    fixture.detectChanges();

    const req = httpMock.expectOne('/assets/icon.svg');
    expect(req.request.method).toBe('GET');
    req.flush(mockSvg);

    expect(component.svgSafe).toBe(mockSvg);
  });

  it('debería manejar error al cargar SVG', () => {
    const consoleSpy = spyOn(console, 'error');

    fixture.componentRef.setInput('src', '/assets/error.svg');
    fixture.detectChanges();

    const req = httpMock.expectOne('/assets/error.svg');
    req.error(new ProgressEvent('Network error'));

    expect(consoleSpy).toHaveBeenCalledWith('Error cargando SVG:', jasmine.anything());
  });

  it('no debería hacer petición si no hay `src`', () => {
    fixture.componentRef.setInput('src', '');
    fixture.detectChanges();
    httpMock.expectNone(() => true); // No debe haber ninguna petición
  });
});
