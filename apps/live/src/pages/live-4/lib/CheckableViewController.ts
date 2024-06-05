import { Toggled } from './events/Toggled';
import type { ToggleView } from './ToggleView';
import type { ListView } from './ListView';
import type { View } from 'rune-ts';

export interface CheckableView<T extends object, IV extends View<T>> {
  checkAllView: ToggleView;
  listView: ListView<T, IV>;
  getItemViewChecked(itemView: IV): boolean;
  setItemViewChecked(itemView: IV, bool: boolean): void;
}

export class CheckableViewController<T extends object, IV extends View<T>> {
  constructor(public view: CheckableView<T, IV>) {
    this.view.checkAllView.data.on = this._isCheckAll();
    this.view.checkAllView.addEventListener(Toggled, (e) => this._checkAll(e.detail.on));
    this.view.listView.addEventListener(Toggled, () => this._syncCheckAll());
  }

  private _checkAll(on: boolean) {
    this.view.listView.itemViews
      .filter((itemView) => this.view.getItemViewChecked(itemView) !== on)
      .forEach((itemView) => this.view.setItemViewChecked(itemView, on));
  }

  private _syncCheckAll() {
    this.view.checkAllView.setOn(this._isCheckAll());
  }

  private _isCheckAll() {
    return this.view.listView.itemViews.every((itemView) => this.view.getItemViewChecked(itemView));
  }
}
