import Block from "./Block.ts";
import Token from "./Token.ts";
import { BlockType, TokenType } from "./TokenType.ts";


class Lexer {
  private blocks: Block[] = [];

  private blocksNumber = 0
  private start = 0;
  private current = 0;

  private startLine = 1
  private currentLine = 1;

  constructor(
    private source: string
  ) { }

  public scanBlocks() {
    while (!this.isAtEnd()) {
      this.whitespace()

      this.start = this.current
      this.startLine = this.currentLine

      this.scanBlock()
    }

    this.blocks.push(new Block(BlockType.EOF, "", this.startLine, this.currentLine))

    return this.blocks
  }

  private scanBlock() {

    const c = this.advance()

    switch (c) {
      case "#":
        this.blockHeading(); break;
      case "-":
        this.blockList(); break;
      case "%":
        this.statement(); break;
      case "":
        break
      default:
        this.paragraph(); break;
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
    this.currentLine++
  }

  private blockList() {
    // if no space is added, treat as paragraph
    if (this.peek() !== " ") {
      this.paragraph()
    }

    let inList = true
    do {
      this.advanceLine()

      // handle multiple newlines
      this.advanceLine()
      this.advance() // consume "\n"
      this.currentLine++

      if (this.peek() !== "-") inList = false

    } while (inList)

    this.addBlock(BlockType.LIST)
  }

  private statement() {
    let keyword = ""

    while (![" ", "\n"].includes(this.peek()) && !this.isAtEnd()) keyword += this.advance()

    switch (keyword) {
      case "decl":
        this.advanceLine()
        this.addBlock(BlockType.DECL_BLOCK);
        break;

      case "declend":
        this.advanceLine()
        this.addBlock(BlockType.DECL_BLOCK_END);
        break;

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
      case "ifend":
        this.advanceLine()
        this.addBlock(BlockType.IF_BLOCK_END);
        break;

      default: this.paragraph(); break;
    }
  }

  private paragraph() {
    this.advanceLine()
    this.addBlock(BlockType.PARAGRAPH)
    return
  }

  private addBlock(type: BlockType) {
    const content = this.source.slice(this.start, this.current)
    this.blocks.push(new Block(type, content, this.startLine, this.currentLine))
  }

  private atEol(): boolean {
    return this.peek() === "\n"
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length
  }

  private advance(): string {
    return this.source.charAt(this.current++);
  }

  private advanceLine() {
    while (!this.atEol() && !this.isAtEnd()) {
      this.advance()
    }
  }

  private whitespace() {
    while ([" ", "\n"].includes(this.peek())) {
      if (this.advance() === "\n") this.currentLine++
    }
  }

  private peek(): string {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.current);
  }


}

export default Lexer