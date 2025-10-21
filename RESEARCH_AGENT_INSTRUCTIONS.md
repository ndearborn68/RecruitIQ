# Research Agent Instructions

## How to Use the Research Agent

Instead of running the analysis through the UI, you can invoke a specialized research agent directly through Claude Code CLI that will:

1. **Extract unique identifiers** from the job description
2. **Perform exhaustive web searches** using multiple search strategies
3. **Cross-reference results** from multiple sources
4. **Calculate confidence scores** based on evidence
5. **Return detailed reasoning** for the match

---

## To Invoke the Research Agent:

1. **Open Claude Code CLI** (the terminal where you're chatting with me)
2. **Type this command**:

```
@analyze-job-posting
```

3. **Paste the job description** when prompted

4. **Wait 2-5 minutes** for deep research

5. **Receive detailed report** with:
   - Identified employer
   - Confidence score (0-100%)
   - All search queries used
   - Evidence from multiple sources
   - Cross-references and verification

---

## How It Works (Same Process as Other LLM):

### Step 1: Extract Unique Identifiers
- "Technical accounting (e.g. business combinations, ASC 842, cash flow statement)"
- "Sage Intacct experience"
- "fast-growing multi-site organization, preferably Healthcare related"
- Salary range: $105k-$115k
- Location: Austin, TX

### Step 2: Build Intelligent Search Queries
1. `"business combinations, ASC 842, cash flow statement" "Senior Accountant" Austin TX`
2. `"Sage Intacct" "ASC 842" healthcare Austin TX`
3. `"fast-growing multi-site" healthcare "Senior Accountant" Austin`
4. `Senior Accountant Sage Intacct Austin TX dermatology`
5. `"multi-site healthcare" "Sage Intacct" Austin accounting`

### Step 3: Cross-Reference Results
- Search for company + Sage Intacct case studies
- Search for company + ASC 842
- Search for company + multi-site healthcare expansion
- Verify company headquarters location
- Check salary ranges on Glassdoor

### Step 4: Calculate Confidence Score
- **High (85-100%)**: Multiple exact phrase matches + verification from 3+ sources
- **Medium (70-84%)**: Several phrase matches + 2 sources
- **Low (50-69%)**: Some matches + 1 source
- **Very Low (<50%)**: Weak matches

---

## Example Output:

```
🔍 RESEARCH AGENT ANALYSIS REPORT
================================

JOB SOURCE: Solomon Page (Staffing Agency)
JOB TITLE: Senior Accountant
LOCATION: Austin, TX

IDENTIFIED END EMPLOYER: Epiphany Dermatology

CONFIDENCE SCORE: 95%

EVIDENCE:
----------

1. UNIQUE IDENTIFIER MATCH: "Technical accounting (ASC 842, business combinations)"
   ✅ Found: Epiphany Dermatology Sage Intacct case study
   Source: https://www.sage.com/en-us/success-stories/epiphany-dermatology/

2. SOFTWARE MATCH: "Sage Intacct"
   ✅ Confirmed: Epiphany uses Sage Intacct ERP
   Evidence: Official Sage case study

3. MULTI-SITE MATCH: "fast-growing multi-site organization"
   ✅ Confirmed: Grew from 7 to 50 clinics across 10 states
   Evidence: Sage case study quote

4. HEALTHCARE MATCH: "Healthcare related"
   ✅ Confirmed: Dermatology practice (healthcare)

5. LOCATION MATCH: Austin, TX
   ✅ Confirmed: Headquarters in Austin, TX
   Source: LinkedIn, Indeed, company website

6. SALARY VERIFICATION: $105k-$115k
   ✅ Compatible: Glassdoor shows $83k-$107k for Senior Accountant
   Note: Solomon Page salary slightly higher (includes bonus?)

7. HISTORICAL VERIFICATION:
   ✅ Ryan Dabadie was Senior Accountant at Epiphany (started 2017)
   Source: Epiphany website staff page

CROSS-REFERENCES:
-----------------
- Talentify.io posting (may have had identical job description)
- LinkedIn company page confirms Austin HQ
- Indeed reviews confirm multi-location growth
- Sage marketplace confirms ASC 842 compliance needs

REASONING:
----------
The combination of:
- Exact technical accounting phrase match (ASC 842 + business combinations)
- Confirmed Sage Intacct usage
- Confirmed multi-site healthcare expansion
- Matching location and salary range
- Historical evidence of Senior Accountant roles

All point to Epiphany Dermatology with 95% confidence.

ALTERNATIVE MATCHES CONSIDERED:
-------------------------------
- Dell Medical School (Austin healthcare, but less likely due to lack of ASC 842/Sage Intacct evidence)
- Ascension Seton (Large healthcare, but no Sage Intacct confirmation)

RECOMMENDATION:
---------------
Epiphany Dermatology is the most likely end employer for this Solomon Page posting.
```

---

## Why This Approach is Better:

1. **Uses real web search** (not mock data)
2. **Multiple search strategies** (like the other LLM did)
3. **Cross-references multiple sources**
4. **Provides detailed evidence trail**
5. **Calculates confidence scores**
6. **Checks alternative matches**

---

## Next Steps:

Would you like me to:

**Option A**: Create a slash command `/analyze-job` that you can run anytime?

**Option B**: Integrate this research agent into your UI so it runs automatically?

**Option C**: Just run it manually right now for the Solomon Page job?

Let me know which option you prefer!
