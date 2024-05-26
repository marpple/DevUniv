import { html, View } from 'rune-ts';
import { Toggled } from './events/Toggled';

export class SwitchView extends View<{ on: boolean }> {
  override template() {
    return html`
      <button class="${this.data.on ? 'on' : ''}">
        <span class="toggle"></span>
      </button>
    `;
  }

  protected override onRender() {
    this.addEventListener('click', () => this._toggle());
  }

  private _toggle() {
    this.setOn(!this.data.on);
    this.dispatchEvent(Toggled, { bubbles: true, detail: this.data });
  }

  setOn(bool: boolean) {
    this.data.on = bool;
    this.element().classList.toggle('on', bool);
  }
}
