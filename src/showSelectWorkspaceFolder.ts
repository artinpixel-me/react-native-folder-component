import { WorkspaceFolder, Uri, window } from 'vscode';

export default async function showSelectWorkspaceFolder(
  workspaceFolders: WorkspaceFolder[]
): Promise<Uri | null> {
  const workspaceFolderNames = workspaceFolders.map(workspaceFolder => workspaceFolder.name);

  const selectedWorkspaceFolderName = await window.showQuickPick(workspaceFolderNames, {
    placeHolder: 'Nome do Workspace'
  });

  const selectedWorkspaceFolder = workspaceFolders.find(
    workspaceFolder => workspaceFolder.name === selectedWorkspaceFolderName
  );
  if (!selectedWorkspaceFolder) {
    return null;
  }

  return selectedWorkspaceFolder.uri;
}
