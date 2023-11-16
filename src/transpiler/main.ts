import Lexer from "./Lexer.ts";

const md = `%decl

## hello from decl!

%declend

# HEADING

this is text.

- list *item* 1
- list **item** 2

### heading small

headings are small

%decl

## hello from decl!

%declend

%for $test in $list

i think {{ $test }} is good

%forend`
// const md = `# HEADING

// this is text.

// - list *item* 1
// - list **item** 2

// ### heading small

// headings are small

// %decl

// ## hello from decl!

// %declend

// `

const lexer = new Lexer(md)

console.log(lexer.scanBlocks())