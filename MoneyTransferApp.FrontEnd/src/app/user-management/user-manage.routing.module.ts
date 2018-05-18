import { RouterModule } from "@angular/router";
import { Routes } from "@angular/router";
import { UserManageComponent } from "./user-manage.component";
import { UserEditComponent } from "./edit-user.component";

const routes: Routes = [
    {
        path: '',
        component: UserManageComponent,
        children:[
            {
                path: 'edit',
                component: UserEditComponent,
    
            },
            {
                path: 'new',
                component: UserEditComponent,
            },
        ]
    }

]

export const UserManageRouting = RouterModule.forChild(routes);
