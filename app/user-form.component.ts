
import {Component, OnInit} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {CanDeactivate, Router, RouteParams} from 'angular2/router';

import {BasicValidators} from './basicValidator';
import {UserService} from './user.service';
import {User} from './user';

@Component({
    templateUrl: 'app/user-form.component.html',
    providers: [UserService]
})
export class UserFormComponent implements OnInit, CanDeactivate {
    form: ControlGroup;
    isSaving = false;
    title: string;
    user = new User();

    constructor(
        fb: FormBuilder,
        private _router: Router,
        private _routeParams: RouteParams,
        private _userService: UserService
    ) {
        this.form = fb.group({
            name: ['', Validators.required],
            email: ['', BasicValidators.email],
            phone: [],
            address: fb.group({
                street: [],
                suite: [],
                city: [],
                zipcode: []
            })
        });
    }

    ngOnInit() {
        var id = this._routeParams.get("id");

        this.title = id ? "Edit User" : "New User";

        if (!id)
            return;
        
        this._userService.getUser(id)
                        .subscribe(
                            user => this.user = user,
                            response => {
                                if (response.status == 404)
                                    this._router.navigate(['NotFound']);
                            }
                        );
    }

    routerCanDeactivate() {
        if (this.form.dirty && !this.isSaving)
            return confirm('Are you sure you want to navigate away?');
        
        return true;
    }

    save() {
        // this._userService.addUser(this.form.value)
        //     .subscribe(x => this._router.navigate(['Users']));

        var result;

        if (this.user.id)
            result = this._userService.updateUser(this.user);
        else
            result = this._userService.addUser(this.user);

        result.subscribe(x => {
            this._router.navigate(['Users']);
        });

        this.isSaving = true;
    }
}