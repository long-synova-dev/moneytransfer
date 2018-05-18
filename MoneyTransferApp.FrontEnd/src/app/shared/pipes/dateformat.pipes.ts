import {Pipe, PipeTransform, Injectable} from '@angular/core'
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'dateformatpipe',
})
@Injectable()
export class DateFormatPipe extends DatePipe implements PipeTransform{
    transform(value: string, includeHm?: any): any{
        let languageId = localStorage.getItem("currentLangId");
        let locate;
        switch(languageId){
            case '1':
            {
                if(includeHm)
                {
                    value = super.transform(value,'MM/dd-yyyy, HH:mm');
                }
                else
                {
                    value = super.transform(value,'MM/dd-yyyy');
                }
                break;
            }
            case '2':
            {
                if(includeHm)
                {
                    value = super.transform(value,'dd/MM-yyyy, HH:mm');
                }
                else
                {
                    value = super.transform(value,'dd/MM-yyyy');
                }
                break;
            }
            
        }
        return value;
    }
}