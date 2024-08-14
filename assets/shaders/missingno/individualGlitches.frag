#pragma header

uniform float binaryIntensity;

void main() {
	vec2 uv = openfl_TextureCoordv.xy;
    
    // get snapped position
    float psize = 0.04 * binaryIntensity;
    float psq = 1.0 / psize;
    float px = floor(uv.x * psq + 0.5) * psize;
    float py = floor(uv.y * psq + 0.5) * psize;

    vec2 clampedPxPy = clamp(vec2(px, py), vec2(0.0), vec2(1.0));
    vec4 colSnap = texture2D(bitmap, clampedPxPy);
    
    float lum = pow(1.0 - (colSnap.r + colSnap.g + colSnap.b) / 3.0, binaryIntensity);
    
    float qsize = psize * lum;
    float qsq = 1.0 / qsize;
    float qx = floor(uv.x * qsq + 0.5) * qsize;
    float qy = floor(uv.y * qsq + 0.5) * qsize;

    float rx = (px - qx) * lum + uv.x;
    float ry = (py - qy) * lum + uv.y;
    vec2 clampedRxRy = clamp(vec2(rx, ry), vec2(0.0), vec2(1.0));
    gl_FragColor = texture2D(bitmap, clampedRxRy);
}