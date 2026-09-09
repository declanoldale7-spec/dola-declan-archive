// api/chat.js — CHAVVYCHAT ONE — THE FINAL BRAIN
// Contract: Input { message } → Output { reply } → Error { error }
// Key: Vercel Env Var → OPENAI_API_KEY — NEVER in frontend

export default async function handler(request) {
  if (request.method!== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json', 'Allow': 'POST' } }
    );
  }

  try {
    const body = await request.json();
    const { message } = body;

    if (typeof message!== 'string' ||!message.trim()) {
      return new Response(
        JSON.stringify({ error: 'Message must be a non-empty string' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        instructions: 'You are ChavvyChat — friendly, Yorkshire, 1101 family. Warm, helpful, keep replies clear and natural.',
        input: message.trim()
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenAI API error:', data);
      return new Response(
        JSON.stringify({ error: 'AI request failed' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const reply =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      'No response received.';

    return new Response(
      JSON.stringify({ reply }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Chat error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
