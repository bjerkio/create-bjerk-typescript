#!/usr/bin/env node
/* eslint no-console: off */
/* eslint @typescript-eslint/no-var-requires: off */
/* eslint no-undef: off */
import path from 'path';
import fsExt from 'fs-extra';

const makepath = (...p) => path.join(...p);
const ignoreContent =
  (...values) =>
  source =>
    !values.some(x => source === x);

const ignored = [
  '.git',
  '.idea',
  '.vscode',
  '.github',
  '.yarn/cache',
  '.yarn/build-state.yml',
  '.yarn/install-state.gz',
  'cmd',
  'coverage',
  'dist',
  'docs',
  'node_modules',
  'scripts',
  'templates',
  'tools',
  '.codeclimate.yml',
  '.npmignore',
  '.env',
  'CONTRIBUTING.md',
  'CHANGELOG.md',
  'CODE_OF_CONDUCT.md',
  'LICENSE',
  'README.md',
  'Makefile',
  'package.json',
  'package-lock.json',
  'yarn.lock',

  // TODO: Remove .prettierignore once we have a better solution
  // Read more: https://github.com/prettier/prettier/issues/8048

  // '.prettierignore',
];

const noDeps = ['fs-extra'];

const templates = [
  {
    file: 'github/workflows/workflow.yml',
    copyTo: '.github/workflows/workflow.yml',
  },
  {
    file: 'github/workflows/pull-request.yml',
    copyTo: '.github/workflows/pull-request.yml',
  },
  {
    file: 'github/dependabot.yml',
    copyTo: '.github/dependabot.yml',
  },
  { file: 'README.md', copyTo: 'README.md' },
  { file: 'yarnrc.yml', copyTo: '.yarnrc.yml' },
  { file: 'yarn-releases', copyTo: '.yarn/releases/' },
  { file: '.gitignore.root', copyTo: '.gitignore' },
];

const packageFieldsToKeep = [
  'type',
  'volta',
  'engines',
  'prettier',
  'eslintConfig',
  'scripts',
  'dependencies',
  'devDependencies',
  'license',
];

console.log('Bootstrapping');

const [, , app = 'my-app', dest = process.cwd()] = process.argv;
const source = makepath(__dirname, '../..');
const destination = makepath(dest.trim(), app.trim());

console.log(
  `
Summary:
Destination: ${destination}
App: ${app}
`,
);

console.log('Copying Project Files ...');

fsExt.copySync(source, destination, {
  filter: ignoreContent(...ignored.map(x => makepath(source, x))),
});

console.log('Copying Templates ...');

templates.forEach(x =>
  fsExt.copySync(
    makepath(source, 'templates', x.file),
    makepath(destination, x.copyTo),
  ),
);

console.log('Preparing package.json ...');

const pkg = fsExt.readJsonSync(makepath(source, 'package.json'));
const newPkg = {
  name: app,
  exports: './dist/main.js',
};

packageFieldsToKeep.forEach(field => {
  if (typeof pkg[field] !== 'undefined') {
    newPkg[field] = pkg[field];
  }
});

noDeps.forEach(dep => {
  if (pkg.dependencies[dep]) {
    delete pkg.dependencies[dep];
  }

  if (pkg.devDependencies[dep]) {
    delete pkg.dependencies[dep];
  }
});

fsExt.writeJsonSync(makepath(destination, 'package.json'), newPkg, {
  spaces: 2,
});

console.log('\nDone!');
