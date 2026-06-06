const fs = require('fs');
const path = require('path');

const replacements = [
  { from: `throw new AppError('No \${data.bedType} beds available', 400);`, to: `throw new AppError('NO_BEDS_AVAILABLE', 400, \`No \${data.bedType} beds available\`);` },
  { from: `throw new AppError('Admission not found', 404);`, to: `throw new AppError('ADMISSION_NOT_FOUND', 404, 'Admission not found');` },
  { from: `throw new AppError('Patient is not currently admitted', 400);`, to: `throw new AppError('PATIENT_NOT_ADMITTED', 400, 'Patient is not currently admitted');` },
  { from: `throw new AppError('Bed not found', 404);`, to: `throw new AppError('BED_NOT_FOUND', 404, 'Bed not found');` },
  { from: `throw new AppError('Bed is not available', 400);`, to: `throw new AppError('BED_NOT_AVAILABLE', 400, 'Bed is not available');` },
  { from: `throw new AppError('Cannot schedule maintenance for occupied bed', 400);`, to: `throw new AppError('BED_OCCUPIED', 400, 'Cannot schedule maintenance for occupied bed');` },
  { from: `throw new AppError('Cannot delete occupied bed', 400);`, to: `throw new AppError('BED_OCCUPIED', 400, 'Cannot delete occupied bed');` },
  { from: `throw new AppError('No hospitals available for emergency', 404);`, to: `throw new AppError('NO_HOSPITALS_AVAILABLE', 404, 'No hospitals available for emergency');` },
  { from: `throw new AppError('Emergency request not found', 404);`, to: `throw new AppError('EMERGENCY_NOT_FOUND', 404, 'Emergency request not found');` },
  { from: `throw new AppError('Emergency request is no longer pending', 400);`, to: `throw new AppError('EMERGENCY_NOT_PENDING', 400, 'Emergency request is no longer pending');` },
  { from: `throw new AppError('Selected bed is not available', 400);`, to: `throw new AppError('BED_NOT_AVAILABLE', 400, 'Selected bed is not available');` },
  { from: `throw new AppError('Hospital not found', 404);`, to: `throw new AppError('HOSPITAL_NOT_FOUND', 404, 'Hospital not found');` },
];

const files = [
  'src/modules/hms/services/admissionService.ts',
  'src/modules/hms/services/bedService.ts',
  'src/modules/hms/services/emergencyDispatchService.ts',
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  replacements.forEach(({ from, to }) => {
    if (content.includes(from)) {
      content = content.replaceAll(from, to);
      changed = true;
    }
  });
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${file}`);
  }
});

console.log('Done!');
