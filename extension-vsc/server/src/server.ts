/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import labels from './labels';
import {
	createConnection,
	TextDocuments,
	TextDocument,
	Diagnostic,
	DiagnosticSeverity,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	CompletionItemKind,
	TextDocumentPositionParams
} from 'vscode-languageserver';

// Create a connection for the server. The connection uses Node's IPC as a transport.
// Also include all preview / proposed LSP features.
let connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager. The text document manager
// supports full document sync only
let documents: TextDocuments = new TextDocuments();

let hasConfigurationCapability: boolean = false;
let hasWorkspaceFolderCapability: boolean = false;
let hasDiagnosticRelatedInformationCapability: boolean = false;

connection.onInitialize((params: InitializeParams) => {
	let capabilities = params.capabilities;

	// Does the client support the `workspace/configuration` request?
	// If not, we will fall back using global settings
	hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
	hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);
	hasDiagnosticRelatedInformationCapability =
		!!(capabilities.textDocument &&
			capabilities.textDocument.publishDiagnostics &&
			capabilities.textDocument.publishDiagnostics.relatedInformation);

	return {
		capabilities: {
			textDocumentSync: documents.syncKind,
			// Tell the client that the server supports code completion
			completionProvider: {
				resolveProvider: true
			}
		}
	};
});

connection.onInitialized(() => {
	if (hasConfigurationCapability) {
		// Register for all configuration changes.
		connection.client.register(
			DidChangeConfigurationNotification.type,
			undefined
		);
	}
	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders(_event => {
			connection.console.log('Workspace folder change event received.');
		});
	}
});

// The example settings
interface ExampleSettings {
	maxNumberOfProblems: number;
}

// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings: ExampleSettings = { maxNumberOfProblems: 1000 };
let globalSettings: ExampleSettings = defaultSettings;

// Cache the settings of all open documents
let documentSettings: Map<string, Thenable<ExampleSettings>> = new Map();

connection.onDidChangeConfiguration(change => {
	if (hasConfigurationCapability) {
		// Reset all cached document settings
		documentSettings.clear();
	} else {
		globalSettings = <ExampleSettings>(
			(change.settings.languageServerExample || defaultSettings)
		);
	}

	// Revalidate all open text documents
	documents.all().forEach(validateTextDocument);
});

function getDocumentSettings(resource: string): Thenable<ExampleSettings> {
	if (!hasConfigurationCapability) {
		return Promise.resolve(globalSettings);
	}
	let result = documentSettings.get(resource);
	if (!result) {
		result = connection.workspace.getConfiguration({
			scopeUri: resource,
			section: 'languageServerExample'
		});
		documentSettings.set(resource, result);
	}
	return result;
}

// Only keep settings for open documents
documents.onDidClose(e => {
	documentSettings.delete(e.document.uri);
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
	validateTextDocument(change.document);
});

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
	// In this simple example we get the settings for every validate run.
	let settings = await getDocumentSettings(textDocument.uri);

	// The validator creates diagnostics for all uppercase words length 2 and more
	let text = textDocument.getText();
	let pattern = /\b[A-Z]{2,}\b/g;
	let m: RegExpExecArray | null;

	let problems = 0;
	let diagnostics: Diagnostic[] = [];
	while ((m = pattern.exec(text)) && problems < settings.maxNumberOfProblems) {
		problems++;
		let diagnosic: Diagnostic = {
			severity: DiagnosticSeverity.Warning,
			range: {
				start: textDocument.positionAt(m.index),
				end: textDocument.positionAt(m.index + m[0].length)
			},
			message: `${m[0]} is all uppercase.`,
			source: 'ex'
		};
		if (hasDiagnosticRelatedInformationCapability) {
			diagnosic.relatedInformation = [
				{
					location: {
						uri: textDocument.uri,
						range: Object.assign({}, diagnosic.range)
					},
					message: 'Spelling matters'
				},
				{
					location: {
						uri: textDocument.uri,
						range: Object.assign({}, diagnosic.range)
					},
					message: 'Particularly for names'
				}
			];
		}
		diagnostics.push(diagnosic);
	}

	// Send the computed diagnostics to VSCode.
	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

connection.onDidChangeWatchedFiles(_change => {
	// Monitored files have change in VSCode
	connection.console.log('We received an file change event');
});

// This handler provides the initial list of the completion items.
connection.onCompletion(
	(_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
		// The pass parameter contains the position of the text document in
		// which code complete got requested. For the example we ignore this
		// info and always provide the same completion items.
		return labels;
	}
);

// This handler resolve additional information for the item selected in
// the completion list.
connection.onCompletionResolve(
	(item: CompletionItem): CompletionItem => {
		switch (item.data) {
			case 1:
				(item.detail = 'new pc'),
					(item.documentation = 'Root namespace for the PlayCanvas Engine');
				break;
			case 2:
				(item.detail = 'new pc.Application(canvas, options)'),
					(item.documentation = 'Create application');
				break;
			case 3:
				(item.detail = 'new pc.Entity()'),
					(item.documentation = 'Core primitive of a PlayCanvas game');
				break;
			case 4:
				(item.detail = 'app.start()'),
					(item.documentation = 'Start game loop');
				break;
			case 5:
				(item.detail = 'app'),
					(item.documentation = 'Get the pc.Application');
				break;
			case 6:
				(item.detail = 'setCanvasFillMode(mode, [width], [height])'),
					(item.documentation = 'Controls how the canvas fills the window and resizes when the window changes');
				break;
			case 7:
				(item.detail = 'setCanvasResolution(mode, [width], [height])'),
					(item.documentation = 'Change the resolution of the canvas, and set the way it behaves when the window is resized');
				break;
			case 8:
				(item.detail = 'pc.FILLMODE_FILL_WINDOW'),
					(item.documentation = 'the canvas will simply fill the window, changing aspect ratio');
				break;
			case 9:
				(item.detail = 'pc.RESOLUTION_AUTO'),
					(item.documentation = 'if width and height are not provided, canvas will be resized to match canvas client size');
				break;
			case 10:
				(item.detail = 'resizeCanvas([width], [height])'),
					(item.documentation = 'Resize the canvas');
				break;
			case 11:
				(item.detail = 'addComponent(type, data)'),
					(item.documentation = 'Create a new component and add it to the entity');
				break;
			case 12:
				(item.detail = 'cube component'),
					(item.documentation = 'Component to the Entity');
				break;
			case 13:
				(item.detail = 'camera component'),
					(item.documentation = 'Component to the Entity');
				break;
			case 14:
				(item.detail = 'light component'),
					(item.documentation = 'Component to the Entity');
				break;
			case 15:
				(item.detail = 'model component'),
					(item.documentation = 'Component to the Entity');
				break;
			case 16:
				(item.detail = 'box type'),
					(item.documentation = 'Component Type to the Entity');
				break;
			case 17:
				(item.detail = 'pc.Color'),
					(item.documentation = 'Representation of an RGBA color');
				break;
			case 18:
				(item.detail = 'pc.Entity root'),
					(item.documentation = 'The root pc.Entity of the application');
				break;
			case 19:
				(item.detail = 'addChild(node)'),
					(item.documentation = 'Add a new child to the child list and update the parent value of the child node');
				break;
			case 20:
				(item.detail = 'setPosition(x, [y], [z])'),
					(item.documentation = 'Sets the world-space position of the specified graph node');
				break;
			case 21:
				(item.detail = 'setEulerAngles(x, [y], [z])'),
					(item.documentation = 'Sets the world-space rotation of the specified graph node using euler angles');
				break;
			case 22:
				(item.detail = 'app.on(action, callback)'),
					(item.documentation = 'Event');
				break;
			case 23:
				(item.detail = 'update'),
					(item.documentation = 'Update Event');
				break;
			case 24:
				(item.detail = 'deltaTime'),
					(item.documentation = 'Time Type');
				break;
			case 25:
				(item.detail = 'rotate(x, [y], [z])'),
					(item.documentation = 'Rotates the graph node in world-space by the specified Euler angles');
				break;
			default:
				(item.detail = 'Play Canvas details'),
					(item.documentation = 'No documentation');
		}
		return item;
	}
);

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
