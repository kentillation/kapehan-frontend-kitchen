<template>
    <div class="loader-overlay" v-if="visible">
        <div class="loader-content">
            <div class="loader"></div>
            <p v-if="message" class="loader-message">{{ message }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "LoaderUI",
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        message: {
            type: String,
            default: ""
        }
    }
};
</script>

<style scoped>
.loader-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.589);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.loader-content {
    /* background: #462a0a; */
    padding: 25px 40px;
    border-radius: 8px;
    text-align: center;
    z-index: 9999;
}

.loader {
    --c1: #63ddff;
    --c2: #0090b6;
    width: 35px;
    height: 70px;
    border-top: 4px solid var(--c1);
    border-bottom: 4px solid var(--c1);
    background: linear-gradient(90deg, var(--c1) 2px, var(--c2) 0 5px, var(--c1) 0) 50%/7px 8px no-repeat;
    display: grid;
    overflow: hidden;
    animation: l5-0 2s infinite linear;
    margin: 0 auto;
}

.loader::before,
.loader::after {
    content: "";
    grid-area: 1/1;
    width: 75%;
    height: calc(50% - 4px);
    margin: 0 auto;
    border: 2px solid var(--c1);
    border-top: 0;
    box-sizing: content-box;
    border-radius: 0 0 40% 40%;
    /* -webkit-mask: linear-gradient(#000 0 0) bottom/4px 2px no-repeat,
        linear-gradient(#000 0 0); */
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    background: linear-gradient(var(--d, 0deg), var(--c2) 50%, #0000 0) bottom /100% 205%,
        linear-gradient(var(--c2) 0 0) center/0 100%;
    background-repeat: no-repeat;
    animation: inherit;
    animation-name: l5-1;
}

.loader::after {
    transform-origin: 50% calc(100% + 2px);
    transform: scaleY(-1);
    --s: 3px;
    --d: 180deg;
}

.loader-message {
    margin-top: 15px;
    color: #63ddff;
}

@keyframes l5-0 {
    80% {
        transform: rotate(0)
    }

    100% {
        transform: rotate(0.5turn)
    }
}

@keyframes l5-1 {

    10%,
    70% {
        background-size: 100% 205%, var(--s, 0) 100%
    }

    70%,
    100% {
        background-position: top, center
    }
}

p {
    font-family: 'Poppins', Arial;
}
</style>