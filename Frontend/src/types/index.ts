// src/types/index.ts

export interface VideoSummary {
  videoId: any;
  id: string;                        
  userEmail: string;                
  videoUrl: string;
  videoTitle: string;               
  videoThumbnail: string;          
  summary: string;                  
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;              
  updatedAt?: string;          
}
