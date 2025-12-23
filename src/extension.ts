import * as vscode from 'vscode';

let isAutoAcceptEnabled = false;
let statusBarItem: vscode.StatusBarItem;
let intervalId: NodeJS.Timeout | undefined;

export function activate(context: vscode.ExtensionContext) {
    console.log('Amazon Q Auto-Accept extension is now active!');

    statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );
    statusBarItem.command = 'amazonq-autoaccept.toggle';
    updateStatusBar();
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    let toggleCommand = vscode.commands.registerCommand(
        'amazonq-autoaccept.toggle',
        () => {
            isAutoAcceptEnabled = !isAutoAcceptEnabled;
            updateStatusBar();

            if (isAutoAcceptEnabled) {
                startAutoAccept();
                vscode.window.showWarningMessage(
                    '⚠️ Amazon Q Auto-Accept ENABLED - All commands will be executed automatically!'
                );
            } else {
                stopAutoAccept();
                vscode.window.showInformationMessage(
                    '✓ Amazon Q Auto-Accept DISABLED - Manual confirmation required'
                );
            }
        }
    );

    let enableCommand = vscode.commands.registerCommand(
        'amazonq-autoaccept.enable',
        () => {
            if (!isAutoAcceptEnabled) {
                isAutoAcceptEnabled = true;
                updateStatusBar();
                startAutoAccept();
                vscode.window.showWarningMessage(
                    '⚠️ Amazon Q Auto-Accept ENABLED - All commands will be executed automatically!'
                );
            }
        }
    );

    let disableCommand = vscode.commands.registerCommand(
        'amazonq-autoaccept.disable',
        () => {
            if (isAutoAcceptEnabled) {
                isAutoAcceptEnabled = false;
                updateStatusBar();
                stopAutoAccept();
                vscode.window.showInformationMessage(
                    '✓ Auto-Accept disabled'
                );
            }
        }
    );

    context.subscriptions.push(toggleCommand, enableCommand, disableCommand);
}

function updateStatusBar() {
    if (isAutoAcceptEnabled) {
        statusBarItem.text = '$(zap) Amazon Q: AUTO';
        statusBarItem.backgroundColor = new vscode.ThemeColor(
            'statusBarItem.warningBackground'
        );
        statusBarItem.tooltip = 'Amazon Q Auto-Accept ENABLED (Click to disable)';
    } else {
        statusBarItem.text = '$(circle-slash) Amazon Q: MANUAL';
        statusBarItem.backgroundColor = undefined;
        statusBarItem.tooltip = 'Amazon Q Auto-Accept DISABLED (Click to enable)';
    }
}

let lastCommandTime = 0;
let isCommandRunning = false;
let consecutiveErrors = 0;
const MAX_CONSECUTIVE_ERRORS = 10;

function startAutoAccept() {
    if (intervalId) return;
    
    consecutiveErrors = 0;
    
    intervalId = setInterval(async () => {
        // Prevent overlapping executions
        if (isCommandRunning) return;
        
        const now = Date.now();
        if (now - lastCommandTime < 300) return;
        
        // Stop if too many errors
        if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
            vscode.window.showErrorMessage(
                'Amazon Q Auto-Accept: Too many errors, stopping. Toggle to restart.'
            );
            stopAutoAccept();
            isAutoAcceptEnabled = false;
            updateStatusBar();
            return;
        }
        
        isCommandRunning = true;
        lastCommandTime = now;
        
        try {
            await vscode.commands.executeCommand('aws.amazonq.runCmdExecution');
            consecutiveErrors = 0; // Reset on success
        } catch (error) {
            consecutiveErrors++;
        } finally {
            isCommandRunning = false;
        }
    }, 300);
}

function stopAutoAccept() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = undefined;
    }
    isCommandRunning = false;
    consecutiveErrors = 0;
    lastCommandTime = 0;
}

export function deactivate() {
    stopAutoAccept();
    if (statusBarItem) {
        statusBarItem.dispose();
    }
    // Force cleanup
    isAutoAcceptEnabled = false;
    intervalId = undefined;
}
