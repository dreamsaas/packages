"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require("path");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    const extensionPath = context.extensionPath;
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "dreamsaas2" is now active!');
    vscode.commands.registerCommand("extension.dreamsaasDashboard", () => {
        // Create and show a new webview
        const panel = vscode.window.createWebviewPanel("React", // Identifies the type of the webview. Used internally
        "Dreamsaas: Dashboard", // Title of the panel displayed to the user
        vscode.ViewColumn.One, // Editor column to show the new webview panel in.
        {
            enableScripts: true
        } // Webview options. More on these later.
        );
        console.log(path.join(extensionPath, "base/build", "asset-manifest.json"));
        panel.webview.html = getHtmlForWebview({
            extensionPath
        });
        context.subscriptions.push(panel);
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
function getHtmlForWebview(options) {
    console.log(path.join(options.extensionPath, "base/build", "asset-manifest.json"));
    const manifest = require(path.join(options.extensionPath, "base/build", "asset-manifest.json"));
    const mainScript = manifest["main.js"];
    const mainStyle = manifest["main.css"];
    const scriptPathOnDisk = vscode.Uri.file(path.join(options.extensionPath, "base/build", mainScript));
    const scriptUri = scriptPathOnDisk.with({ scheme: "vscode-resource" });
    const stylePathOnDisk = vscode.Uri.file(path.join(options.extensionPath, "base/build", mainStyle));
    const styleUri = stylePathOnDisk.with({ scheme: "vscode-resource" });
    // Use a nonce to whitelist which scripts can be run
    const nonce = getNonce();
    return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
			<meta name="theme-color" content="#000000">
			<title>React App</title>
			<link rel="stylesheet" type="text/css" href="${styleUri}">
			<base href="${vscode.Uri.file(path.join(options.extensionPath, "base/build")).with({
        scheme: "vscode-resource"
    })}/">
		</head>

		<body>
			<noscript>You need to enable JavaScript to run this app.</noscript>
			<div id="root"></div>
			
			<script src="${scriptUri}"></script>
		</body>
		</html>`;
}
function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
//# sourceMappingURL=extension.js.map