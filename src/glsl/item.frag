uniform vec3 color;
uniform float alpha;

void main(void) {
  vec4 dest = vec4(color, alpha);
  gl_FragColor = dest;
}
