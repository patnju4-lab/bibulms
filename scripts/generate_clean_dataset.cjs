const fs = require('fs');

const rawGrads = JSON.parse(fs.readFileSync('./scripts/parsed_2020.json', 'utf-8'));

function cleanTitle(rawTitle, level) {
  let t = rawTitle.replace(/\s+/g, ' ').trim();
  const upper = t.toUpperCase();
  if (upper.includes('HONORIS CAUSA') || upper.includes('HONORARY')) {
    return 'Doctor of Divinity (Honoris Causa)';
  }
  if (upper.includes('SACREDMINISTRY') || upper.includes('SACRED MINISTRY')) {
    return 'Doctor of Sacred Ministry (D.S.M. Honoris Causa)';
  }
  if (upper.includes('HUMANE LETTERS')) {
    return 'Doctor of Humane Letters (D.H.L. Honoris Causa)';
  }
  if (upper.includes('DOCTOR IN DIVINITY') || upper.includes('DOCTORATE IN DIVINITY')) {
    return 'Doctor of Divinity (D.Div. Honoris Causa)';
  }
  if (upper.includes('SACRED LEADERSHIP')) {
    return 'Doctor of Sacred Leadership (D.S.L. Honoris Causa)';
  }
  if (upper.includes('DOCTORATE IN MINISTRY')) {
    return 'Doctor of Ministry (D.Min. Honoris Causa)';
  }
  if (upper.includes('PHD IN BIBLICAL COUNSELING')) {
    return 'Doctor of Philosophy (Ph.D.) in Biblical Counseling Psychology';
  }
  if (upper.includes('MASTERS IN BIBLICAL COUNSELING') || upper.includes('MASTERS OF CHRISTIAN COUNSELING')) {
    return 'Master of Arts in Biblical Counseling Psychology';
  }
  if (upper.includes('MASTERS IN THEOLOGICAL STUDIES')) {
    return 'Master of Theological Studies (M.T.S.)';
  }
  if (upper.includes('MASTERS DEGREE IN CHRISTIAN MINISTRY')) {
    return 'Master of Arts in Christian Ministry';
  }
  if (upper.includes('MASTERS OF CHRISTIAN ENTREPRENEURSHIP')) {
    return 'Master of Arts in Christian Entrepreneurship';
  }
  if (upper.includes('MASTERS OF CHRISTIAN WORLD RELIGIOUS')) {
    return 'Master of Arts in Christian World Religions';
  }
  if (upper.includes('MASTERS IN PHILOSOPHY OF RELIGION')) {
    return 'Master of Arts in Philosophy of Religion & Apologetics';
  }
  if (upper.includes('MASTERS IN SYSTEMATIC THEOLOGY')) {
    return 'Master of Arts in Systematic Theology';
  }
  if (upper.includes('EDUCATION SCIENCES AND LEADERSHIP')) {
    return 'Master of Education in Educational Sciences & Leadership';
  }
  if (upper.includes('MASTERS IN COUNSELING PSYCHOLOGY')) {
    return 'Master of Arts in Counseling Psychology';
  }
  if (upper.includes('BACHELOR OF CONFLICT MANAGEMENT')) {
    return 'Bachelor of Arts in Conflict Management Skills';
  }
  if (upper.includes('LEADERSHIP AND MANAGEMENT SKILL')) {
    return 'Bachelor of Arts in Christian Leadership & Management';
  }
  if (upper.includes('BACHELORS IN LEADERSHIP') || upper.includes('BARCHELOR DEGREE IN LEADERSHIP') || upper.includes('BACHELOR DEGREEIN CHRISTIAN LEADERSHIP')) {
    return 'Bachelor of Arts in Christian Leadership';
  }
  if (upper.includes('BACHELOR DEGREE IN COUNSELING PSYCHOLOGY') || upper.includes('BACHELORS IN BIBLICAL COUNSELING PSYCHOLOGY') || upper.includes('BACHELOR DEGREE IN BIBLICAL COUNSELING PSYCHOLOGY')) {
    return 'Bachelor of Arts in Biblical Counseling Psychology';
  }
  if (upper.includes('BACHELORS DEGREE IN BIBLE & THEOLOGY') || upper.includes('BACHELOR DEGREE IN BIBLE AND THEOLOGY')) {
    return 'Bachelor of Arts in Bible and Theology';
  }
  if (upper.includes('BACHELORS IN THEOLOGY') || upper.includes('BACHELOR DEGREE IN THEOLOGY')) {
    return 'Bachelor of Theology (B.Th.)';
  }
  if (upper.includes('BACHELOR DEGREE IN THEOLOGICAL STUDIES') || upper.includes('BACHELORS DEGREE IN THEOLOGICAL STUDIES') || upper.includes('BACHELORS IN THEOLOGICAL STUDIES') || upper.includes('BACHELORS DEGREE IN BIBLICAL AND THEOLOGICAL STUDIES')) {
    return 'Bachelor of Arts in Theological Studies';
  }
  if (upper.includes('HIGHER DIPLOMAIN THEOLOGY') || upper.includes('HIGHER DIPLOMA')) {
    return 'Higher Diploma in Theology and Biblical Studies';
  }
  if (upper.includes('DIPLOMA IN CHRISTIAN LEADERSHIP') || upper.includes('DIPLOMA IN LEADERSHIP') || upper.includes('GRADUATE DIPLOMA IN LEADERSHIP AND ADMINISTRATION')) {
    return 'Diploma in Christian Leadership & Administration';
  }
  if (upper.includes('DIPLOMA IN BIBLICAL COUNSELING') || upper.includes('DIPLOMA IN COUNSELING PSYCHOLOGY') || upper.includes('DIPLOMA IN COUNSELLING PSYCHOLOGY')) {
    return 'Diploma in Biblical Counseling Psychology';
  }
  if (upper.includes('GRADUATE DIPLOMA IN PASTORAL MINISTRY')) {
    return 'Graduate Diploma in Pastoral Ministry';
  }
  if (upper.includes('DIPLOMA IN THEOLOGY') || upper.includes('DIPLOMA IN THEOLOGICAL STUDIES') || upper.includes('DIPLOMA IN BIBLE AND THEOLOGY') || upper.includes('DIPLOMA IN BIBLICAL AND THEOLOGICAL STUDIES')) {
    return 'Diploma in Theology and Biblical Studies';
  }
  if (upper.includes('CERTIFICATE IN BIBLE AND THEOLOGY')) {
    return 'Certificate in Bible and Theology';
  }
  if (upper.includes('INTRODUCTION TO THEOLOGICAL STUDIES')) {
    return 'Certificate in Introduction to Theological Studies';
  }
  if (upper.includes('CERTIFICATE IN THEOLOGY AND BIBLICAL STUDIES') || upper.includes('CERTIFICATE IN THEOLOGICAL STUDIES')) {
    return 'Certificate in Theological Studies';
  }

  return t;
}

function getCampusCode(item) {
  const c = (item.county || item.campus || '').toLowerCase();
  const country = (item.country || '').toLowerCase();
  if (country === 'tanzania') return 'TZ';
  if (country === 'zimbabwe') return 'ZIM';
  if (country === 'ethiopia') return 'ETH';
  if (country === 'haiti') return 'HTI';
  if (item.qualificationLevel === 'Honorary Doctorate') return 'HON';
  if (c.includes('nairobi')) return 'NBI';
  if (c.includes('narok')) return 'NRK';
  if (c.includes('kajiado')) return 'KAJ';
  if (c.includes('muranga')) return 'MUR';
  if (c.includes('laikipia')) return 'LKP';
  if (c.includes('kirinyaga')) return 'KIR';
  if (c.includes('makueni')) return 'MAK';
  if (c.includes('nakuru')) return 'NK';
  if (c.includes('machakos')) return 'MCH';
  if (c.includes('nyandarua')) return 'NYD';
  if (c.includes('kitui')) return 'KTU';
  return 'KEN';
}

function formatNameProper(name) {
  return name.trim().split(/\s+/).map(part => {
    // preserve hyphens, apostrophes
    if (part.includes("'") || part.includes("’")) {
      return part.split(/['’]/).map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join("'");
    }
    if (part.includes('-')) {
      return part.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join('-');
    }
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  }).join(' ');
}

const campusCounters = {};

const processed = rawGrads.map((g, idx) => {
  const code = getCampusCode(g);
  campusCounters[code] = (campusCounters[code] || 0) + 1;
  const countStr = String(campusCounters[code]).padStart(3, '0');
  const regNo = `BIBU/2020/${code}/${countStr}`;

  const cleanedName = formatNameProper(g.name);
  const nameParts = cleanedName.split(/\s+/);
  const firstName = nameParts[0] || 'Graduate';
  const lastName = nameParts[nameParts.length - 1] || 'Alumnus';
  const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';

  // Generate deterministic phone
  let phone = '';
  const seq = 1000 + idx;
  if (g.country === 'Tanzania') {
    phone = `+255 754 ${String(seq).slice(0, 3)} ${String(seq).slice(3, 4)}11`;
  } else if (g.country === 'Zimbabwe') {
    phone = `+263 772 ${String(seq).slice(0, 3)} ${String(seq).slice(3, 4)}22`;
  } else if (g.country === 'Ethiopia') {
    phone = `+251 911 ${String(seq).slice(0, 3)} ${String(seq).slice(3, 4)}33`;
  } else if (g.country === 'Haiti') {
    phone = `+509 37${String(seq).slice(0, 2)} ${String(seq).slice(2, 4)}44`;
  } else {
    // Kenya
    const p1 = 700 + (idx % 90);
    const p2 = 100 + ((idx * 7) % 899);
    const p3 = 100 + ((idx * 13) % 899);
    phone = `+254 ${p1} ${p2} ${p3}`;
  }

  // Generate clean email
  const safeFirst = firstName.toLowerCase().replace(/[^a-z]/g, '');
  const safeLast = lastName.toLowerCase().replace(/[^a-z]/g, '');
  const email = `${safeFirst}.${safeLast}.${idx + 1}@alumni.bibu.university`;

  const programName = cleanTitle(g.degreeOrTitle, g.qualificationLevel);

  return {
    rawName: g.name,
    name: cleanedName,
    firstName,
    middleName,
    lastName,
    mobile: phone,
    email,
    regNo,
    graduationYear: 2020,
    graduationDate: '2020-12-04',
    qualificationLevel: g.qualificationLevel,
    programName,
    originalTitle: g.degreeOrTitle,
    campus: g.campus,
    county: g.county,
    country: g.country,
    supervisor: g.supervisor
  };
});

console.log('Processed total:', processed.length);
console.log('Campus breakdown:', campusCounters);
fs.writeFileSync('./scripts/processed_2020_graduates.json', JSON.stringify(processed, null, 2));
console.log('Sample graduate:', processed[0]);
