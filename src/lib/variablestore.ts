import { writable } from 'svelte/store';

// Create a writable store with the default value.
export const destinationStore = writable("No destination selected");