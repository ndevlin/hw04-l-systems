#version 300 es
precision highp float;

in vec4 fs_Col;
in vec4 fs_Pos;

in vec4 fs_Nor;

in vec4 fs_matCol0;
in vec4 fs_matCol1;
in vec4 fs_matCol2;
in vec4 fs_matCol3;

out vec4 out_Col;

void main()
{
    //float dist = 1.0 - (length(fs_Pos.xyz) * 2.0);
    //out_Col = vec4(dist) * fs_Col;

    //out_Col = fs_Col;

    out_Col = vec4(0.4588, 0.2353, 0.1333, 1.0);

    //out_Col = vec4(vec3(fs_matCol0), 1.0);
}