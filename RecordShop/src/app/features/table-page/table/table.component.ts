import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { Table } from '../../../core/interfaces/table.interface';
import { TableService } from '../../../core/services/table.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzIconModule,
    NzTagModule,
    NzInputNumberModule
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  tables: Table[] = [];
  tableForm: FormGroup;
  isEditMode = false;
  editingTableId: number | null = null;
  isModalVisible = false;
  isLoading = false;
  pageSize = 7;

  constructor(
    private tableService: TableService,
    private fb: FormBuilder,
    private message: NzMessageService
  ) {
    this.tableForm = this.fb.group({
      controlNumber: ['', [Validators.required, Validators.pattern(/^(CD|VNL)\d{3}$/)]],
      albumName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      price: [null, [Validators.required, Validators.min(0.01), Validators.max(9999.99)]],
      productType: ['', [Validators.required]],
      stockQuantity: [null, [Validators.required, Validators.min(0), Validators.max(9999)]],
      soldQuantity: [null, [Validators.required, Validators.min(0), Validators.max(9999)]],
      image: ['']
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.tableService.getAll().subscribe(data => {
      this.tables = data;
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.editingTableId = null;
    this.tableForm.reset();
    this.isModalVisible = true;
  }

  openEditModal(table: Table): void {
    this.isEditMode = true;
    this.editingTableId = table.id;

    this.tableForm.patchValue({
      controlNumber: table.controlNumber,
      albumName: table.albumName,
      price: table.price,
      productType: table.productType,
      stockQuantity: table.stockQuantity,
      soldQuantity: table.soldQuantity,
      image: table.image || ''
    });

    this.isModalVisible = true;
  }

  handleOk(): void {
    if (this.tableForm.invalid) {
      Object.values(this.tableForm.controls).forEach(c => {
        c.markAsDirty();
        c.updateValueAndValidity();
      });
      return;
    }

    this.isLoading = true;
    const formData = { ...this.tableForm.value };

    try {
      if (this.isEditMode && this.editingTableId !== null) {
        // Edit existing table
        const tableIndex = this.tables.findIndex(t => t.id === this.editingTableId);
        if (tableIndex !== -1) {
          this.tables = [
            ...this.tables.slice(0, tableIndex),
            { ...formData, id: this.editingTableId },
            ...this.tables.slice(tableIndex + 1)
          ];
          this.message.success('Table updated successfully');
        }
      } else {
        // Add new table
        const maxId = this.tables.length > 0 ? Math.max(...this.tables.map(t => t.id)) : 0;
        const newTable = { ...formData, id: maxId + 1 };
        this.tables = [...this.tables, newTable];
        this.message.success('Table added successfully');
      }

      // Save to localStorage
      this.tableService.saveTables(this.tables);

      // Close modal and reset form
      this.isModalVisible = false;
      this.tableForm.reset();
      this.isEditMode = false;
      this.editingTableId = null;

    } catch (error) {
      this.message.error('An error occurred while processing your request');
      console.error('Error in handleOk:', error);
    } finally {
      this.isLoading = false;
    }
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.tableForm.reset();
    this.isEditMode = false;
    this.editingTableId = null;
  }

  deleteTable(table: Table): void {
    this.tables = this.tables.filter(t => t.id !== table.id);
    this.tableService.saveTables(this.tables);
    this.message.success('Table deleted successfully');
  }

  resetToOriginalData(): void {
    this.tableService.resetToInitial().subscribe(data => {
      this.tables = data;
      this.message.success('Data has been reset to original values');
    });
  }

  getModalTitle(): string {
    return this.isEditMode ? 'Edit Table' : 'Add Table';
  }

  getOkButtonText(): string {
    return this.isEditMode ? 'Update' : 'Add';
  }

  getStockStatus(table: Table): { color: string; text: string } {
    const ratio = table.stockQuantity / (table.stockQuantity + table.soldQuantity);
    if (table.stockQuantity === 0) {
      return { color: 'red', text: 'Out of Stock' };
    } else if (ratio < 0.2) {
      return { color: 'orange', text: 'Low Stock' };
    } else {
      return { color: 'green', text: 'In Stock' };
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.tableForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldDisplayName(fieldName)} cannot exceed ${field.errors['maxlength'].requiredLength} characters`;
      }
      if (field.errors['min']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['min'].min}`;
      }
      if (field.errors['max']) {
        return `${this.getFieldDisplayName(fieldName)} cannot exceed ${field.errors['max'].max}`;
      }
      if (field.errors['pattern']) {
        return 'Control number must follow format: CD001 or VNL001';
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      'controlNumber': 'Control Number',
      'albumName': 'Album Name',
      'price': 'Price',
      'productType': 'Product Type',
      'stockQuantity': 'Stock Quantity',
      'soldQuantity': 'Sold Quantity',
      'image': 'Image URL'
    };
    return fieldNames[fieldName] || fieldName;
  }

  hasError(fieldName: string): boolean {
    const field = this.tableForm.get(fieldName);
    return !!(field?.errors && field.touched);
  }

  trackByTableId(index: number, table: Table): number {
    return table.id;
  }
}