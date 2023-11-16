import Block from "./Block.ts";
import Token from "./Token.ts";
import { TokenType, BlockType } from "./TokenType.ts";

class InlineLexer {
  private tokens: Token[] = [];

  private start = 0;
  private current = 0;
  private line = 1;

  public static keywords = new Map(Object.entries({
    "and": TokenType.AND,
    "else": TokenType.ELSE,
    "false": TokenType.FALSE,
    "for": TokenType.FOR,
    "if": TokenType.IF,
    "or": TokenType.OR,
    "true": TokenType.TRUE,
  }));

  constructor(private source: string) { }


  private isAtEnd(): boolean {
    return this.current >= this.source.length
  }

  private advance(): string {
    return this.source.charAt(this.current++);
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) != expected) return false;

    this.current++;
    return true;
  }

  private peek(): string {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.current);
  }

  private peekNext(): string {
    if (this.current + 1 >= this.source.length) return '\0';
    return this.source.charAt(this.current + 1);
  }

  private isAlpha(c: string): boolean {
    return (
      (c >= "a" && c <= "z") ||
      (c >= "A" && c <= "Z") ||
       c === "_"
    )
  }

  private isDigit(c: string): boolean {
    return !isNaN(parseInt(c))
  }

  private isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c);
  }
}
