import Token from "./Token.ts";
import { BlockType } from "./TokenType.ts";

class Block {
  public tokens: Token[] = []

  constructor(
    public type: BlockType,
    public content: string,
    public line: number,
  ) { }

  toString(): string {
    return `${this.getEnumName()}: ${this.content}`;
  }

  private getEnumName() {
    return BlockType[this.type];
  }

  public addToken(token: Token) {
    this.tokens.push(token)
  }
}

export default Block