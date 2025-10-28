#!/usr/bin/env python3
"""
Script to extract institution data from Excel files in the docs/ directory
"""

import pandas as pd
import json
import os
from pathlib import Path

def extract_institutions_from_excel():
    """Extract institutions from all Excel files in docs/ directory"""
    
    docs_dir = Path("docs")
    all_institutions = []
    
    # Get all Excel files in docs directory
    excel_files = list(docs_dir.glob("*.xlsx"))
    
    print(f"Found {len(excel_files)} Excel files:")
    for file in excel_files:
        print(f"  - {file.name}")
    
    for excel_file in excel_files:
        print(f"\nProcessing {excel_file.name}...")
        
        try:
            # Read the Excel file
            df = pd.read_excel(excel_file)
            
            print(f"  Columns: {list(df.columns)}")
            print(f"  Shape: {df.shape}")
            print(f"  First few rows:")
            print(df.head())
            
            # Try to identify institution name column
            name_columns = [col for col in df.columns if any(keyword in col.lower() for keyword in ['name', 'institution', 'organization', 'company', 'employer'])]
            
            if name_columns:
                name_col = name_columns[0]
                print(f"  Using '{name_col}' as institution name column")
                
                # Extract unique institution names
                institutions = df[name_col].dropna().unique()
                print(f"  Found {len(institutions)} unique institutions")
                
                for institution in institutions:
                    if pd.notna(institution) and str(institution).strip():
                        all_institutions.append({
                            'name': str(institution).strip(),
                            'source_file': excel_file.name
                        })
            else:
                print(f"  Warning: Could not identify institution name column in {excel_file.name}")
                print(f"  Available columns: {list(df.columns)}")
                
        except Exception as e:
            print(f"  Error processing {excel_file.name}: {e}")
    
    # Remove duplicates based on name
    unique_institutions = []
    seen_names = set()
    
    for inst in all_institutions:
        name_lower = inst['name'].lower().strip()
        if name_lower not in seen_names:
            seen_names.add(name_lower)
            unique_institutions.append(inst)
    
    print(f"\nTotal unique institutions found: {len(unique_institutions)}")
    
    # Save to JSON file
    output_file = "extracted_institutions.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(unique_institutions, f, indent=2, ensure_ascii=False)
    
    print(f"Saved institutions to {output_file}")
    
    return unique_institutions

if __name__ == "__main__":
    institutions = extract_institutions_from_excel()
    
    print("\nFirst 10 institutions:")
    for i, inst in enumerate(institutions[:10]):
        print(f"{i+1}. {inst['name']} (from {inst['source_file']})")
