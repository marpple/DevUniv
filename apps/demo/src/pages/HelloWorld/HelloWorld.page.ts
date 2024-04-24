import { html, Page } from 'rune-ts';
import klass from './HelloWorld.module.scss';
import favicon from '../../../public/favicon.png';
import { Counter } from '../../components/atoms/Counter/Counter';

export class HelloWorldPage extends Page<object> {
  override template() {
    return html`<div class="${klass.hello_world}">
      <div class="${klass.title}">
        Hello, Rune World <img src="${favicon}" alt="logo" class="${klass.logo}" />
      </div>
      ${new Counter({ count: 0 })}
      <div class="${klass.description}">
        작업을 원하시면 demo 앱을 복사하여 새로운 앱을 추가해서 작업 바랍니다.
      </div>
    </div>`;
  }
}
