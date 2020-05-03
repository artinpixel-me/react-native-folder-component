import { Uri, workspace, FileType } from 'vscode';
import { join } from 'path';
import * as minimatch from 'minimatch';

interface ExcludeFilesSetting {
  [globPattern: string]: boolean
}

export default async function getSubFolders(
  workspaceFolder: Uri,
  currentFolder: Uri
): Promise<Uri[]> {
  const folderChilds = await workspace.fs.readDirectory(currentFolder);

  const subFolderUris = folderChilds
    .filter(([_, fileType]) => fileType & FileType.Directory)
    .map(([folderName]) => Uri.file(join(currentFolder.path, folderName)));

  const excludedFilesSettings = workspace
    .getConfiguration('files', workspaceFolder)
    .get<ExcludeFilesSetting>('exclude');

  const activeExcludedFoldes = excludedFilesSettings
    ? Object.keys(excludedFilesSettings).filter(
        globPattern => excludedFilesSettings[globPattern] === true
      )
    : [];

  const filteredSubFolderUris = subFolderUris.filter(subFolderUri => {
    let relativeWorkspaceFolderPath = subFolderUri.path.replace(workspaceFolder.path, '');
    if (relativeWorkspaceFolderPath[0] === '/') {
      relativeWorkspaceFolderPath = relativeWorkspaceFolderPath.substr(1);
    }
    if (relativeWorkspaceFolderPath[relativeWorkspaceFolderPath.length - 1] !== '/') {
      relativeWorkspaceFolderPath += '/';
    }

    const shouldExclude = activeExcludedFoldes.some(excludedGlobPattern =>
      minimatch(relativeWorkspaceFolderPath, excludedGlobPattern, { matchBase: true })
    );

    return !shouldExclude;
  });

  return filteredSubFolderUris;
}
