#version 330 core

uniform vec2 iResolution;               /* screen resolution, value passed from CPU */
uniform float iTime;                    /* current time, value passed from CPU */
uniform int iFrame;                     /* current frame, value passed from CPU */
in vec2 fragCoord;                      /* fragment shader input: fragment coordinates, valued passed from vertex shader */
out vec4 fragColor;                     /* fragment shader output: fragment color, value passed to pixel processing for screen display */

const float M_PI = 3.1415926535;                        /* const value for PI */
vec3 BG_COLOR = mix(vec3(237, 187, 92) / 255, vec3(144, 104, 179) / 255, abs(fragCoord.y / iResolution.y - 0.5) * 2);

//// This function converts from Polar Coordinates to Cartesian coordinates

vec2 polar2cart(float angle, float length)
{
    return vec2(cos(angle) * length, sin(angle) * length);
}

//// This is a sample function showing you how to check if a point is inside a triangle

bool inTriangle(vec2 p, vec2 p1, vec2 p2, vec2 p3)
{
    if(dot(cross(vec3(p2 - p1, 0), vec3(p - p1, 0)), cross(vec3(p2 - p1, 0), vec3(p3 - p1, 0))) >= 0. &&
        dot(cross(vec3(p3 - p2, 0), vec3(p - p2, 0)), cross(vec3(p3 - p2, 0), vec3(p1 - p2, 0))) >= 0. &&
        dot(cross(vec3(p1 - p3, 0), vec3(p - p3, 0)), cross(vec3(p1 - p3, 0), vec3(p2 - p3, 0))) >= 0.){
        return true;
    }
    return false;
}

//// Sample function without iTime

vec3 drawTriangle(vec2 pos, vec2 center, vec3 color)
{
    vec2 p1 = polar2cart(0, 160.) + center;
    vec2 p2 = polar2cart(2. * M_PI / 3., 160.) + center;
    vec2 p3 = polar2cart(4. * M_PI / 3., 160.) + center;
    if(inTriangle(pos, p1, p2, p3)){
        return color;
    }
    return vec3(0);
}

//Implemented function letting you control rotationAngle, size, etc.

vec3 drawTriangle(vec2 pos, vec2 center, int rotationAngle, float size, vec3 color) {
    vec2 p1 = polar2cart(rotationAngle * M_PI/180, size) + center;
    vec2 p2 = polar2cart(rotationAngle * M_PI/180 + 2. * M_PI / 3., size) + center;
    vec2 p3 = polar2cart(rotationAngle * M_PI/180 + 4. * M_PI / 3., size) + center;
    if(inTriangle(pos, p1, p2, p3)){
        return color;
    }
    return vec3(0);
}


/////////////////////////////////////////////////////
//// Step 1 Function: Inside Circle
//// In this function, you will implement a function to checks if a point is inside a circle
//// The inputs include the point position, the circle's center and radius
//// The output is a bool indicating if the point is inside the circle (true) or not (false)
/////////////////////////////////////////////////////
//// Implementation hint: use dot(v,v) to calculate the squared length of a vector v
/////////////////////////////////////////////////////

bool inCircle(vec2 pos, vec2 center, float radius)
{
    /* your implementation starts */
    if (sqrt(dot(center - pos, center - pos)) <= radius) {
        return true;
    }
	
    /* your implementation ends */
    
    return false;
}

//// This function calls the inCircle function you implemented above and returns the color of the circle
//// If the point is outside the circle, it returns a zero vector by default
vec3 drawCircle(vec2 pos, vec2 center, float radius, vec3 color)
{
    if(inCircle(pos, center, radius)){
        return color;
    }
    return vec3(0);
}

/////////////////////////////////////////////////////
//// Step 2 Function: Inside Rectangle
//// In this function, you will implement a function to checks if a point is inside a rectangle
//// The inputs include the point position, the left bottom corner and the right top corner of the rectangle
//// The output is a bool indicating if the point is inside the rectangle (true) or not (false)
/////////////////////////////////////////////////////
//// Implementation hint: use .x and .y to access the x and y components of a vec2 variable
/////////////////////////////////////////////////////

bool inRectangle(vec2 pos, vec2 leftBottom, vec2 rightTop)
{
    if ((pos.x >= leftBottom.x && pos.x <= rightTop.x) && (pos.y >= leftBottom.y && pos.y <= rightTop.y)) {
        return true;
    }
    return false;
}

//// This function calls the inRectangle function you implemented above and returns the color of the rectangle
//// If the point is outside the rectangle, it returns a zero vector by default

vec3 drawRectangle(vec2 pos, vec2 leftBottom, vec2 rightTop, vec3 color)
{
    if(inRectangle(pos,leftBottom,rightTop)){
        return color;
    }
    return vec3(0);
}

// Basic inEllipse function without rotation

bool inEllipse(vec2 pos, vec2 center, float semiMinor, float semiMajor) {
    if ((pow(pos.x - center.x, 2) / pow(semiMinor, 2)) + (pow(pos.y - center.y, 2) / pow(semiMajor, 2)) <= 1) {
        return true;
    }
    return false;
}

// Draws an ellipse with inputs of lengths and rotationAngle

vec3 drawEllipse(vec2 pos, vec2 center, float semiMinor, float semiMajor, int rotationAngle, vec3 color) {
    // Translate the position relative to the center of the ellipse
    vec2 translatedPos = pos - center;
    
    // Apply rotation using the rotation angle
    vec2 rotatedPos = vec2(
        translatedPos.x * cos(rotationAngle * M_PI/180) + translatedPos.y * sin(rotationAngle * M_PI/180),
        - translatedPos.x * sin(rotationAngle * M_PI/180) + translatedPos.y * cos(rotationAngle * M_PI/180)
    );
    if (inEllipse(rotatedPos + center, center, semiMinor, semiMajor)) {
        return color;
    }
    return vec3(0);
}

bool inClouds(vec2 pos, vec2 center, float size) {
    if (inCircle(pos, (center - vec2(380, -80) * size), 70 * size) ||
        inCircle(pos, (center - vec2(380, 80) * size), 70 * size) ||
        inCircle(pos, (center - vec2(300, 0) * size), 90 * size) ||
        inCircle(pos, (center - vec2(100, 0) * size), 200 * size) ||
        inCircle(pos, (center + vec2(100, 0) * size), 120 * size) ||
        inCircle(pos, (center + vec2(190, 0) * size), 90 * size) ||
        inCircle(pos, (center + vec2(300, 0) * size), 120 * size) ||
        inCircle(pos, (center + vec2(400, 100) * size), 40 * size) ||
        inCircle(pos, (center + vec2(400, -100) * size), 40 * size) ||
        inCircle(pos, (center + vec2(470, 40) * size), 90 * size) ||
        inCircle(pos, (center + vec2(470, -40) * size), 90 * size) ||
        inCircle(pos, (center + vec2(530, 0) * size), 90 * size)
        ) {
        return true;
    }
    return false;
}

vec3 drawClouds(vec2 pos, vec2 center, float iTime) {
    vec3 color = vec3(70, 70, 124) / 255;
    vec3 color1 = vec3(94, 93, 148) / 255;
    vec3 color2 = vec3(252, 240, 146) / 255;
    vec3 color3 = vec3(35, 36, 54) / 255;
    if (iTime != -1) {
        if (inRectangle(pos, vec2(0, iResolution.y / 2 - 6), vec2(iResolution.x, iResolution.y / 2 + 6))) {
        return mix(vec3(164, 163, 214) / 255, vec3(255, 208, 117) / 255, pos.x / iResolution.x);
    }
        if (inClouds(pos, center + vec2(200 + 10 * cos(iTime * 1.5), 0), 0.8) ||
            inClouds(pos, vec2(200 + 15 * sin(iTime * 1.5), iResolution.y/2), 0.7) ||
            inCircle(pos, (center + vec2(660 + 10 * cos(iTime * 1.5), 0)), 100)
            ) {
            return color;
        }
        if (inClouds(pos, center + vec2(10 * cos(iTime * 1.8), 0), 1.0) ||
            inClouds(pos, vec2(-250 + 10 * sin(iTime * 1.2), iResolution.y/2), 1.2) ||
            inCircle(pos, (center + vec2(620 + 10 * cos(iTime * 1.5), 0)), 150)
            ) {
            return color1;
        }
        if (inClouds(pos, center + vec2(70 + 10 * cos(iTime * 1.5), 0), 1.2) ||
            inClouds(pos, vec2(-400 + 10 * sin(iTime * 1.5), iResolution.y/2), 1.5)
            ){
            return color2;
        }
        if ((inTriangle(pos, vec2(iResolution.x + 50, iResolution.y/2), vec2(iResolution.x + 20 * cos(iTime * 1.5), - 20), vec2(iResolution.x - 400, iResolution.y/2))) ||
        (inTriangle(pos, vec2(iResolution.x - 50, iResolution.y/2), vec2(iResolution.x - 400 + 20 * sin(iTime * 1.5), - 100), vec2(iResolution.x - 800, iResolution.y/2))) ||
        (inTriangle(pos, vec2(800, iResolution.y/2), vec2(500 + 20 * cos(iTime * 1.5), iResolution.y - 800), vec2(150, iResolution.y/2))) ||
        (inTriangle(pos, vec2(-400, iResolution.y/2), vec2(100 + 20 * sin(iTime * 1.5), iResolution.y - 1000), vec2(600, iResolution.y/2)))
        ){
        return color3;
    }
    } else {
        if (inRectangle(pos, vec2(0, iResolution.y / 2 - 6), vec2(iResolution.x, iResolution.y / 2 + 6))) {
        return mix(vec3(164, 163, 214) / 255, vec3(255, 208, 117) / 255, pos.x / iResolution.x);
        }
        if (inClouds(pos, center + vec2(200, 0), 0.8) ||
            inClouds(pos, vec2(200, iResolution.y/2), 0.7) ||
            inCircle(pos, (center + vec2(660, 0)), 100)
            ) {
            return color;
        }
        if (inClouds(pos, center, 1.0) ||
            inClouds(pos, vec2(-250, iResolution.y/2), 1.2) ||
            inCircle(pos, (center + vec2(620, 0)), 150)
            ) {
            return color1;
        }
        if (inClouds(pos, center + vec2(70, 0), 1.2) ||
            inClouds(pos, vec2(-400, iResolution.y/2), 1.5)
            ){
            return color2;
        }
        if ((inTriangle(pos, vec2(iResolution.x + 50, iResolution.y/2), vec2(iResolution.x + 75, iResolution.y - 20), vec2(iResolution.x - 400, iResolution.y/2))) ||
        (inTriangle(pos, vec2(iResolution.x - 50, iResolution.y/2), vec2(iResolution.x - 400, iResolution.y + 100), vec2(iResolution.x - 800, iResolution.y/2))) ||
        (inTriangle(pos, vec2(800, iResolution.y/2), vec2(500, 800), vec2(150, iResolution.y/2))) ||
        (inTriangle(pos, vec2(-400, iResolution.y/2), vec2(100, 1000), vec2(600, iResolution.y/2)))
        ){
        return color3;
    }
    }
    return vec3(0);
}

//// This function draws objects on the canvas by specifying a fragColor for each fragCoord

void mainImage(in vec2 fragCoord, out vec4 fragColor)
{
    //// Get the window center
    vec2 center = vec2(iResolution / 2.);

    vec3 fragOutput;

    if (fragCoord.y >= iResolution.y / 2) {
        fragOutput = drawClouds(fragCoord, center, -1);
    } else {
        fragOutput = drawClouds(fragCoord, center, iTime) + vec3(130, 120, 200) / 255;
    }

    // //// Set the fragment color to be the background color if it is zero
    if(fragOutput == vec3(0)){
        fragColor = vec4(BG_COLOR, 1.0);
    }
    //// Otherwise set the fragment color to be the color calculated in fragOutput
    else{
        fragColor = vec4(fragOutput, 1.0);
    }
    //// Step 5: Implement your customized scene by modifying the mainImage function
    //// Try to leverage what you have learned from Step 1 to 4 to define the shape and color of a new object in the fragment shader
    //// Notice how we put multiple objects together by adding their color values
}

void main()
{
    mainImage(fragCoord, fragColor);
}