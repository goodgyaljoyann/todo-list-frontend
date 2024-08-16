import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { TasksService } from '../services/tasks.service';
import { AuthService } from '../Auth/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-task-list-manager',
  templateUrl: './task-list-manager.component.html',
  styleUrls: ['./task-list-manager.component.css']
})
export class TaskListManagerComponent implements OnInit, OnDestroy {

  tasks: any[] = [];
  selectedTask: Task | null = null;
  formData: any = {};
  subscriptions: Subscription = new Subscription();
  hasData: boolean = false;
  taskData: any = { title: '', description: '' };
  selectedFile: File | null = null;
  
  constructor(
    private tasksService: TasksService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadTasks(): void {
    const userId = this.authService.getUserId();
    
    if (!userId) {
      console.error('User ID not found');
      this.hasData = false;
      return;
    }
    
    this.tasksService.fetchTaskByUserId(parseInt(userId, 10)).subscribe(
      (res: { status: string, data: any }) => {
        if (res && res.status === 'success') {
          this.tasks = res.data || []; // Ensure tasks is assigned an empty array if res.data is undefined
          this.hasData = this.tasks.length > 0; // Update hasData based on the presence of tasks
        } else {
          console.error('Error fetching tasks:', res);
          this.tasks = []; // Ensure tasks is reset to an empty array in case of error
          this.hasData = false;
        }
      },
      (error: HttpErrorResponse) => {
        if (error.status === 404) {
          console.error('No tasks found for this user.');
        } else {
          console.error('Error fetching tasks:', error);
        }
        this.tasks = []; // Ensure tasks is reset to an empty array in case of error
        this.hasData = false;
      }
    );
  }  

   //Function that stores message data
   saveTask(newTaskForm: NgForm): void {
    const user_id = this.authService.getUserId(); // Get id
    const { title, description, picture } = newTaskForm.value;

    // Add customer_id to the form data
    const formDataWithUserId = { ...newTaskForm.value, user_id, title, description, picture };

    this.tasksService.createTask(formDataWithUserId).subscribe(
      (res: any) => {
        if (res.status === 'success') {
          // Show success message
          this.snackBar.open('Task created successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });

          // Redirect to message-us page
          this.router.navigate(['/']);
        } else {
          this.snackBar.open('Failed to send message. Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      },
      (error: any) => {
        console.error('Error creating message:', error);
        this.snackBar.open('An error occurred while creating the message. Please try again later.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    );
  }

  clearForm(): void {
    this.taskData = { title: '', description: '' };
    this.selectedFile = null;
  }

  deleteTask(task: Task): void {
    const userConfirmed = confirm(`Are you sure you want to delete the task: "${task.title}"?`);
    if (userConfirmed) {
      const deleteTaskSub = this.tasksService.deleteTask(task.id).subscribe({
        next: (res) => {
          if (res && res.status === 'success') {
            this.tasks = this.tasks.filter(t => t !== task);
            this.snackBar.open('Task deleted successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          } else {
            this.snackBar.open('Failed to delete task.', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        },
        error: (err) => {
          console.error('Error deleting task:', err);
          this.snackBar.open('An error occurred while deleting the task.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
      this.subscriptions.add(deleteTaskSub);
    }
  }
}

export class Task {
  constructor(public id: number, public title: string, public isDone: boolean = false) {}

  toggleIsDone(): void {
    this.isDone = !this.isDone;
  }
}
