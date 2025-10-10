# Nuxt Minimal Starter

## 🚀 Quick Deployment

For quick deployment or updating from the `xiaohongshu` branch:

```bash
# 1. Pull latest changes from branch
git pull origin xiaohongshu

# 2. Load NVM environment
if [ -s "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh"
else
    echo "错误：找不到 NVM 脚本。请检查 $NVM_DIR/nvm.sh 路径是否正确。"
    exit 1
fi

# 3. (Optional) Load NVM bash completion
if [ -s "$NVM_DIR/bash_completion" ]; then
    . "$NVM_DIR/bash_completion"
fi

# 4. Use the correct Node version
nvm use node

# 5. Build the project
npm run build

# 6. Restart the PM2 process
pm2 restart redbook



# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.


