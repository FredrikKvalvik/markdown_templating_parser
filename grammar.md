# Grammar for markdown with templating

Markdown grammar

```
DOCUMENT    -> (BLOCK | statement)*
BLOCK       -> HEADER | PARAGRAPH | LIST
statement   -> if_block | for_block | declaration
HEADER      -> ('#' | '##' | '###' | '####' | '#####' | '######' | "######") TEXT? EOL

LIST_UL     -> LIST_ITEM_UL+
LIST_ITEM_UL-> "-" PARAGRAPH

LIST_OL     -> LIST_ITEM+
LIST_ITEM_OL-> DIGIT+"." PARAGRAPH

PARAGRAPH   -> (TEXT | expression_inline)* EOL
ITALIC      -> "*" TEXT "*"
BOLD        -> "**" TEXT "**"
IMAGE       -> "!" LINK
LINK        -> "[" ALNUM | expr_inline "]" "(" ALNUM | expr_inline ")"

TEXT        -> ( alpha | NUMBER | digit | ITALIC | BOLD )+

// primitives
ALNUM       -> ( alpha | digit )*
alpha       -> [a-z]
NUMBER      -> digit+ ( "." digit+ )?
digit       -> [0-9]
bool        -> "true" | "false"

EOL         -> "\n"
```

templating grammar
```
IDENTIFIER  -> "$"alpha( alpha | digit )*

// filters are built in methods for working on input
filter      -> "|" alnum

declaration -> IDENTIFIER "=" (alpha
                              | NUMBER
                              | bool
                              | LIST_UL ) EOL
if_block    -> "%if" expr EOL BLOCK* (%else EOL BLOCK*)? "%endif" EOL
for_block   -> "%for" identifier "in" LIST EOL BLOCK* "%endfor" EOL

expr_inline -> "{{" expr "}}"

expr        -> logic_or filter*
logic_or    -> logic_and ("or" logic_and)*
logic_and   -> equality ("and" equality)*
equality    -> comparison (("is" | "is not") comparison)*
comparison  -> term ( ( ">" | "<" | ">=" | "<=" ) term )*
term        -> factor ( ( "-" | "+" ) factor )* 
unary       -> primary | ( "not" | "-" ) call
primary     -> bool | NUMBER | ALNUM | LIST | TEXT
```
