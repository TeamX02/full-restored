#define round(a) floor(a + 0.5)
#define iResolution vec3(openfl_TextureSize, 0.)
uniform float iTime;
#define iChannel0 bitmap
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform sampler2D iChannel3;
#define texture flixel_texture2D

// third argument fix
vec4 flixel_texture2D(sampler2D bitmap, vec2 coord, float bias) {
	vec4 color = texture2D(bitmap, coord, bias);
	if (!hasTransform)
	{
		return color;
	}
	if (color.a == 0.0)
	{
		return vec4(0.0, 0.0, 0.0, 0.0);
	}
	if (!hasColorTransform)
	{
		return color * openfl_Alphav;
	}
	color = vec4(color.rgb / color.a, color.a);
	mat4 colorMultiplier = mat4(0);
	colorMultiplier[0][0] = openfl_ColorMultiplierv.x;
	colorMultiplier[1][1] = openfl_ColorMultiplierv.y;
	colorMultiplier[2][2] = openfl_ColorMultiplierv.z;
	colorMultiplier[3][3] = openfl_ColorMultiplierv.w;
	color = clamp(openfl_ColorOffsetv + (color * colorMultiplier), 0.0, 1.0);
	if (color.a > 0.0)
	{
		return vec4(color.rgb * color.a * openfl_Alphav, color.a * openfl_Alphav);
	}
	return vec4(0.0, 0.0, 0.0, 0.0);
}

// variables which is empty, they need just to avoid crashing shader
uniform float iTimeDelta;
uniform float iFrameRate;
uniform int iFrame;
#define iChannelTime float[4](iTime, 0., 0., 0.)
#define iChannelResolution vec3[4](iResolution, vec3(0.), vec3(0.), vec3(0.))
uniform vec4 iMouse;
uniform vec4 iDate;

#pragma header

uniform float binaryIntensity = 0.0;

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	vec2 uv = openfl_TextureCoordv.xy;
    
    // get snapped position
    float psize = 0.04 * binaryIntensity;
    float psq = 1.0 / psize;

    float px = floor(uv.x * psq + 0.5) * psize;
    float py = floor(uv.y * psq + 0.5) * psize;
    
	vec4 colSnap = texture2D(bitmap, vec2(px, py));
    
	float lum = pow(1.0 - (colSnap.r + colSnap.g + colSnap.b) / 3.0, binaryIntensity);
    
    float qsize = psize * lum;
    float qsq = 1.0 / qsize;

    float qx = floor(uv.x * qsq + 0.5) * qsize;
    float qy = floor(uv.y * qsq + 0.5) * qsize;

    float rx = (px - qx) * lum + uv.x;
    float ry = (py - qy) * lum + uv.y;

    fragColor = texture2D(bitmap, vec2(rx, ry));
}
