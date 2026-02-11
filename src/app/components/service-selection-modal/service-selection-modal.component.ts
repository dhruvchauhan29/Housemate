import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { Service } from '../../store/models/booking.model';

@Component({
  selector: 'app-service-selection-modal',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatDividerModule,
    MatCardModule,
    FormsModule
  ],
  templateUrl: './service-selection-modal.component.html',
  styleUrl: './service-selection-modal.component.scss'
})
export class ServiceSelectionModalComponent implements OnInit {
  services: Service[] = [
    {
      id: '1',
      name: 'Cleaning',
      description: 'Professional cleaning services for your home',
      pricePerHour: 150,
    },
    {
      id: '2',
      name: 'Cooking',
      description: 'Expert cooking services',
      pricePerHour: 150,
    },
    {
      id: '3',
      name: 'Gardening',
      description: 'Garden maintenance services',
      pricePerHour: 150,
    }
  ];
  
  selectedService: Service | null = null;

  constructor(
    private dialogRef: MatDialogRef<ServiceSelectionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      currentServiceName?: string;
    }
  ) {}

  ngOnInit() {
    // Pre-select current service if provided
    if (this.data.currentServiceName) {
      this.selectedService = this.services.find(s => s.name === this.data.currentServiceName) || null;
    }
  }

  selectService(service: Service) {
    this.selectedService = service;
  }

  confirm() {
    if (this.selectedService) {
      this.dialogRef.close({ service: this.selectedService });
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  getServiceIcon(serviceName: string): string {
    const icons: { [key: string]: string } = {
      'Cleaning': '🧹',
      'Cooking': '👨‍🍳',
      'Gardening': '🌱'
    };
    return icons[serviceName] || '🏠';
  }
}
