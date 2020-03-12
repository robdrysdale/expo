import fs from 'fs-extra';
import * as Markdown from './Markdown';

export type ChangelogChanges = {
  [key: string]: string[];
};

export default class Changelog {
  filePath: string;
  tokens: Markdown.Token[] | null = null;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async getChanges(fromVersion?: string, toVersion: string = 'master'): Promise<ChangelogChanges> {
    const tokens = await this.getTokensAsync();
    const changes: ChangelogChanges = {};

    let currentSection: string | null = null;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (token.type === Markdown.TokenType.HEADING) {
        if (token.depth === 2) {
          if (token.text !== toVersion && (!fromVersion || token.text === fromVersion)) {
            // We've iterated over everything we needed, stop the loop.
            break;
          }
          currentSection = null;
        } else if (token.depth === 3) {
          currentSection = token.text;
        }
        continue;
      }
      if (currentSection && token.type === Markdown.TokenType.LIST_ITEM_START) {
        i++;
        for (; tokens[i].type !== Markdown.TokenType.LIST_ITEM_END; i++) {
          const token = tokens[i] as Markdown.TextToken;

          if (token.text) {
            if (!changes[currentSection]) {
              changes[currentSection] = [];
            }
            changes[currentSection].push(token.text);
          }
        }
      }
    }
    return changes;
  }

  async getTokensAsync(): Promise<Markdown.Token[]> {
    if (!this.tokens) {
      await fs.access(this.filePath, fs.constants.R_OK);
      this.tokens = Markdown.lexify(await fs.readFile(this.filePath, 'utf8'));
    }
    return this.tokens;
  }
}
