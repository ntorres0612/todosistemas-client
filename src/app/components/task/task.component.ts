import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Employee } from 'src/app/model/employee';
import { Status } from 'src/app/model/status';
import { Task } from 'src/app/model/task';
import * as moment from 'moment';

moment.locale("es");

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  constructor(private api: ApiService) { }

  openModal: Boolean = false;
  openModalDelete: Boolean = false;
  isLoading: Boolean = false;
  isSuccess: Boolean = false;
  tasks: Task[] = [];
  taskTmp: Task;

  employees: Employee[] = [];

  loading = true;
  taskStatus: Object
  errorMessages: string[] = []

  ngOnInit() {

    this.initTmpTask()
    this.taskStatus = Object.values(Status);

    this.api.listTasks()
      .subscribe(res => {
        console.log("res ", res);

        this.tasks = res;
        this.tasks.forEach(task => {
          task.execution = moment(task.execution).format("YYYY-MM-DD hh:mm:ss").toString()
          if (!task.employee) {
            task.employee = {
              id: 0,
              name: "N/A",
              isEditing: false,
              isLoading: false,
              isSuccess: false
            }
          }
        });
        this.tasks.forEach(function (value) {
          console.log(value);
        });

        this.loading = false;
      }, err => {
        console.log(err);
        this.loading = false;
      });

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

  openModalDeleteTask(task: Task) {
    this.taskTmp = task;
    this.openModalDelete = true;
  }

  initTmpTask() {
    this.taskTmp = {
      id: 0,
      name: '',
      status: Status.Pending,
      execution: null,
      employee: {
        id: 0,
        name: "",
        isEditing: false,
        isLoading: false,
        isSuccess: false
      },
      isEditing: false,
      isLoading: false,
      isSuccess: false,
      errorMessages: []
    }
  }

  onChangeName(newValue, selectedTask) {
    this.tasks = this.tasks.map(task => {
      if (task.id == selectedTask.id)
        task.name = newValue

      return task
    })
  }

  onChangeEmployee(newValue, selectedTask) {
    let selectedEmployee = this.employees.filter(employee => employee.id == newValue.toString())[0]
    console.log('selectedEmployee', selectedEmployee)
    this.tasks = this.tasks.map(task => {
      if (task.id == selectedTask.id)
        task.employee = selectedEmployee

      return task
    })
  }

  onChangeStatus(newValue, selectedTask) {
    let selectedEmployee = this.employees.filter(employee => employee.id == newValue.toString())[0]
    console.log(newValue);

    this.tasks = this.tasks.map(task => {
      if (task.id == selectedTask.id)
        task.status = newValue

      return task
    })
  }

  changeEditing(task: Task) {
    console.log(task);


    if (!task.employee) {
      task.employee = {
        id: 0,
        name: "",
        isEditing: false,
        isLoading: false,
        isSuccess: false
      }
    }

    const newTask = this.tasks.map(currentTask => {
      if (currentTask.id == task.id) {
        currentTask.isEditing = !currentTask.isEditing
        currentTask.employee = task.employee

      }
      return currentTask
    })
    this.tasks = newTask
  }

  onChangeExpiration(newValue, selectedTask) {
    this.tasks = this.tasks.map(task => {
      if (task.id == selectedTask.id)
        task.execution = newValue

      return task
    })
  }

  updateTask(task: Task) {
    this.validateFieldsTask(task)
    if (task.errorMessages.length === 0) {
      task.isLoading = true
      if (task.execution.includes("T")) {
        let parstDate = task.execution.toString().split("T")
        task.execution = `${parstDate[0]} ${parstDate[1]}:00`
        console.log(moment(task.execution).format("YYYY-MM-DD hh:mm:ss"))
        console.log(task)
      }

      this.api.updateTask(task).subscribe(response => {
        task.isLoading = false;
        task.isSuccess = true;
        task.isEditing = false;
        this.initTmpTask()
        setTimeout(() => {
          task.isSuccess = false;
        }, 1900);
      }, err => {
        console.log(err);
        this.loading = false;
      });
    }
  }

  validateFieldsTask(task: Task) {
    task.errorMessages = []

    if (task.name.trim() === '')
      task.errorMessages.push('* Name is required')
    if (task.status === '')
      task.errorMessages.push('* Status is required')
    if (task.execution === '' || task.execution === null)
      task.errorMessages.push('* Execution is required')

    return task.errorMessages

  }
  validateFields() {
    console.log('this.taskTmp.execution ', this.taskTmp.execution)
    this.errorMessages = []
    if (this.taskTmp.name.trim() === '')
      this.errorMessages.push('* Name is required')
    if (this.taskTmp.status === '')
      this.errorMessages.push('* Status is required')
    if (this.taskTmp.execution === '' || this.taskTmp.execution === null)
      this.errorMessages.push('* Execution is required')

    console.log(this.errorMessages)
  }

  createTask() {
    this.validateFields()

    if (this.errorMessages.length === 0) {
      this.taskTmp.isLoading = true
      if (this.taskTmp.execution.includes("T")) {
        let parstDate = this.taskTmp.execution.toString().split("T")
        this.taskTmp.execution = `${parstDate[0]} ${parstDate[1]}:00`
      }

      this.api.createTask(this.taskTmp).subscribe(response => {
        this.taskTmp.isLoading = false;
        this.taskTmp.isSuccess = true;
        this.taskTmp.isEditing = false;
        this.taskTmp.id = response.id
        this.tasks.unshift(this.taskTmp)

        setTimeout(() => {
          this.taskTmp.isSuccess = false;
          this.openModal = false;


        }, 1900);
      }, err => {
        console.log(err);
        this.loading = false;
      });
    } else {

    }
  }

  deleteTask() {
    this.isLoading = true


    this.api.deleteTask(this.taskTmp.id).subscribe(response => {
      console.log('response', response)
      this.isLoading = false;
      this.isSuccess = true;

      this.tasks = this.tasks.filter(currentTask => currentTask.id != this.taskTmp.id)
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

  toggleModal() {
    this.openModal = !this.openModal
  }
  toggleModalDelete() {
    this.openModalDelete = !this.openModalDelete
  }
  onChangeStatusCreate(newValue) {
    this.taskTmp.status = newValue
  }
  onChangeEmployeeCreate(newValue) {
    let selectedEmployee = this.employees.filter(employee => employee.id == newValue.toString())[0]
    this.taskTmp.employee = selectedEmployee

  }
  onChangeExpirationCreate(newValue) {
    this.taskTmp.execution = newValue
  }
  onChangeNameCreate(newValue) {
    this.taskTmp.name = newValue
  }

}

