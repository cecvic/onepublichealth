#!/usr/bin/env python3
"""
Script to update institutions with website URLs based on search results
"""

import json
import re

# Load the existing processed institutions data
with open('processed_institutions_with_queries.json', 'r') as f:
    institutions = json.load(f)

print(f"Loaded {len(institutions)} institutions to process")

# Known websites from search results
known_websites = {
    "Sulabh International": "https://www.sulabhinternational.org/",
    "Gram Vikas": "https://www.gramvikas.org/",
    "Arogya World": "https://arogyaworld.org/",
    "Goonj": "https://goonj.org/",
    "Smile Foundation": "https://www.smilefoundationindia.org/",
    "Seva Foundation India": "https://sevaind.org/",
    "HelpAge India": "https://www.helpageindia.org/",
    "CBM India Trust": "https://cbmindia.org/",
    "George Institute for Global Health – India": "https://www.georgeinstitute.org/",
    "Healis Sekhsaria Institute": "https://www.healis.org/"
}

def extract_domain_from_url(url):
    """Extract clean domain from URL"""
    if not url:
        return None
    
    # Remove protocol and www
    domain = re.sub(r'^https?://(www\.)?', '', url)
    # Remove trailing slash and path
    domain = domain.split('/')[0]
    return domain

def update_institutions_with_websites():
    """Update institutions with known website URLs"""
    updated_count = 0
    
    for institution in institutions:
        company_name = institution['companyName']
        
        # Check if we have a known website for this institution
        if company_name in known_websites:
            institution['website'] = known_websites[company_name]
            institution['website_domain'] = extract_domain_from_url(known_websites[company_name])
            updated_count += 1
            print(f"Updated: {company_name} -> {known_websites[company_name]}")
        else:
            # Set to None for institutions without known websites
            institution['website'] = None
            institution['website_domain'] = None
    
    return institutions, updated_count

def main():
    print("Updating institutions with known website URLs...")
    
    # Update institutions
    updated_institutions, updated_count = update_institutions_with_websites()
    
    # Save results
    output_file = 'institutions_with_websites.json'
    with open(output_file, 'w') as f:
        json.dump(updated_institutions, f, indent=2)
    
    # Statistics
    with_websites = sum(1 for inst in updated_institutions if inst.get('website'))
    without_websites = len(updated_institutions) - with_websites
    
    print(f"\n=== Website Update Complete ===")
    print(f"Total institutions: {len(updated_institutions)}")
    print(f"Institutions with websites: {with_websites}")
    print(f"Institutions without websites: {without_websites}")
    print(f"Success rate: {(with_websites/len(updated_institutions)*100):.1f}%")
    print(f"Results saved to: {output_file}")
    
    # Show sample results
    print(f"\n=== Sample Results ===")
    for i, inst in enumerate(updated_institutions[:10]):
        print(f"{i+1}. {inst['companyName']}")
        print(f"   Website: {inst.get('website', 'Not found')}")
        print()

if __name__ == "__main__":
    main()

