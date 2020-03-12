import path from 'path';
import chalk from 'chalk';
import fs from 'fs-extra';
import { Command } from '@expo/commander';

import * as Npm from '../Npm';
import * as Git from '../Git';
import * as Markdown from '../Markdown';
import { Package, getListOfPackagesAsync } from '../Packages';
import inquirer from 'inquirer';
import { EXPO_DIR } from '../Constants';
import Changelog from '../Changelog';

const { green, yellow, cyan, blue, magenta, red, gray } = chalk;

type ActionOptions = {
  outdated: boolean;
  exclude?: string;
  scope?: string;
};

type PackageState = {
  pkg: Package;
  pkgView: Npm.PackageViewType | null;
  changelog: Changelog;
};

async function checkBranchNameAsync(): Promise<boolean> {
  const branchName = await Git.getCurrentBranchNameAsync();

  if (branchName === 'master') {
    return true;
  }
  console.log(
    yellow(
      `It's recommended to publish from ${blue('master')} while you're at ${blue(branchName)}.`
    )
  );

  const { confirmed } = await inquirer.prompt<{ confirmed: boolean }>([
    {
      type: 'confirm',
      name: 'confirmed',
      message: 'Do you want to proceed?',
      default: true,
    },
  ]);
  return confirmed;
}

async function collectPackageStatesAsync(
  exclude: string[],
  scope: string[] | null
): Promise<PackageState[]> {
  console.log(cyan('\n🔎 Collecting package states...\n'));

  const packages = (await getListOfPackagesAsync()).filter(pkg => {
    const isPrivate = pkg.packageJson.private;
    const isScoped = !scope || scope.includes(pkg.packageName);
    const isExcluded = exclude.includes(pkg.packageName);
    return !isPrivate && isScoped && !isExcluded;
  });

  const states = await Promise.all(
    packages.map(
      async (pkg: Package): Promise<PackageState> => {
        const pkgView = await Npm.getPackageViewAsync(pkg.packageName, pkg.packageVersion);
        const changelog = new Changelog(pkg.changelogPath);
        return { pkg, pkgView, changelog };
      }
    )
  );
  return states;
}

function checkPackageIntegrity(pkg: Package, pkgView: Npm.PackageViewType): boolean {
  return pkg.packageJson.gitHead === pkgView.gitHead;
}

async function listOutdatedPackagesAsync(packages: PackageState[]): Promise<void> {
  for (const { pkg, pkgView, changelog } of packages) {
    try {
      if (pkgView && !checkPackageIntegrity(pkg, pkgView)) {
        console.log(
          yellow(
            `Package integrity check failed for ${green(pkg.packageName)}, git heads mismatch.`
          )
        );
        console.log(
          yellow(
            `Published head: ${green(pkgView.gitHead)}, currently in the repo: ${green(
              pkg.packageJson.gitHead
            )}`
          )
        );
        return;
      }

      const logs = await Git.logAsync(pkg.path, {
        fromCommit: pkg.packageJson.gitHead,
        toCommit: 'head',
      });

      // Remove publish commit
      logs.pop();

      if (logs.length > 0) {
        console.log(green(pkg.packageName));
      }

      console.log(await changelog.getChanges(pkg.packageVersion));
    } catch (error) {
      console.error(red(error.stack));
    }
  }
}

async function action(options: ActionOptions): Promise<void> {
  // if (!(await checkBranchNameAsync())) {
  //   return;
  // }

  const exclude = options.exclude?.split(/\s*,\s*/g) ?? [];
  const scope = options.scope?.split(/\s*,\s*/g) ?? null;

  const packageStates = await collectPackageStatesAsync(exclude, scope);

  if (options.outdated) {
    await listOutdatedPackagesAsync(packageStates);
    // return;
  }

  console.log();
}

export default (program: Command) => {
  program
    .command('publish-packages')
    .alias('pub-pkg', 'pp')
    .option(
      '-o, --outdated',
      'Lists packages that some changes have been applied since the previous published version.'
    )
    .option(
      '-s, --scope [string]',
      "Comma-separated names of packages to be published. By default, it's trying to publish all public packages that have unpublished changes.",
      ''
    )
    .option(
      '-e, --exclude [string]',
      'Comma-separated names of packages to be excluded from publish. It has a higher precedence than `scope` flag.',
      ''
    )
    .option(
      '-d, --dry',
      'Whether to skip `npm publish` command. Despite this, some files might be changed after running this script.',
      false
    )
    .description(
      `This script helps in doing a lot of publishing stuff like handling dependency versions in packages that depend on themselves,
updating Android and iOS projects for Expo Client, committing changes that were made by the script and finally publishing.`
    )
    .asyncAction(action);
};
