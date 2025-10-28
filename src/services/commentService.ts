// src/services/commentService.ts
import client from '@/lib/contentful';
import { Comment, NestedReply } from '@/components/CommentSystem';

interface ContentfulComment extends Comment {
  id?: string;
}

interface ContentfulNestedReply extends NestedReply {
  id?: string;
}

class CommentService {
  private managementToken: string;
  private spaceId: string;
  private environmentId: string;

  constructor() {
    this.managementToken = import.meta.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN;
    this.spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
    this.environmentId = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master';

    if (!this.managementToken) {
      throw new Error('Contentful Management Token not found. Please add VITE_CONTENTFUL_MANAGEMENT_TOKEN to your environment variables.');
    }
  }

  /**
   * Generate a unique ID for comments and replies
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Calculate average rating from comments
   */
  private calculateAverageRating(comments: ContentfulComment[]): number {
    const commentsWithRating = comments.filter(comment => comment.rating && comment.rating > 0);
    if (commentsWithRating.length === 0) return 0;
    
    const totalRating = commentsWithRating.reduce((sum, comment) => sum + (comment.rating || 0), 0);
    return Math.round((totalRating / commentsWithRating.length) * 10) / 10;
  }

  /**
   * Add reply at specific path in nested structure
   */
  private addReplyAtPath(
    comments: ContentfulComment[], 
    commentIndex: number, 
    replyPath: number[], 
    newReply: ContentfulNestedReply
  ): ContentfulComment[] {
    const updatedComments = [...comments];
    
    if (replyPath.length === 0) {
      // Add reply directly to the main comment
      if (!updatedComments[commentIndex].replies) {
        updatedComments[commentIndex].replies = [];
      }
      updatedComments[commentIndex].replies!.push(newReply);
    } else {
      // Navigate to the nested reply and add the new reply there
      let targetReplies = updatedComments[commentIndex].replies!;
      
      // Navigate through the path to find the target reply
      for (let i = 0; i < replyPath.length - 1; i++) {
        targetReplies = targetReplies[replyPath[i]].replies!;
      }
      
      // Add reply to the final target
      const finalIndex = replyPath[replyPath.length - 1];
      if (!targetReplies[finalIndex].replies) {
        targetReplies[finalIndex].replies = [];
      }
      targetReplies[finalIndex].replies!.push(newReply);
    }
    
    return updatedComments;
  }

  /**
   * Update like status for a comment or reply
   */
  private updateLikeAtPath(
    comments: ContentfulComment[], 
    commentIndex: number, 
    replyPath?: number[]
  ): ContentfulComment[] {
    const updatedComments = [...comments];
    
    if (!replyPath || replyPath.length === 0) {
      // Update main comment
      const comment = updatedComments[commentIndex];
      comment.likes = (comment.likes || 0) + (comment.isLiked ? -1 : 1);
      comment.isLiked = !comment.isLiked;
    } else {
      // Navigate to nested reply and update
      let targetReplies = updatedComments[commentIndex].replies!;
      
      // Navigate through the path to find the target reply
      for (let i = 0; i < replyPath.length - 1; i++) {
        targetReplies = targetReplies[replyPath[i]].replies!;
      }
      
      const targetReply = targetReplies[replyPath[replyPath.length - 1]];
      targetReply.likes = (targetReply.likes || 0) + (targetReply.isLiked ? -1 : 1);
      targetReply.isLiked = !targetReply.isLiked;
    }
    
    return updatedComments;
  }

  /**
   * Mark comment or reply as reported
   */
  private markAsReportedAtPath(
    comments: ContentfulComment[], 
    commentIndex: number, 
    replyPath?: number[]
  ): ContentfulComment[] {
    const updatedComments = [...comments];
    
    if (!replyPath || replyPath.length === 0) {
      // Update main comment
      updatedComments[commentIndex].isReported = true;
    } else {
      // Navigate to nested reply and update
      let targetReplies = updatedComments[commentIndex].replies!;
      
      // Navigate through the path to find the target reply
      for (let i = 0; i < replyPath.length - 1; i++) {
        targetReplies = targetReplies[replyPath[i]].replies!;
      }
      
      targetReplies[replyPath[replyPath.length - 1]].isReported = true;
    }
    
    return updatedComments;
  }

  /**
   * Fetch entry from Contentful
   */
  private async fetchEntry(entryId: string) {
    const response = await fetch(
      `https://api.contentful.com/spaces/${this.spaceId}/environments/${this.environmentId}/entries/${entryId}`,
      {
        headers: {
          'Authorization': `Bearer ${this.managementToken}`,
          'Content-Type': 'application/vnd.contentful.management.v1+json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch entry: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Update entry in Contentful
   */
  private async updateEntry(entryId: string, fields: any, version: number) {
    const response = await fetch(
      `https://api.contentful.com/spaces/${this.spaceId}/environments/${this.environmentId}/entries/${entryId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.managementToken}`,
          'Content-Type': 'application/vnd.contentful.management.v1+json',
          'X-Contentful-Version': version.toString()
        },
        body: JSON.stringify({ fields })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update entry: ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  }

  /**
   * Publish entry in Contentful
   */
  private async publishEntry(entryId: string, version: number) {
    const response = await fetch(
      `https://api.contentful.com/spaces/${this.spaceId}/environments/${this.environmentId}/entries/${entryId}/published`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.managementToken}`,
          'X-Contentful-Version': version.toString()
        }
      }
    );

    if (!response.ok) {
      console.warn('Failed to publish entry, but changes were saved as draft');
    }

    return response.ok;
  }

  /**
   * Fetch comments from Contentful
   */
  async fetchComments(postId: string): Promise<{ comments: ContentfulComment[], blogRating: number }> {
    try {
      const entry = await client.getEntry(postId);
      const commentsData = entry.fields.comment || [];
      // Calculate rating from existing comments instead of using a separate field
      const comments = commentsData as ContentfulComment[];
      const currentRating = this.calculateAverageRating(comments);

      return {
        comments,
        blogRating: currentRating
      };
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw new Error('Failed to fetch comments');
    }
  }

  /**
   * Add a new comment
   */
  async addComment(
    postId: string, 
    comment: Omit<ContentfulComment, 'id' | 'updatedTime' | 'replies'>
  ): Promise<ContentfulComment[]> {
    try {
      const entry = await this.fetchEntry(postId);
      const currentComments = entry.fields.comment?.['en-US'] || [];

      const newComment: ContentfulComment = {
        id: this.generateId(),
        name: comment.name,
        content: comment.content,
        updatedTime: new Date().toISOString(),
        rating: comment.rating,
        replies: [],
        likes: 0,
        isLiked: false,
        isReported: false
      };

      const updatedComments = [newComment, ...currentComments];

      const updatedEntry = await this.updateEntry(postId, {
        ...entry.fields,
        comment: { 'en-US': updatedComments }
      }, entry.sys.version);

      await this.publishEntry(postId, updatedEntry.sys.version);

      return updatedComments;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  /**
   * Add a reply to a comment
   */
  async addReply(
    postId: string,
    commentIndex: number,
    replyPath: number[],
    reply: Omit<ContentfulNestedReply, 'id' | 'updatedTime' | 'replies'>
  ): Promise<ContentfulComment[]> {
    try {
      const entry = await this.fetchEntry(postId);
      const currentComments = [...(entry.fields.comment?.['en-US'] || [])];

      const newReply: ContentfulNestedReply = {
        id: this.generateId(),
        name: reply.name,
        content: reply.content,
        updatedTime: new Date().toISOString(),
        replies: [],
        likes: 0,
        isLiked: false,
        isReported: false
      };

      const updatedComments = this.addReplyAtPath(currentComments, commentIndex, replyPath, newReply);

      const updatedEntry = await this.updateEntry(postId, {
        ...entry.fields,
        comment: { 'en-US': updatedComments }
      }, entry.sys.version);

      await this.publishEntry(postId, updatedEntry.sys.version);

      return updatedComments;
    } catch (error) {
      console.error('Error adding reply:', error);
      throw error;
    }
  }

  /**
   * Toggle like on a comment or reply
   */
  async toggleLike(
    postId: string,
    commentIndex: number,
    replyPath?: number[]
  ): Promise<ContentfulComment[]> {
    try {
      const entry = await this.fetchEntry(postId);
      const currentComments = [...(entry.fields.comment?.['en-US'] || [])];

      const updatedComments = this.updateLikeAtPath(currentComments, commentIndex, replyPath);

      const updatedEntry = await this.updateEntry(postId, {
        ...entry.fields,
        comment: { 'en-US': updatedComments }
      }, entry.sys.version);

      await this.publishEntry(postId, updatedEntry.sys.version);

      return updatedComments;
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  }

  /**
   * Report a comment or reply
   */
  async reportComment(
    postId: string,
    commentIndex: number,
    replyPath?: number[]
  ): Promise<ContentfulComment[]> {
    try {
      const entry = await this.fetchEntry(postId);
      const currentComments = [...(entry.fields.comment?.['en-US'] || [])];

      const updatedComments = this.markAsReportedAtPath(currentComments, commentIndex, replyPath);

      const updatedEntry = await this.updateEntry(postId, {
        ...entry.fields,
        comment: { 'en-US': updatedComments }
      }, entry.sys.version);

      await this.publishEntry(postId, updatedEntry.sys.version);

      return updatedComments;
    } catch (error) {
      console.error('Error reporting comment:', error);
      throw error;
    }
  }

  /**
   * Get comment statistics
   */
  getCommentStats(comments: ContentfulComment[]): {
    totalComments: number;
    totalReplies: number;
    averageRating: number;
    totalRatings: number;
  } {
    const countNestedReplies = (replies: ContentfulNestedReply[] = []): number => {
      let count = replies.length;
      replies.forEach(reply => {
        if (reply.replies) {
          count += countNestedReplies(reply.replies);
        }
      });
      return count;
    };

    const totalReplies = comments.reduce((acc, comment) => {
      return acc + countNestedReplies(comment.replies);
    }, 0);

    const commentsWithRating = comments.filter(comment => comment.rating && comment.rating > 0);
    const averageRating = this.calculateAverageRating(comments);

    return {
      totalComments: comments.length,
      totalReplies,
      averageRating,
      totalRatings: commentsWithRating.length
    };
  }
}

export default new CommentService();
