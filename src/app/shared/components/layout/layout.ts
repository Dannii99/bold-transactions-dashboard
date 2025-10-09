import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faCircleQuestion } from '@ng-icons/font-awesome/regular';
import { Svg } from '../ui/svg/svg';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Svg, NgIcon],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  viewProviders: [provideIcons({ faCircleQuestion })]
})
export class Layout {

}
