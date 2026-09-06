const fs = require('fs');

const raw = fs.readFileSync('./raw_2020.txt', 'utf-8');
const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

const entries = [];

// We will parse with a state machine
let currentCampus = 'Central Administration';
let currentCounty = 'Nairobi County';
let currentCountry = 'Kenya';
let currentSupervisor = 'Senate Executive';
let currentProgram = 'Honorary Doctorate';
let currentLevel = 'Doctorate';
let inHonorary = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.includes('BREAKTHROUGH BIBLE UNIVERSITY ON FRIDAY') || line.includes('PROGRAMME FOR THE AWARD')) {
    continue;
  }

  if (line.includes('BREAKTHROUGH INTERNATIONAL BIBLE UNIVERSITY HONORARY DOCTORATE DEGREES')) {
    inHonorary = true;
    currentCampus = 'Main Convocation Hall';
    currentCounty = 'Nairobi County';
    currentCountry = 'Kenya';
    currentSupervisor = 'Chancellor & Senate';
    currentLevel = 'Honorary Doctorate';
    currentProgram = 'Honorary Doctorate';
    continue;
  }

  if (line.startsWith('NO\t') || line.startsWith('NO ') || line.startsWith('S/N') || line === 'NO\tNAMES' || line === 'NO\tNAME\tTITTLE' || line === 'NO\tNAME') {
    continue;
  }

  // Detect section headers
  if (line.includes('BREAKTHROUGH INTERNATIONAL BIBLE UNIVERSITY')) {
    inHonorary = false;
    continue;
  }

  // Check campus / supervisor headers
  if (line.includes('COUNTY') || line.includes('CAMPUS') || line.includes('STUDENTS') || line.includes('TANZANIA') || line.includes('ETHIOPIA') || line.includes('HAITI') || line.includes('ZIMBABWE') || line.includes('CLASS') || line.includes('ATHI RIVER') || line.includes('MAGADI')) {
    // Might be campus header
    if (!line.startsWith('1\t') && !line.startsWith('2\t') && !line.startsWith('1.') && !/^\d+[\t\s]/.test(line)) {
      const lower = line.toLowerCase();
      if (lower.includes('tanzania')) {
        currentCountry = 'Tanzania';
        currentCounty = 'Kilimanjaro / Arusha';
      } else if (lower.includes('ethiopia')) {
        currentCountry = 'Ethiopia';
        currentCounty = 'Addis Ababa / Gambela';
      } else if (lower.includes('zimbabwe')) {
        currentCountry = 'Zimbabwe';
        currentCounty = 'Harare / Bulawayo';
      } else if (lower.includes('haiti')) {
        currentCountry = 'Haiti';
        currentCounty = 'Port-au-Prince / Ouest';
      } else {
        currentCountry = 'Kenya';
        if (lower.includes('nairobi')) currentCounty = 'Nairobi County';
        else if (lower.includes('narok')) currentCounty = 'Narok County';
        else if (lower.includes('kajiado')) currentCounty = 'Kajiado County';
        else if (lower.includes('muranga') || lower.includes("murang'a")) currentCounty = "Murang'a County";
        else if (lower.includes('laikipia')) currentCounty = 'Laikipia County';
        else if (lower.includes('kirinyaga')) currentCounty = 'Kirinyaga County';
        else if (lower.includes('makueni')) currentCounty = 'Makueni County';
        else if (lower.includes('nakuru')) currentCounty = 'Nakuru County';
        else if (lower.includes('machakos')) currentCounty = 'Machakos County';
        else if (lower.includes('nyandarua')) currentCounty = 'Nyandarua County';
        else if (lower.includes('kitui')) currentCounty = 'Kitui County';
      }

      // Check supervisor
      const profMatch = line.match(/\(?(PROF|BISHOP|DR|REV|AGNES|SUSAN)[^)]+\)?/i);
      if (profMatch) {
        currentSupervisor = profMatch[0].replace(/[()]/g, '').trim();
      }

      currentCampus = line.replace(/BREAKTHROUGH INTERNATIONAL BIBLE UNIVERSITY/i, '').trim();
      inHonorary = false;
      continue;
    }
  }

  // Check degree / program headers
  const isProgHeader = [
    'phd in', 'masters in', 'master degree', 'masters of', 'masters degree', 'bachelors', 'bachelor degree', 'bachelor of', 'barchelor',
    'diploma in', 'higher diploma', 'certificate in', 'graduate diploma', 'introduction to', 'honoris causa doctorate'
  ].some(p => line.toLowerCase().includes(p));

  if (isProgHeader && !/^\d+[\t\s.]/.test(line)) {
    currentProgram = line.trim();
    const pLow = currentProgram.toLowerCase();
    if (pLow.includes('phd') || pLow.includes('doctor')) {
      currentLevel = pLow.includes('honoris') || pLow.includes('honorary') ? 'Honorary Doctorate' : 'Doctorate';
    } else if (pLow.includes('master')) {
      currentLevel = 'Master';
    } else if (pLow.includes('bachelor') || pLow.includes('barchelor')) {
      currentLevel = 'Bachelor';
    } else if (pLow.includes('higher diploma')) {
      currentLevel = 'Higher Diploma';
    } else if (pLow.includes('graduate diploma') || pLow.includes('diploma')) {
      currentLevel = 'Diploma';
    } else if (pLow.includes('certificate') || pLow.includes('introduction to')) {
      currentLevel = 'Certificate';
    }
    continue;
  }

  // Check graduate record lines:
  // e.g. "1	DANIEL KITHIA M’ARIMBA	DOCTOR IN  SACREDMINISTRY"
  // or "1	EVANS KEITANY CHEPKWONY"
  // or "1.	JOSEPH KAREMERI WANJIRU"
  const match = line.match(/^(\d+)[\t\.\s]+(.+)$/);
  if (match) {
    const sn = parseInt(match[1], 10);
    let rest = match[2].trim();
    if (!rest) continue;

    let candidateName = rest;
    let specificTitle = currentProgram;

    if (inHonorary || rest.includes('\t')) {
      const parts = rest.split(/\t+/);
      if (parts.length >= 2) {
        candidateName = parts[0].trim();
        specificTitle = parts.slice(1).join(' ').trim();
      }
    }

    // Clean name
    candidateName = candidateName.replace(/\s+/g, ' ').trim();
    if (candidateName.length < 2) continue;

    entries.push({
      sn: entries.length + 1,
      sourceSn: sn,
      name: candidateName,
      degreeOrTitle: specificTitle,
      qualificationLevel: currentLevel,
      campus: currentCampus,
      county: currentCounty,
      country: currentCountry,
      supervisor: currentSupervisor,
      graduationYear: 2020
    });
  }
}

console.log('Total parsed 2020 graduates:', entries.length);
fs.writeFileSync('./scripts/parsed_2020.json', JSON.stringify(entries, null, 2));
console.log('Sample first 5:');
console.log(entries.slice(0, 5));
console.log('Sample last 5:');
console.log(entries.slice(-5));
