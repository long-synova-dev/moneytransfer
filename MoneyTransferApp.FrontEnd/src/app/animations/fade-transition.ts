import {trigger, state, animate, style, transition} from '@angular/animations';

export function fadeTransition() {
  return trigger('fadeTransition', [
    state('void', style({position:'fixed', width:'100%'}) ),
    state('*', style({position:'relative', width:'100%'}) ),
    transition(':enter', [
      style({opacity: 0}),
      animate('0.5s ease-in-out', style({opacity: 1}))
    ]),
    transition(':leave', [
      style({opacity: 1}),
      animate('0.1s ease-in-out', style({opacity: 0}))
    ])
  ]);
}
