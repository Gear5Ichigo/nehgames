varying vec2 vTextureCoord;

uniform sampler2D uTexture;

uniform float uScaleX;
uniform float uScaleY;

void main(void){
    vec2 coordinates;
    float pixelDistanceX;
    float pixelDistanceY;
    float offset;
    float dir;

    pixelDistanceX = distance(vTextureCoord.x, 0.5) * uScaleX;
    pixelDistanceY = distance(vTextureCoord.y, 0.5) * uScaleY;

    offset = (pixelDistanceX*0.1) * pixelDistanceY;

    if (vTextureCoord.y <= 0.5) 
        dir = 1.0;
    else
        dir = -1.0;


    coordinates = vec2(vTextureCoord.x, vTextureCoord.y + pixelDistanceX* (offset*9.0*dir));

   gl_FragColor = texture2D(uTexture, coordinates);
}