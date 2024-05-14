import { concat, each, filter, flat, map, pipe, reduce, take, zip } from '@fxts/core';
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

const usersHtml = (users) => html`
  <ul>
    ${users.map(userHtml)}
  </ul>
`;

abstract class View<T> {
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
    this.onRender();
    return this._element;
  }

  onRender() {}

  delegate(eventType, selector, listener) {
    this.element().addEventListener(eventType, (e) => {
      pipe(
        this.element().querySelectorAll(selector),
        filter((currentTarget) => (currentTarget as HTMLElement).contains(e.target)),
        take(1),
        each((currentTarget) => {
          listener(Object.assign(Object.fromEntries(entries(e)), { currentTarget }));
        }),
      );
    });
  }
}

function* entries(object) {
  for (const key in object) {
    yield [key, object[key]];
  }
}

interface User {
  name: string;
  age: number;
}

const userHtml = ({ name, age }: User) => html` <li>${name} (${age})</li> `;

class UserView extends View<User> {
  override template() {
    return html`
      <li class="user">${this.data.name} (<span class="age">${this.data.age}</span>)</li>
    `;
  }
}

class UsersView extends View<User[]> {
  override template(users: User[]): Tmpl {
    return html`
      <div style="margin-top: 40px;">
        <button>유저 추가</button>
        <ul class="users">
          ${users.map((user) => new UserView(user).template())}
        </ul>
      </div>
    `;
  }

  override onRender() {
    const userEls: NodeList = this.element().querySelectorAll('.user');
    const iterator = userEls[Symbol.iterator]();
    console.log(userEls);
    console.log(iterator.next());
    console.log(iterator.next());
    console.log(iterator.next());

    // const iterator2 = map(
    //   (userEl) => (userEl as HTMLElement).innerHTML,
    //   userEls
    // );
    //
    // console.log(iterator2.next());
    // console.log(iterator2.next());

    pipe(
      userEls,
      map((userEl) => (userEl as HTMLElement).querySelector('.age')!),
      map((ageEl) => parseInt(ageEl.innerHTML)),
      take(2),
      filter((age) => age % 2),
      reduce((a, b) => a + b),
      console.log,
      // (iter) => console.log([...iter])
    );

    console.log(
      [1, 2, 3]
        .map((a) => a + 10)
        .filter((a) => a % 2)
        .reduce((a, b) => a + b),
    );

    this.element()
      .querySelector('button')!
      .addEventListener('click', () => {
        this.element()
          .querySelector('.users')!
          .append(new UserView({ name: 'hjl', age: 23 }).render());
      });
  }
}

interface Ball {
  color: string;
}

class BallView extends View<Ball> {
  override template(): Tmpl {
    return html`
      <div
        class="ball"
        style="
        background: ${this.data.color};
        width: 40px;
        height: 40px;
        border-radius: 20px;
        text-align: center; 
      "
      >
        <span style="cursor: pointer; font-size: 12px;">${this.data.color}</span>
      </div>
    `;
  }

  override onRender() {
    this.element().animate(
      [
        { transform: 'translateX(0px)' },
        { transform: 'translateX(300px)' },
        { transform: 'translateX(0px)' },
      ],
      {
        duration: 5000,
        iterations: Infinity,
      },
    );
  }
}

class BallsView extends View<Ball[]> {
  override template(): Tmpl {
    return html`
      <div>
        <button>볼 추가</button>
        <div class="balls"></div>
      </div>
    `;
  }

  override onRender() {
    this.element()
      .querySelector('button')!
      .addEventListener('click', () => this._createBalls());

    this.delegate('click', '.balls .ball', (e) => e.currentTarget.remove());
  }

  private _createBalls() {
    this.data
      .map((ball) => new BallView(ball))
      .forEach((ballView) => this.element().querySelector('.balls')!.append(ballView.render()));
  }
}

export function main() {
  const balls: Ball[] = [{ color: 'red' }, { color: 'green' }, { color: 'blue' }];

  document.body.append(new BallsView(balls).render());

  // balls
  //   .map(ball => new BallView(ball))
  //   .forEach(ballView => document.body.append(ballView.render()));

  const users = [
    { name: 'idy', age: 20 },
    { name: 'bjk', age: 21 },
    { name: 'hdy', age: 22 },
    { name: 'kim', age: 23 },
  ];

  document.body.append(new UsersView(users).render());

  /*const a = 'a';
  const b = '<script>';
  const c = '<img onload="">';

  const result = html`
    <ul>
      <li>${a}</li>
      <li>${b}</li>
      <li>${c}</li>
      <li>${userHtml(users[2])}</li>
      <li>
        ${usersHtml(users)}
        ${usersHtml(users)}
      </li>
    </ul>
  `;

  console.log(result.toHtml());*/
}
