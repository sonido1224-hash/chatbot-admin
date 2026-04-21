export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const body = req.body;

  // サイト取得
  if (body.action === 'fetch_site') {
    try {
      const baseUrl = body.url.replace(/\/$/, '');
      const [postsRes, pagesRes] = await Promise.all([
        fetch(`${baseUrl}/wp-json/wp/v2/posts?per_page=5&_fields=title,content,excerpt`),
        fetch(`${baseUrl}/wp-json/wp/v2/pages?per_page=10&_fields=title,content`)
      ]);
      let content = '';
      if (postsRes.ok) {
        const posts = await postsRes.json();
        posts.forEach(p => {
          const title = p.title?.rendered || '';
          const text = (p.content?.rendered || '').replace(/<[^>]+>/g,' ').replace(/\s{3,}/g,'\n').trim();
          content += `\n\n【記事】${title}\n${text.slice(0,500)}`;
        });
      }
      if (pagesRes.ok) {
        const pages = await pagesRes.json();
        pages.forEach(p => {
          const title = p.title?.rendered || '';
          const text = (p.content?.rendered || '').replace(/<[^>]+>/g,' ').replace(/\s{3,}/g,'\n').trim();
          content += `\n\n【ページ】${title}\n${text.slice(0,1500)}`;
        });
      }
      if (!content) {
        const siteRes = await fetch(baseUrl);
        const html = await siteRes.text();
        content = html.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/\s{3,}/g,'\n\n').trim();
      }
      return res.status(200).json({ content: content.trim().slice(0,15000) });
    } catch(e) {
      return res.status(500).json({ error: 'サイトの取得に失敗しました' });
    }
  }

  // GASへの中継（ログイン・設定・クライアント管理）
  if (['login','get_settings','save_settings','get_clients','add_client'].includes(body.action)) {
    try {
      const gasRes = await fetch(body.gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await gasRes.json();
      return res.status(200).json(data);
    } catch(e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // チャット
  if (body.action === 'chat') {
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
          max_tokens: 200,
          system: body.systemPrompt,
          messages: [...(body.history || []), { role: 'user', content: body.message }]
        })
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || 'エラーが発生しました。';
      // GASにログを保存
if (body.gasUrl && body.clientId) {
  fetch(body.gasUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'save_log',
      clientId: body.clientId,
      message: body.message,
      reply
    })
  }).catch(e => console.log('ログ保存エラー:', e));
}

return res.status(200).json({ reply });
    } catch(e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(400).json({ error: 'Unknown action' });
}
