import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

Pusher.logToConsole = process.env.NODE_ENV === 'development'

const echo = new Echo({
    broadcaster: 'pusher',
    key: 'f2ff9925065555c61de5',
    cluster: 'ap1',
    wsHost: '127.0.0.1', // remove in Production
    wsPort: '6001', // remove in Production
    forceTLS: false,
    encrypted: false,
    enabledTransports: ['ws'],
    enableStats: true,
    logToConsole: true,
    authEndpoint: '/broadcasting/auth', // for local development 
    auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
    }
})

export default echo