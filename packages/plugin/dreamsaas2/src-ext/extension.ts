// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const extensionPath = context.extensionPath;
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "dreamsaas2" is now active!');
  vscode.commands.registerCommand("extension.dreamsaasDashboard", () => {
    // Create and show a new webview
    const panel = vscode.window.createWebviewPanel(
      "React", // Identifies the type of the webview. Used internally
      "Dreamsaas: Dashboard", // Title of the panel displayed to the user
      vscode.ViewColumn.One, // Editor column to show the new webview panel in.
      {
        enableScripts: true
      } // Webview options. More on these later.
    );
    const html = getHtmlForWebview({
      extensionPath
    });
    console.log(html);

    panel.webview.html = html;

    context.subscriptions.push(panel);
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}

function getHtmlForWebview(options: { extensionPath: string }) {
  console.log(
    path.join(options.extensionPath, "basic/build", "asset-manifest.json")
  );
  const manifest = require(path.join(
    options.extensionPath,
    "basic/build",
    "asset-manifest.json"
  ));
  // return `<!DOCTYPE html>
  //     <html lang="en">
  //     <head>
  //       <meta charset="utf-8">
  //       <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
  //       <meta name="theme-color" content="#000000">
  //       <title>React App</title>
  //     </head>

  //     <body>
  //       <noscript>You need to enable JavaScript to run this app.</noscript>
  //       <div id="root">
  //       <h1>test</h1></div>
  //     </body>
  //     </html>`;
  console.log(manifest);
  const mainScript = manifest.files["main.js"];
  const mainStyle = manifest.files["main.css"];

  console.log("passed");
  const scriptPathOnDisk = vscode.Uri.file(
    path.join(options.extensionPath, "basic/build", mainScript)
  );
  const scriptUri = scriptPathOnDisk.with({ scheme: "vscode-resource" });
  const stylePathOnDisk = vscode.Uri.file(
    path.join(options.extensionPath, "basic/build", mainStyle)
  );
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
			<base href="${vscode.Uri.file(
        path.join(options.extensionPath, "basic/build")
      ).with({
        scheme: "vscode-resource"
      })}/">
		</head>

		<body>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <h1>test</h1>
			<div id="root"></div>
			
      <script src="${scriptUri}"></script>
      <script>
      !(function(e) {
        function r(r) {
          for (
            var n, i, l = r[0], a = r[1], f = r[2], p = 0, s = [];
            p < l.length;
            p++
          )
            (i = l[p]),
              Object.prototype.hasOwnProperty.call(o, i) &&
                o[i] &&
                s.push(o[i][0]),
              (o[i] = 0);
          for (n in a)
            Object.prototype.hasOwnProperty.call(a, n) && (e[n] = a[n]);
          for (c && c(r); s.length; ) s.shift()();
          return u.push.apply(u, f || []), t();
        }
        function t() {
          for (var e, r = 0; r < u.length; r++) {
            for (var t = u[r], n = !0, l = 1; l < t.length; l++) {
              var a = t[l];
              0 !== o[a] && (n = !1);
            }
            n && (u.splice(r--, 1), (e = i((i.s = t[0]))));
          }
          return e;
        }
        var n = {},
          o = { 1: 0 },
          u = [];
        function i(r) {
          if (n[r]) return n[r].exports;
          var t = (n[r] = { i: r, l: !1, exports: {} });
          return e[r].call(t.exports, t, t.exports, i), (t.l = !0), t.exports;
        }
        (i.m = e),
          (i.c = n),
          (i.d = function(e, r, t) {
            i.o(e, r) ||
              Object.defineProperty(e, r, { enumerable: !0, get: t });
          }),
          (i.r = function(e) {
            "undefined" != typeof Symbol &&
              Symbol.toStringTag &&
              Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
              Object.defineProperty(e, "__esModule", { value: !0 });
          }),
          (i.t = function(e, r) {
            if ((1 & r && (e = i(e)), 8 & r)) return e;
            if (4 & r && "object" == typeof e && e && e.__esModule) return e;
            var t = Object.create(null);
            if (
              (i.r(t),
              Object.defineProperty(t, "default", { enumerable: !0, value: e }),
              2 & r && "string" != typeof e)
            )
              for (var n in e)
                i.d(
                  t,
                  n,
                  function(r) {
                    return e[r];
                  }.bind(null, n)
                );
            return t;
          }),
          (i.n = function(e) {
            var r =
              e && e.__esModule
                ? function() {
                    return e.default;
                  }
                : function() {
                    return e;
                  };
            return i.d(r, "a", r), r;
          }),
          (i.o = function(e, r) {
            return Object.prototype.hasOwnProperty.call(e, r);
          }),
          (i.p = "/");
        var l = (this.webpackJsonpbasic = this.webpackJsonpbasic || []),
          a = l.push.bind(l);
        (l.push = r), (l = l.slice());
        for (var f = 0; f < l.length; f++) r(l[f]);
        var c = a;
        t();
      })([]);
    </script>
			<script src="${path.join(
        options.extensionPath,
        "basic/build",
        mainScript
      )}"></script>
		</body>
		</html>`;
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
