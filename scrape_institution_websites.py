#!/usr/bin/env python3
"""
Script to scrape website URLs for all institutions using BrightData MCP
"""

import json
import time
import re
from typing import List, Dict, Optional

# Load the existing processed institutions data
with open('processed_institutions_with_queries.json', 'r') as f:
    institutions = json.load(f)

print(f"Loaded {len(institutions)} institutions to process")

def extract_website_from_search_results(search_results: List[Dict]) -> Optional[str]:
    """Extract the most likely official website from search results"""
    if not search_results:
        return None
    
    # Look for official website patterns
    official_patterns = [
        r'https?://(?:www\.)?([^/]+)\.org',
        r'https?://(?:www\.)?([^/]+)\.in',
        r'https?://(?:www\.)?([^/]+)\.gov\.in',
        r'https?://(?:www\.)?([^/]+)\.ac\.in',
        r'https?://(?:www\.)?([^/]+)\.edu',
        r'https?://(?:www\.)?([^/]+)\.com'
    ]
    
    for result in search_results[:5]:  # Check top 5 results
        url = result.get('url', '')
        title = result.get('title', '').lower()
        description = result.get('description', '').lower()
        
        # Skip social media and job sites
        skip_domains = ['linkedin.com', 'facebook.com', 'twitter.com', 'indeed.com', 'glassdoor.com', 'naukri.com']
        if any(domain in url.lower() for domain in skip_domains):
            continue
            
        # Look for official website indicators
        official_indicators = ['official', 'homepage', 'main', 'about us', 'contact us']
        if any(indicator in title or indicator in description for indicator in official_indicators):
            # Extract domain from URL
            for pattern in official_patterns:
                match = re.search(pattern, url)
                if match:
                    domain = match.group(1)
                    # Reconstruct clean URL
                    if url.startswith('https://'):
                        return f"https://{domain}"
                    else:
                        return f"http://{domain}"
    
    # If no official site found, try to extract any valid domain from top results
    for result in search_results[:3]:
        url = result.get('url', '')
        for pattern in official_patterns:
            match = re.search(pattern, url)
            if match:
                domain = match.group(1)
                if url.startswith('https://'):
                    return f"https://{domain}"
                else:
                    return f"http://{domain}"
    
    return None

def process_institution_websites():
    """Process all institutions to find their websites"""
    processed_count = 0
    institutions_with_websites = []
    
    # Process in batches of 5 to avoid rate limiting
    batch_size = 5
    
    for i in range(0, len(institutions), batch_size):
        batch = institutions[i:i + batch_size]
        print(f"\nProcessing batch {i//batch_size + 1}/{(len(institutions) + batch_size - 1)//batch_size}")
        
        # Process each institution in the batch
        for inst in batch:
            print(f"  Processing: {inst['companyName']}")
            
            # Create search query for official website
            search_query = f"{inst['companyName']} official website"
            
            try:
                # This will be called by the MCP tool, not directly
                # For now, we'll add a placeholder and process manually
                inst['website'] = None
                institutions_with_websites.append(inst)
                processed_count += 1
                
                print(f"    Website: Not found (manual processing needed)")
                
            except Exception as e:
                print(f"    Error: {e}")
                inst['website'] = None
                institutions_with_websites.append(inst)
                processed_count += 1
        
        # Add delay between batches
        time.sleep(1)
    
    return institutions_with_websites

def main():
    print("Starting website extraction for all institutions...")
    print("Note: This script will create a template for manual website addition.")
    print("Websites will need to be added manually or through MCP tools.")
    
    # Process all institutions
    institutions_with_websites = process_institution_websites()
    
    # Save results
    output_file = 'institutions_with_websites.json'
    with open(output_file, 'w') as f:
        json.dump(institutions_with_websites, f, indent=2)
    
    # Statistics
    with_websites = sum(1 for inst in institutions_with_websites if inst.get('website'))
    without_websites = len(institutions_with_websites) - with_websites
    
    print(f"\n=== Website Extraction Complete ===")
    print(f"Total institutions processed: {len(institutions_with_websites)}")
    print(f"Institutions with websites: {with_websites}")
    print(f"Institutions without websites: {without_websites}")
    print(f"Results saved to: {output_file}")
    print(f"\nNext step: Use MCP tools to search for websites manually")

if __name__ == "__main__":
    main()