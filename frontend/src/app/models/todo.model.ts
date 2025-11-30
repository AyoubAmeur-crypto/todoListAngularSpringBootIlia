export interface Todo {
    id?: number;
    title: string;
    completed: boolean;
    status?: 'todo' | 'inProgress' | 'done';
}