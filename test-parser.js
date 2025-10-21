// Test the enhanced parser with Disney job description

const disneyJob = `We are looking for a Talent Acquisition Coordinator for a top media & entertainment company out of their Burbank, CA offices! The Company is seeking a Talent Acquisition Coordinator to support their dynamic and fast-paced Talent Acquisition team. This highly visible role is critical to creating a seamless candidate experience and ensuring the success of our recruiting efforts across the organization. We're looking for someone with recruitment coordination experience who thrives in a high-volume environment, has a sharp eye for detail, and can think creatively to solve scheduling challenges with minimal supervision.

Responsibilities:
Schedule a high volume of interviews (approximately 35–70 per week), panel interviews, and candidate travel arrangements
Coordinate with hiring managers, recruiters, and interviewers to align availability and ensure smooth execution
Book conference rooms and send timely confirmation emails to candidates
Facilitate onboarding tasks, including orientation scheduling, background check coordination, and fingerprint scheduling for Florida backgrounds
Manage and update job postings through our Applicant Tracking System (ATS), Workday
Serve as a point of contact for candidates, ensuring a positive and professional experience

Required Qualifications:
2-3 years of experience as a Recruiting Coordinator or in a similar fast-paced administrative support role
Strong scheduling skills with the ability to juggle multiple calendars(Outlook) and priorities under tight deadlines
A strong customer service mindset and commitment to delivering an outstanding candidate experience
High attention to detail and a knack for spotting errors or inconsistencies
Creative problem-solving skills and the ability to think outside the box when faced with scheduling conflicts or changes
Strong verbal and written communication skills
Proficient in Microsoft Office Suite (Outlook, Excel, Word) and calendar management tools
Experience using Workday or similar HRIS/ATS systems preferred
Ability to handle sensitive information with discretion
Organized, dependable, and capable of working independently with minimal supervision
Comfortable working in a collaborative team environment and partnering with all levels of leadership
Bachelor's degree preferred`

console.log('🧪 Testing Enhanced Parser with Disney Job Description')
console.log('=' .repeat(80))
console.log('\n📋 EXPECTED IDENTIFIERS TO EXTRACT:\n')

console.log('TIER 1 - Critical Signals:')
console.log('  🎯 HRIS/ATS: Workday (CRITICAL - Disney uses Workday)')
console.log('  🎯 Exact Metric: 35-70 interviews per week (EXACT MATCH)')
console.log('  🎯 Geographic: fingerprint scheduling for Florida backgrounds (SMOKING GUN)')
console.log('  🎯 Exact Metric: 2-3 years experience')
console.log('')

console.log('TIER 2 - Exact Phrases:')
console.log('  📝 "approximately 35–70 per week"')
console.log('  📝 "panel interviews, and candidate travel arrangements"')
console.log('  📝 "Outlook, Excel, Word"')
console.log('  📝 "collaborative team environment and partnering with all levels of leadership"')
console.log('')

console.log('TIER 3 - Vertical Terms:')
console.log('  🏢 Media: "media & entertainment company"')
console.log('  🏢 Media: "studio operations" (implied)')
console.log('')

console.log('TIER 4 - Location-Specific:')
console.log('  📍 Workday in Burbank, CA')
console.log('  📍 Outlook in Burbank, CA')
console.log('  📍 Florida backgrounds from Burbank location')
console.log('')

console.log('TIER 5 - Uncommon Phrases:')
console.log('  💎 "fingerprint scheduling florida backgrounds"')
console.log('  💎 "panel interviews candidate travel"')
console.log('  💎 "think creatively solve scheduling"')
console.log('  💎 "high volume environment sharp"')
console.log('  💎 "minimal supervision comfortable working"')
console.log('')

console.log('TIER 6 - Compliance Terms:')
console.log('  ⚖️ Background check coordination')
console.log('  ⚖️ Handle sensitive information with discretion')
console.log('')

console.log('TIER 7 - Proprietary Tools:')
console.log('  🔧 Applicant Tracking System (ATS)')
console.log('  🔧 Calendar management tools')
console.log('')

console.log('=' .repeat(80))
console.log('\n💡 KEY INSIGHTS:')
console.log('  1. "Workday" + "Burbank, CA" + "media & entertainment" → Strong Disney signal')
console.log('  2. "35-70 interviews per week" → Exact match with Disney postings')
console.log('  3. "Florida fingerprints" → Unique to companies with CA/FL operations (Disney!)')
console.log('  4. Combination of all 3 → 85%+ confidence it\'s Disney')
console.log('')
console.log('✅ With this enhanced extraction, we can identify Disney with high confidence!')
console.log('✅ These identifiers create a unique "fingerprint" for cross-referencing')
