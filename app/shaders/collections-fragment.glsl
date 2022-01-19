#pragma glslify: Cover = require(./modules/Cover)

uniform float uAlpha;
uniform sampler2D tMap;
uniform vec2 uResolution;
uniform vec2 uImageSize;

varying vec2 vUv;

#pragma glslify: Cover = require(./modules/Cover)

void main() {
    vec2 coverUV = Cover(vUv, uResolution, uImageSize);

    vec4 texture = texture2D(tMap, coverUV);

    gl_FragColor = texture;
    gl_FragColor.a = uAlpha;
}

