import { TokenType } from "./TokenType.ts";

class Token {
  constructor(
    public type: TokenType,
    public lexeme: string,
    public literal: Literal,
    public line: number,
  ) {}

  toString(): string {
    return `${this.getEnumName()} ${this.lexeme} ${this.literal}`;
  }

  private getEnumName() {
    return TokenType[this.type];
  }
}

export default Token;
