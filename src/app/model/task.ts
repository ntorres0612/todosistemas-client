import { Employee } from "./employee";

export class Task {
  id: number;
  name: string;
  status: string;
  execution: string;
  employee: Employee;
  isEditing: Boolean = false;
  isLoading: Boolean = false;
  isSuccess: Boolean = false;
  errorMessages: string[] = [];
}