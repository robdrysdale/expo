import * as Utils from './Utils';

export type GitLogOptions = {
  fromCommit?: string;
  toCommit?: string;
  format?: string;
  paths?: string[];
};

export type GitLog = {
  commit: string;
  abbreviatedCommit: string;
  parent: string;
  abbreviatedParent: string;
  refs: string;
  title: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
};

/**
 * Returns repository's branch name that you're checked out.
 */
export async function getCurrentBranchNameAsync(): Promise<string> {
  const { stdout } = await Utils.spawnAsync('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
  return stdout.replace(/\n+$/, '');
}

/**
 * Tries to deduce the SDK version from branch name. Returns null if the branch name is not a release branch.
 */
export async function getSDKVersionFromBranchNameAsync(): Promise<string | null> {
  const currentBranch = await getCurrentBranchNameAsync();
  const match = currentBranch.match(/\bsdk-(\d+)$/);

  if (match) {
    const sdkMajorNumber = match[1];
    return `${sdkMajorNumber}.0.0`;
  }
  return null;
}

/**
 * Returns formatted results of `git log` command.
 */
export async function logAsync(path: string, options: GitLogOptions = {}): Promise<GitLog[]> {
  const fromCommit = options.fromCommit ?? '';
  const toCommit = options.toCommit ?? 'head';
  // const format = options.format ?? '%s';
  const paths = options.paths ?? ['.'];

  const format =
    ',{"commit":"%H","abbreviatedCommit":"%h","parent":"%P","abbreviatedParent":"%p","refs":"%D","title":"%s","author":{"name":"%aN","email":"%aE","date":"%aD"}}';

  const { stdout } = await Utils.spawnAsync(
    'git',
    ['log', `--pretty=format:${format}`, '--color', `${fromCommit}..${toCommit}`, '--', ...paths],
    {
      cwd: path,
    }
  );

  const logs = stdout
    .slice(1)
    .replace(/[^\x00-\x7F]/gu, '')
    .replace(/[\u{0080}-\u{FFFF}]/gu, '');

  return JSON.parse(`[${logs}]`);

  // return logs
  //   .trim()
  //   .split(/\r?\n/g)
  //   .filter(a => a);
}
