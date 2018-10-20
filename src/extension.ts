'use strict'
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log("vscode-poetry is now active!")
  let root_keywords = ["func", "export", "var"]

  context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider('poetry', {
    provideDocumentSymbols(document, token) {
      let res = []
      let src = document.getText()
      let lines = src.split("\n")
      let linum = 0
      for (let line of lines) {
        let words = line.split(/\s+/g)
        if (root_keywords.indexOf(words[0]) != -1) {
          let name = words[1]
          let kind = vscode.SymbolKind.Function
          if (words[0] === "export") name = words[2]
          if (words[0] === "var") kind = vscode.SymbolKind.Variable
          let rest = document.getText(new vscode.Range(linum, 0, document.lineCount, 0))
          let funclen = rest.split(/\n\S/)[0].trim().split("\n").length - 1
          res.push(new vscode.DocumentSymbol(
            name, line, kind,
            new vscode.Range(linum, 0, linum + funclen, lines[linum + funclen].length),
            new vscode.Range(linum, 0, linum, line.length)
          ))
        }
        linum++
      }
      return res
    }
  }))
}

// this method is called when your extension is deactivated
export function deactivate() {
}