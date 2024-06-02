import { View, html } from 'rune-ts';
import { SwitchView } from '../lib/SwitchView';
import { Toggled } from '../lib/events/Toggled';

interface Setting {
  title: string;
  on: boolean;
}

class SettingItemView extends View<Setting> {
  switchView = new SwitchView(this.data);

  override template() {
    return html`
      <div>
        <span class="title">${this.data.title}</span>
        ${this.switchView}
      </div>
    `;
  }
}

class SettingListView extends View<Setting[]> {
  itemViews = this.data.map((setting) => new SettingItemView(setting));

  override template() {
    return html` <div>${this.itemViews}</div> `;
  }
}

class SettingPage extends View<Setting[]> {
  private _listView = new SettingListView(this.data);
  private _checkAllView = new SwitchView({ on: this._isCheckAll() });

  override template() {
    return html`
      <div>
        <div class="header">
          <h2>Setting</h2>
          ${this._checkAllView}
        </div>
        <div class="body">${this._listView}</div>
      </div>
    `;
  }

  protected override onRender() {
    this._checkAllView.addEventListener(Toggled, (e) => this._checkAll(e.detail.on));
    this._listView.addEventListener(Toggled, () => this._syncCheckAll());
  }

  private _checkAll(on: boolean) {
    this._listView.itemViews
      .filter((itemView) => itemView.data.on !== on)
      .forEach((itemView) => itemView.switchView.setOn(on));
  }

  private _syncCheckAll() {
    this._checkAllView.setOn(this._isCheckAll());
  }

  private _isCheckAll() {
    return this._listView.itemViews.every(({ data }) => data.on);
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
