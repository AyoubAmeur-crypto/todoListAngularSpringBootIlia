import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-list',
  imports: [CommonModule, DragDropModule, FormsModule],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoList implements OnInit {

  todoList: Todo[] = [];
  inProgressList: Todo[] = [];
  doneList: Todo[] = [];
  newTitle = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe(data => {
      // Categorize todos by status
      this.todoList = data.filter(todo => !todo.status || todo.status === 'todo');
      this.inProgressList = data.filter(todo => todo.status === 'inProgress');
      this.doneList = data.filter(todo => todo.status === 'done');
    });
  }

  addTodo() {
    if (this.newTitle.trim()) {
      this.todoService.addTodo({title: this.newTitle, completed: false, status: 'todo'})
        .subscribe(todo => {
          this.todoList.push(todo);
          this.newTitle = '';
        });
    }
  }

  drop(event: CdkDragDrop<Todo[]>, status: 'todo' | 'inProgress' | 'done') {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      // Update the status of the moved todo
      const movedTodo = event.container.data[event.currentIndex];
      movedTodo.status = status;
      
      // Update completed status based on column
      if (status === 'done') {
        movedTodo.completed = true;
      } else {
        movedTodo.completed = false;
      }
    }
  }

  delete(todo: Todo, list: Todo[]) {
    this.todoService.deleteTodo(todo.id!).subscribe(() => {
      const index = list.findIndex(t => t.id === todo.id);
      if (index > -1) {
        list.splice(index, 1);
      }
    });
  }
}
