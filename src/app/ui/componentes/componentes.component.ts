import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared';

@Component({
  selector: 'app-componentes',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './componentes.component.html',
  styleUrl: './componentes.component.scss'
})
export default class ComponentesComponent {

}
