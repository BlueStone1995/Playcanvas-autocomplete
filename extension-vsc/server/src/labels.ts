import { CompletionItemKind } from 'vscode-languageserver';

const labels = [
    {
        label: 'pc', kind: CompletionItemKind.Text,
        data: 1
    },
    {
        label: 'Application',
        kind: CompletionItemKind.Text,
        data: 2
    },
    {
        label: 'Entity',
        kind: CompletionItemKind.Text,
        data: 3
    },
    {
        label: 'start',
        kind: CompletionItemKind.Text,
        data: 4
    },
    {
        label: 'app',
        kind: CompletionItemKind.Text,
        data: 5
    },
    {
        label: 'setCanvasFillMode',
        kind: CompletionItemKind.Text,
        data: 6
    },
    {
        label: 'setCanvasResolution',
        kind: CompletionItemKind.Text,
        data: 7
    },
    {
        label: 'FILLMODE_FILL_WINDOW',
        kind: CompletionItemKind.Text,
        data: 8
    },
    {
        label: 'RESOLUTION_AUTO',
        kind: CompletionItemKind.Text,
        data: 9
    },
    {
        label: 'resizeCanvas',
        kind: CompletionItemKind.Text,
        data: 10
    },
    {
        label: 'addComponent',
        kind: CompletionItemKind.Text,
        data: 11
    },
    {
        label: 'cube',
        kind: CompletionItemKind.Text,
        data: 12
    },
    {
        label: 'camera',
        kind: CompletionItemKind.Text,
        data: 13
    },
    {
        label: 'light',
        kind: CompletionItemKind.Text,
        data: 14
    },
    {
        label: 'model',
        kind: CompletionItemKind.Text,
        data: 15
    },
    {
        label: 'box',
        kind: CompletionItemKind.Text,
        data: 16
    },
    {
        label: 'Color',
        kind: CompletionItemKind.Text,
        data: 17
    },
    {
        label: 'root',
        kind: CompletionItemKind.Text,
        data: 18
    },
    {
        label: 'addChild',
        kind: CompletionItemKind.Text,
        data: 19
    },
    {
        label: 'setPosition',
        kind: CompletionItemKind.Text,
        data: 20
    },
    {
        label: 'setEulerAngles',
        kind: CompletionItemKind.Text,
        data: 21
    },
    {
        label: 'on',
        kind: CompletionItemKind.Text,
        data: 22
    },
    {
        label: 'update',
        kind: CompletionItemKind.Text,
        data: 23
    },
    {
        label: 'deltaTime',
        kind: CompletionItemKind.Text,
        data: 24
    },
    {
        label: 'rotate',
        kind: CompletionItemKind.Text,
        data: 25
    }
];

export default labels;
