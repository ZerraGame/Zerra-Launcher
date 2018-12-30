const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, 'release-builds')

  return Promise.resolve({
    appDirectory: path.join(outPath, 'zerra-launcher-win32-ia32/'),
    authors: 'Zerra Dev Team',
    noMsi: true,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'zerra-launcher.exe',
    setupExe: 'ZerraLauncherInstaller.exe',
    setupIcon: path.join(rootPath, 'assets', 'icons', 'win', 'icon.ico')
  })
}