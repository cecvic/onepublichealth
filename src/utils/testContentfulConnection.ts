// src/utils/testContentfulConnection.ts
// Utility to test Contentful connection and content type setup
import client from "@/lib/contentful";

export interface ContentfulTestResult {
  success: boolean;
  message: string;
  details?: any;
}

export async function testContentfulConnection(): Promise<ContentfulTestResult> {
  try {
    // Test basic connection
    const response = await client.getContentTypes();
    
    // Check if newsArticle content type exists
    const newsArticleType = response.items.find(
      (type: any) => type.sys.id === "newsArticle"
    );

    if (!newsArticleType) {
      return {
        success: false,
        message: "Content type 'newsArticle' not found. Please create it in Contentful.",
        details: {
          availableTypes: response.items.map((type: any) => type.sys.id),
          instructions: "Create a content type called 'newsArticle' with the required fields."
        }
      };
    }

    // Test fetching entries
    const entriesResponse = await client.getEntries({
      content_type: "newsArticle",
      limit: 1
    });

    return {
      success: true,
      message: `Contentful connection successful! Found ${entriesResponse.total} news articles.`,
      details: {
        contentTypeExists: true,
        totalEntries: entriesResponse.total,
        contentTypeFields: newsArticleType.fields.map((field: any) => ({
          id: field.id,
          type: field.type,
          required: field.required
        }))
      }
    };

  } catch (error: any) {
    return {
      success: false,
      message: `Contentful connection failed: ${error.message}`,
      details: {
        error: error.message,
        possibleCauses: [
          "Invalid space ID or access token",
          "Network connectivity issues",
          "Contentful service unavailable"
        ]
      }
    };
  }
}

// Function to validate content type structure
export async function validateContentTypeStructure(): Promise<ContentfulTestResult> {
  try {
    const response = await client.getContentType("newsArticle");
    const fields = response.fields;
    
    const requiredFields = [
      "title",
      "description", 
      "source",
      "publishedDate",
      "category"
    ];

    const missingFields = requiredFields.filter(
      fieldName => !fields.some((field: any) => field.id === fieldName)
    );

    if (missingFields.length > 0) {
      return {
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
        details: {
          missingFields,
          availableFields: fields.map((field: any) => field.id),
          requiredFields
        }
      };
    }

    return {
      success: true,
      message: "Content type structure is valid!",
      details: {
        availableFields: fields.map((field: any) => ({
          id: field.id,
          type: field.type,
          required: field.required
        }))
      }
    };

  } catch (error: any) {
    return {
      success: false,
      message: `Failed to validate content type: ${error.message}`,
      details: { error: error.message }
    };
  }
}

// Export a comprehensive test function
export async function runContentfulTests(): Promise<{
  connection: ContentfulTestResult;
  structure: ContentfulTestResult;
}> {
  const connection = await testContentfulConnection();
  const structure = connection.success 
    ? await validateContentTypeStructure()
    : { success: false, message: "Skipped structure validation due to connection failure" };

  return { connection, structure };
}



