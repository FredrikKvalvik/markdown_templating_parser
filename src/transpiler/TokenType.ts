export enum TokenType {
  
  // Single-character tokens.
  MINUS,
  PLUS,
  SLASH,
  PERCENT,

  // One, two or three character tokens.
  LEFT_BRACE_2,
  RIGHT_BRACE_2,

  STAR,
  STAR_STAR,
  POUND,
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
  NUMBER,

  // Keywords.
  AND,
  OR,
  NOT,
  ELSE,
  FALSE,
  FOR,
  IF,
  TRUE,
}

export enum BlockType {
  // blocks.
  HEADING, PARAGRAPH, LIST, 

  // statements.
  IF_BLOCK, IF_BLOCK_END,
  FOR_BLOCK, FOR_BLOCK_END,
  DECL_BLOCK, DECL_BLOCK_END,

  EOF
}

