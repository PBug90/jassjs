# JASS Parser

This is a work in progress basic implementation of a Warcraft 3 vanilla JASS Parser in JavaScript.
It uses the [chevrotain](https://github.com/SAP/chevrotain/) library and a custom grammar to parse the input and outputs an abstract syntax tree that can be traversed.

## Use cases

Aside from the general use case of checking for correct syntax and semantic in a jass program, you can use this to extract information from WarCraft 3 melee maps aswell. Check the examples/mapexample.js file to show a use case for extracting neutral unit metadata from a Melee map jass file.

## Usage
Due to the WIP status, no usage instructions yet. Feel free to try it out though.

## Todos
* loop statements
* local variable declarations
* function arguments
* function return values
* verify correct operator precedence in grammar
* ... and a lot more :)

## Feature Requests

Feel free to open a PR for new features or improvements.