varying vec2 vTextureCoord;

uniform sampler2D uTexture;

void main(void){
    vec2 coordinates;
    float pixelDistanceX;
    float pixelDistanceY;
    float offset;
    float dir;

    pixelDistanceX = distance(vTextureCoord.x, 0.5);
    pixelDistanceY = distance(vTextureCoord.y, 0.5);

    offset = (pixelDistanceX*0.2) * pixelDistanceY;

    if (vTextureCoord.y <= 0.5) 
        dir = 1.0;
    else
        dir = -1.0;


    coordinates = vec2(vTextureCoord.x, vTextureCoord.y + pixelDistanceX* (offset*7.0*dir));

   gl_FragColor = texture2D(uTexture, coordinates);
}