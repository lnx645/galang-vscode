const vscode = require('vscode');
const path = require('path');

let disposables = [];

function activate(context) {

	// The command 'galang.compile' is registered via package.json
	let compileCommand = vscode.commands.registerCommand('galang.compile', async () => {
		const interpreterPath = vscode.workspace.getConfiguration('galang').get('interpreterPath') || 'gar';
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		const document = editor.document;
		if (document.languageId !== 'galang') {
			vscode.window.showInformationMessage('The active file is not a GaLang file.');
			return;
		}
		const filePath = document.uri.fsPath;
		const tempDir = vscode.workspace.tempDirectory || '/tmp';
		const outputPath = path.join(tempDir, 'out');
		
		vscode.window.withProgress({
			title: 'Compiling GaLang',
			location: vscode.ProgressLocation.Notification
		}, async (progress) => {
			try {
				const { execSync } = require('child_process');
				execSync(`"${interpreterPath}" compile "${filePath}" -o "${outputPath}"`, { stdio: 'pipe' });
				vscode.window.showInformationMessage(`Compiled successfully to ${outputPath}`);
				
				// Try to run it
				try {
					execSync(`"${interpreterPath}" run "${outputPath}"`, { stdio: 'pipe' });
					vscode.window.showInformationMessage('Program executed successfully');
				} catch (runErr) {
					vscode.window.showErrorMessage(`Runtime error: ${runErr.message}`);
				}
			} catch (err) {
				vscode.window.showErrorMessage(`Compile error: ${err.message}`);
			}
		});
	});

	// The command 'galang.run' is registered via package.json
	let runCommand = vscode.commands.registerCommand('galang.run', async () => {
		const interpreterPath = vscode.workspace.getConfiguration('galang').get('interpreterPath') || 'gar';
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		const document = editor.document;
		if (document.languageId !== 'galang') {
			vscode.window.showInformationMessage('The active file is not a GaLang file.');
			return;
		}
		const filePath = document.uri.fsPath;
		const tempDir = vscode.workspace.tempDirectory || '/tmp';
		const outputPath = path.join(tempDir, 'out');
		
		vscode.window.withProgress({
			title: 'Running GaLang',
			location: vscode.ProgressLocation.Notification
		}, async (progress) => {
			try {
				const { execSync } = require('child_process');
				execSync(`"${interpreterPath}" run "${filePath}"`, { stdio: 'pipe' });
				vscode.window.showInformationMessage('Program executed successfully');
			} catch (err) {
				vscode.window.showErrorMessage(`Runtime error: ${err.message}`);
			}
		});
	});

	disposables.push(compileCommand, runCommand);
}

function deactivate() {
	// Clean up
}

module.exports = {
	activate,
	deactivate
}
