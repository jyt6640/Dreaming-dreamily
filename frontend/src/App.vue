<template>
    <div id="app">
        <router-view />
    </div>
</template>

<style>
#app {
    height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow: hidden;
    background-color: #c6c3c3;
    color: #ccc;
}
.gaegu-bold {
    font-family: 'Gaegu', sans-serif;
    font-weight: 700;
    font-style: normal;
}

.gaegu-regular {
    font-family: 'Gaegu', sans-serif;
    font-weight: 400;
    font-style: normal;
}

.gaegu-light {
    font-family: 'Gaegu', sans-serif;
    font-weight: 300;
    font-style: normal;
}
</style>
