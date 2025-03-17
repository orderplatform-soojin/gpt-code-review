# GPT 코드 리뷰 GitHub Action

ChatGPT를 활용한 자동 코드 리뷰 GitHub Action입니다.

## 기능

- Pull Request 생성/수정 시 자동으로 코드 리뷰 수행
- ChatGPT를 활용한 상세한 코드 리뷰 제공
- 한국어 리뷰 지원
- 특정 파일 패턴 무시 기능

## 사용 방법

1. GitHub 저장소의 `.github/workflows` 디렉토리에 워크플로우 파일을 생성합니다 (예: `code-review.yml`):

```yaml
name: Code Review

on:
  pull_request:
    types: [opened, reopened, synchronize]

jobs:
  review:
    if: ${{ !contains(github.event.pull_request.labels.*.name, 'no-review') }}
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: your-username/gpt-code-review@main
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          LANGUAGE: Korean
          MODEL: gpt-4
          PROMPT: |
            다음 코드 변경사항을 리뷰해주세요.
            Pull request title - ${{ github.event.pull_request.title }}
            Pull request body - ${{ github.event.pull_request.body }}
          MAX_COMPLETION_TOKENS: 1000
          MAX_PATCH_LENGTH: 3000
          IGNORE_PATTERNS: /node_modules,.*\.(md|yml|svg|jpg|png)$
```

2. GitHub 저장소의 Settings > Secrets에서 다음 시크릿을 설정합니다:
   - `OPENAI_API_KEY`: OpenAI API 키

## 환경 변수 설정

| 변수 | 필수 여부 | 기본값 | 설명 |
|------|-----------|--------|------|
| GITHUB_TOKEN | 필수 | - | GitHub 토큰 |
| OPENAI_API_KEY | 필수 | - | OpenAI API 키 |
| LANGUAGE | 선택 | Korean | 리뷰 언어 |
| MODEL | 선택 | gpt-4 | 사용할 OpenAI 모델 |
| PROMPT | 선택 | - | 추가적인 프롬프트 |
| MAX_COMPLETION_TOKENS | 선택 | 1000 | 최대 토큰 수 |
| MAX_PATCH_LENGTH | 선택 | 3000 | 최대 변경사항 길이 |
| IGNORE_PATTERNS | 선택 | - | 무시할 파일 패턴 (콤마로 구분) |

## 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 모드 실행
npm run dev

# 빌드
npm run build

# 린트 실행
npm run lint

# 테스트 실행
npm run test
```

## 라이선스

ISC
