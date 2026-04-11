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

    // Extract content from <div class="con-wrap" id="con-wrap">
    let content = '';
    
    const conWrapMatch = html.match(/<div[^>]*id="con-wrap"[^>]*>([\s\S]*?)<!--\s*e:\s*page/i) 
      || html.match(/<div[^>]*id="con-wrap"[^>]*>([\s\S]*?)<div[^>]*class="[^"]*satisfaction/i)
      || html.match(/<div[^>]*id="con-wrap"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/i);
    
    if (conWrapMatch) {
      content = conWrapMatch[1];
    } else {
      // Broader fallback: get everything inside contentsBox
      const contentsMatch = html.match(/<div[^>]*id="contentsBox"[^>]*>([\s\S]*?)<div[^>]*class="[^"]*satisfaction/i);
      if (contentsMatch) {
        content = contentsMatch[1];
      }
    }

    // Remove tab navigation (taps-dt5)
    content = content.replace(/<ul[^>]*class="[^"]*taps-dt[^"]*"[^>]*>[\s\S]*?<\/ul>/gi, '');
    // Remove spacer elements
    content = content.replace(/<p[^>]*class="gap\d+"[^>]*><\/p>/gi, '');
    // Remove scripts, styles
    content = content.replace(/<script[\s\S]*?<\/script>/gi, '');
    content = content.replace(/<style[\s\S]*?<\/style>/gi, '');

    // Convert h4/h5 titles
    content = content.replace(/<h4[^>]*class="cont-title"[^>]*>([\s\S]*?)<\/h4>/gi, '\n## $1\n');
    content = content.replace(/<h5[^>]*class="cont-title[^"]*"[^>]*>([\s\S]*?)<\/h5>/gi, '\n### $1\n');
    // Convert list items
    content = content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '$1\n');
    // Convert paragraphs
    content = content.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n');
    // Convert br
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

    // Extract title
    const titleMatch = html.match(/<h3[^>]*class="title"[^>]*>([\s\S]*?)<\/h3>/i);
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
