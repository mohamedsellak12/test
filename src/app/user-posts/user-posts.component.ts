import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-user-posts',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './user-posts.component.html',
  styleUrl: './user-posts.component.css'
})
export class UserPostsComponent implements OnInit{
  user:any;
  posts:any=[];
  openMenuPostById:string|null=null ;
  updateOpenId:string|null=null ;
  updatedTitle:string=''
  updatedContent:string=''
  selectedPhoto: File | null = null;
  emptyMessage:string|null=null;
  postService=inject(PostService)


  onSelectPhoto(event:any):void{
    this.selectedPhoto=event.target.files[0];
    console.log(this.selectedPhoto)
  }
  closeUpdateForm(){
    this.updateOpenId=null;
  }

  toggleMenu(postId:any){
    this.openMenuPostById=this.openMenuPostById===postId?null:postId;
  }
  openUpdateForm(post:any){
    this.updateOpenId=post._id;
    this.updatedTitle=post.title;
    this.updatedContent=post.content;

  }
  isMenuOpen(postId:string):boolean{
    return this.openMenuPostById===postId ;
  }
  ngOnInit(): void {
    if(!this.user){
      const storedUser=localStorage.getItem('user');
      this.user=storedUser?JSON.parse(storedUser) : null;
    }
    console.log(this.user.id)
    this.postService.getPostsByUserId(this.user.id).subscribe({
      next:( response )=>{
        this.posts=response
        if(this.posts.length===0){
          this.emptyMessage='No posts found for this user'
        }
      },
      error:( error )=> {
        console.error('Error:', error)
      }})
    
  }
  Ondelete(id:string){
    if(confirm('Are you sure you want to delete this post?')){
      this.postService.deletePost(id).subscribe({
        next: (response) => {
          console.log('Post deleted successfully');
          this.posts=this.posts.filter((post :any)=>post._id!==id); // Remove the deleted post from the posts array
          alert(response.message)
        },
        error: (error) => {
          console.error('Error deleting post:', error);
        }
      })
    }
  }
  
  onSubmit(id: string ,event:Event){
    event.preventDefault()
    const formData = new FormData();
    formData.append('title', this.updatedTitle);
    formData.append('content', this.updatedContent);
    if(this.selectedPhoto){
      formData.append('photo', this.selectedPhoto);
    }
    this.postService.updatePost(id,formData).subscribe({
        next: (response) => {
          console.log('Post updated successfully');
          const updatedPost=response;
          // Find and update the post in the posts array
          const index = this.posts.findIndex((post :any) => post._id === id);
          if (index !== -1) {
            this.posts[index] = { ...this.posts[index], ...formData };
          } // Replace the old post with the updated one in the posts array
          this.closeUpdateForm();
          alert(response.message)
        },
        error: (error) => {
          console.error('Error updating post:', error);
        }
      })
  }


}
