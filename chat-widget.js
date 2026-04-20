(function() {
  const VERCEL_URL = 'https://chatbot-admin-eight.vercel.app';
  const GAS_URL = document.currentScript.getAttribute('data-gas-url') || '';
const CLIENT_ID = document.currentScript.getAttribute('data-client-id') || 'sonido';
  const COLOR = document.currentScript.getAttribute('data-color') || '#1976D2';

  const style = document.createElement('style');
  style.textContent = `
#sonido-chat-btn{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;background:${COLOR};color:#fff;border:none;font-size:24px;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.2);z-index:9999;display:flex;align-items:center;justify-content:center;transition:transform .2s}
#sonido-chat-btn:hover{transform:scale(1.08)}
@media(min-width:768px){#sonido-chat-btn{right:74px}#sonido-chat-wrap{right:64px}#sonido-chat-balloon{right:190px}}
#sonido-chat-balloon{position:fixed;bottom:36px;right:140px;background:#fff;border:1px solid #e0e0e0;border-radius:12px 12px 0 12px;padding:8px 14px;font-size:13px;color:#333;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.12);z-index:9997;animation:balloon-in .3s ease}
#sonido-chat-balloon{display:none}
@media(min-width:768px){#sonido-chat-balloon{display:block}}
#sonido-chat-balloon::after{content:'';position:absolute;bottom:0;right:-8px;width:0;height:0;border:8px solid transparent;border-left-color:#fff;border-bottom:0}
@keyframes balloon-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    #sonido-chat-wrap{position:fixed;bottom:90px;right:24px;width:340px;height:480px;background:#fff;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,.15);z-index:9998;display:none;flex-direction:column;overflow:hidden;font-family:'Hiragino Kaku Gothic Pro','Noto Sans JP',sans-serif}
    #sonido-chat-wrap.open{display:flex}
    .sc-header{background:${COLOR};padding:12px 16px;display:flex;align-items:center;gap:10px;color:#fff}
    .sc-avatar{width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:16px}
    .sc-name{font-size:14px;font-weight:700}
    .sc-status{font-size:11px;opacity:.6;display:flex;align-items:center;gap:4px;margin-top:2px}
    .sc-dot{width:6px;height:6px;border-radius:50%;background:#4ade80}
    .sc-close{margin-left:auto;background:none;border:none;color:#fff;font-size:18px;cursor:pointer;opacity:.7}
    .sc-close:hover{opacity:1}
    .sc-messages{flex:1;overflow-y:auto;padding:12px 10px;background:#f7f8fc;display:flex;flex-direction:column;gap:8px}
    .sc-msg{display:flex;flex-direction:column}
    .sc-msg.bot{align-items:flex-start}
    .sc-msg.user{align-items:flex-end}
    .sc-bubble{max-width:85%;padding:8px 12px;font-size:13px;line-height:1.6;word-break:break-word;white-space:pre-wrap}
    .sc-bubble.bot{background:#fff;color:#1a1a2e;border-radius:12px 12px 12px 3px;box-shadow:0 1px 3px rgba(0,0,0,.08)}
    .sc-bubble.user{background:${COLOR};color:#fff;border-radius:12px 12px 3px 12px}
    .sc-qrs{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}
    .sc-qr{padding:4px 10px;font-size:11px;border:1px solid #d8d8e8;border-radius:20px;background:#fff;color:#444;cursor:pointer;font-family:inherit}
    .sc-qr:hover{background:#f0f0f8}
    .sc-cta{background:#eff4ff;border:1px solid #c5d5fb;border-radius:10px;padding:10px 12px;margin-top:4px;max-width:88%}
    .sc-cta-t{font-size:11px;font-weight:700;color:#3b5bdb;margin-bottom:4px}
    .sc-cta-b{font-size:11px;color:#555;line-height:1.6;margin-bottom:8px}
    .sc-cta-btn{padding:5px 12px;background:#3b5bdb;color:#fff;border:none;border-radius:20px;font-size:11px;font-weight:700;cursor:pointer;text-decoration:none;display:inline-block}
    .sc-typing{background:#fff;border-radius:12px;padding:9px 13px;display:inline-flex;gap:4px;box-shadow:0 1px 3px rgba(0,0,0,.08)}
    .sc-typing span{width:5px;height:5px;border-radius:50%;background:#ccc;animation:scbob 1.2s infinite}
    .sc-typing span:nth-child(2){animation-delay:.2s}
    .sc-typing span:nth-child(3){animation-delay:.4s}
    @keyframes scbob{0%,80%,100%{transform:translateY(0);opacity:.3}40%{transform:translateY(-4px);opacity:1}}
    .sc-footer{padding:8px 10px;border-top:1px solid #eee;background:#f7f8fc;display:flex;gap:6px;justify-content:center}
.sc-footer-btn{padding:6px 14px;font-size:11px;font-weight:600;border-radius:20px;border:none;cursor:pointer;text-decoration:none;display:inline-block}
.sc-footer-contact{background:#3b5bdb;color:#fff}
.sc-footer-tel{background:#fff;color:#1a1a2e;border:1px solid #ddd}
    .sc-input-row{padding:8px 10px;border-top:1px solid #eee;display:flex;gap:6px;background:#fff}
    .sc-input{flex:1;padding:7px 12px;font-size:13px;border:1px solid #e0e0e0;border-radius:20px;outline:none;font-family:inherit}
    .sc-send{width:34px;height:34px;border-radius:50%;background:${COLOR};color:#fff;border:none;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .sc-send:disabled{background:#e5e5e5;color:#aaa;cursor:default}
  `;
  document.head.appendChild(style);

  document.body.insertAdjacentHTML('beforeend', `
    <div id="sonido-chat-balloon">お気軽にご相談ください 😊</div>
<button id="sonido-chat-btn">💬</button>
    <div id="sonido-chat-wrap">
      <div class="sc-header">
        <div class="sc-avatar">💬</div>
        <div>
          <div class="sc-name" id="sc-name">AIアシスタント</div>
          <div class="sc-status"><span class="sc-dot"></span>24時間対応</div>
        </div>
        <button class="sc-close" id="sc-close">✕</button>
      </div>
      <div class="sc-messages" id="sc-messages"></div>
      <div class="sc-footer" id="sc-footer"></div>
      <div class="sc-input-row">
        <input class="sc-input" id="sc-input" placeholder="質問を入力...">
        <button class="sc-send" id="sc-send">➤</button>
      </div>
    </div>
  `);

  let siteSettings = null;
  let history = [];
  let msgCount = 0;
  let busy = false;
  let initialized = false;

  // GASから設定を取得
async function loadSettings() {
    if (!GAS_URL) return;
    try {
      const res = await fetch(`${VERCEL_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
  action: 'get_settings',
  gasUrl: GAS_URL,
  clientId: CLIENT_ID
})
      });
      const data = await res.json();
      if (data.settings) {
  siteSettings = data.settings;
  document.getElementById('sc-name').textContent = siteSettings.name + ' のBot';
  // フッターボタンを表示
  const footer = document.getElementById('sc-footer');
  let footerHtml = '';
  if (siteSettings.contactUrl) {
    footerHtml += `<a href="${siteSettings.contactUrl}" class="sc-footer-btn sc-footer-contact">📩 無料相談する</a>`;
  }
  if (siteSettings.tel) {
    footerHtml += `<a href="tel:${siteSettings.tel}" class="sc-footer-btn sc-footer-tel">📞 ${siteSettings.tel}</a>`;
  }
  footer.innerHTML = footerHtml;
}
    } catch(e) {}
  }

  loadSettings();

  const btn = document.getElementById('sonido-chat-btn');
  const wrap = document.getElementById('sonido-chat-wrap');
  const closeBtn = document.getElementById('sc-close');
  const messages = document.getElementById('sc-messages');
  const input = document.getElementById('sc-input');
  const send = document.getElementById('sc-send');

btn.onclick = () => {
    wrap.classList.toggle('open');
    // 吹き出しを消す
    const balloon = document.getElementById('sonido-chat-balloon');
    if (balloon) balloon.remove();
    if (!initialized) {
      initialized = true;
      const name = siteSettings?.name || 'AIアシスタント';
      addBot(`こんにちは！${name}のAIアシスタントです。\nご質問はお気軽にどうぞ 😊`,
        ['サービス内容を教えて', '料金はいくら？', '無料相談したい']);
    }
  };
  closeBtn.onclick = () => wrap.classList.remove('open');
  send.onclick = () => sendMsg();
  input.onkeydown = e => { if (e.key === 'Enter') sendMsg(); };

  async function sendMsg(text) {
    const msg = (text || input.value).trim();
    if (!msg || busy) return;
    input.value = '';
    msgCount++;
    addUser(msg);
    setBusy(true);

    const name = siteSettings?.name || 'AIアシスタント';
    const content = siteSettings?.content || '';
    const qaList = siteSettings?.qaList || [];

    // Q&Aマッチング
    const matched = qaList.find(qa => {
      const kws = qa.q.split(/[？?、。\s]/).filter(k => k.length >= 2);
      return kws.some(kw => msg.includes(kw));
    });

    const systemPrompt = matched
      ? `ユーザーが「${matched.q}」について聞いています。必ず次の内容で答えてください：「${matched.a}」マークダウン記法は使わない。`
      : `あなたは「${name}」のAIアシスタントです。\n=== サイト情報 ===\n${content}\n=== ここまで ===\nルール：2〜3文で簡潔に答える。マークダウン記法は使わない。最後に短い質問を1つ添える。サイト情報にないことは「詳しくはお問い合わせください」と答える。`;

    try {
      const res = await fetch(`${VERCEL_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'chat', message: msg, history, systemPrompt })
      });
      const data = await res.json();
      const reply = data.reply || 'もう一度お試しください。';
      history = [...history, { role: 'user', content: msg }, { role: 'assistant', content: reply }];
      setBusy(false);
      addBot(reply, null, msgCount % 5 === 0);
    } catch(e) {
      setBusy(false);
      addBot('エラーが発生しました。しばらくしてからお試しください。');
    }
  }

  function addBot(text, quick, cta) {
    const d = document.createElement('div');
    d.className = 'sc-msg bot';
    d.innerHTML = `<div class="sc-bubble bot">${esc(text)}</div>`;
    if (quick) {
      const qr = document.createElement('div'); qr.className = 'sc-qrs';
      quick.forEach(q => {
        const b = document.createElement('button'); b.className = 'sc-qr';
        b.textContent = q; b.onclick = () => sendMsg(q); qr.appendChild(b);
      });
      d.appendChild(qr);
    }
    if (cta && siteSettings) {
      const c = document.createElement('div'); c.className = 'sc-cta';
      const tel = siteSettings.tel ? `<br>📞 ${siteSettings.tel}` : '';
      const contactUrl = siteSettings.contactUrl || '';
      c.innerHTML = `<div class="sc-cta-t">📩 無料相談受付中</div><div class="sc-cta-b">相談だけでも大歓迎！${tel}</div>${contactUrl ? `<a href="${contactUrl}" class="sc-cta-btn">無料相談を申し込む →</a>` : ''}`;
      d.appendChild(c);
    }
    messages.appendChild(d);
    messages.scrollTop = messages.scrollHeight;
  }

  function addUser(text) {
    const d = document.createElement('div');
    d.className = 'sc-msg user';
    d.innerHTML = `<div class="sc-bubble user">${esc(text)}</div>`;
    messages.appendChild(d);
    messages.scrollTop = messages.scrollHeight;
  }

  let typingEl = null;
  function setBusy(on) {
    busy = on; send.disabled = on; input.disabled = on;
    if (on) {
      typingEl = document.createElement('div');
      typingEl.className = 'sc-msg bot';
      typingEl.innerHTML = '<div class="sc-typing"><span></span><span></span><span></span></div>';
      messages.appendChild(typingEl);
      messages.scrollTop = messages.scrollHeight;
    } else if (typingEl) { typingEl.remove(); typingEl = null; }
  }

  function esc(s) {
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
  }
})();
