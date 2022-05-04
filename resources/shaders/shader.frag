uniform vec3 uColor1;
uniform vec3 uColor2;
#include <fog_pars_fragment>

varying float vElevation;

void main()
{
    float strength = (vElevation + 0.3) * 1.7;
    vec3 color = mix(uColor1, uColor2, strength);
    gl_FragColor = vec4(color, 1.0);
    #include <fog_fragment>
}