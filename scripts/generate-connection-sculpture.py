"""Original HyperChat connection sculpture: two shaded, interlocking solid forms.
No external imagery, gradients, fonts or runtime dependencies. Run from repo root.
"""
from math import sin, cos, pi, sqrt
from pathlib import Path

def rotate(v, ax, ay, az):
    x,y,z=v
    y,z=y*cos(ax)-z*sin(ax),y*sin(ax)+z*cos(ax)
    x,z=x*cos(ay)+z*sin(ay),-x*sin(ay)+z*cos(ay)
    return x*cos(az)-y*sin(az),x*sin(az)+y*cos(az),z

def vertex(u,v,ring,normal=False):
    n=(cos(u)*cos(v),sin(u)*cos(v),sin(v))
    p=n if normal else ((126+34*cos(v))*cos(u),(126+34*cos(v))*sin(u),34*sin(v))
    p=rotate(p,0,(-.45 if ring==0 else 1.05),0)
    if not normal: p=(p[0]+(-88 if ring==0 else 88),p[1],p[2])
    return rotate(p,.36,-.14,-.18)

faces=[]
light=(-.45,-.65,.75)
norm=sqrt(sum(n*n for n in light));light=tuple(n/norm for n in light)
for ring in range(2):
    base=(215,203,185) if ring==0 else (184,112,47)
    for i in range(112):
        for j in range(24):
            u,v=2*pi*i/112,2*pi*j/24
            points=[vertex(a,b,ring) for a,b in [(u,v),(u+2*pi/112,v),(u+2*pi/112,v+2*pi/24),(u,v+2*pi/24)]]
            normal=vertex(u+pi/112,v+pi/24,ring,True)
            diffuse=max(0,sum(a*b for a,b in zip(normal,light)))
            spec=max(0,normal[2]*.8+normal[0]*(-.25)+normal[1]*(-.35))**26
            color=tuple(min(246,round(c*(.37+.65*diffuse)+spec*52)) for c in base)
            xy=' '.join(f'{500+x*1.65:.1f},{235+y*1.2:.1f}' for x,y,z in points)
            faces.append((sum(p[2] for p in points)/4,f'<polygon points="{xy}" fill="rgb{color}" stroke="rgb{color}" stroke-width=".5"/>'))
svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="480" viewBox="0 0 1000 480"><title>HyperChat — shared connection</title>'
svg+='<defs><filter id="shadow" x="-50%" y="-100%" width="200%" height="300%"><feGaussianBlur stdDeviation="12"/></filter></defs><ellipse cx="500" cy="440" rx="235" ry="12" fill="#221f1c" opacity=".14" filter="url(#shadow)"/>'
svg+=''.join(face for _,face in sorted(faces))+'</svg>'
Path('public/sculpture/hyperchat-connection.svg').write_text(svg)
