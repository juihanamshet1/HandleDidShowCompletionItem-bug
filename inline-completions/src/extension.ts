import * as vscode from 'vscode';

// Try it out in `playground.js`

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand(
		'extension.inline-completion-settings',
		() => {
			vscode.window.showInformationMessage('Show settings');
		}
	);

	context.subscriptions.push(disposable);

	const provider: vscode.InlineCompletionItemProvider = new IntellicodeCompletionProvider();

	vscode.languages.registerInlineCompletionItemProvider({ pattern: '**' }, provider);

}

class IntellicodeCompletionProvider implements vscode.InlineCompletionItemProvider {
	public provideInlineCompletionItems(document: vscode.TextDocument, position: vscode.Position, context: vscode.InlineCompletionContext, token: vscode.CancellationToken): 
	vscode.ProviderResult<vscode.InlineCompletionItem[] | vscode.InlineCompletionList> 
	{
		console.log('provideInlineCompletionItems triggered');

		const regexp = /\/\/ \[(.+),(.+)\):(.*)/;
		if (position.line <= 0) {
			return;
		}

		let insertText = "";

		const lineBefore = document.lineAt(position.line - 1).text;
		const matches = lineBefore.match(regexp);
		if (matches) {
			const start = matches[1];
			const startInt = parseInt(start, 10);
			const end = matches[2];
			const endInt =
				end === '*' ? document.lineAt(position.line).text.length : parseInt(end, 10);
			insertText = matches[3].replace(/\\n/g, '\n');

			if (context.selectedCompletionInfo !== undefined) {
				insertText = `${context.selectedCompletionInfo.text}.log()`;
			}

			return [
				{
					insertText,
				},
			] as vscode.InlineCompletionItem[];
		}
	}

	public handleDidShowCompletionItem(item: vscode.InlineCompletionItem): void
	{
		console.log("handleDidShowCompletionItem called");
	}
}

