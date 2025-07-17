import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

Pusher.logToConsole = process.env.NODE_ENV === 'development'

const echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.VUE_APP_PUSHER_KEY,
    cluster: process.env.VUE_APP_PUSHER_CLUSTER,
    wsHost: process.env.VUE_APP_PUSHER_HOST, // remove in Production
    wsPort: process.env.VUE_APP_PUSHER_PORT, // remove in Production
    wssPort: process.env.VUE_APP_PUSHER_PORT, // remove in Production
    forceTLS: process.env.VUE_APP_PUSHER_FORCE_TLS,
    encrypted: process.env.VUE_APP_PUSHER_ENCRYPTED,
    enabledTransports: ['ws', 'wss'],
    enableStats: true,
    logToConsole: true,
    authEndpoint: '/broadcasting/auth', // for local development 
    auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
    }
})

echo.connector.pusher.connection.bind('state_change', (states) => {
    console.log('Pusher state changed:', states)
    if (states.current === 'unavailable') {
        console.error('Pusher connection failed. Retrying...')
    }
})

echo.connector.pusher.connection.bind('connected', () => {
    console.log('Pusher connected successfully!')
})

export default echo