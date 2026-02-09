import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot } from '@angular/router';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { inject } from '@angular/core';
import { ResourceManagerService } from './resource-manager.service';

const folderResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const _resourceManagerService = inject(ResourceManagerService);
    const router = inject(Router);
    
    const p1 = _resourceManagerService.getQuestionsByVault(Number(route.paramMap.get('question_vault_id')))
    const p2 = _resourceManagerService.getGroupsByVault(Number(route.paramMap.get('question_vault_id')))
    
    return Promise.all([p1,p2]).then(resEnd => {
        _resourceManagerService.question_vault_id = Number(route.paramMap.get('question_vault_id'))
        //FIEMX 3
        _resourceManagerService.setQuestionsToGroups(_resourceManagerService.question_vault_id)
    }).catch(error => {
        const parentUrl = state.url.split('/').slice(0, -1).join('/');
        // Navigate to there
        router.navigateByUrl(parentUrl);
        // Throw an error
        throw new Error('folderResolver:', error)
    });
};

export default [
    {
        path: '',
        children: [
            {
                path: '',
                component: ListComponent,
            },
            {
                path: 'edit', redirectTo: ''
            },
            {
                path: 'edit/:question_vault_id',
                component: EditComponent,
                resolve: {
                    item: folderResolver,
                },
            },
        ],
    },
] as Route[];
