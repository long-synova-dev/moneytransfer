import {trigger, state, animate, style, transition} from '@angular/animations';

export function tableAddRowTransition() {
  return trigger('tableAddRowTransition', [
    transition(':enter', [
      style({background: '#e0e3e7'}),
      animate('1s ease-in-out', style({background: 'transparent'}))
    ]),
    transition(':leave', [
      style({opacity: 1}),
      animate('0.1s ease-in-out', style({opacity: 0}))
    ])
  ]);
}
