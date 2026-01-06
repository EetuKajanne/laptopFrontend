import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // FAILSAFE: If no API key is set, return a mock response (Good for demos if you have no credits)
        if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ 
            role: 'assistant', 
            content: "I am a demo bot. I can't think for real yet because my API Key is missing, but I show that the connection works!" 
        });
        }

        // Call OpenAI
        const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // or gpt-4o-mini for speed/cost
        messages: [
            { role: "system", content: "You are a helpful assistant for RefurbShop, a store selling refurbished laptops. Be concise, polite, and helpful." },
            ...messages
        ],
    });

    const reply = completion.choices[0].message;

    return NextResponse.json(reply);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}