import Block from "./Block.ts";
import Token from "./Token.ts";
import { BlockType, TokenType } from "./TokenType.ts";


class BlockLexer {
  private blocks: Block[] = [];

  private start = 0;
  private current = 0;

  private line = 1;

  constructor(
    private source: string
  ) { }

  public scanBlocks() {
    while (!this.isAtEnd()) {
      this.whitespace()

      this.start = this.current

      this.scanBlock()
    }

    this.blocks.push(new Block(BlockType.EOF, "", this.line))

    return this.blocks
  }

  private scanBlock() {

    const c = this.advance()

    switch (c) {
      case "#":
        this.blockHeading(); break;
      case "-":
        this.blockListUl(); break;
      case "%":
        this.statement(); break;
      case "$":
        this.declaration(); break;
      case "":
        break
      default:
        if (this.isDigit(c)) return this.blockListOl()

        return this.paragraph();
    }
  }

  private blockHeading() {
    while (this.peek() === "#") {
      this.advance()
    }

    // if it is not followed by a space, default to paragraph.
    if (this.peek() !== " ") {
      this.paragraph()
    }
    this.advanceLine()
    this.addBlock(BlockType.HEADING)

    this.advance()
    this.line++
  }

  private blockListUl() {
    // if no space is added, treat as paragraph
    if (this.peek() !== " ") {
      return this.paragraph()
    } else {
      this.advanceLine()
      return this.addBlock(BlockType.LIST_ITEM_UL)
    }
  }

  private blockListOl() {
    // advance throught digits
    while (this.isDigit(this.peek()) && !this.isAtEnd() && !this.atEol()) this.advance()

    if (this.match(".") && this.match(" ")) {
      this.advanceLine()
      return this.addBlock(BlockType.LIST_ITEM_OL)
    }

    return this.paragraph()
  }

  private statement() {
    let keyword = ""

    while (![" ", "\n"].includes(this.peek()) && !this.isAtEnd()) keyword += this.advance()

    switch (keyword) {
      case "for":
        this.advanceLine()
        this.addBlock(BlockType.FOR_BLOCK);
        break;
      case "forend":
        this.advanceLine()
        this.addBlock(BlockType.FOR_BLOCK_END);
        break
      case "if":
        this.advanceLine()
        this.addBlock(BlockType.IF_BLOCK);
        break;
      case "else":
        this.advanceLine()
        this.addBlock(BlockType.ELSE_BLOCK);
        break
      case "ifend":
        this.advanceLine()
        this.addBlock(BlockType.IF_BLOCK_END);
        break;

      default: this.paragraph(); break;
    }
  }

  private declaration() {
    if([" ", "\n"].includes(this.peek())) this.paragraph()

    while(this.isAlphaNumeric(this.peek())) this.advance()
    while(this.peek() === " ") this.advance()
    
    if(this.match("=")) {
      this.advanceLine()
      return this.addBlock(BlockType.DECLARATION)
    }
    return this.paragraph()
  }

  private paragraph() {
    this.advanceLine()
    this.addBlock(BlockType.PARAGRAPH)
    return
  }

  private addBlock(type: BlockType) {
    const content = this.source.slice(this.start, this.current)
    this.blocks.push(new Block(type, content, this.line))
  }

  /** return true if the cursor points to a "\n" */
  private atEol(): boolean {
    return this.peek() === "\n"
  }

  /** return true if cursor is at the end of file */
  private isAtEnd(): boolean {
    return this.current >= this.source.length
  }

  /** return chat and cursor, and then increment cursor */
  private advance(): string {
    return this.source.charAt(this.current++);
  }

  /** advance until end of line */
  private advanceLine() {
    while (!this.atEol() && !this.isAtEnd()) {
      this.advance()
    }
  }

  /** return true if c is a digit */
  private isDigit(c: string): boolean {
    return !isNaN(parseInt(c))
  }

  /** advance through whitespace (" " and "\n") */
  private whitespace() {
    while ([" ", "\n"].includes(this.peek())) {
      if (this.advance() === "\n") this.line++
    }
  }

  /** return char at cursor */
  private peek(): string {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.current);
  }

  /** conditional advance, only if expected matches char at cursor */
  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) != expected) return false;

    this.current++;
    return true;
  }

  private isAlpha(c: string): boolean {
    return (
      (c >= "a" && c <= "z") ||
      (c >= "A" && c <= "Z") ||
       c === "_"
    )
  }

  private isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c);
  }
}

export default BlockLexer