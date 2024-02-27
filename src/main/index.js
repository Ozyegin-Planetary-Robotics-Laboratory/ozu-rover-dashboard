import { app, shell, BrowserWindow } from 'electron'
import { dirname, join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
//import cassandra from 'cassandra-driver'

import express from 'express'
import cors from 'cors'
import rosNodeJS from 'rosnodejs'
import { abort } from 'process'

// Global Data
var telemetryData = {
  autonomy: {
    gps: {
      base: [0.0, 0.0],
      rover: [0.0, 0.0]
    },
    goal: null,
    markerType: null
  },  
  science: {
    archive_ids: []
  },
  manipulator: {
    angelPoses: [0, 0, 0, 0, 0]
  }
}

// ROS
var enqueue_client = null
var abort_client = null
function listener() {
  try {
    rosNodeJS.initNode('/listener_node').then((nh) => {
      console.log('ROS node initialized')
      enqueue_client = nh.serviceClient('/ares/goal/enqueue', 'ozurover_messages/GetMarker')
      abort_client = nh.serviceClient('/ares/goal/abort', 'ozurover_messages/Abort')
      var sub1 = nh.subscribe('/ares/gps/rover', 'sensor_msgs/NavSatFix', (data) => {
        telemetryData.autonomy.gps.rover = [data.latitude, data.longitude]
        console.log('GPS Data: ', telemetryData.autonomy.gps.rover)
      });
      var sub2 = nh.subscribe('/ares/arm/state', 'sensor_msgs/JointState', (data) => {
        telemetryData.manipulator.angelPoses = data.position
      });
    })
  } catch (error) {
    console.error('Error initializing ROS node: ', error)
  }
}

if (require.main === module) {
  listener()
}

// Express
const expressApp = express()
const expressPort = 4000
expressApp.use(express.json())
expressApp.use(cors())

// Cassandra
//const authProvider = new cassandra.auth.PlainTextAuthProvider(
//  'username',
//  'password'
//)
//const client = cassandra.Client({
//  contactPoints: ['localhost'],
//  localDataCenter: 'datacenter1',
//  authProvider: authProvider,
//  keyspace: 'ares'
//})

// Endpoints
expressApp.get('/data/gps/rover', (req, res) => {
  res.send(telemetryData.autonomy.gps.rover)
})

expressApp.post('/goal/enqueue', (req, res) => {
  let marker = JSON.parse(req.body)
  enqueue_client.call({
    'gps': {
      latitude: marker.gps[0],
      longitude: marker.gps[1]
    },
    'type': marker.type
  })
})

expressApp.post('goal/abort', (req, res) => {
  abort_client.call()
})

expressApp.get('/science/sample', (req, res) => {
  /* Send ROS service request */
  res.send(
    JSON.stringify({
      spectrograph: []
    })
  )
})

expressApp.get('/science/capture/panorama', (req, res) => {
  /* Send ROS service request */
  res.send(JSON.stringify({}))
})

expressApp.get('/science/capture/highres', (req, res) => {
  /* Send ROS service request */
  res.send(JSON.stringify({}))
})

expressApp.post('/science/archive/select', (req, res) => {
  /* Request  */
})

expressApp.post('/science/archive/create', (req, res) => {
  /* Request  */
})

expressApp.get('/arm/data/ak60', (req, res) => {
  res.send(JSON.stringify({
    'states': telemetryData.manipulator.angelPoses
  }))
})

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      webSecurity: false,
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  //#region express http getter
  expressApp.post('/rover-data', (req, res) => {
    const requestData = req.body

    mainWindow.webContents.send('electron-vue-rover-data', JSON.stringify(requestData))

    res.send('Data forwarded to renderer process')
  })

  expressApp.listen(expressPort, () => {
    console.log('Electron main listening on port 4000')
  })

  expressApp.get('/data', (req, res) => {
    res.send(currentData)
  })

  //#endregion

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.