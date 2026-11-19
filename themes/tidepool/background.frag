// Tidepool: rings spreading slowly from two points on a dark tide.
// Single pass, Shadertoy form. Uses iResolution, iTime, iMouse, and roostAccent.
// Kept dark on purpose: the brightest pixel stays under the text-contrast line.

// One family of rings around c. f counts rings outward; lines sit where f is a whole number.
float rings(vec2 p, vec2 c, float spacing, float speed) {
	float d = length(p - c);
	float f = d / spacing - iTime * speed;
	float edge = 0.5 - abs(fract(f) - 0.5);
	float line = 1.0 - smoothstep(0.0, 1.4 * fwidth(f), edge);
	return line * exp(-d * 1.15);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	vec2 uv = fragCoord / iResolution.xy;
	float aspect = iResolution.x / iResolution.y;
	vec2 p = vec2(uv.x * aspect, uv.y);
	float t = iTime * 0.12;

	// The water: near the canvas color, lifting toward green at the upper right.
	vec3 deep = vec3(0.045, 0.085, 0.11);
	vec3 shallow = vec3(0.07, 0.19, 0.19);
	vec3 col = mix(deep, shallow, smoothstep(0.1, 1.3, uv.x * 0.75 + uv.y * 0.55));

	// A violet bloom at the lower left.
	vec2 bloom = vec2(0.34 * aspect, -0.08);
	col += vec3(0.17, 0.11, 0.32) * 0.6 * exp(-2.6 * length(p - bloom));

	// Two drifting centers. A held mouse button moves the first one.
	vec2 c1 = vec2(0.72 * aspect, 0.79) + 0.025 * vec2(sin(t * 2.1), cos(t * 1.7));
	if (iMouse.z > 0.0) c1 = vec2(iMouse.x / iResolution.y, iMouse.y / iResolution.y);
	vec2 c2 = vec2(0.24 * aspect, 0.07) + 0.025 * vec2(cos(t * 1.9), sin(t * 1.3));

	float r = rings(p, c1, 0.075, 0.18) + 0.8 * rings(p, c2, 0.085, 0.14);

	// A soft swell under the rings, in the theme's accent.
	float swell = 0.5 + 0.5 * sin(length(p - c1) * 7.0 - iTime * 0.5);
	col += roostAccent * 0.035 * swell * exp(-1.6 * length(p - c1));
	col += mix(vec3(0.55, 0.75, 0.75), roostAccent, 0.5) * 0.16 * r;

	// Darker at the edges.
	col *= 0.82 + 0.18 * smoothstep(1.15, 0.15, length(uv - vec2(0.55, 0.5)));
	fragColor = vec4(col, 1.0);
}
