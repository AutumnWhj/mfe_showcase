<template>
  <div id="root" class="main-container">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/login">Login</router-link>
    </div>
    <router-view />
    <div id="subapp-viewport" class="app-view-box"></div>
  </div>
</template>
