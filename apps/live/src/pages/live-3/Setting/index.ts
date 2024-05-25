import { View, html } from 'rune-ts';
import { each, pipe, zip } from '@fxts/core';

class SwitchView extends View<{ on: boolean }> {
  override template() {
    return html`
      <button class="${this.data.on ? 'on' : ''}">
        <span class="toggle"></span>
      </button>
    `;
  }

  protected override onRender() {
    this.element().addEventListener('click', () => this._toggle());
  }

  private _toggle() {
    this.setOn(!this.data.on);
    this.element().dispatchEvent(new CustomEvent('toggled', { bubbles: true }));
  }

  setOn(bool: boolean) {
    this.data.on = bool;
    this.element().classList.toggle('on', bool);
  }
}

interface Setting {
  title: string;
  on: boolean;
}

class SettingItemView extends View<Setting> {
  private _switchView = new SwitchView(this.data);

  override template() {
    return html`
      <div>
        <span class="title">${this.data.title}</span>
        ${this._switchView}
      </div>
    `;
  }

  setOn(bool: boolean) {
    this._switchView.setOn(bool);
  }
}

class SettingListView extends View<Setting[]> {
  itemViews = this.data.map((setting) => new SettingItemView(setting));

  override template() {
    return html` <div>${this.itemViews}</div> `;
  }
}

class SettingPage extends View<Setting[]> {
  private _originData = this.data.map((setting): Setting => ({ ...setting }));
  private _checkAllView = new SwitchView({ on: this._isCheckAll() });
  private _listView = new SettingListView(this.data);

  override template() {
    return html`
      <div>
        <div class="header">
          <h2>Setting</h2>
          ${this._checkAllView}
        </div>
        <div class="body">${this._listView}</div>
        <div class="footer">
          <button class="reset">Reset</button>
        </div>
      </div>
    `;
  }

  protected override onRender() {
    this._checkAllView.element().addEventListener('toggled', () => this._checkAll());
    this._listView.element().addEventListener('toggled', () => this._syncCheckAll());
    this.delegate('click', 'button.reset', () => this._reset());
  }

  private _checkAll() {
    const { on } = this._checkAllView.data;
    this._listView.itemViews
      .filter((itemView) => itemView.data.on !== on)
      .forEach((itemView) => itemView.setOn(on));
  }

  private _syncCheckAll() {
    this._checkAllView.setOn(this._isCheckAll());
  }

  private _isCheckAll() {
    return this.data.every((setting) => setting.on);
  }

  private _reset() {
    pipe(
      zip(this._originData, this._listView.itemViews),
      each(([{ on }, itemView]) => itemView.setOn(on)),
    );
    this._syncCheckAll();
  }
}

export function main() {
  const settings: Setting[] = [
    { title: 'WiFi', on: true },
    { title: 'Bluetooth', on: false },
    { title: 'AirDrop', on: true },
  ];

  document.querySelector('#body')!.append(new SettingPage(settings).render());
}
