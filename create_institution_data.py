#!/usr/bin/env python3
"""
Script to create comprehensive institution data with descriptions
"""

import json
import re
from typing import Dict, List, Any

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

def create_institution_entry(institution_data: Dict[str, Any]) -> Dict[str, Any]:
    """Create a complete institution entry matching the expected format"""
    name = institution_data['name']
    source_file = institution_data.get('source_file', 'Unknown')
    
    # Extract description from scraped content if available
    description = institution_data.get('description', '')
    if not description:
        description = f"{name} is a public health organization working to improve community health and well-being."
    
    # Create short description (first 100 characters)
    short_description = description[:100] + '...' if len(description) > 100 else description
    
    return {
        "id": f"extracted_{name.lower().replace(' ', '_').replace('-', '_')}",
        "companyName": name,
        "shortDescription": short_description,
        "description": description,
        "vision": f"{name} envisions a healthier future for all communities through innovative public health solutions.",
        "overallRating": 4.0,  # Default rating
        "totalComments": 0,
        "comments": [],
        "source": source_file,
        "category": "Public Health Organization",
        "extracted": True
    }

def main():
    """Main function to process institution data"""
    
    # Sample data from the first 5 institutions we scraped
    sample_institutions = [
        {
            "name": "Sulabh International",
            "source_file": "india_public_health_employers_batch3_100.xlsx",
            "description": "Founded in 1970 by Dr Bindeshwar Pathak, Sulabh's contribution in the field of sanitation is both monumental in scale and historical in its application of human rights framing to sanitation. Dr Pathak's foray into sanitation was in response to tackle the deep rooted discrimination, abuse and stigma faced by a community of people – known as manual scavengers – who cleaned dry latrines manually and were labelled as untouchables."
        },
        {
            "name": "Gram Vikas",
            "source_file": "india_public_health_employers_batch3_100.xlsx",
            "description": "We partner with rural communities to enable them to lead a dignified life. We do this by building their capabilities, strengthening community institutions and mobilising resources. At Gram Vikas, equity and dignity are at the heart of what we do."
        },
        {
            "name": "Arogya World",
            "source_file": "india_public_health_employers_batch3_100.xlsx",
            "description": "Arogya World is a global health non-profit organization working to prevent non-communicable diseases (NCDs)—diabetes, heart disease, cancer and chronic lung diseases—through health education and lifestyle change. Through our programs and advocacy efforts, we help people around the world lead healthier lives."
        },
        {
            "name": "Goonj",
            "source_file": "india_public_health_employers_batch3_100.xlsx",
            "description": "Goonj aims to build an equitable relationship of strength, sustenance, and dignity between the cities and villages, using under-utilized material as a tool to trigger development with dignity. We envision growing as an idea across regions, economies, and countries using urban surplus material as a tool to address basic but neglected issues."
        },
        {
            "name": "Smile Foundation",
            "source_file": "india_public_health_employers_batch3_100.xlsx",
            "description": "Smile Foundation was initiated in 2002 when a group of friends came together with the intention of giving back to the society. Over the last two decades, Smile has evolved as a sustainable Indian social institution – committed to do real work on the ground, and make the society and businesses inclusive in the process of bringing change."
        }
    ]
    
    # Load the extracted institutions
    try:
        with open('extracted_institutions.json', 'r') as f:
            all_institutions = json.load(f)
    except FileNotFoundError:
        print("extracted_institutions.json not found. Using sample data only.")
        all_institutions = []
    
    # Create comprehensive institution data
    processed_institutions = []
    
    # Process sample institutions with descriptions
    for inst in sample_institutions:
        processed_institutions.append(create_institution_entry(inst))
    
    # Process remaining institutions with default descriptions
    sample_names = {inst['name'] for inst in sample_institutions}
    for inst in all_institutions:
        if inst['name'] not in sample_names:
            processed_institutions.append(create_institution_entry(inst))
    
    # Save the processed data
    output_file = 'processed_institutions.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(processed_institutions, f, indent=2, ensure_ascii=False)
    
    print(f"Processed {len(processed_institutions)} institutions")
    print(f"Saved to {output_file}")
    
    # Print sample entries
    print("\nSample processed institutions:")
    for i, inst in enumerate(processed_institutions[:3]):
        print(f"\n{i+1}. {inst['companyName']}")
        print(f"   Description: {inst['description'][:100]}...")
        print(f"   Source: {inst['source']}")

if __name__ == "__main__":
    main()
