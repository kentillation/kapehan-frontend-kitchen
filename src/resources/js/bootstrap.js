// import Echo from 'laravel-echo';
// import Pusher from 'pusher-js';

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: process.env.VUE_APP_PUSHER_KEY || 'f2ff9925065555c61de5',
//     cluster: process.env.VUE_APP_PUSHER_CLUSTER || 'ap1',
//     wsHost: process.env.VUE_APP_PUSHER_HOST, // remove in Production
//     wsPort: process.env.VUE_APP_PUSHER_PORT, // remove in Production
//     wssPort: process.env.VUE_APP_PUSHER_PORT, // remove in Production
//     forceTLS: process.env.VUE_APP_PUSHER_FORCE_TLS,
//     encrypted: process.env.VUE_APP_PUSHER_ENCRYPTED,
//     disableStats: true,
//     enabledTransports: ['ws', 'wss'],
//     authEndpoint: '/broadcasting/auth', // for local development 
//     auth: {
//         headers: {
//             Authorization: `Bearer ${localStorage.getItem('auth_token')}`
//         }
//     }
// });