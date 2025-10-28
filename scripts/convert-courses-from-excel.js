import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the course types and their corresponding files
const courseTypes = [
  { type: 'MPH', file: 'MPH.xlsx' },
  { type: 'MD', file: 'MD.xlsx' },
  { type: 'MSC', file: 'MSC.xlsx' },
  { type: 'Online', file: 'online.xlsx' },
  { type: 'Others', file: 'others.xlsx' }
];

// Function to normalize and clean data
function normalizeData(entry, courseType) {
  const normalized = {
    id: `${courseType.toLowerCase()}_${Math.random().toString(36).substr(2, 9)}`,
    courseType: courseType,
    institution: '',
    location: '',
    website: '',
    specializations: []
  };

  // Common field mappings across all types
  if (entry['Institution']) {
    normalized.institution = entry['Institution'];
  } else if (entry['Programme Name']) {
    normalized.institution = entry['Programme Name'];
  } else if (entry['Diploma / Programme Name']) {
    normalized.institution = entry['Diploma / Programme Name'];
  }

  if (entry['Location']) {
    normalized.location = entry['Location'];
  } else if (entry['Location (City, State)']) {
    normalized.location = entry['Location (City, State)'];
  }

  // Type-specific field mappings
  switch (courseType) {
    case 'MPH':
      normalized.parentUniversity = entry['Parent University / Status'] || '';
      normalized.nirfRank = entry['NIRF Rank (2025)'] || '';
      normalized.specializations = entry['Specialisations Offered'] ? 
        entry['Specialisations Offered'].split(';').map(s => s.trim()) : [];
      normalized.website = entry['Course Website'] || '';
      break;

    case 'MD':
      normalized.mdFocus = entry['MD Community Medicine / Dept Focus'] || '';
      normalized.website = entry['Official Website'] || '';
      break;

    case 'MSC':
      normalized.programName = entry['Programme Name'] || '';
      normalized.parentUniversity = entry['Parent University / Status'] || '';
      normalized.specializations = entry['Focus / Specialisation Areas'] ? 
        entry['Focus / Specialisation Areas'].split(';').map(s => s.trim()) : [];
      normalized.website = entry['Official Dept / Course Website'] || '';
      break;

    case 'Online':
      normalized.programName = entry['Programme Name'] || '';
      normalized.modeDuration = entry['Mode / Duration'] || '';
      normalized.specializations = entry['Focus / Specialisation'] ? 
        entry['Focus / Specialisation'].split(';').map(s => s.trim()) : [];
      normalized.targetAudience = entry['Target Audience'] || '';
      normalized.website = entry['Website'] || '';
      break;

    case 'Others':
      normalized.programName = entry['Diploma / Programme Name'] || '';
      normalized.parentUniversity = entry['Parent University / Status'] || '';
      normalized.specializations = entry['Focus / Specialisation Areas'] ? 
        entry['Focus / Specialisation Areas'].split(';').map(s => s.trim()) : [];
      normalized.targetProfile = entry['Target Profile / Notes'] || '';
      normalized.website = entry['Official Dept / Course Website'] || '';
      break;
  }

  return normalized;
}

// Function to process all Excel files
function convertExcelToJson() {
  const allCourses = [];
  const coursesDir = path.join(__dirname, '..', 'docs', 'Courses');

  console.log('Starting conversion of Excel files to JSON...');

  courseTypes.forEach(({ type, file }) => {
    try {
      const filePath = path.join(coursesDir, file);
      console.log(`Processing ${file}...`);

      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        return;
      }

      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      console.log(`Found ${data.length} entries in ${file}`);

      data.forEach((entry, index) => {
        const normalizedEntry = normalizeData(entry, type);
        allCourses.push(normalizedEntry);
      });

    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  });

  // Write the combined data to JSON file
  const outputPath = path.join(__dirname, '..', 'public', 'data', 'courses.json');
  
  try {
    fs.writeFileSync(outputPath, JSON.stringify(allCourses, null, 2));
    console.log(`\nSuccessfully converted ${allCourses.length} courses to JSON`);
    console.log(`Output file: ${outputPath}`);
    
    // Print summary by course type
    const summary = courseTypes.map(({ type }) => ({
      type,
      count: allCourses.filter(course => course.courseType === type).length
    }));
    
    console.log('\nSummary by course type:');
    summary.forEach(({ type, count }) => {
      console.log(`  ${type}: ${count} courses`);
    });
    
  } catch (error) {
    console.error('Error writing JSON file:', error.message);
  }
}

// Run the conversion
convertExcelToJson();
