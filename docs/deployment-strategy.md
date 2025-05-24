# Deployment Options

## Platform Comparison

| Feature             | Netlify | Vercel | GitHub Pages  |
| ------------------- | ------- | ------ | ------------- |
| Free Tier           | Yes     | Yes    | Yes           |
| Vue+Vite Support    | Native  | Native | Static Only   |
| Auto-Deploy on Push | Yes     | Yes    | Yes           |
| Free SSL            | Yes     | Yes    | Custom Domain |
| Analytics           | Basic   | Pro    | None          |

## Recommended Setup: Netlify

1. Create Netlify account
2. Connect GitHub repository (needs initialization first)
3. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Required secrets: None for public repos

## Initial Deployment Steps

1. Initialize Git: `git init`
2. Create GitHub repository
3. Add remote: `git remote add origin [URL]`
4. Push code: `git push -u origin main`

## CI/CD Pipeline (GitHub Actions)

1. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:unit
      - run: npm run build
      - uses: netlify/actions/cli@v2
        with:
          args: deploy --dir=dist --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

2. Testing Notes:

- Unit tests run in CI before deployment
- E2E tests typically run against staging environments
- Production monitoring recommended via:
  ```yaml
  - run: npm run test:e2e -- --config=playwright.production.config.ts
  ```

3. Set up branch protection:

- Require status checks to pass before merging
- Require pull request reviews
- Include administrators
