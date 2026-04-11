const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { menuCd } = await req.json();
    if (!menuCd) {
      return new Response(JSON.stringify({ error: 'menuCd required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = `https://www.geoje.go.kr/index.geoje?menuCd=${menuCd}`;
    const response = await fetch(url);
    const html = await response.text();

    // Extract main content area - look for the content between breadcrumb and footer
    // The content is in the #contentsBox area
    let content = '';
    
    // Try to extract content from the HTML
    const contentMatch = html.match(/<div[^>]*class="[^"]*sub_cont[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<div[^>]*class="[^"]*satisfaction/i);
    if (contentMatch) {
      content = contentMatch[1];
    } else {
      // Fallback: try to find article content
      const articleMatch = html.match(/<div[^>]*id="contentsBox"[^>]*>([\s\S]*?)<div[^>]*class="[^"]*satisfaction/i);
      if (articleMatch) {
        content = articleMatch[1];
      }
    }

    // Clean HTML: remove scripts, styles, navigation
    content = content
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<div[^>]*class="[^"]*location[^"]*"[\s\S]*?<\/div>/gi, '')
      .replace(/<div[^>]*class="[^"]*lnb[^"]*"[\s\S]*?<\/div>/gi, '');

    // Convert HTML to simplified text
    // Replace headers
    content = content.replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, '\n## $1\n');
    // Replace list items
    content = content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '• $1\n');
    // Replace paragraphs
    content = content.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n');
    // Replace br
    content = content.replace(/<br\s*\/?>/gi, '\n');
    // Remove remaining HTML tags
    content = content.replace(/<[^>]+>/g, '');
    // Decode HTML entities
    content = content.replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');
    // Clean up whitespace
    content = content.replace(/\n{3,}/g, '\n\n').trim();

    // Extract title from page
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    return new Response(JSON.stringify({ title, content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching place origin:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
