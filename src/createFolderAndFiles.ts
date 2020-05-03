import { Uri, workspace, FileType, window } from 'vscode'
import { basename } from 'path'

export interface FileDescription {
  uri: Uri
  contents: string
}

export default async function createFolderAndFiles(
  folderUri: Uri,
  files: FileDescription[],
  openFileIndices: number[] = [0]
) {
  try {
    const folderStats = await workspace.fs.stat(folderUri)

    if (folderStats.type & FileType.Directory) {
      const existingFolderContens = await workspace.fs.readDirectory(folderUri)
      if (existingFolderContens.length !== 0) {
        const folderName = basename(folderUri.path)
        window.showWarningMessage(
          `Uma pasta com o nome "${folderName}" já existe e não está vazia. 
          Criar o componente aqui pode substituir algo inesperadamente!`
        )
        return
      }
    }
  } catch (_ /* ignore error */) {}

  await workspace.fs.createDirectory(folderUri)

  await Promise.all(
    files.map(fileDescription =>
      workspace.fs.writeFile(fileDescription.uri, Buffer.from(fileDescription.contents, 'utf8'))
    )
  )

  openFileIndices.forEach(async fileIndex => {
    const fileDescription = files[fileIndex]
    if (fileDescription) {
      await window.showTextDocument(fileDescription.uri, { preview: true })
    }
  })
}
