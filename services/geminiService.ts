import { GoogleGenAI, Type } from "@google/genai";
import { WordEntry } from '../types';

// This is required to inform TypeScript that the 'process' object will be available in the build environment.
declare const process: any;

// The API key is obtained from the environment variable `process.env.API_KEY`.
// This variable MUST be set in your Vercel project settings.
const apiKey = process.env.API_KEY;

if (!apiKey) {
    // This message will be visible in the browser's developer console.
    console.error("API_KEY environment variable not set. This service will not function.");
    throw new Error("An API Key must be set when running in a browser");
}

// FIX: Initialize GoogleGenAI with a named apiKey parameter as required by the guidelines.
const ai = new GoogleGenAI({apiKey: apiKey});

/**
 * Generates a new, creative "love dialect" word and its meaning.
 */
export const generateLoveDialectOfTheDay = async (): Promise<{ word: string, meaning: string }> => {
    try {
        const prompt = `
            당신은 연인들을 위한 창의적인 작가입니다. 
            연인들이 서로에게 사용할 수 있는 귀엽고 새로운 애칭이나 표현(사랑방언)을 추천해주세요. 
            이미 존재하는 단어가 아닌, 당신이 새롭게 창조한 단어여야 합니다. 
            단어와 그 의미를 JSON 형식으로 제공해주세요. 
            의미는 왜 그런 단어가 만들어졌는지 설명하는 1~2문장의 짧은 글이어야 합니다.
            
            예시:
            {
              "word": "뽀송구름",
              "meaning": "나를 볼 때마다 뽀송한 구름처럼 행복하고 포근한 기분을 느끼게 해준다는 의미."
            }
        `;

        // FIX: Use ai.models.generateContent and the 'gemini-2.5-flash' model as per guidelines.
        // FIX: Use responseSchema for reliable JSON output.
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        word: { type: Type.STRING, description: "새로운 한국어 사랑방언 단어" },
                        meaning: { type: Type.STRING, description: "단어의 한국어 의미" },
                    },
                    required: ["word", "meaning"],
                },
                temperature: 1.0,
            },
        });

        // FIX: Access generated text directly from the response.text property.
        const jsonText = response.text?.trim() ?? '';
        const result = JSON.parse(jsonText);
        
        if (!result.word || !result.meaning) {
            throw new Error('AI did not return the expected format.');
        }

        return result;
    } catch (error) {
        console.error("Error generating love dialect:", error);
        throw new Error("AI 추천 단어를 생성하는 데 실패했어요. 잠시 후 다시 시도해주세요.");
    }
};


/**
 * Analyzes chat text to find potential new "love dialect" words.
 * Returns a stream of results for better UX.
 */
export async function* findWordsInChatStream(
    chatText: string,
    existingWords: WordEntry[]
): AsyncGenerator<{ progress?: number; words?: { word:string; meaning: string }[] }> {
    try {
        const existingWordList = existingWords.map(w => w.word).join(', ') || '없음';

        const prompt = `
            당신은 연인의 대화 내용을 분석하여 그들만의 특별한 애칭이나 표현(사랑방언)을 찾아내는 언어 분석 전문가입니다.
            주어진 카카오톡 대화 내용에서 연인들이 자주 사용하거나 특별한 의미를 부여하는 단어나 구절을 찾아주세요.
            이미 사전에 등록된 단어는 제외해야 합니다.

            분석 기준:
            1.  일반적이지 않은 독특한 애칭 (예: "우리 빵실이", "뽀짝이")
            2.  둘만의 사건이나 추억과 관련된 단어 (예: "제주도 똥돼지", "첫눈 와플")
            3.  서로의 특징을 묘사하는 귀여운 표현 (예: "말랑콩떡", "햇살버튼")
            4.  오타나 귀여운 말투에서 파생된 단어 (예: "해쪄염", "보고시포")

            결과는 아래 JSON 형식의 배열로 반환해주세요. 각 객체는 'word'와 'meaning'을 포함해야 합니다.
            'meaning'은 어떤 대화 맥락에서 이 단어가 나왔는지, 어떤 의미를 가지는지 1~2 문장으로 요약해주세요.
            찾아낸 단어가 없다면 빈 배열 []을 반환하세요.

            ---
            이미 등록된 단어 목록 (분석에서 제외):
            ${existingWordList}
            ---

            ---
            분석할 대화 내용:
            ${chatText.substring(0, 30000)} 
            ---
        `;

        yield { progress: 10 };
        
        // FIX: Use ai.models.generateContentStream for streaming responses, with the 'gemini-2.5-flash' model.
        const responseStream = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            word: { type: Type.STRING },
                            meaning: { type: Type.STRING },
                        },
                        required: ["word", "meaning"],
                    },
                },
            },
        });

        yield { progress: 30 };
        
        let fullResponseText = "";
        let reportedProgress = 30;

        for await (const chunk of responseStream) {
            // FIX: Access text from chunk.text and accumulate it.
            fullResponseText += chunk.text;
            
            if (reportedProgress < 90) {
                reportedProgress += 10;
                yield { progress: Math.min(90, reportedProgress) };
            }
        }
        
        if (!fullResponseText.trim()) {
             yield { words: [] };
             return;
        }

        const result = JSON.parse(fullResponseText);
        yield { words: result };

    } catch (error) {
        console.error("Error finding words in chat:", error);
        throw new Error("대화 내용 분석 중 오류가 발생했습니다. 파일 형식이 올바른지 확인해주세요.");
    }
}