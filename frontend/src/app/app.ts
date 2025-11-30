import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TodoService } from './services/todo.service';
import { Todo } from './models/todo.model';
import { MatButtonModule } from '@angular/material/button';
import { TodoList } from './components/todo-list/todo-list';

@Component({
  selector: 'app-root',
  imports: [CommonModule, MatIconModule, MatButtonModule, TodoList],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  isDark = signal(window.matchMedia('(prefers-color-scheme: dark)').matches);

  constructor() {
    // Auto dark mode
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', e => this.isDark.set(e.matches));
    effect(() => document.documentElement.dataset['theme'] = this.isDark() ? 'dark' : 'light');
  }

  toggleTheme() {
    this.isDark.set(!this.isDark());
  }
}
