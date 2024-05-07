const config = {
    type: 'app',
    name: 'tracker-plugin-configurator',
    title: 'Tracker Plugin Configurator',
    description: 'Tracker plugin configurator allows you to easily set up and configure plugins into your core Capture environment.',
    minDHIS2Version: '2.38',

    entryPoints: {
        app: './src/App.tsx',
    },
}

module.exports = config
