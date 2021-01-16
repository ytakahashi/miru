<template>
  <div id="nav">
    <router-link to="/">Settings</router-link> |
    <router-link to="/issues">Issues</router-link> |
    <router-link to="/pulls">Pull Requests</router-link>
  </div>
  <router-view/>
</template>

<style>
@import './assets/theme.scss';

body {
  background-color: var(--main-background-color);
  color: var(--main-font-color);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--main-font-color);
}

#nav {
  padding: 20px;
}

#nav a {
  font-weight: bold;
  color: var(--link-color);
}

#nav a.router-link-exact-active {
  color: var(--link-color-active);
}
</style>
