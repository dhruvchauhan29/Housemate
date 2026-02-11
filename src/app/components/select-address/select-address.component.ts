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
import { selectAddress, addAddress, setAddingNewAddress, calculateTotal } from '../../store/actions/booking.actions';

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
      serviceAddress: 'Flat 304, Building A, Green Valley Apartments, M.G. Road',
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
      serviceAddress: 'Tower B, 15th Floor, Tech Park, Bandra Kurla Complex',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400051',
      contactName: 'John Doe',
      contactNumber: '9876543210',
      houseType: '3 BHK',
      isDefault: false
    };

    const parentsHouse: Address = {
      id: 'addr-3',
      label: 'Parents House',
      serviceAddress: 'House No. 42, Shanti Nagar, Near Central Park',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400092',
      contactName: 'John Doe',
      contactNumber: '9876543210',
      houseType: '3 BHK',
      isDefault: false
    };

    this.store.dispatch(addAddress({ address: homeAddress }));
    this.store.dispatch(addAddress({ address: officeAddress }));
    this.store.dispatch(addAddress({ address: parentsHouse }));
  }

  selectAddressCard(address: Address): void {
    this.store.dispatch(selectAddress({ address }));
  }

  toggleAddNewForm(): void {
    this.showAddNewForm = !this.showAddNewForm;
    this.store.dispatch(setAddingNewAddress({ isAdding: this.showAddNewForm }));
    if (!this.showAddNewForm) {
      this.addressForm.reset();
    }
  }

  selectHouseType(type: string): void {
    this.addressForm.patchValue({ houseType: type });
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
      this.store.dispatch(setAddingNewAddress({ isAdding: false }));
      
      this.addressForm.reset();
      this.showAddNewForm = false;
    }
  }

  nextStep(): void {
    // Calculate total before navigating to booking summary
    this.store.dispatch(calculateTotal());
    this.router.navigate(['/book-service/booking-summary']);
  }

  previousStep(): void {
    this.router.navigate(['/book-service/select-datetime']);
  }
}
