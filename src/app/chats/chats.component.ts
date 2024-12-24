import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConversationService } from '../services/conversation.service';

@Component({
  selector: 'app-chats',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css'
})
export class ChatsComponent implements OnInit {
  conversations:any= [];
  user:any;



  constructor(private conversationService:ConversationService){}
  ngOnInit(): void {
    if(!this.user){
      const storedUser=localStorage.getItem('user');
      this.user=storedUser?JSON.parse(storedUser) : null;
    }
    this.conversationService.getConversations(this.user.id).subscribe({
      next: (response) => this.conversations=response.filter((c:any) =>!!c.lastMessage),
      error: (error) => console.log(error)
    })

  }

}
