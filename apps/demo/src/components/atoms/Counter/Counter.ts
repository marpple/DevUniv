import { html, View } from 'rune-ts';
import klass from './Counter.module.scss';

export class Counter extends View<{ count: number }> {
  override template() {
    return html`
      <div class="${klass.counter}">
        <button class="${klass.button}" name="minus" type="button">
          <span>-</span>
        </button>
        <div>${this.data.count}</div>
        <button class="${klass.button}" name="plus" type="button">
          <span>+</span>
        </button>
      </div>
    `;
  }

  override onRender() {
    this.delegate('click', 'button[name="minus"]', () => {
      this.data.count -= 1;
      this.redraw();
    });

    this.delegate('click', 'button[name="plus"]', () => {
      this.data.count += 1;
      this.redraw();
    });
  }
}
