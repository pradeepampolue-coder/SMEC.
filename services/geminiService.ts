
import { GoogleGenAI, Type } from "@google/genai";
import { Timetable, Section, LabRequest } from "../types";
import { MOCK_LAB_SCHEDULE_PROMPT } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function matchLabRequest(
  request: LabRequest,
  allTimetables: Timetable[]
) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

  const prompt = `
    Context: St. Martin's Engineering College (SMEC) - ECE Department.
    Student ${request.requesterName} from Section ${request.requesterSection} needs a ${request.requirement}.
    Today is ${today}, Current Time is ${currentTime}.

    Lab Knowledge Base:
    ${MOCK_LAB_SCHEDULE_PROMPT}

    Current Timetables Data for all sections:
    ${JSON.stringify(allTimetables)}

    Task:
    1. Check which sections currently (or for the next few hours) do NOT have a lab session.
    2. Identify specific sections that are in a regular theory class or have a free period.
    3. Students in those sections don't need their aprons or lab equipment right now.
    4. Provide a friendly recommendation on which section the requester should approach.

    Return a JSON response with the following format:
    {
      "recommendation": "Short summary of who to ask",
      "eligibleSections": ["A", "B"],
      "reasoning": "Explain why based on the schedule"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendation: { type: Type.STRING },
            eligibleSections: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            reasoning: { type: Type.STRING }
          },
          required: ["recommendation", "eligibleSections", "reasoning"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI matching failed", error);
    return {
      recommendation: "Checking all sections...",
      eligibleSections: [],
      reasoning: "AI verification service is currently busy. Please check with Section A or B manually."
    };
  }
}
