#version 300 es

uniform mat4 u_ViewProj;
uniform float u_Time;

uniform mat3 u_CameraAxes; // Used for rendering particles as billboards (quads that are always looking at the camera)
// gl_Position = center + vs_Pos.x * camRight + vs_Pos.y * camUp;

in vec4 vs_Pos; // Non-instanced; each particle is the same quad drawn in a different place
in vec4 vs_Nor; // Non-instanced, and presently unused
in vec4 vs_Col; // An instanced rendering attribute; each particle instance has a different color
in vec3 vs_Translate; // Another instance rendering attribute used to position each quad instance in the scene
in vec2 vs_UV; // Non-instanced, and presently unused in main(). Feel free to use it for your meshes.

in float vs_Scale;

// The transformation matrix in the form of 4 vec4s
in vec4 vs_matCol0;
in vec4 vs_matCol1;
in vec4 vs_matCol2;
in vec4 vs_matCol3;

out vec4 fs_matCol0;
out vec4 fs_matCol1;
out vec4 fs_matCol2;
out vec4 fs_matCol3;

out vec4 fs_Col;
out vec4 fs_Pos;

out float fs_Scale;

out vec4 fs_Nor;

void main()
{
    fs_Col = vs_Col;
    fs_Pos = vs_Pos;

    fs_Nor = vs_Nor;

    fs_Scale = vs_Scale;

    fs_matCol0 = vs_matCol0;
    fs_matCol1 = vs_matCol1;
    fs_matCol2 = vs_matCol2;
    fs_matCol3 = vs_matCol3;



    vec3 offset = vs_Translate;


    mat4 transformMat = mat4(vs_matCol0,
                            vs_matCol1,
                            vs_matCol2,
                            vs_matCol3);

    vec4 newPos = vec4(1.0, 1.0, 1.0, 1.0);
    newPos = vs_Pos * vs_Scale;
    newPos[1] = vs_Pos[1];
    newPos[3] = 1.0;

    newPos = vec4(vec3(transformMat * newPos) + offset, 1.0);

    gl_Position = u_ViewProj * newPos;

    //offset.z = (sin((u_Time + offset.x) * 3.14159 * 0.1) + cos((u_Time + offset.y) * 3.14159 * 0.1)) * 1.5;
    //vec3 billboardPos = offset + vs_Pos.x * u_CameraAxes[0] + vs_Pos.y * u_CameraAxes[1];
    //gl_Position = u_ViewProj * vec4(billboardPos, 1.0);
}
