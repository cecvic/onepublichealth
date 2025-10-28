// src/utils/utils.ts
import { Document } from "@contentful/rich-text-types";
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

export type EducationPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  upvotes: number;
  comments: number;
  readTime: string;
  content: string;
  keyConsiderations: string;
  futureDirections: string;
  rating?: number;
};

export type Resource = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  publishedAt: string;
  detailDescription: string;
  keyConsiderations: string;
  futureDirections: string;
  readTime: string;
};

export type Magazine = {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  issueNumber: string;
  publishedDate: string;
};

export type Institution = {
  id: string;
  companyName: string;
  shortDescription: string;
  description: string;
  vision: string;
  overallRating: number;
  totalComments: number;
  comments: Comment[];
  website?: string;
  category?: string;
};

export type Comment = {
  name: string;
  content: string;
  updatedTime: string;
  rating?: number;
};

// Helper function to extract plain text from Contentful rich text
const extractTextFromRichText = (richTextDocument: any): string => {
  if (!richTextDocument || !richTextDocument.content) return "";
  
  let text = "";
  const extractFromContent = (content: any[]) => {
    content.forEach((node: any) => {
      if (node.nodeType === "paragraph" && node.content) {
        node.content.forEach((textNode: any) => {
          if (textNode.nodeType === "text" && textNode.value) {
            text += textNode.value + " ";
          }
        });
      } else if (node.nodeType === "unordered-list" && node.content) {
        node.content.forEach((listItem: any) => {
          if (listItem.nodeType === "list-item" && listItem.content) {
            extractFromContent(listItem.content);
          }
        });
      }
    });
  };
  
  extractFromContent(richTextDocument.content);
  return text.trim();
};

// Helper function to convert Contentful rich text to HTML
const convertRichTextToHtml = (richTextDocument: any): string => {
  if (!richTextDocument || !richTextDocument.content) return "";
  
  try {
    let html = documentToHtmlString(richTextDocument);
    
    // Handle multiple newlines by converting them to proper paragraph breaks
    // Replace \n\n\n or \n\n with closing and opening paragraph tags
    html = html.replace(/\n\n+/g, '</p><p>');
    
    return html;
  } catch (error) {
    console.error("Error converting rich text to HTML:", error);
    // Fallback to plain text extraction with line break handling
    let text = extractTextFromRichText(richTextDocument);
    // Convert multiple newlines to paragraph breaks
    text = text.replace(/\n\n+/g, '</p><p>');
    return `<p>${text}</p>`;
  }
};

export const mapEducationEntry = (item: any): EducationPost => {
  // Helper function to safely extract text from rich text content
  const extractText = (richText: any): string => {
    if (typeof richText === 'string') return richText;
    if (richText?.content?.[0]?.content?.[0]?.value) {
      return richText.content[0].content[0].value;
    }
    if (richText?.content?.[0]?.value) {
      return richText.content[0].value;
    }
    return "Untitled";
  };

  return {
    id: item.sys.id,
    title: item.fields.title || "Untitled", // Direct string field
    excerpt: extractTextFromRichText(item.fields.description) || "No description available",
    category: item.fields.category || "General", // Fixed: was 'categorie'
    tags: Array.isArray(item.fields.tags) ? item.fields.tags : [], // Fixed: use actual 'tags' field
    author: item.fields.author || "Unknown", // Fixed: was 'drName'
    publishedAt: new Date(item.sys.createdAt).toLocaleDateString(),
    upvotes: Math.floor(Math.random() * 100), // placeholder since not in Contentful
    comments: item.fields.comment ? item.fields.comment.length : 0, // Use actual comment count
    readTime: "5 min read", // static unless you calculate dynamically
    content: convertRichTextToHtml(item.fields.content) || "",
    keyConsiderations: convertRichTextToHtml(item.fields.keyConsiderations) || "",
    futureDirections: convertRichTextToHtml(item.fields.futureDirections) || "",
  };
};


export const mapMagazineEntry = (item: any, assets?: any[]): Magazine => {
  // Helper function to safely extract text from rich text content or plain string
  const extractText = (richTextOrString: any): string => {
    if (typeof richTextOrString === 'string') return richTextOrString;
    if (richTextOrString?.content?.[0]?.content?.[0]?.value) {
      return richTextOrString.content[0].content[0].value;
    }
    if (richTextOrString?.content?.[0]?.value) {
      return richTextOrString.content[0].value;
    }
    return "";
  };

  // Helper function to get asset URL by ID from includes or sys reference
  const getAssetUrl = (assetRef: any, assets?: any[]): string => {
    if (!assetRef) return "";
    
    // If it's a direct asset reference with sys.id
    if (assetRef.sys?.id) {
      const assetId = assetRef.sys.id;
      
      // Look for the asset in the provided assets array
      if (assets) {
        const asset = assets.find((a: any) => a.sys.id === assetId);
        if (asset?.fields?.file?.url) {
          // Add https: prefix if URL starts with //
          const url = asset.fields.file.url;
          return url.startsWith('//') ? `https:${url}` : url;
        }
      }
    }
    
    // If it's already a direct asset object
    if (assetRef.fields?.file?.url) {
      const url = assetRef.fields.file.url;
      return url.startsWith('//') ? `https:${url}` : url;
    }
    
    return "";
  };

  // Helper function to get cover image (supports both direct asset link and rich text)
  const getCoverImage = (coverImageField: any, assets?: any[]): string => {
    if (!coverImageField) return "";
    
    // If it's a direct asset reference (sys.id)
    if (coverImageField.sys?.id) {
      return getAssetUrl(coverImageField, assets);
    }
    
    // If it's a rich text document with embedded asset
    if (coverImageField.content) {
      return getCoverImageFromRichText(coverImageField, assets);
    }
    
    return "";
  };

  // Helper function to extract cover image from rich text embedded asset
  const getCoverImageFromRichText = (richTextDocument: any, assets?: any[]): string => {
    if (!richTextDocument?.content) return "";
    
    // Look for embedded-asset-block in the rich text content
    const findEmbeddedAsset = (content: any[]): string => {
      for (const node of content) {
        if (node.nodeType === "embedded-asset-block" && node.data?.target?.sys?.id) {
          const assetId = node.data.target.sys.id;
          
          // Find the asset in the assets array
          if (assets) {
            const asset = assets.find((a: any) => a.sys.id === assetId);
            if (asset?.fields?.file?.url) {
              const url = asset.fields.file.url;
              return url.startsWith('//') ? `https:${url}` : url;
            }
          }
        }
        
        // Recursively check nested content
        if (node.content && Array.isArray(node.content)) {
          const found = findEmbeddedAsset(node.content);
          if (found) return found;
        }
      }
      return "";
    };
    
    return findEmbeddedAsset(richTextDocument.content);
  };

  // Helper function to format date from ISO string or Contentful date
  const formatPublishedDate = (dateInput: any): string => {
    try {
      let date: Date;
      
      if (typeof dateInput === 'string') {
        // Handle ISO date string like "2025-10-28T12:00+05:30"
        date = new Date(dateInput);
      } else if (dateInput instanceof Date) {
        date = dateInput;
      } else {
        // Fallback to creation date
        date = new Date(item.sys.createdAt);
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return new Date(item.sys.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  // Helper function to handle pdfUrl (can be direct URL string or asset reference)
  const getPdfUrl = (pdfField: any, assets?: any[]): string => {
    if (!pdfField) return "";
    
    // If it's a direct URL string
    if (typeof pdfField === 'string') {
      return pdfField;
    }
    
    // If it's an asset reference
    return getAssetUrl(pdfField, assets);
  };

  return {
    id: item.sys.id,
    title: typeof item.fields.title === 'string' ? item.fields.title : extractText(item.fields.title) || "Untitled Magazine",
    description: typeof item.fields.description === 'string' ? item.fields.description : extractTextFromRichText(item.fields.description) || "No description available",
    coverImage: getCoverImage(item.fields.coverImage, assets) || "",
    pdfUrl: getPdfUrl(item.fields.pdfUrl || item.fields.pdfFile, assets) || "",
    issueNumber: item.fields.issueNumber ? `Issue ${item.fields.issueNumber}` : "Issue 1",
    publishedDate: formatPublishedDate(item.fields.publishedDate),
  };
};

export const mapInstitutionEntry = (item: any): Institution => {
  // Helper function to calculate overall rating from rating array
  const calculateOverallRating = (ratings: any[]): number => {
    if (!ratings || !Array.isArray(ratings) || ratings.length === 0) {
      return 0;
    }
    
    const validRatings = ratings.filter(r => r.rating && typeof r.rating === 'number');
    if (validRatings.length === 0) return 0;
    
    const sum = validRatings.reduce((acc, r) => acc + r.rating, 0);
    return sum / validRatings.length;
  };

  // Helper function to map comments with nested replies
  const mapComments = (comments: any[]): Comment[] => {
    if (!comments || !Array.isArray(comments)) return [];
    
    return comments.map((comment: any) => ({
      name: comment.name || "Anonymous",
      content: comment.content || "",
      updatedTime: comment.updatedTime || new Date().toISOString(),
      rating: comment.rating || undefined,
    }));
  };

  // Helper function to count total comments including nested replies
  const countTotalComments = (comments: any[]): number => {
    if (!comments || !Array.isArray(comments)) return 0;
    
    let count = comments.length;
    
    // Count nested replies recursively
    const countReplies = (replies: any[]): number => {
      if (!replies || !Array.isArray(replies)) return 0;
      
      let replyCount = replies.length;
      replies.forEach((reply: any) => {
        if (reply.replies) {
          replyCount += countReplies(reply.replies);
        }
      });
      return replyCount;
    };
    
    comments.forEach((comment: any) => {
      if (comment.replies) {
        count += countReplies(comment.replies);
      }
    });
    
    return count;
  };

  return {
    id: item.sys.id,
    companyName: item.fields.companyName || "Unknown Company",
    shortDescription: extractTextFromRichText(item.fields.Shotdescription) || "No description available",
    description: extractTextFromRichText(item.fields.description) || "",
    vision: extractTextFromRichText(item.fields.vision) || "",
    overallRating: calculateOverallRating(item.fields.ratingCompany),
    totalComments: countTotalComments(item.fields.comment),
    comments: mapComments(item.fields.comment),
  };
};

export const mapResourceEntry = (item: any): Resource => {
  // Helper function to safely extract tags array
  const extractTags = (tagsField: any): string[] => {
    if (!tagsField) return [];
    
    // Check if it's already an array
    if (Array.isArray(tagsField)) {
      return tagsField;
    }
    
    // Check if it's an object with tags property
    if (tagsField.tags && Array.isArray(tagsField.tags)) {
      return tagsField.tags;
    }
    
    return [];
  };

  // Calculate approximate read time based on content length
  const calculateReadTime = (content: string): string => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const detailDescription = item.fields.detailDescription || "";

  return {
    id: item.sys.id,
    title: item.fields.title || "Untitled Resource",
    description: item.fields.description || "No description available",
    tags: extractTags(item.fields.tags),
    author: item.fields.author || "Unknown Author",
    publishedAt: new Date(item.sys.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    detailDescription: detailDescription,
    keyConsiderations: item.fields.keyConsiderations || "",
    futureDirections: item.fields.futureDirections || "",
    readTime: calculateReadTime(detailDescription),
  };
};