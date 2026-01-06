import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { botInstructions } from '@/config/bot-instructions';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
try {
    const { messages, lang } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash-lite",
    systemInstruction: botInstructions[lang as 'fi' | 'en'] || botInstructions.en
    });

    const history = messages
        .slice(0, -1) // Exclude the current user message
        .filter((m: { role: string; content: string }, index: number) => {
            if (index === 0 && m.role !== 'user') return false;
            return true;
        })
        .map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
        }));

    const lastMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
        history: history,
        generationConfig: {
            maxOutputTokens: 200,
            temperature: 0.7,
        },
    });
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    
    return NextResponse.json({
    role: "assistant",
    content: response.text(),
    });

} catch (error: unknown) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Connection failed" }, { status: 500 });
}
}