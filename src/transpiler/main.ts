import InlineLexer from "./InlineLexer.ts";
import Lexer from "./BlockLexer.ts";

const md = `## hello from decl!

$variable =
- 234
- 123 
- 234 

# HEADING

this is text.

- list *item* 1
- list **item** 2

1. list item, number 1
1. list item, number 2

### heading small

headings are small

## hello from decl!

%if $a > $b

min tekst hvis a er større enn b

%else

min tekst hvis a ikke er større enn b

%endif

%for $test in $list

i think {{ $test }} is good

%forend`


const lexer = new Lexer(md)
const inlineLexer = new InlineLexer(lexer.scanBlocks())

console.log(inlineLexer.scanTokensInBlocks())
// console.log(lexer.scanBlocks().map(block => block.toString()))