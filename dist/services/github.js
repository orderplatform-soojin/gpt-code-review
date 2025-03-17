import * as github from '@actions/github';
export class GitHubService {
    octokit;
    config;
    constructor(config) {
        this.config = config;
        this.octokit = github.getOctokit(config.githubToken);
    }
    async getPullRequestInfo() {
        const context = github.context;
        const pullRequest = context.payload.pull_request;
        if (!pullRequest) {
            throw new Error('이 액션은 Pull Request 이벤트에서만 실행될 수 있습니다.');
        }
        return {
            owner: context.repo.owner,
            repo: context.repo.repo,
            pullNumber: pullRequest.number,
            title: pullRequest.title,
            body: pullRequest.body || '',
        };
    }
    async getDiff() {
        const prInfo = await this.getPullRequestInfo();
        try {
            const response = await this.octokit.rest.pulls.get({
                owner: prInfo.owner,
                repo: prInfo.repo,
                pull_number: prInfo.pullNumber,
                mediaType: {
                    format: 'diff',
                },
            });
            const diff = response.data;
            if (this.config.maxPatchLength && diff.length > this.config.maxPatchLength) {
                throw new Error(`변경사항이 너무 큽니다: ${diff.length} > ${this.config.maxPatchLength}`);
            }
            // 무시할 파일 패턴 필터링
            if (this.config.ignorePatterns) {
                const lines = diff.split('\n');
                const filteredLines = lines.filter(line => {
                    if (line.startsWith('diff --git')) {
                        return !this.config.ignorePatterns?.some(pattern => {
                            const regex = new RegExp(pattern);
                            return regex.test(line);
                        });
                    }
                    return true;
                });
                return filteredLines.join('\n');
            }
            return diff;
        }
        catch (error) {
            console.error('Pull Request diff 가져오기 실패:', error);
            throw error;
        }
    }
    async createReviewComment(review) {
        const prInfo = await this.getPullRequestInfo();
        try {
            await this.octokit.rest.issues.createComment({
                owner: prInfo.owner,
                repo: prInfo.repo,
                issue_number: prInfo.pullNumber,
                body: review,
            });
        }
        catch (error) {
            console.error('리뷰 코멘트 작성 실패:', error);
            throw error;
        }
    }
}
