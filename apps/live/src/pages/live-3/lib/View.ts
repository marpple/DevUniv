import { concat, each, filter, flat, map, pipe, reduce, take, zip } from '@fxts/core';
import { escapeHtml } from './escape';

export const html = (strings: TemplateStringsArray, ...values: unknown[]) =>
  new Tmpl(strings, values);

class Tmpl {
  constructor(
    private strings: TemplateStringsArray,
    private values: unknown[],
  ) {}

  private _merge = (value: unknown) =>
    Array.isArray(value) ? value.reduce((a, b) => html`${a}${b}`) : value;

  private _escapeHtml = (value: unknown): string =>
    value instanceof Tmpl ? value.toHtml() : escapeHtml(value);

  toHtml() {
    return joinTT(this.strings, this.values, (v) => this._escapeHtml(this._merge(v)));
  }
}

const joinTT = <T>(strings: TemplateStringsArray, values: T[], f: (value: T) => string) =>
  pipe(
    zip(
      strings,
      concat(
        map((v) => f(v), values),
        [''],
      ),
    ),
    flat,
    reduce((a, b) => a + b),
  );

export class View<T> {
  private _element: HTMLElement | null = null;

  constructor(public data: T) {}

  element(): HTMLElement {
    if (this._element === null) {
      throw TypeError('render를 실행한 후 사용해야 합니다.');
    }
    return this._element;
  }

  template(data: T) {
    return html``;
  }

  render() {
    const wrapEl = document.createElement('div');
    wrapEl.innerHTML = this.template(this.data).toHtml();
    this._element = wrapEl.children[0] as HTMLElement;
    this._element.classList.add(this.constructor.name);
    this.onRender();
    return this._element;
  }

  protected onRender() {}

  delegate<K extends keyof HTMLElementEventMap>(
    eventType: K,
    selector: string,
    listener: (this: this, e: HTMLElementEventMap[K]) => void,
  ): this {
    this.element().addEventListener(eventType, (e) => {
      pipe(
        this.element().querySelectorAll(selector),
        filter((currentTarget) => (currentTarget as HTMLElement).contains(e.target as HTMLElement)),
        take(1),
        each((currentTarget) => {
          listener.call(
            this,
            Object.assign(Object.fromEntries(entries(e)), {
              currentTarget,
            }) as HTMLElementEventMap[K],
          );
        }),
      );
    });
    return this;
  }
}

function* entries(object) {
  for (const key in object) {
    yield [key, object[key]];
  }
}
