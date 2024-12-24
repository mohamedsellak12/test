import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ConversationService } from '../services/conversation.service';
import { MessageService } from '../services/message.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-conversation',
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.css'
})
export class ConversationComponent implements OnInit {
  recipientId:any;
  user:any;
  User:any;
  conversationId:any;
  messageSent:string='';
  messages:any=[];
  constructor(private route:ActivatedRoute 
    ,private conversationService:ConversationService
    , private messageService:MessageService ,
    private userService:UserServiceService
  ){
  }
  ngOnInit(): void {
    this.recipientId=this.route.snapshot.paramMap.get('id');
    if(!this.user){
      const storedUser=localStorage.getItem('user');
      this.user=storedUser?JSON.parse(storedUser) : null;
    }
    this.userService.getUserById(this.recipientId).subscribe({
      next: (response) => {
        this.User=response;
      },
      error: (error) => {
        console.error(error);
      }
    })
    this.conversationService.createConversation(this.user.id,this.recipientId).subscribe({
      next: (response) => {
        // console.log(response._id);
        this.conversationId=response._id;
        this.messageService.getMessages(this.conversationId).subscribe({
          next: (response) => {
            
            this.messages = response;
          },
          error: (error) => {
            console.error(error);
          }
        })
    

      },
      error: (error) => {
        console.error(error);
      }

    })



    
  }

  sendMessage(){
    this.messageService.sendMessage(this.conversationId,this.user.id,this.messageSent).subscribe({
      next: (response) => {
        this.messageSent='';
        this.messages.push(response);
      },
      error: (error) => {
        console.error(error);
      }
    })

  }


}
