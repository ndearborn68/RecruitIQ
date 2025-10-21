// Simple Express server that acts as a bridge between your React app and Claude API
// This server will receive search queries and use Claude API to perform web searches

import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
const PORT = 3001;

// Enable CORS for localhost:5173
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

/**
 * POST /api/search
 * Performs web search using Claude API with web search capability
 */
app.post('/api/search', async (req, res) => {
  try {
    const { query, jobData } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log(`🔍 Performing web search for: "${query}"`);

    // Call Claude API with web search enabled
    const message = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219', // Latest model with web search
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `Perform a web search for job postings matching this query: "${query}"

Focus on finding:
- Company names
- Job URLs (especially careers pages, Greenhouse, Lever, Talentify, LinkedIn, Indeed)
- Job titles
- Locations
- Salary information
- Technology/software mentioned (especially Sage Intacct, ASC 842, etc.)
- Healthcare/industry indicators

Return results in this exact JSON format:
{
  "results": [
    {
      "jobUrl": "https://...",
      "company": "Company Name",
      "jobTitle": "Job Title",
      "location": "City, State",
      "description": "Brief description from search result",
      "salary": "$XXk-$XXXk" (if found),
      "techStack": ["Tech1", "Tech2"],
      "postedDate": "ISO date string",
      "source": "linkedin|indeed|greenhouse|lever|company-careers"
    }
  ]
}

IMPORTANT: Only return job postings that match the query. If no relevant results found, return empty results array.`
      }],
      tools: [{
        type: 'web_search_20241111'
      }]
    });

    // Parse the response
    const responseText = message.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('');

    // Try to extract JSON from response
    let results = [];
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*"results"[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        results = parsed.results || [];
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response as JSON:', parseError);
    }

    console.log(`✅ Found ${results.length} job postings`);

    res.json({
      results,
      totalResults: results.length
    });

  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({
      error: error.message,
      results: []
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Search API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Search API server running on http://localhost:${PORT}`);
  console.log(`📡 Accepting requests from http://localhost:5173`);
  console.log(`\n💡 Make sure to set ANTHROPIC_API_KEY environment variable`);
});
