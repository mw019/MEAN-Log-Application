import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private updatePosts = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: Post[] }>(
        'http://localhost:3000/api/posts'
      )
      // .pipe(
      //   map(postData => {
      //     return postData.posts.map(post => {
      //       return {
      //         title: post.title,
      //         content: post.content,
      //         id: post._id
      //       };
      //     });
      //   })
      // )
      .subscribe(postData => {
        this.posts = postData.posts;
        this.updatePosts.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.updatePosts.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string }>('http://localhost:3000/api/posts', post)
      .subscribe(responseData => {
        console.log(responseData.message);
        this.posts.push(post);
        this.updatePosts.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatePosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatePosts;
        this.updatePosts.next([...this.posts]);
      });
  }
}
