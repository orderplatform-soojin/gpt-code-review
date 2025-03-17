import * as core from '@actions/core';
import { GitHubService } from './services/github.js';
import { OpenAIService } from './services/openai.js';
import type { ReviewConfig } from './types/index.js';

async function run(): Promise<void> {
  try {
    // GitHub Actions 환경 변수에서 설정 가져오기
    const config: ReviewConfig = {
      githubToken: core.getInput('GITHUB_TOKEN', { required: true }),
      openaiApiKey: core.getInput('OPENAI_API_KEY', { required: true }),
      language: core.getInput('LANGUAGE') || '한국어',
      model: core.getInput('MODEL') || 'gpt-4',
      prompt: core.getInput('PROMPT'),
      maxCompletionTokens: parseInt(core.getInput('MAX_COMPLETION_TOKENS') || '1000', 10),
      maxPatchLength: parseInt(core.getInput('MAX_PATCH_LENGTH') || '3000', 10),
      ignorePatterns: core.getInput('IGNORE_PATTERNS')?.split(',').map(p => p.trim()) || [],
    };

    // 서비스 초기화
    const githubService = new GitHubService(config);
    const openaiService = new OpenAIService(config);

    // PR 변경사항 가져오기
    const diff = await githubService.getDiff();

    // ChatGPT를 사용하여 코드 리뷰 생성
    const review = await openaiService.generateCodeReview(diff);

    // GitHub PR에 리뷰 코멘트 작성
    await githubService.createReviewComment(review);

    core.info('코드 리뷰가 성공적으로 완료되었습니다! 🎉');
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('알 수 없는 오류가 발생했습니다.');
    }
  }
}

run();
