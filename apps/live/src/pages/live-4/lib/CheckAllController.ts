import { Toggled } from './events/Toggled';
import type { ToggleView } from './ToggleView';
import type { ListView } from './ListView';
import type { View } from 'rune-ts';

export class CheckAllController<T extends object, IV extends View<T>> {
  constructor(
    public checkAllView: ToggleView,
    public listView: ListView<T, IV>,
    private _getItemViewChecked: (itemView: IV) => boolean,
    private _setItemViewChecked: (itemView: IV, bool: boolean) => void,
  ) {
    this.checkAllView.data.on = this._isCheckAll();
    this.checkAllView.addEventListener(Toggled, (e) => this._checkAll(e.detail.on));
    this.listView.addEventListener(Toggled, () => this._syncCheckAll());
  }

  private _checkAll(on: boolean) {
    this.listView.itemViews
      .filter((itemView) => this._getItemViewChecked(itemView) !== on)
      .forEach((itemView) => this._setItemViewChecked(itemView, on));
  }

  private _syncCheckAll() {
    this.checkAllView.setOn(this._isCheckAll());
  }

  private _isCheckAll() {
    return this.listView.itemViews.every((itemView) => this._getItemViewChecked(itemView));
  }
}
