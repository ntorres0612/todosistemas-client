import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Employee } from 'src/app/model/employee';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  constructor(private api: ApiService) { }

  employees: Employee[] = [];
  loading = true;
  openModalCreate: Boolean = false;
  openModalDelete: Boolean = false;
  isLoading: Boolean = false;
  isSuccess: Boolean = false;
  tmpEmployee: Employee;
  actionMode: string = 'create'

  ngOnInit() {
    this.initEmployee();
    this.api.listEmployees()
      .subscribe(res => {
        this.employees = res;
        console.log(this.employees);
        this.loading = false;
      }, err => {
        console.log(err);
        this.loading = false;
      });
  }

  initEmployee() {
    this.tmpEmployee = {
      id: 0,
      name: '',
      isEditing: false,
      isLoading: false,
      isSuccess: false
    }
  }
  onChangeNameCreate(name: string) {
    this.tmpEmployee.name = name;
  }

  createEmployee() {
    this.tmpEmployee.isLoading = true
    this.api.createEmployee(this.tmpEmployee).subscribe(response => {
      this.tmpEmployee.isLoading = false;
      this.tmpEmployee.isSuccess = true;
      this.tmpEmployee.isEditing = false;
      this.tmpEmployee.id = response.id
      this.employees.unshift(this.tmpEmployee)

      setTimeout(() => {
        this.tmpEmployee.isSuccess = false;
        this.openModalCreate = false;

      }, 1900);
    }, err => {
      console.log(err);
      this.loading = false;
    });
  }

  updateEmployee() {
    this.tmpEmployee.isLoading = true
    this.api.updateEmployee(this.tmpEmployee).subscribe(response => {
      this.tmpEmployee.isLoading = false;
      this.tmpEmployee.isSuccess = true;
      this.tmpEmployee.isEditing = false;
      this.tmpEmployee.id = response.id

      setTimeout(() => {
        this.tmpEmployee.isSuccess = false;
        this.openModalCreate = false;

      }, 1900);
    }, err => {
      console.log(err);
      this.loading = false;
    });
  }

  openModalCreateUpdate(mode, employee) {
    this.actionMode = mode;
    if (mode == 'update') {
      this.tmpEmployee = employee
    } else {
      this.tmpEmployee.name = ""
    }
    this.openModalCreate = true
  }
  closeModalCreateUpdate() {
    this.openModalCreate = false
  }
  toggleModalDelete() {
    this.openModalDelete = !this.openModalDelete
  }
  openModalDeleteEmployee(employee: Employee) {
    this.tmpEmployee = employee;
    this.openModalDelete = true;
  }

  deleteEmployee() {
    this.isLoading = true


    this.api.deleteTask(this.tmpEmployee.id).subscribe(response => {
      console.log('response', response)
      this.isLoading = false;
      this.isSuccess = true;

      this.employees = this.employees.filter(currentEmployee => currentEmployee.id != this.tmpEmployee.id)
      setTimeout(() => {
        this.isSuccess = false;
        this.openModalDelete = false;
      }, 1900);
    }, err => {
      console.log(err);
      this.isLoading = false;
      this.isSuccess = true;
    });
  }
}
