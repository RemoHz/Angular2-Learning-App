
import {Component, OnInit} from 'angular2/core';
import {UserService} from './user.service';
import {RouterLink} from 'angular2/router';

@Component({
    templateUrl: 'app/users.component.html',
    providers: [UserService],
    directives: [RouterLink]
})
export class UsersComponent implements OnInit {
    users: any[];

    constructor(private _service: UserService) {

    }

    ngOnInit() {
        this._service.getUsers()
                    .subscribe(users => this.users = users);
    }

    deleteUser(user) {
        if (confirm("Are you sure you want to delete " + user.name + "?")) {
            var index = this.users.indexOf(user);

            this.users.splice(index, 1);

            this._service.deleteUser(user.id)
                        .subscribe(null,
                                err => {
                                    alert("Could not delete the user");
                                    this.users.splice(index, 0, user);
                                });
        }
    }
}