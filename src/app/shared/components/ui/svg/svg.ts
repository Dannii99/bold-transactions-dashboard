import { HttpClient } from '@angular/common/http';
import { Component, input, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'b-svg',
  imports: [],
  templateUrl: './svg.html',
  styleUrl: './svg.scss'
})
export class Svg {
  src = input<string>(''); // Ruta relativa a la carpeta public

  svgSafe: SafeHtml | null = null;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    if (this.src()) {
      this.http.get(this.src(), { responseType: 'text' }).subscribe({
        next: (svgContent) => {
          this.svgSafe = this.sanitizer.bypassSecurityTrustHtml(svgContent);
        },
        error: (err) => {
          console.error('Error cargando SVG:', err);
        },
      });
    }
  }
}

