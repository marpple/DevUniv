import { html, Page } from 'rune-ts';
import { main } from './concurrent';

export class IterableAndAsyncPage extends Page<object> {
  override template() {
    return html`<div></div>`;
  }

  override async onRender() {
    await main();
  }
}
