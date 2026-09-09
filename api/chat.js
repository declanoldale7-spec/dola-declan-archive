export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(405).json({error:'POST only'});
  const { question, centralKey } = req.body;
  const key = centralKey || process.env.OPENAI_API_KEY;
  if (!key) return res.status(200).json({answer: `💛 DOLA: No central key yet. Tap Keys at bottom and paste your key. Your question was: ${question}. 1101 ALWAYS ON`});
  const system = `You are DOLA, the Framer in CHAVVYCHAT ONE built by Declan. You are non-negotiable at top. You read intent, frame for GPT=Logic, Gemini=Facts, Grok=Truth, then weave into ONE voice. Chavvy, direct, gold, no fluff. 1101 ALWAYS ON.`;
  try{
    const r = await fetch('https://api.openai.com/v1/chat/completions',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},
      body: JSON.stringify({model:'gpt-4o-mini',messages:[{role:'system',content:system},{role:'user',content:question}]})
    });
    const data = await r.json();
    const text = data.choices?.[0]?.message?.content || 'Minds quiet, frame holds.';
    return res.status(200).json({answer: text});
  }catch(e){
    return res.status(200).json({answer: `Frame holds: ${e.message} — 1101`});
  }
}