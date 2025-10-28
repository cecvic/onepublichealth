import { Institution } from '../utils/utils';

// Load the processed institutions data from public directory
let extractedInstitutionsData: any[] = [];

// Function to load data
const loadInstitutionData = async () => {
  try {
    const response = await fetch('/data/processed_institutions.json');
    extractedInstitutionsData = await response.json();
  } catch (error) {
    console.error('Error loading extracted institutions data:', error);
    extractedInstitutionsData = [];
  }
};

export interface ExtractedInstitution {
  id: string;
  companyName: string;
  shortDescription: string;
  description: string;
  vision: string;
  overallRating: number;
  totalComments: number;
  comments: any[];
  source: string;
  category: string;
  extracted: boolean;
  website?: string;
  website_domain?: string;
}

export class ExtractedInstitutionService {
  private static institutions: ExtractedInstitution[] = [];
  private static dataLoaded = false;

  /**
   * Initialize the service by loading data
   */
  static async initialize(): Promise<void> {
    if (!this.dataLoaded) {
      await loadInstitutionData();
      this.institutions = extractedInstitutionsData as ExtractedInstitution[];
      this.dataLoaded = true;
    }
  }

  /**
   * Get all extracted institutions
   */
  static async getAllInstitutions(): Promise<ExtractedInstitution[]> {
    await this.initialize();
    return this.institutions;
  }

  /**
   * Get institutions by category
   */
  static async getInstitutionsByCategory(category: string): Promise<ExtractedInstitution[]> {
    await this.initialize();
    return this.institutions.filter(inst => 
      inst.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  /**
   * Search institutions by name or description
   */
  static async searchInstitutions(query: string): Promise<ExtractedInstitution[]> {
    await this.initialize();
    const lowercaseQuery = query.toLowerCase();
    return this.institutions.filter(inst => 
      inst.companyName.toLowerCase().includes(lowercaseQuery) ||
      inst.description.toLowerCase().includes(lowercaseQuery) ||
      inst.shortDescription.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Get institution by ID
   */
  static async getInstitutionById(id: string): Promise<ExtractedInstitution | undefined> {
    await this.initialize();
    return this.institutions.find(inst => inst.id === id);
  }

  /**
   * Convert extracted institution to the standard Institution format
   */
  static convertToStandardFormat(extractedInst: ExtractedInstitution): Institution {
    return {
      id: extractedInst.id,
      companyName: extractedInst.companyName,
      shortDescription: extractedInst.shortDescription,
      description: extractedInst.description,
      vision: extractedInst.vision,
      overallRating: extractedInst.overallRating,
      totalComments: extractedInst.totalComments,
      comments: extractedInst.comments,
      website: extractedInst.website,
      category: extractedInst.category
    };
  }

  /**
   * Get combined institutions (Contentful + Extracted)
   * This would be used to merge with existing Contentful data
   */
  static async getCombinedInstitutions(contentfulInstitutions: Institution[]): Promise<Institution[]> {
    await this.initialize();
    const extractedAsStandard = this.institutions.map(inst => 
      this.convertToStandardFormat(inst)
    );
    
    return [...contentfulInstitutions, ...extractedAsStandard];
  }

  /**
   * Get institutions with verified websites
   */
  static async getInstitutionsWithWebsites(): Promise<ExtractedInstitution[]> {
    await this.initialize();
    return this.institutions.filter(inst => inst.website && inst.website.trim() !== '');
  }

  /**
   * Get statistics about extracted institutions
   */
  static async getStatistics() {
    await this.initialize();
    const total = this.institutions.length;
    const categories = [...new Set(this.institutions.map(inst => inst.category))];
    const sources = [...new Set(this.institutions.map(inst => inst.source))];
    const withWebsites = this.institutions.filter(inst => inst.website && inst.website.trim() !== '').length;
    
    return {
      total,
      withWebsites,
      withoutWebsites: total - withWebsites,
      categories: categories.length,
      sources: sources.length,
      categoryBreakdown: categories.map(cat => ({
        category: cat,
        count: this.institutions.filter(inst => inst.category === cat).length
      })),
      sourceBreakdown: sources.map(src => ({
        source: src,
        count: this.institutions.filter(inst => inst.source === src).length
      }))
    };
  }
}
