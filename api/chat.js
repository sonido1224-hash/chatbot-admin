export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // サイト取得機能
if (req.body.action === 'fetch_site') {
    try {
      const baseUrl = req.body.url.replace(/\/$/, '');
      
      // WordPress REST APIで投稿・固定ページを取得
      const [postsRes, pagesRes] = await Promise.all([
        fetch(`${baseUrl}/wp-json/wp/v2/posts?per_page=10&_fields=title,content,excerpt`),
        fetch(`${baseUrl}/wp-json/wp/v2/pages?per_page=10&_fields=title,content`)
      ]);

      let content = '';

      if (postsRes.ok) {
        const posts = await postsRes.json();
        posts.forEach(p => {
          const title = p.title?.rendered || '';
          const text = (p.content?.rendered || p.excerpt?.rendered || '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s{3,}/g, '\n')
            .trim();
          content += `\n\n【記事】${title}\n${text.slice(0, 1000)}`;
        });
      }

      if (pagesRes.ok) {
        const pages = await pagesRes.json();
        pages.forEach(p => {
          const title = p.title?.rendered || '';
          const text = (p.content?.rendered || '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s{3,}/g, '\n')
            .trim();
          content += `\n\n【ページ】${title}\n${text.slice(0, 2000)}`;
        });
      }

      // REST APIが使えない場合はトップページのみ取得
      if (!content) {
        const siteRes = await fetch(baseUrl);
        const html = await siteRes.text();
        content = html
          .replace(/<script[\s\S]*?<\/script>/gi, '')
          .replace(/<style[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s{3,}/g, '\n\n')
          .trim();
      }

      return res.status(200).json({ content: content.trim().slice(0, 15000) });
    } catch (e) {
      return res.status(500).json({ error: 'サイトの取得に失敗しました' });
    }
  }

  // チャット機能
  const { message, history, systemPrompt } = req.body;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 150,
        system: systemPrompt,
        messages: [...(history || []), { role: 'user', content: message }]
      })
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'エラーが発生しました。';
    res.status(200).json({ reply, type: 'ai' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
