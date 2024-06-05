import { CustomEventWithDetail } from 'rune-ts';

export class Toggled extends CustomEventWithDetail<{ on: boolean }> {}
