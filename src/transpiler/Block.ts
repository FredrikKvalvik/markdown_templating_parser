import Token from "./Token.ts";
import { BlockType } from "./TokenType.ts";

class Block {
  public children: Token[] = []

  constructor(
    public type: BlockType,
    public content: string,
    public startLine: number,
    public endLine: number,
  ) { }

  toString(): string {
    return `${this.getEnumName()} ${this.content}`;
  }

  private getEnumName() {
    return BlockType[this.type];
  }

  public addToken(token: Token) {
    this.children.push(token)
  }
}

export default Block