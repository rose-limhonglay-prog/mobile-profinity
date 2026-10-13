import json, sys, copy
sys.path.insert(0, sys.argv[1])            # scratchpad pylib (fontTools)
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import DecomposingRecordingPen as RecordingPen
SRC, WAVE, FONT, OUT = sys.argv[2:6]
LX, LY, SIZE = float(sys.argv[6]), float(sys.argv[7]), float(sys.argv[8])

new = json.load(open(SRC)); wave = json.load(open(WAVE))

# ---- 1. recolour to Dr Tim's palette (same mapping the waving doctor got)
MAP = {'#4f504f':'#563c00','#4f504e':'#563c00',            # hair -> brown
       '#fdd4ba':'#ffd9bb','#fac3a5':'#ffd9bb','#fdd0b5':'#ffd9bb','#e2a383':'#f4c7a6',  # skin
       '#cee3e7':'#000618','#b5d0d6':'#000618',            # shirt -> navy
       '#7398ce':'#fcc25d','#4f76b8':'#d9a21b',            # tie -> amber
       '#515151':'#1b1848',                                # mug -> navy
       '#646464':'#292569','#514843':'#1b1848'}            # trousers / shoes
def hx(c): return '#%02x%02x%02x' % tuple(int(round(v*255)) for v in c[:3])
def rgb(h): return [int(h[1:3],16)/255, int(h[3:5],16)/255, int(h[5:7],16)/255, 1]
n=0
def recolour(shapes):
    global n
    for s in shapes:
        if s.get('ty')=='gr': recolour(s.get('it',[]))
        elif s.get('ty') in ('fl','st'):
            c=s['c']['k']
            if isinstance(c,list) and not isinstance(c[0],dict) and hx(c) in MAP:
                s['c']['k']=rgb(MAP[hx(c)]); n+=1
for l in new['layers']: recolour(l.get('shapes',[]))
print('recoloured fills:', n)

# ---- 2. glasses: identical face rig (layer 8 'f', eyes 6/7) so the layer ports verbatim
glasses = copy.deepcopy([l for l in wave['layers'] if l['nm']=='Glasses'][0])
glasses['ind']=13; glasses['op']=new['op']+1
mi = next(i for i,l in enumerate(new['layers']) if l['nm']=='m')
new['layers'].insert(mi+1, glasses)

# ---- 3. "Dr Tim Pearce" signature as vector paths on the coat (parented to the body layer)
font = TTFont(FONT); gs = font.getGlyphSet(); cmap = font.getBestCmap(); upm = font['head'].unitsPerEm
hmtx = font['hmtx']
def kern(a,b):
    return 0
def line_paths(text):
    """returns list of lottie 'sh' shapes (font units, y up) + advance width"""
    pen_paths=[]; x=0
    for ch in text:
        g = cmap.get(ord(ch))
        if g is None: x += upm*0.25; continue
        rp = RecordingPen(gs); gs[g].draw(rp)
        cur=None; contours=[]; last=None
        for op, pts in rp.value:
            if op=='moveTo': cur=[('m',pts[0])]; contours.append(cur); last=pts[0]
            elif op=='lineTo': cur.append(('l',pts[0])); last=pts[0]
            elif op=='qCurveTo':
                # TrueType: implied on-curve points between consecutive off-curve points
                pts=list(pts)
                if pts[-1] is None: pts[-1]=pts[0]
                start = last
                offs=pts[:-1]; end=pts[-1]
                # expand implied midpoints
                seq=[]
                for i,o in enumerate(offs):
                    if i<len(offs)-1:
                        nxt=offs[i+1]; mid=((o[0]+nxt[0])/2,(o[1]+nxt[1])/2); seq.append((o,mid))
                    else: seq.append((o,end))
                p0=start
                for o,e in seq:
                    # quadratic -> cubic
                    c1=(p0[0]+2/3*(o[0]-p0[0]), p0[1]+2/3*(o[1]-p0[1]))
                    c2=(e[0]+2/3*(o[0]-e[0]), e[1]+2/3*(o[1]-e[1]))
                    cur.append(('c',(c1,c2,e))); p0=e
                last=end
            elif op=='curveTo': cur.append(('c',pts)); last=pts[-1]
            elif op=='closePath' or op=='endPath': pass
        for c in contours:
            # build lottie bezier: v = vertices, i = in tangents, o = out tangents (relative)
            v=[]; i_=[]; o_=[]
            # first point
            v.append(c[0][1]); i_.append((0,0)); o_.append((0,0))
            for op,pts in c[1:]:
                if op=='l':
                    v.append(pts); i_.append((0,0)); o_.append((0,0))
                else:
                    c1,c2,e=pts
                    o_[-1]=(c1[0]-v[-1][0], c1[1]-v[-1][1])
                    v.append(e); i_.append((c2[0]-e[0], c2[1]-e[1])); o_.append((0,0))
            # drop duplicated closing vertex
            if len(v)>1 and abs(v[-1][0]-v[0][0])<1e-6 and abs(v[-1][1]-v[0][1])<1e-6:
                i_[0]=i_[-1]; v.pop(); i_.pop(); o_.pop()
            pen_paths.append((x, v, i_, o_))
        x += hmtx[g][0]
    return pen_paths, x
def to_shape(paths, width, dx, dy, k):
    out=[]
    for x0,v,i_,o_ in paths:
        f=lambda p,ox=0: [round(dx+(p[0]+ox)*k,2), round(dy-(p[1])*k,2)]
        g=lambda p: [round(p[0]*k,2), round(-p[1]*k,2)]
        out.append({"ty":"sh","nm":"P","ks":{"a":0,"k":{"c":True,"v":[f(p,x0-width/2) for p in v],"i":[g(p) for p in i_],"o":[g(p) for p in o_]}}})
    return out
k = SIZE/upm
l1,w1 = line_paths("Dr Tim"); l2,w2 = line_paths("Pearce")
shapes = to_shape(l1,w1,LX,LY,k) + to_shape(l2,w2,LX,LY+SIZE*0.78,k)
shapes.append({"ty":"fl","nm":"F","c":{"a":0,"k":rgb('#000618')},"o":{"a":0,"k":100},"r":1})
shapes.append({"ty":"tr","o":{"a":0,"k":100},"r":{"a":0,"k":-6},"p":{"a":0,"k":[LX,LY]},"a":{"a":0,"k":[LX,LY]},"s":{"a":0,"k":[100,100]},"nm":"T","sk":{"a":0,"k":0},"sa":{"a":0,"k":0}})
logo={"ddd":0,"ind":14,"ty":4,"nm":"Logo","parent":9,"sr":1,
      "ks":{"o":{"a":0,"k":100},"r":{"a":0,"k":0},"p":{"a":0,"k":[0,0,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":0,"k":[100,100,100]}},
      "ao":0,"shapes":[{"ty":"gr","nm":"Sig","it":shapes}],"ip":0,"op":new['op']+1,"st":0,"bm":0}
# draw above the body (9) but below arms/hands (1-4) and face: insert just before the body layer
bi = next(i for i,l in enumerate(new['layers']) if l['ind']==9)
new['layers'].insert(bi, logo)
new['nm']='drtim-coffee'
json.dump(new, open(OUT,'w'), separators=(',',':'))
print('wrote', OUT, 'layers', [l['nm'] for l in new['layers']])
