
import {Component, OnInit} from 'angular2/core';
import {PostService} from './post.service';
import {SpinnerComponent} from './spinner.component';
import {UserService} from './user.service';
import {PaginationComponent} from './pagination.component';

@Component({
    templateUrl: 'app/posts.component.html',
    styles: [`
         .posts li { cursor: default; }
         .posts li:hover { background: #ecf0f1; } 
         .list-group-item.active, 
         .list-group-item.active:hover, 
         .list-group-item.active:focus { 
             background-color: #ecf0f1;
             border-color: #ecf0f1; 
             color: #2c3e50;
         }
    `],
    providers: [PostService, UserService],
    directives: [SpinnerComponent, PaginationComponent]
})
export class PostsComponent implements OnInit {
    posts = [];
    users = [];
    postsLoading;
    commentsLoading;
    currentPost;
    pagedPosts = [];
    pageSize = 10;

    constructor(private _postService: PostService, 
                private _userService: UserService) 
    {

    }

    ngOnInit() {
        this.loadUsers();
        this.loadPosts();
    }

    private loadUsers() {
        this._userService.getUsers()
                        .subscribe(users => this.users = users);
    }

    private loadPosts(filter?) {
        this.postsLoading = true;

        this._postService.getPosts(filter)
                        .subscribe(
                            posts => {
                                this.posts = posts;
                                this.pagedPosts = this.getPostsInPage(1);
                            },
                            null,
                            () => { this.postsLoading = false; }
                        );
    }

    onPageChanged(page) {
        this.pagedPosts = this.getPostsInPage(page);
    }

    private getPostsInPage(page) {
        var result = [];

        var startIndex = (page-1)*this.pageSize;
        var endIndex = Math.min(startIndex + this.pageSize, this.posts.length);

        for (var i = startIndex; i < endIndex; i++) {
            result.push(this.posts[i]);
        } 

        return result;
    }

    reloadPosts(filter) {
        this.currentPost = null;
        this.loadPosts(filter);
    }

    select (post) {
        this.currentPost = post;

        this.commentsLoading = true;

        this._postService.getComments(post.id)
                        .subscribe(
                            comments => this.currentPost.comments = comments,
                            null,
                            () => this.commentsLoading = false
                        );
    }
}