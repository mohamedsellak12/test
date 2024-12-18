import { Component, inject, OnInit } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PostService } from '../services/post.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule,FormsModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  id:any='';
  User:any;
  user:any;
  userService=inject(UserServiceService)
  
  constructor( private route:ActivatedRoute) { }
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
    this.id=this.route.snapshot.paramMap.get('id');
    this.userService.getUserById(this.id).subscribe({
      next: (data) => {
        this.User=data;
      },
      error: (err) => {
        console.error('Error retrieving user data', err);
      }
    })

    if(!this.user){
      const storedUser=localStorage.getItem('user');
      this.user=storedUser?JSON.parse(storedUser) : null;
    }
    console.log(this.user.id)
    this.postService.getPostsByUserId(this.id).subscribe({
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



