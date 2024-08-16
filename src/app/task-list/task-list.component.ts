import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { TasksService } from '../services/tasks.service';

@Component({
  selector: 'task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {

  tasks: Task[] = [];
  selectedTask: Task | null = null;
  formData: any = {};
  subscriptions: Subscription = new Subscription();

  constructor(
    private tasksService: TasksService,
    private snackBar: MatSnackBar){}

  ngOnInit(): void {
    this.loadTasks();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Load tasks from the backend
  loadTasks(): void {
    const loadTasksSub = this.tasksService.fetchAllTasks().subscribe({
      next: (res) => {
        if (res && res.status === 'success') {
          this.tasks = res.data;
        } else {
          this.snackBar.open('Failed to load tasks.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.snackBar.open('An error occurred while loading tasks.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
    this.subscriptions.add(loadTasksSub);
  }

  saveTask(taskData: any): void {
    if (this.selectedTask) {
      const updateTaskSub = this.tasksService.updateTask(this.selectedTask.id, taskData).subscribe({
        next: (res) => {
          if (res && res.status === 'success') {
            const taskIndex = this.tasks.findIndex(t => t.id === this.selectedTask?.id);
            this.tasks[taskIndex] = { ...this.selectedTask, ...taskData };
            this.snackBar.open('Task updated successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.clearForm();
          } else {
            this.snackBar.open('Failed to update task.', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        },
        error: (err) => {
          console.error('Error updating task:', err);
          this.snackBar.open('An error occurred while updating the task.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
      this.subscriptions.add(updateTaskSub);
    } else {
      const createTaskSub = this.tasksService.createTask(taskData).subscribe({
        next: (res) => {
          if (res && res.status === 'success') {
            this.tasks.push(res.data);
            this.snackBar.open('Task created successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.clearForm();
          } else {
            this.snackBar.open('Failed to create task.', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        },
        error: (err) => {
          console.error('Error creating task:', err);
          this.snackBar.open('An error occurred while creating the task.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
      this.subscriptions.add(createTaskSub);
    }
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

  clearForm(): void {
    this.formData = {};
    this.selectedTask = null;
  }
}

class Task {
  constructor(public id: number, public title: string, public isDone: boolean = false) {}

  toggleIsDone(): void {
    this.isDone = !this.isDone;
  }
}
