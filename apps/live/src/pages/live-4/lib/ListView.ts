import { html, View } from 'rune-ts';

export abstract class ListView<T extends object, IV extends View<T>> extends View<T[]> {
  itemViews = this.data.map((itemData) => this.createItemView(itemData));

  abstract createItemView(itemData: T): IV;

  override template() {
    return html` <div>${this.itemViews}</div> `;
  }
}
