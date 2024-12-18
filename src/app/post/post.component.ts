import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../services/comment.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-post',
  imports: [CommonModule ,FormsModule , RouterModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {
  user: any;
  Posts: any=[];
  Comments: any=[];
  Comment: any={
    content: '',
    postId: '',
    userId: ''
  };
  isEditCommentPopupOpen = false;
  selectedComment: any = {};
  numberOfcomments:any;
  openMenuPostById:string|null=null 
  openCommentPostById:string|null=null ;
  updateOpenId:string|null=null ;
  updatedTitle:string=''
  updatedContent:string=''
  selectedPhoto: File | null = null;
  postService=inject(PostService)
  commentService=inject(CommentService)
  

  onSelectPhoto(event:any):void{
    this.selectedPhoto=event.target.files[0];
    console.log(this.selectedPhoto)
  }
  openCommentArea(postId:any){
    this.openCommentPostById=this.openCommentPostById===postId?null:postId;
    this.commentService.getCommentsOfPost(postId).subscribe({
      next: (response) => {
        console.log('Comments of post:', response);
        this.Comments=response.comments;
        this.numberOfcomments=this.Comments.length; // Update the number of comments for the post
      },
      error: (error) => {
        console.error('Error fetching comments of post:', error);
      }
    })

  }
  openEditPopup(comment:any){
    this.isEditCommentPopupOpen=true;
    this.selectedComment={...comment};
  }
  closeEditPopup(){
    this.isEditCommentPopupOpen=false;
    this.selectedComment={};
  }
  onUpdateComment(){
    this.commentService.updateComment(this.selectedComment._id ,this.selectedComment.content)
    .subscribe({
      next: (response) => {
        const commentIndex = this.Comments.findIndex((c:any) => c._id === this.selectedComment._id);
        if (commentIndex > -1) {
          this.Comments[commentIndex] = { ...this.Comments[commentIndex], ...response.comment };
        }

        // Fermer le popup
        this.isEditCommentPopupOpen = false;
        this.selectedComment = {};
        console.log('Comment updated successfully:', response.message);
        
      },
      error: (error) => {
        console.error('Error updating comment:', error);
      }

    })
  }
  isCommentAreaOpen(postId:any){
     return this.openCommentPostById===postId ;
  }
  openUpdateForm(post:any){
    this.updateOpenId=post._id;
    this.updatedTitle=post.title;
    this.updatedContent=post.content;
  }
  closeUpdateForm(){
    this.updateOpenId=null;
  }

  toggleMenu(postId:any){
    this.openMenuPostById=this.openMenuPostById===postId ?null: postId ;
  }

  isMenuOpen(postId:string):boolean{
    return this.openMenuPostById===postId ;
  }
   
  ngOnInit(): void {
    console.log(this.Posts)
    if(!this.user){
      const storedUser=localStorage.getItem('user');
      this.user=storedUser?JSON.parse(storedUser) : null;
    } // Retrieve the user data
    console.log('User data:', this.user);
    // Fetch all posts from the server
    this.postService.getAllPosts().subscribe({
      next: (response) => {
        console.log('All posts:', response);
        this.Posts=response;
         // Assign the posts to the component's posts array
      },
      error: (error) => {
        console.error('Error fetching posts:', error);
      }
    })
   
  }
  //adding comment
  onAddComment(idPost:any){
    // console.log(this.Comment)
    if (typeof window !== 'undefined' && window.localStorage) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && user.id) {
        this.Comment.userId = user.id;
      } else {
        console.error('User ID is missing in localStorage.');
        return; // Prevent the post from being submitted without an author.
      }
    } else {
      console.error('LocalStorage is not available.');
      return;
    }
    this.Comment.postId=idPost;
   

    this.commentService.addComment(this.Comment).subscribe({
      next: (response) => {
        this.Comments.push(response.comment)
        this.Comment={
          content: '',
          postId: '',
          userId: '',
        }
        // Add the new comment to the corresponding post
        alert(response.message)
      },
      error: (error) => {
        console.error('Error adding comment:', error);
      }

    })
  }
  onDeleteComment(id:any){
    if(confirm('Are you sure you want to delete this comment')){
      this.commentService.deleteComment(id).subscribe({
        next: (response) => {
          console.log('Comment deleted successfully');
          this.Comments=this.Comments.filter((comment :any)=>comment._id!==id); // Remove the deleted comment from the comments array
        },
        error: (error) => {
          console.error('Error deleting comment:', error);
        }
      })

    }


  }
  
  Ondelete(id:string){
    if(confirm('Are you sure you want to delete this post?')){
      this.postService.deletePost(id).subscribe({
        next: (response) => {
          console.log('Post deleted successfully');
          this.Posts=this.Posts.filter((post :any)=>post._id!==id); // Remove the deleted post from the posts array
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
          const index = this.Posts.findIndex((post :any) => post._id === id);
          if (index !== -1) {
            this.Posts[index] = { ...this.Posts[index], ...formData };
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
