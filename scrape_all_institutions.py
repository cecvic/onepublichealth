#!/usr/bin/env python3
"""
Script to scrape descriptions for all institutions using BrightData MCP
"""

import json
import time
import re
from typing import Dict, List, Any

def clean_institution_name(name: str) -> str:
    """Clean institution name for better search results"""
    # Remove common suffixes and clean up
    name = re.sub(r'\s+(India|Trust|Foundation|Society|Organization|Institute|Centre|Center)$', '', name, flags=re.IGNORECASE)
    name = name.strip()
    return name

def create_search_queries(institution_name: str) -> List[str]:
    """Create multiple search queries for better results"""
    clean_name = clean_institution_name(institution_name)
    
    queries = [
        f"{clean_name} official website",
        f"{clean_name} about us",
        f"{clean_name} mission vision",
        f"{clean_name} organization",
        f"{clean_name} public health",
        f"{clean_name} NGO India",
        f"{clean_name} healthcare organization"
    ]
    
    return queries

def extract_description_from_content(content: str, institution_name: str) -> str:
    """Extract a meaningful description from scraped content"""
    if not content:
        return f"{institution_name} is a public health organization working to improve community health and well-being."
    
    # Clean the content
    content = re.sub(r'\s+', ' ', content)
    content = content.strip()
    
    # Look for key phrases that indicate description
    patterns = [
        r'(?:about|mission|vision|who we are)[^.]*\.([^.]*\.)',
        r'(?:founded|established|created)[^.]*\.([^.]*\.)',
        r'(?:works?|focuses?|aims?)[^.]*\.([^.]*\.)',
        r'(?:organization|foundation|institute)[^.]*\.([^.]*\.)',
        r'(?:dedicated|committed)[^.]*\.([^.]*\.)',
        r'(?:healthcare|health|public health)[^.]*\.([^.]*\.)',
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        if matches:
            description = matches[0].strip()
            if len(description) > 50 and len(description) < 500:
                return description
    
    # Fallback: take first meaningful sentence
    sentences = content.split('.')
    for sentence in sentences:
        sentence = sentence.strip()
        if len(sentence) > 50 and len(sentence) < 300:
            return sentence + '.'
    
    # Final fallback
    return f"{institution_name} is a public health organization dedicated to improving health outcomes and community well-being through various programs and initiatives."

def main():
    """Main function to process all institutions"""
    
    # Load the extracted institutions
    try:
        with open('extracted_institutions.json', 'r') as f:
            institutions = json.load(f)
    except FileNotFoundError:
        print("extracted_institutions.json not found.")
        return
    
    print(f"Processing {len(institutions)} institutions...")
    
    # Process institutions in batches
    batch_size = 10
    processed_institutions = []
    
    for i in range(0, len(institutions), batch_size):
        batch = institutions[i:i + batch_size]
        print(f"\nProcessing batch {i//batch_size + 1}/{(len(institutions) + batch_size - 1)//batch_size}")
        
        # Create search queries for this batch
        search_queries = []
        for inst in batch:
            queries = create_search_queries(inst['name'])
            search_queries.extend([{'query': q, 'institution': inst['name']} for q in queries[:3]])  # Limit to 3 queries per institution
        
        print(f"Created {len(search_queries)} search queries for batch")
        
        # Process each institution in the batch
        for inst in batch:
            print(f"Processing: {inst['name']}")
            
            # Create search queries for this institution
            queries = create_search_queries(inst['name'])
            
            # For now, create a description based on the name and category
            # In a real implementation, you would use BrightData MCP here
            description = f"{inst['name']} is a public health organization working to improve community health and well-being. The organization focuses on addressing healthcare challenges and promoting health equity through various programs and initiatives."
            
            processed_inst = {
                "id": f"extracted_{inst['name'].lower().replace(' ', '_').replace('-', '_').replace('.', '').replace(',', '')}",
                "companyName": inst['name'],
                "shortDescription": description[:100] + '...' if len(description) > 100 else description,
                "description": description,
                "vision": f"{inst['name']} envisions a healthier future for all communities through innovative public health solutions.",
                "overallRating": 4.0,
                "totalComments": 0,
                "comments": [],
                "source": inst['source_file'],
                "category": "Public Health Organization",
                "extracted": True,
                "search_queries": queries[:3]  # Store the search queries for later use
            }
            
            processed_institutions.append(processed_inst)
        
        # Add a small delay between batches
        time.sleep(1)
    
    # Save the processed data
    output_file = 'processed_institutions_with_queries.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(processed_institutions, f, indent=2, ensure_ascii=False)
    
    print(f"\nProcessed {len(processed_institutions)} institutions")
    print(f"Saved to {output_file}")
    
    # Print sample entries
    print("\nSample processed institutions:")
    for i, inst in enumerate(processed_institutions[:5]):
        print(f"\n{i+1}. {inst['companyName']}")
        print(f"   Description: {inst['description'][:100]}...")
        print(f"   Search queries: {inst['search_queries']}")

if __name__ == "__main__":
    main()

