import { writable } from "svelte/store";

export let webSocket: { socket: null | WebSocket } = $state({ socket: null });