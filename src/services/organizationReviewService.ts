// src/services/organizationReviewService.ts
import { Comment, NestedReply } from '@/components/CommentSystem';

interface OrganizationReview extends Comment {
  id?: string;
}

interface OrganizationNestedReply extends NestedReply {
  id?: string;
}

class OrganizationReviewService {
  private localStorageKey = 'organization-reviews';

  /**
   * Generate a unique ID for reviews and replies
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get all reviews for all organizations
   */
  private getAllReviews(): Record<string, OrganizationReview[]> {
    try {
      const data = localStorage.getItem(this.localStorageKey);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error reading reviews from localStorage:', error);
      return {};
    }
  }

  /**
   * Save all reviews to localStorage
   */
  private saveAllReviews(reviews: Record<string, OrganizationReview[]>) {
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(reviews));
    } catch (error) {
      console.error('Error saving reviews to localStorage:', error);
    }
  }

  /**
   * Calculate average rating from reviews
   */
  private calculateAverageRating(reviews: OrganizationReview[]): number {
    const reviewsWithRating = reviews.filter(review => review.rating && review.rating > 0);
    if (reviewsWithRating.length === 0) return 0;
    
    const totalRating = reviewsWithRating.reduce((sum, review) => sum + (review.rating || 0), 0);
    return Math.round((totalRating / reviewsWithRating.length) * 10) / 10;
  }

  /**
   * Add reply at specific path in nested structure
   */
  private addReplyAtPath(
    reviews: OrganizationReview[], 
    reviewIndex: number, 
    replyPath: number[], 
    newReply: OrganizationNestedReply
  ): OrganizationReview[] {
    const updatedReviews = [...reviews];
    
    if (replyPath.length === 0) {
      if (!updatedReviews[reviewIndex].replies) {
        updatedReviews[reviewIndex].replies = [];
      }
      updatedReviews[reviewIndex].replies!.push(newReply);
    } else {
      let targetReplies = updatedReviews[reviewIndex].replies!;
      
      for (let i = 0; i < replyPath.length - 1; i++) {
        targetReplies = targetReplies[replyPath[i]].replies!;
      }
      
      const finalIndex = replyPath[replyPath.length - 1];
      if (!targetReplies[finalIndex].replies) {
        targetReplies[finalIndex].replies = [];
      }
      targetReplies[finalIndex].replies!.push(newReply);
    }
    
    return updatedReviews;
  }

  /**
   * Update like status for a review or reply
   */
  private updateLikeAtPath(
    reviews: OrganizationReview[], 
    reviewIndex: number, 
    replyPath?: number[]
  ): OrganizationReview[] {
    const updatedReviews = [...reviews];
    
    if (!replyPath || replyPath.length === 0) {
      const review = updatedReviews[reviewIndex];
      review.likes = (review.likes || 0) + (review.isLiked ? -1 : 1);
      review.isLiked = !review.isLiked;
    } else {
      let targetReplies = updatedReviews[reviewIndex].replies!;
      
      for (let i = 0; i < replyPath.length - 1; i++) {
        targetReplies = targetReplies[replyPath[i]].replies!;
      }
      
      const targetReply = targetReplies[replyPath[replyPath.length - 1]];
      targetReply.likes = (targetReply.likes || 0) + (targetReply.isLiked ? -1 : 1);
      targetReply.isLiked = !targetReply.isLiked;
    }
    
    return updatedReviews;
  }

  /**
   * Mark review or reply as reported
   */
  private markAsReportedAtPath(
    reviews: OrganizationReview[], 
    reviewIndex: number, 
    replyPath?: number[]
  ): OrganizationReview[] {
    const updatedReviews = [...reviews];
    
    if (!replyPath || replyPath.length === 0) {
      updatedReviews[reviewIndex].isReported = true;
    } else {
      let targetReplies = updatedReviews[reviewIndex].replies!;
      
      for (let i = 0; i < replyPath.length - 1; i++) {
        targetReplies = targetReplies[replyPath[i]].replies!;
      }
      
      targetReplies[replyPath[replyPath.length - 1]].isReported = true;
    }
    
    return updatedReviews;
  }

  /**
   * Fetch reviews for an organization
   */
  async fetchReviews(organizationId: string): Promise<{ reviews: OrganizationReview[], averageRating: number }> {
    const allReviews = this.getAllReviews();
    const reviews = allReviews[organizationId] || [];
    const averageRating = this.calculateAverageRating(reviews);

    return {
      reviews,
      averageRating
    };
  }

  /**
   * Add a new review
   */
  async addReview(
    organizationId: string, 
    review: Omit<OrganizationReview, 'id' | 'updatedTime' | 'replies'>
  ): Promise<OrganizationReview[]> {
    const allReviews = this.getAllReviews();
    const currentReviews = allReviews[organizationId] || [];

    const newReview: OrganizationReview = {
      id: this.generateId(),
      name: review.name,
      content: review.content,
      updatedTime: new Date().toISOString(),
      rating: review.rating,
      replies: [],
      likes: 0,
      isLiked: false,
      isReported: false
    };

    const updatedReviews = [newReview, ...currentReviews];
    allReviews[organizationId] = updatedReviews;
    
    this.saveAllReviews(allReviews);

    return updatedReviews;
  }

  /**
   * Add a reply to a review
   */
  async addReply(
    organizationId: string,
    reviewIndex: number,
    replyPath: number[],
    reply: Omit<OrganizationNestedReply, 'id' | 'updatedTime' | 'replies'>
  ): Promise<OrganizationReview[]> {
    const allReviews = this.getAllReviews();
    const currentReviews = [...(allReviews[organizationId] || [])];

    const newReply: OrganizationNestedReply = {
      id: this.generateId(),
      name: reply.name,
      content: reply.content,
      updatedTime: new Date().toISOString(),
      replies: [],
      likes: 0,
      isLiked: false,
      isReported: false
    };

    const updatedReviews = this.addReplyAtPath(currentReviews, reviewIndex, replyPath, newReply);
    allReviews[organizationId] = updatedReviews;
    
    this.saveAllReviews(allReviews);

    return updatedReviews;
  }

  /**
   * Toggle like on a review or reply
   */
  async toggleLike(
    organizationId: string,
    reviewIndex: number,
    replyPath?: number[]
  ): Promise<OrganizationReview[]> {
    const allReviews = this.getAllReviews();
    const currentReviews = [...(allReviews[organizationId] || [])];

    const updatedReviews = this.updateLikeAtPath(currentReviews, reviewIndex, replyPath);
    allReviews[organizationId] = updatedReviews;
    
    this.saveAllReviews(allReviews);

    return updatedReviews;
  }

  /**
   * Report a review or reply
   */
  async reportReview(
    organizationId: string,
    reviewIndex: number,
    replyPath?: number[]
  ): Promise<OrganizationReview[]> {
    const allReviews = this.getAllReviews();
    const currentReviews = [...(allReviews[organizationId] || [])];

    const updatedReviews = this.markAsReportedAtPath(currentReviews, reviewIndex, replyPath);
    allReviews[organizationId] = updatedReviews;
    
    this.saveAllReviews(allReviews);

    return updatedReviews;
  }

  /**
   * Get review statistics
   */
  getReviewStats(reviews: OrganizationReview[]): {
    totalReviews: number;
    totalReplies: number;
    averageRating: number;
    totalRatings: number;
  } {
    const countNestedReplies = (replies: OrganizationNestedReply[] = []): number => {
      let count = replies.length;
      replies.forEach(reply => {
        if (reply.replies) {
          count += countNestedReplies(reply.replies);
        }
      });
      return count;
    };

    const totalReplies = reviews.reduce((acc, review) => {
      return acc + countNestedReplies(review.replies);
    }, 0);

    const reviewsWithRating = reviews.filter(review => review.rating && review.rating > 0);
    const averageRating = this.calculateAverageRating(reviews);

    return {
      totalReviews: reviews.length,
      totalReplies,
      averageRating,
      totalRatings: reviewsWithRating.length
    };
  }

  /**
   * Get overall statistics for all organizations
   */
  getAllOrganizationsStats(): Record<string, { averageRating: number; totalRatings: number; totalReviews: number }> {
    const allReviews = this.getAllReviews();
    const stats: Record<string, { averageRating: number; totalRatings: number; totalReviews: number }> = {};

    Object.keys(allReviews).forEach(orgId => {
      const reviews = allReviews[orgId];
      const reviewStats = this.getReviewStats(reviews);
      stats[orgId] = {
        averageRating: reviewStats.averageRating,
        totalRatings: reviewStats.totalRatings,
        totalReviews: reviewStats.totalReviews
      };
    });

    return stats;
  }
}

export default new OrganizationReviewService();

