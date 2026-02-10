import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { Address } from '../../store/models/booking.model';
import { selectAddresses, selectSelectedAddress } from '../../store/selectors/booking.selectors';
import { selectAddress, addAddress } from '../../store/actions/booking.actions';

@Component({
  selector: 'app-select-address',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './select-address.component.html',
  styleUrl: './select-address.component.scss'
})
export class SelectAddressComponent implements OnInit {
  addresses$: Observable<Address[]>;
  selectedAddress$: Observable<Address | undefined>;
  showAddNewForm = false;
  addressForm: FormGroup;

  houseTypeOptions = ['1 BHK', '2 BHK', '3 BHK', '4 BHK'];

  constructor(
    private router: Router,
    private store: Store,
    private fb: FormBuilder
  ) {
    this.addresses$ = this.store.select(selectAddresses);
    this.selectedAddress$ = this.store.select(selectSelectedAddress);

    this.addressForm = this.fb.group({
      serviceAddress: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pinCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      contactName: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      alternateContactNumber: ['', Validators.pattern(/^\d{10}$/)],
      houseType: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Add mock saved addresses if none exist
    this.addresses$.subscribe(addresses => {
      if (addresses.length === 0) {
        this.addMockAddresses();
      }
    });
  }

  private addMockAddresses(): void {
    const homeAddress: Address = {
      id: 'addr-1',
      label: 'Home',
      serviceAddress: '123 Main Street, Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400001',
      contactName: 'John Doe',
      contactNumber: '9876543210',
      alternateContactNumber: '9876543211',
      houseType: '2 BHK',
      isDefault: true
    };

    const officeAddress: Address = {
      id: 'addr-2',
      label: 'Office',
      serviceAddress: '456 Business Park, Tower A, Floor 5',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400002',
      contactName: 'Jane Smith',
      contactNumber: '9876543220',
      houseType: '4 BHK',
      isDefault: false
    };

    this.store.dispatch(addAddress({ address: homeAddress }));
    this.store.dispatch(addAddress({ address: officeAddress }));
  }

  selectAddressCard(address: Address): void {
    this.store.dispatch(selectAddress({ address }));
  }

  toggleAddNewForm(): void {
    this.showAddNewForm = !this.showAddNewForm;
    if (!this.showAddNewForm) {
      this.addressForm.reset();
    }
  }

  saveAddress(): void {
    if (this.addressForm.valid) {
      const newAddress: Address = {
        id: `addr-${Date.now()}`,
        label: 'New Address',
        ...this.addressForm.value,
        isDefault: false
      };

      this.store.dispatch(addAddress({ address: newAddress }));
      this.store.dispatch(selectAddress({ address: newAddress }));
      
      this.addressForm.reset();
      this.showAddNewForm = false;
    }
  }

  nextStep(): void {
    this.router.navigate(['/book-service/booking-summary']);
  }

  previousStep(): void {
    this.router.navigate(['/book-service/select-datetime']);
  }
}
