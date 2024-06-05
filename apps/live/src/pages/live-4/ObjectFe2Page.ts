import { html, Page } from 'rune-ts';
import { main as loadSetting } from './Setting';
import { main as loadTodo } from './Todo';

export class ObjectFe2Page extends Page<object> {
  override template() {
    return html`<div></div>`;
  }

  override onRender() {
    loadTodo();
    loadSetting();
    this.element().remove();
  }
}
