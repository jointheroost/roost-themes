// Phosphor: a dark green tube with scan lines, a slow refresh band, and a little grain.
// Single pass, Shadertoy form. Uses iResolution, iTime, and roostAccent.
// Kept very dark: it should feel like a lit screen, not compete with the text.

float hash(vec2 p) {
	p = fract(p * vec2(123.34, 456.21));
	p += dot(p, p + 45.32);
	return fract(p.x * p.y);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	vec2 uv = fragCoord / iResolution.xy;
	vec3 tint = mix(vec3(0.3, 0.95, 0.45), roostAccent, 0.6);

	// The glass: brightest a little above center, falling off to the corners.
	vec2 q = uv - vec2(0.55, 0.6);
	float glass = exp(-dot(q, q) * 2.4);
	vec3 col = vec3(0.016, 0.04, 0.024) + tint * 0.1 * glass;

	// Scan lines: one dark line every 3 pixels.
	float scan = 0.5 + 0.5 * cos(fragCoord.y * 2.0944);
	col *= 0.62 + 0.38 * scan;

	// A soft band that rolls down the screen every 9 seconds.
	float band = fract(uv.y + iTime / 9.0);
	col += tint * 0.04 * smoothstep(0.0, 0.08, band) * smoothstep(0.2, 0.08, band);

	// Grain that changes every frame of the tube, about 24 a second.
	float grain = hash(floor(fragCoord / 2.0) + floor(iTime * 24.0));
	col += tint * 0.02 * (grain - 0.5);

	// Darker corners.
	vec2 v = uv * (1.0 - uv);
	col *= pow(16.0 * v.x * v.y, 0.18);
	fragColor = vec4(max(col, 0.0), 1.0);
}
