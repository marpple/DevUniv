import { html, View, on } from 'rune-ts';
import { CheckView } from '../lib/CheckView';
import { Toggled } from '../lib/events/Toggled';
import { ListView } from '../lib/ListView';
import { CheckAllController } from '../lib/CheckAllController';

interface Todo {
  title: string;
  completed: boolean;
}

class TodoItemView extends View<Todo> {
  private _checkView = new CheckView({ on: this.data.completed });

  override template({ title, completed }: Todo) {
    return html`
      <div class="${completed ? 'completed' : ''}">
        ${this._checkView}
        <span class="title">${title}</span>
      </div>
    `;
  }

  @on(Toggled)
  private _syncCompleted() {
    this.data.completed = this._checkView.data.on;
    this.element().classList.toggle('completed', this.data.completed);
  }

  setCompleted(completed: boolean) {
    this._checkView.setOn(completed);
    this._syncCompleted();
  }
}

class TodoListView extends ListView<Todo, TodoItemView> {
  createItemView(itemData: Todo) {
    return new TodoItemView(itemData);
  }
}

class TodoPage extends View<Todo[]> {
  private _checkAllController = new CheckAllController(
    new CheckView(),
    new TodoListView(this.data),
    (itemView) => itemView.data.completed,
    (itemView, bool) => itemView.setCompleted(bool),
  );

  override template() {
    return html`
      <div>
        <div class="header">
          ${this._checkAllController.checkAllView}
          <input type="text" />
        </div>
        <div class="body">${this._checkAllController.listView}</div>
      </div>
    `;
  }
}

export function main() {
  const todos: Todo[] = [
    { title: 'Coding', completed: false },
    { title: 'Dinner', completed: true },
    { title: 'Test', completed: false },
  ];

  document.querySelector('#body')!.append(new TodoPage(todos).render());
}
