import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

// Enable Pusher logging (optional)
Pusher.logToConsole = process.env.NODE_ENV === 'development'

const echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.VUE_APP_PUSHER_KEY || 'f2ff9925065555c61de5',
    cluster: process.env.VUE_APP_PUSHER_CLUSTER || 'ap1',
    wsHost: process.env.VUE_APP_PUSHER_HOST || 'ws.pusher.com', // remove in Production
    wsPort: process.env.VUE_APP_PUSHER_PORT || 80, // remove in Production
    wssPort: process.env.VUE_APP_PUSHER_PORT || 443, // remove in Production
    forceTLS: (process.env.VUE_APP_PUSHER_FORCE_TLS || 'true') === 'true',
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

// Add connection monitoring
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