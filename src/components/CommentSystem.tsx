import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User, Send, Reply, ThumbsUp, Flag, MoreHorizontal } from "lucide-react";
import StarRating from "@/components/ui/star-rating-props";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Enhanced comment types with additional features
export type NestedReply = {
  id?: string;
  name: string;
  content: string;
  updatedTime: string;
  replies?: NestedReply[];
  likes?: number;
  isLiked?: boolean;
  isReported?: boolean;
};

export type Comment = {
  id?: string;
  name: string;
  content: string;
  updatedTime: string;
  rating?: number;
  replies?: NestedReply[];
  likes?: number;
  isLiked?: boolean;
  isReported?: boolean;
};

interface CommentSystemProps {
  comments: Comment[];
  onCommentSubmit: (comment: Omit<Comment, 'id' | 'updatedTime' | 'replies'>) => Promise<void>;
  onReplySubmit: (commentIndex: number, replyPath: number[], name: string, content: string) => Promise<void>;
  onLike?: (commentIndex: number, replyPath?: number[]) => Promise<void>;
  onReport?: (commentIndex: number, replyPath?: number[]) => Promise<void>;
  isSubmitting?: boolean;
  showRating?: boolean;
  maxDepth?: number;
}

// Separate component for reply forms to avoid re-render issues
const ReplyForm: React.FC<{
  onSubmit: (name: string, content: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  depth?: number;
}> = ({ onSubmit, onCancel, isSubmitting, depth = 0 }) => {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !content.trim()) {
      setError("Please fill in both name and reply fields.");
      return;
    }

    try {
      await onSubmit(name.trim(), content.trim());
      setName('');
      setContent('');
    } catch (error) {
      console.error('Error submitting reply:', error);
      setError(`Failed to add reply: ${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  };

  return (
    <Card className={`mt-3 p-3 bg-secondary/20 ${depth > 2 ? 'text-xs' : ''}`}>
      {error && (
        <Alert variant="destructive" className="mb-3">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full ${depth > 2 ? 'text-xs h-8' : ''}`}
            required
          />
        </div>
        <div>
          <Textarea
            placeholder="Write your reply..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`w-full ${depth > 2 ? 'text-xs min-h-[60px]' : 'min-h-[80px]'}`}
            required
          />
        </div>
        <div className="flex items-center justify-end space-x-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className={depth > 2 ? 'text-xs h-7 px-2' : ''}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting}
            className={`bg-brand-primary text-white hover:bg-brand-primary/90 ${depth > 2 ? 'text-xs h-7 px-2' : ''}`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                Posting...
              </>
            ) : (
              <>
                <Send className={`${depth > 2 ? 'w-2.5 h-2.5 mr-1' : 'w-3 h-3 mr-1'}`} />
                Post Reply
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

// Separate component for individual replies to avoid re-render issues
const ReplyItem: React.FC<{
  reply: NestedReply;
  commentIndex: number;
  replyPath: number[];
  depth: number;
  maxDepth: number;
  onReplySubmit: (commentIndex: number, replyPath: number[], name: string, content: string) => Promise<void>;
  onLike?: (commentIndex: number, replyPath: number[]) => Promise<void>;
  onReport?: (commentIndex: number, replyPath: number[]) => Promise<void>;
}> = ({ reply, commentIndex, replyPath, depth, maxDepth, onReplySubmit, onLike, onReport }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInMs = now.getTime() - commentDate.getTime();

    if (diffInMs < 0) return 'just now';

    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 60) return 'just now';
    else if (diffInMinutes < 60) return diffInMinutes === 1 ? '1 min ago' : `${diffInMinutes} mins ago`;
    else if (diffInHours < 24) return diffInHours === 1 ? '1 hr ago' : `${diffInHours} hrs ago`;
    else if (diffInDays < 7) return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    else if (diffInWeeks < 4) return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`;
    else if (diffInMonths < 12) return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
    else return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
  };

  const handleReplySubmit = async (name: string, content: string) => {
    setIsSubmittingReply(true);
    try {
      await onReplySubmit(commentIndex, replyPath, name, content);
      setShowReplyForm(false);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleLike = async () => {
    if (onLike) {
      try {
        await onLike(commentIndex, replyPath);
      } catch (error) {
        console.error('Error liking reply:', error);
      }
    }
  };

  const handleReport = async () => {
    if (onReport) {
      try {
        await onReport(commentIndex, replyPath);
      } catch (error) {
        console.error('Error reporting reply:', error);
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start space-x-3">
        <div className={`${depth > 2 ? 'bg-secondary/30 p-1' : 'bg-secondary/50 p-1.5'} rounded-full`}>
          <User className={`${depth > 2 ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-muted-foreground`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <span className={`font-medium text-foreground ${depth > 2 ? 'text-xs' : 'text-sm'}`}>
                {reply.name}
              </span>
              <span className={`text-muted-foreground ${depth > 2 ? 'text-xs' : 'text-xs'}`}>
                {formatTimeAgo(reply.updatedTime)}
              </span>
            </div>

            {/* Enhanced action menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onReport && (
                  <DropdownMenuItem onClick={handleReport}>
                    <Flag className="w-3 h-3 mr-2" />
                    Report
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className={`text-foreground leading-relaxed mb-2 ${depth > 2 ? 'text-xs' : 'text-sm'}`}>
            {reply.content}
          </p>

          {/* Enhanced action buttons */}
          <div className="flex items-center space-x-2">
            {onLike && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`p-0 h-auto font-normal ${depth > 2 ? 'text-xs' : 'text-sm'} ${
                  reply.isLiked ? 'text-brand-primary' : 'text-muted-foreground hover:text-brand-primary'
                }`}
              >
                <ThumbsUp className={`${depth > 2 ? 'w-3 h-3 mr-0.5' : 'w-4 h-4 mr-1'} ${reply.isLiked ? 'fill-current' : ''}`} />
                {reply.likes || 0}
              </Button>
            )}

            {/* Reply button - only show if not at max depth */}
            {depth < maxDepth && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className={`text-brand-primary hover:text-brand-primary/80 p-0 h-auto font-normal ${depth > 2 ? 'text-xs' : 'text-sm'}`}
              >
                <Reply className={`${depth > 2 ? 'w-3 h-3 mr-0.5' : 'w-4 h-4 mr-1'}`} />
                Reply
              </Button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <ReplyForm
              onSubmit={handleReplySubmit}
              onCancel={() => setShowReplyForm(false)}
              isSubmitting={isSubmittingReply}
              depth={depth}
            />
          )}
        </div>
      </div>

      {/* Render nested replies recursively */}
      {reply.replies && reply.replies.length > 0 && (
        <div className={`space-y-3 ${depth > 0 ? 'ml-6 pl-4 border-l-2 border-secondary' : ''}`}>
          {reply.replies.map((nestedReply, nestedIndex) => (
            <ReplyItem
              key={`${replyPath.join('-')}-${nestedIndex}`}
              reply={nestedReply}
              commentIndex={commentIndex}
              replyPath={[...replyPath, nestedIndex]}
              depth={depth + 1}
              maxDepth={maxDepth}
              onReplySubmit={onReplySubmit}
              onLike={onLike}
              onReport={onReport}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CommentSystem: React.FC<CommentSystemProps> = ({
  comments,
  onCommentSubmit,
  onReplySubmit,
  onLike,
  onReport,
  isSubmitting = false,
  showRating = true,
  maxDepth = 5
}) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentForm, setCommentForm] = useState({
    name: '',
    content: '',
    rating: 0
  });

  // Enhanced error handling
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Helper function to count all nested comments and replies
  const countNestedReplies = (replies: NestedReply[] = []): number => {
    let count = replies.length;
    replies.forEach(reply => {
      if (reply.replies) {
        count += countNestedReplies(reply.replies);
      }
    });
    return count;
  };

  // Get total comment count including all nested replies
  const getTotalCommentCount = () => {
    let totalCount = comments.length;
    comments.forEach(comment => {
      if (comment.replies) {
        totalCount += countNestedReplies(comment.replies);
      }
    });
    return totalCount;
  };

  // Format time ago helper with enhanced formatting
  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInMs = now.getTime() - commentDate.getTime();

    if (diffInMs < 0) return 'just now';

    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 60) return 'just now';
    else if (diffInMinutes < 60) return diffInMinutes === 1 ? '1 min ago' : `${diffInMinutes} mins ago`;
    else if (diffInHours < 24) return diffInHours === 1 ? '1 hr ago' : `${diffInHours} hrs ago`;
    else if (diffInDays < 7) return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    else if (diffInWeeks < 4) return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`;
    else if (diffInMonths < 12) return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
    else return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
  };

  // Enhanced comment submission with better error handling
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!commentForm.name.trim() || !commentForm.content.trim()) {
      setError("Please fill in both name and comment fields.");
      return;
    }

    if (showRating && commentForm.rating === 0) {
      setError("Please provide a rating for this article.");
      return;
    }

    try {
      await onCommentSubmit({
        name: commentForm.name.trim(),
        content: commentForm.content.trim(),
        rating: showRating ? commentForm.rating : undefined
      });

      setCommentForm({ name: '', content: '', rating: 0 });
      setShowCommentForm(false);
      setSuccess("Comment added successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError(`Failed to add comment: ${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  };

  // Handle reply submission - wrapper to match the new format
  const handleReplySubmitWrapper = async (commentIndex: number, replyPath: number[], name: string, content: string) => {
    try {
      await onReplySubmit(commentIndex, replyPath, name, content);
      setSuccess("Reply added successfully!");
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error adding reply:', error);
      throw error;
    }
  };

  // Handle like action
  const handleLike = async (commentIndex: number, replyPath?: number[]) => {
    if (onLike) {
      try {
        await onLike(commentIndex, replyPath);
      } catch (error) {
        console.error('Error liking comment:', error);
        setError('Failed to like comment. Please try again.');
      }
    }
  };

  // Handle report action
  const handleReport = async (commentIndex: number, replyPath?: number[]) => {
    if (onReport) {
      try {
        await onReport(commentIndex, replyPath);
        setSuccess('Comment reported successfully.');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        console.error('Error reporting comment:', error);
        setError('Failed to report comment. Please try again.');
      }
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-border">
      {/* Error and Success Messages */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">
          Comments ({getTotalCommentCount()})
        </h3>
        <Button
          onClick={() => setShowCommentForm(!showCommentForm)}
          className="bg-brand-primary text-white hover:bg-brand-primary/90"
        >
          {showCommentForm ? 'Cancel' : 'Add Comment'}
        </Button>
      </div>

      {/* Enhanced Comment Form */}
      {showCommentForm && (
        <Card className="p-6 mb-6">
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            {showRating && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Rate this article *
                </label>
                <StarRating
                  rating={commentForm.rating}
                  onRatingChange={(rating) => setCommentForm(prev => ({ ...prev, rating }))}
                  size="lg"
                  className="mb-4"
                />
              </div>
            )}
            <div>
              <Input
                placeholder="Your name"
                value={commentForm.name}
                onChange={(e) => setCommentForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full"
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="Write your comment..."
                value={commentForm.content}
                onChange={(e) => setCommentForm(prev => ({ ...prev, content: e.target.value }))}
                className="w-full min-h-[100px]"
                required
              />
            </div>
            <div className="flex items-center justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCommentForm(false);
                  setCommentForm({ name: '', content: '', rating: 0 });
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand-primary text-white hover:bg-brand-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Post Comment
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Enhanced Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment, commentIndex) => (
            <CommentItem
              key={comment.id || commentIndex}
              comment={comment}
              commentIndex={commentIndex}
              maxDepth={maxDepth}
              onReplySubmit={handleReplySubmitWrapper}
              onLike={handleLike}
              onReport={handleReport}
              formatTimeAgo={formatTimeAgo}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Separate component for individual comments to improve performance
const CommentItem: React.FC<{
  comment: Comment;
  commentIndex: number;
  maxDepth: number;
  onReplySubmit: (commentIndex: number, replyPath: number[], name: string, content: string) => Promise<void>;
  onLike?: (commentIndex: number, replyPath?: number[]) => Promise<void>;
  onReport?: (commentIndex: number, replyPath?: number[]) => Promise<void>;
  formatTimeAgo: (dateString: string) => string;
}> = ({ comment, commentIndex, maxDepth, onReplySubmit, onLike, onReport, formatTimeAgo }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const handleReplySubmit = async (name: string, content: string) => {
    setIsSubmittingReply(true);
    try {
      await onReplySubmit(commentIndex, [], name, content);
      setShowReplyForm(false);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleLike = async () => {
    if (onLike) {
      try {
        await onLike(commentIndex);
      } catch (error) {
        console.error('Error liking comment:', error);
      }
    }
  };

  const handleReport = async () => {
    if (onReport) {
      try {
        await onReport(commentIndex);
      } catch (error) {
        console.error('Error reporting comment:', error);
      }
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start space-x-4">
        <div className="bg-brand-primary/10 p-3 rounded-full">
          <User className="w-5 h-5 text-brand-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-foreground">{comment.name}</span>
              <span className="text-sm text-muted-foreground">
                {formatTimeAgo(comment.updatedTime)}
              </span>
            </div>

            {/* Enhanced action menu for main comments */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onReport && (
                  <DropdownMenuItem onClick={handleReport}>
                    <Flag className="w-4 h-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {comment.rating && comment.rating > 0 && (
            <div className="mb-3">
              <StarRating rating={comment.rating} readonly={true} size="sm" />
            </div>
          )}

          <p className="text-foreground leading-relaxed mb-4">{comment.content}</p>

          {/* Enhanced action buttons for main comments */}
          <div className="flex items-center space-x-4">
            {onLike && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`p-0 h-auto font-normal ${
                  comment.isLiked ? 'text-brand-primary' : 'text-muted-foreground hover:text-brand-primary'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 mr-1 ${comment.isLiked ? 'fill-current' : ''}`} />
                {comment.likes || 0}
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-brand-primary hover:text-brand-primary/80 p-0 h-auto font-normal"
            >
              <Reply className="w-4 h-4 mr-1" />
              Reply
            </Button>
          </div>

          {/* Main Reply Form */}
          {showReplyForm && (
            <ReplyForm
              onSubmit={handleReplySubmit}
              onCancel={() => setShowReplyForm(false)}
              isSubmitting={isSubmittingReply}
            />
          )}

          {/* Render Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-3 ml-6 pl-4 border-l-2 border-secondary">
              {comment.replies.map((reply, replyIndex) => (
                <ReplyItem
                  key={`${commentIndex}-${replyIndex}`}
                  reply={reply}
                  commentIndex={commentIndex}
                  replyPath={[replyIndex]}
                  depth={0}
                  maxDepth={maxDepth}
                  onReplySubmit={onReplySubmit}
                  onLike={onLike}
                  onReport={onReport}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CommentSystem;