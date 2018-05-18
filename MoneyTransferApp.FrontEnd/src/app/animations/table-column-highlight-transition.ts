import { trigger, state, animate, style, transition } from '@angular/animations';

export function tableColumnHighlightTransition() {
    return trigger('tableColumnHighlightTransition', [
        transition('valid => invalid', [
            style({ background: '#bac3ca' }),
            animate('2s ease-in-out', style({ background: 'transparent' }))
        ])
    ]);
}
