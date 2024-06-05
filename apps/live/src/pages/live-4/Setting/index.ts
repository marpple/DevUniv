import { View, html } from 'rune-ts';
import { SwitchView } from '../lib/SwitchView';
import { ListView } from '../lib/ListView';
import { CheckAllController } from '../lib/CheckAllController';

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

class SettingListView extends ListView<Setting, SettingItemView> {
  createItemView(itemData: Setting) {
    return new SettingItemView(itemData);
  }
}

class SettingPage extends View<Setting[]> {
  private _checkAllController = new CheckAllController(
    new SwitchView(),
    new SettingListView(this.data),
    (itemView) => itemView.data.on,
    (itemView, bool) => itemView.switchView.setOn(bool),
  );

  override template() {
    return html`
      <div>
        <div class="header">
          <h2>Setting</h2>
          ${this._checkAllController.checkAllView}
        </div>
        <div class="body">${this._checkAllController.listView}</div>
      </div>
    `;
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
