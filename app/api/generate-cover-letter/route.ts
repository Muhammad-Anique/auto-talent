// app/api/generate-cover-letter/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, jobDescription, tone } = body;

    if (!jobDescription || typeof tone !== "number") {
      return NextResponse.json(
        { error: "Missing required fields: jobDescription and tone." },
        { status: 400 }
      );
    }

    const toneDescriptionMap: Record<number, string> = {
      1: "formal",
      2: "friendly",
      3: "enthusiastic",
      4: "confident",
      5: "humble",
    };

    const toneLabel = toneDescriptionMap[tone] || "professional";

    const prompt = `
You are a skilled career assistant. Generate a high-quality, professional cover letter for the following job description. 

- Write in a ${toneLabel} tone.
- Keep the letter concise, ideally one page.
- Make sure it sounds human-written and tailored to the role.
- Use today's date: ${new Date().toLocaleDateString()}.
- Start with "Dear Hiring Manager" and avoid generic filler.
- Focus on why the applicant is a great fit.
- Write the cover letter in the same language as the job description.

Job Description:
${jobDescription}

Cover Letter:
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      },
      body: JSON.stringify({
        model: "gpt-4", // or "gpt-3.5-turbo"
        messages: [
          {
            role: "system",
            content:
              "You are an expert career assistant who writes compelling cover letters tailored to job descriptions.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "OpenAI API error");
    }

    const data = await response.json();
    const coverLetter = data.choices?.[0]?.message?.content?.trim() || "";

    return NextResponse.json({ title, context: coverLetter });
  } catch (error) {
    console.error("API error generating cover letter:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to generate cover letter";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
