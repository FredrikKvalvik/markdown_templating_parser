import Block from "./Block.ts";
import Token from "./Token.ts";
import { TokenType, BlockType } from "./TokenType.ts";

class InlineLexer {

  private currentBlock = 0;

  private start = 0
  private current = 0
  private line = 0
  private content = ""
  private tokens: Token[] = [];


  public static keywords = new Map(Object.entries({
    "and": TokenType.AND,
    "else": TokenType.ELSE,
    "false": TokenType.FALSE,
    "for": TokenType.FOR,
    "if": TokenType.IF,
    "or": TokenType.OR,
    "in": TokenType.IN,
    "true": TokenType.TRUE,
  }));

  constructor(private blocks: Block[]) { }

  public scanTokensInBlocks() {
    while (!this.isAtEndBlock()) {
      this.scanBlock()
    }

    return this.blocks
  }

  private scanBlock() {
    const block = this.advanceBlock()
    this.current = 0
    this.start = 0
    this.line = block.line
    this.content = block.content
    this.tokens = []

    this.scanContent()

    block.tokens = this.tokens
  }


  private scanContent() {
    while (!this.isAtEnd()) {
      this.scanToken()
    }
  }

  private scanToken() {
    this.whitespace()

    if(this.isAtEnd()) return 

    this.start = this.current

    const c = this.advance()
    switch (c) {
      case "$": {
        if (this.isAlpha(this.peek())) {
          while (this.isAlphaNumeric(this.peek())) this.advance()
          this.addToken(TokenType.IDENTIFIER)
        } else {
          this.text()
        }
      } break;
      case ">": 
        return this.match("=") ? this.addToken(TokenType.GREATER_EQUAL) : this.addToken(TokenType.GREATER)
      case "<":
        return this.match("=") ? this.addToken(TokenType.LESS_EQUAL) : this.addToken(TokenType.LESS)
      case "=": return this.addToken(TokenType.EQUAL)
      case "(": return this.addToken(TokenType.LEFT_PAREN)
      case ")": return this.addToken(TokenType.RIGHT_PAREN)
      case "[": return this.addToken(TokenType.LEFT_BRACE)
      case "]": return this.addToken(TokenType.RIGHT_BRACE)
      case "{":
        return this.match("{") ? this.addToken(TokenType.LEFT_CURLY_BRACE_2) : this.text()
      case "}":
        return this.match("}") ? this.addToken(TokenType.RIGHT_CURLY_BRACE_2) : this.text()
      case "*":
        return this.match("*") ? this.addToken(TokenType.STAR_STAR) : this.addToken(TokenType.STAR)

      default:
        if (this.current === 1) {
          if (c === "%") {
            let identifier = ""
            while (this.peek() !== " " && !this.isAtEnd()) identifier += this.advance()

            if (InlineLexer.keywords.has(identifier)) {
              this.addToken(InlineLexer.keywords.get(identifier)!)
              this.whitespace()
              return 
            } else {
              return this.text()
            }
          } else if (c === "#") {
            while (this.peek() !== " ") this.advance()
            this.addToken(TokenType.HEADING)
            this.whitespace()
            return
          } else if(c === "-") {
            if(this.peek() === " ") {
              return this.addToken(TokenType.UL)
            } else return this.text()
          }
        }

        this.text()
    }
  }

  private text() {
    while (!["{", "}", "(", ")", "[", "]", "*", "=", "+", "-", "/", "<", ">", "\n", " "].includes(this.peek()) && !this.isAtEnd()) this.advance()

    const lexeme = this.content.slice(this.start, this.current)

    if(InlineLexer.keywords.has(lexeme)) {
      return this.addToken(InlineLexer.keywords.get(lexeme)!)

    } else if(this.isNumber(lexeme)) {
      return this.addToken(TokenType.NUMBER)
    }
    
    this.addToken(TokenType.STRING)
  }

  addToken(type: TokenType, literal: Literal = null) {
    const token = this.createToken(type, literal)
    this.tokens.push(token)
  }

  createToken(type: TokenType, literal: Literal = null): Token {
    const content = this.content.slice(this.start, this.current)

    return new Token(type, content, literal, this.line)
  }

  private isAtEnd(): boolean {
    return this.current >= this.content.length
  }

  private advance(): string {
    return this.content.charAt(this.current++);
  }

  private whitespace() {
    while (this.peek() === " " && !this.isAtEnd()) this.advance()
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.content.charAt(this.current) != expected) return false;

    this.current++;
    return true;
  }

  private peek(): string {
    if (this.isAtEnd()) return '\0';
    return this.content.charAt(this.current);
  }

  private peekNext(): string {
    if (this.current + 1 >= this.content.length) return '\0';
    return this.content.charAt(this.current + 1);
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

  private isNumber(lexeme: string): boolean {
    return !isNaN(parseFloat(lexeme))
  }

  private isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c);
  }

  private isAtEndBlock(): boolean {
    return this.peekBlock().type === BlockType.EOF
  }

  private advanceBlock(): Block {
    return this.blocks[this.currentBlock++]
  }

  private peekBlock(): Block {
    return this.blocks[this.currentBlock]
  }
}

export default InlineLexer