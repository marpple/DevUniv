import { concat, flat, map, pipe, reduce, zip } from '@fxts/core';
import { escapeHtml } from './helper';

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

function upper(strings, ...values: string[]) {
  return joinTT(strings, values, (v) => v.toUpperCase());
}

// function* concat(...arrs) {
//   for (const arr of arrs) {
//     yield* arr;
//   }
// }

class Tmpl {
  constructor(
    private strings: TemplateStringsArray,
    private values: unknown[],
  ) {}

  private _merge = (value: unknown) =>
    Array.isArray(value) ? value.reduce((a, b) => html`${a}${b}`) : value;

  private _escapeHtml = (value: unknown) =>
    value instanceof Tmpl ? value.toHtml() : escapeHtml(value);

  toHtml() {
    return joinTT(this.strings, this.values, (v) => this._escapeHtml(this._merge(v)));
  }
}

const html = (strings: TemplateStringsArray, ...values: unknown[]) => new Tmpl(strings, values);

abstract class View<T> {
  constructor(public data: T) {}

  template(data: T) {
    return html``;
  }

  render() {
    const wrapEl = document.createElement('div');
    wrapEl.innerHTML = this.template(this.data).toHtml();
    return wrapEl.children[0];
  }
}

interface User {
  name: string;
  age: number;
}

class UsersView extends View<User[]> {
  override template(): Tmpl {
    return html`
      <div class="users">
        ${this.data.map(
          (user) => html`
            <div class="user">
              <input type="checkbox" />
              <span>${user.name}</span>
              <span>${user.age}</span>
            </div>
          `,
        )}
      </div>
    `;
  }
}

export function main() {
  const a = 'a';
  const b = '<script>';
  const c = '<img onload="">';

  const result = html`
    <ul>
      <li>${a}</li>
      <li>${b}</li>
      <li>${c}</li>
      <li>
        ${html`
          <ul>
            ${[a, b, c].map((v) => html` <li>${v}</li> `)}
          </ul>
        `}
      </li>
    </ul>
  `;

  console.log('result: ', result);
  console.log('result: ', result.toHtml());

  console.log(
    upper`
      1${a}2${b}3${c}
    `,
  );

  const users: User[] = [
    { name: 'idy', age: 20 },
    { name: 'idy', age: 22 },
    { name: 'idy', age: 23 },
    { name: 'idy', age: 25 },
    { name: 'idy', age: 26 },
  ];

  console.log(
    new UsersView([
      { name: 'idy', age: 20 },
      { name: 'idy', age: 22 },
      { name: 'idy', age: 23 },
    ]).render(),
  );

  document.body.append(new UsersView(users).render());
}
