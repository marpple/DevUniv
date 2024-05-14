import { html, Page } from 'rune-ts';
import { main } from './html2.5';

export class MplPage extends Page<object> {
  override template() {
    return html`<div></div>`;
  }

  override onRender() {
    main();
  }
}
