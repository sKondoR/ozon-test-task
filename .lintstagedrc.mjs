// tsc и lint:arch запускаются из .husky/pre-commit
const config = {
  '*.{js,mjs,cjs,ts,tsx}': ['eslint --cache --fix', 'prettier --write --cache'],
  '*.{json,css,md,yml,yaml}': 'prettier --write --cache',
}

export default config
