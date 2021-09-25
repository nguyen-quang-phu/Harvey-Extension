import * as vscode from 'vscode';
import { createStyleSheet, getLineEndStyleSheet } from './utils';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "helloworld" is now active!');

  let disposable = vscode.commands.registerCommand(
    'extension.createStyleSheet',
    () => {
      let editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage('Create Stylesheet Fail');
        return;
      }
      const document = editor.document;
      const fullText = document.getText();
      const listStyles = fullText
        .match(/styles.([a-zA-Z]+)/g)
        ?.map((nameClass) => {
          return nameClass.split('.')[1];
        });
      const lines = fullText.split('\n');
      let lineContainStyleSheet = 0;
      lines.forEach((line, index) => {
        if (line.match(/const styles = StyleSheet.create/)) {
          lineContainStyleSheet = index;
        }
      });
      const textContainStyleSheet = document.getText(
        new vscode.Range(
          new vscode.Position(lineContainStyleSheet, 0),
          new vscode.Position(document.lineCount, 0),
        ),
      );
      const end = getLineEndStyleSheet(textContainStyleSheet);

      editor.edit((editBuilder) => {
        editBuilder.replace(
          new vscode.Range(
            new vscode.Position(lineContainStyleSheet, 0),
            new vscode.Position(lineContainStyleSheet + end + 1, 0),
          ),
          createStyleSheet(listStyles, textContainStyleSheet),
        );
      });
      vscode.window.showInformationMessage('Create Stylesheet Success');
    },
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
