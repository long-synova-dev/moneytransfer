import {trigger, state, animate, style, transition} from '@angular/animations';

export function PopUpFadeTransition() {
  return trigger('PopUpFadeTransition', [
    // state('void', style({position:'fixed', width:'100%'}) ),
    state('*', style({
      position:'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden'
    })),
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
