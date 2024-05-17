import { html, Page } from 'rune-ts';
import { main } from './concurrent';
import { main as main2 } from './concurrent2';

export class ConcurrentPage extends Page<object> {
  override template() {
    return html`<div></div>`;
  }

  override async onRender() {
    // await main();
    await main2();
  }
}
