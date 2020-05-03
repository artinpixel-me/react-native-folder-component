import * as vscode from 'vscode';
import createReactComponent from './createReactComponent';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
    vscode.commands.registerCommand(
      'extension.createReactNativeComponent',
      (clickedUri?: vscode.Uri) => createReactComponent(clickedUri)
    )
	);
	
	context.subscriptions.push(
    vscode.commands.registerCommand(
      'extension.createReactNativeComponentStyles',
      (clickedUri?: vscode.Uri) => createReactComponent(clickedUri, true)
    )
  );

}

// this method is called when your extension is deactivated
export function deactivate() {}
