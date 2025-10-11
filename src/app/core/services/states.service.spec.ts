import { TestBed } from '@angular/core/testing';
import { StatesService } from './states.service';

describe('StatesService', () => {
  let service: StatesService;
  const localStorageKey = 'filter';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatesService);
    localStorage.clear(); // limpiar antes de cada test
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería guardar y cargar correctamente el filtro', () => {
    const mockData = {
      state: 'activo',
      payment: {
        Selectedcheck: [{ key: 'TODOS' }]
      }
    };

    service.saveFilter(mockData);

    const saved = localStorage.getItem(localStorageKey);
    expect(saved).toBeTruthy();

    const loaded = service.loadFilter();
    expect(loaded).toEqual(mockData);
  });

  it('debería retornar un objeto vacío si no hay filtro guardado', () => {
    const result = service.loadFilter();
    expect(result).toEqual({});
  });

  it('debería limpiar el filtro del localStorage', () => {
    const mockData = { state: 'activo' };
    service.saveFilter(mockData);

    service.clearFilter();

    const loaded = localStorage.getItem(localStorageKey);
    expect(loaded).toBeNull();
  });
});
