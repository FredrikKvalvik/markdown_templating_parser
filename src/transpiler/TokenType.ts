export enum TokenType {
  
  // Single-character tokens.
  MINUS,
  PLUS,
  SLASH,
  PERCENT,

  // One, two or three character tokens.
  LEFT_CURLY_BRACE_2,
  RIGHT_CURLY_BRACE_2,
  LEFT_BRACE,
  RIGHT_BRACE,
  LEFT_PAREN,
  RIGHT_PAREN,
  HEADING,
  UL,
  OL,

  STAR,
  STAR_STAR,
  BANG_EQUAL,
  EQUAL,
  EQUAL_EQUAL,
  GREATER,
  GREATER_EQUAL,
  LESS,
  LESS_EQUAL,

  // Literals.
  IDENTIFIER,
  ALNUM,
  STRING,
  NUMBER,

  // Keywords.
  AND,
  OR,
  NOT,
  ELSE,
  FALSE,
  FOR,
  IF,
  IN,
  TRUE,
}

export enum BlockType {
  // blocks.
  HEADING, PARAGRAPH, 
  LIST_ITEM_UL, LIST_ITEM_OL,

  // statements.
  IF_BLOCK, IF_BLOCK_END, ELSE_BLOCK,
  FOR_BLOCK, FOR_BLOCK_END,
  DECLARATION,

  EOF
}

