import { PipeTransform, Injectable, Pipe } from '@angular/core';
@Pipe({
  name: 'replace'
})
@Injectable()
export class ReplacePipe implements PipeTransform {
  constructor(){}
  transform(item: any): any {
    let locale = localStorage.getItem("lang");
    let lang = JSON.parse(locale).languageCode.split('-')[0];
    if (lang == 'en') {
      return item;  
    } else {
        let clone = item.slice(0);
        clone = clone.replace(",", "|").replace(".", ",").replace("|", ".");
        return clone;
    }
  }
}
