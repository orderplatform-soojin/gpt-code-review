import OpenAI from 'openai';
export class OpenAIService {
    openai;
    config;
    constructor(config) {
        this.config = config;
        this.openai = new OpenAI({
            apiKey: config.openaiApiKey,
        });
    }
    async generateCodeReview(diff) {
        const prompt = this.config.prompt || '다음 코드 변경사항을 리뷰해주세요:';
        const model = this.config.model || 'gpt-4';
        const maxTokens = this.config.maxCompletionTokens || 1000;
        try {
            const response = await this.openai.chat.completions.create({
                model: model,
                messages: [
                    {
                        role: 'system',
                        content: `당신은 숙련된 시니어 개발자입니다. 
            코드 리뷰를 ${this.config.language || '한국어'}로 작성해주세요. 
            코드의 품질, 가독성, 성능, 보안 측면에서 분석해주시고, 
            개선이 필요한 부분이 있다면 구체적인 제안을 해주세요.`
                    },
                    {
                        role: 'user',
                        content: `${prompt}\n\n${diff}`
                    }
                ],
                max_tokens: maxTokens,
            });
            return response.choices[0]?.message?.content || '리뷰를 생성할 수 없습니다.';
        }
        catch (error) {
            console.error('OpenAI API 호출 중 오류 발생:', error);
            throw new Error('코드 리뷰 생성 중 오류가 발생했습니다.');
        }
    }
}
