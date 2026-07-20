/**
 * Paddy palette + flags (spec 2026-07-18-sunroom-skills-paddy-design.md).
 * Pool-blue fill is deliberately ~85% opaque: translucent blue over the butter
 * field shifts green, so the water must carry its own body to stay blue.
 */
export const WATER_FILL = "rgba(126,200,227,0.85)";
export const WATER_SURFACE = "rgba(255,253,246,0.7)";
export const RIPPLE_STROKE = "rgba(88,150,190,0.75)";
/** Shower droplets from the can's sprinkler (deeper than WATER_FILL so they read on butter). */
export const SPRAY_FILL = "rgba(88,150,190,0.92)";
