"""Builds assets/lottie/drtim-doctor.json (2026-10-14): the lottie.host bust
   doctor uq8mJaYwjv recoloured to Dr Tim's palette (same mapping as
   drtim-coffee.build.py), glasses over the eyes, and a gold "P" (Bodoni 72 Bold
   via CoreText — see drtim-doctor-glyph.swift → drtim-doctor-p.glyph.json; the
   wordmark.svg has no P, its first glyph is the R) on a purple disc where the
   coat badge was. Run with -I from the repo root:
   python3 -I assets/lottie/drtim-doctor.build.py <src.json> assets/lottie/drtim-doctor-p.glyph.json assets/lottie/drtim-doctor.json"""
import json, re, sys
SRC, GLYPH, OUT = sys.argv[1:4]
d = json.load(open(SRC))

def hx(c): return '#%02X%02X%02X' % tuple(int(round(v*255)) for v in c[:3])
def rgb(h): return [int(h[1:3],16)/255, int(h[3:5],16)/255, int(h[5:7],16)/255, 1]

# ---- 1. recolour: head group and body group get different maps (the stethoscope
#         shares the hair's navy, so the body keeps its darks navy instead of brown)
HEAD = {'#2C3D5B':'#563C00', '#192A47':'#3B2800', '#8DC5FF':'#6D4C10',
        '#FFBEAA':'#FFD9BB', '#F5A48E':'#F4C7A6'}
BODY = {'#FFBEAA':'#FFD9BB', '#F5A48E':'#F4C7A6',
        '#8DC5FF':'#000618', '#B1DBFC':'#111733', '#59AEFC':'#1B1848',   # shirt + collar -> navy
        '#2A53C4':'#D9A21B', '#2E63E2':'#FCC25D',                       # tie -> amber
        '#2C3D5B':'#1B1848', '#192A47':'#1B1848'}                       # stethoscope / outlines
n = 0
def recolour(items, MAP):
    global n
    for s in items:
        if s.get('ty') == 'gr': recolour(s.get('it', []), MAP)
        elif s.get('ty') in ('fl', 'st'):
            c = s['c']['k']
            if isinstance(c, list) and not isinstance(c[0], dict) and hx(c) in MAP:
                s['c']['k'] = rgb(MAP[hx(c)]); n += 1
layer = d['layers'][1]
head, body = layer['shapes'][0], layer['shapes'][1]
recolour(head['it'], HEAD); recolour(body['it'], BODY)
# stethoscope ear tips: amber accent (they were the light-blue strokes)
for g in body['it'][0]['it'][0]['it']:
    for it in g.get('it', []):
        if it.get('ty') == 'st' and hx(it['c']['k']) == '#1B1848' and g['nm'] in ('Group 3', 'Group 5'):
            it['c']['k'] = rgb('#FCC25D')
print('recoloured', n)

# ---- 2. the coat badge (three concentric circles) becomes the PROfinity P on a purple disc
badge = body['it'][0]['it'][1]
circles = [g for g in badge['it'] if g.get('ty') == 'gr' and g['nm'] in ('Group 1', 'Group 2', 'Group 3')]
cx, cy = circles[0]['it'][-1]['p']['k']          # 323.6, 377.4 in badge-group space
R = 23.0
def circle(r, col, nm):
    k = 0.5523 * r
    return {"ty":"gr","nm":nm,"it":[
        {"ty":"el","nm":"E","d":1,"p":{"a":0,"k":[0,0]},"s":{"a":0,"k":[2*r,2*r]}},
        {"ty":"fl","nm":"F","c":{"a":0,"k":rgb(col)},"o":{"a":0,"k":100},"r":1},
        {"ty":"tr","o":{"a":0,"k":100},"r":{"a":0,"k":0},"p":{"a":0,"k":[cx,cy]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}]}
# P glyph from CoreText (drtim-doctor-p.glyph.json: M/L/Q/C/Z elements, y up)
els = json.load(open(GLYPH))
contours = []; cur = None
for e in els:
    op = e[0]
    if op == 'M': cur = {'v':[(e[1],-e[2])],'i':[(0,0)],'o':[(0,0)]}; contours.append(cur)
    elif op == 'L': cur['v'].append((e[1],-e[2])); cur['i'].append((0,0)); cur['o'].append((0,0))
    elif op in ('Q','C'):
        p0 = cur['v'][-1]
        if op == 'Q':
            q = (e[1],-e[2]); end = (e[3],-e[4])
            c1 = (p0[0]+2/3*(q[0]-p0[0]), p0[1]+2/3*(q[1]-p0[1])); c2 = (end[0]+2/3*(q[0]-end[0]), end[1]+2/3*(q[1]-end[1]))
        else:
            c1 = (e[1],-e[2]); c2 = (e[3],-e[4]); end = (e[5],-e[6])
        cur['o'][-1] = (c1[0]-p0[0], c1[1]-p0[1]); cur['v'].append(end); cur['i'].append((c2[0]-end[0], c2[1]-end[1])); cur['o'].append((0,0))
    elif op == 'Z':
        if len(cur['v']) > 1 and abs(cur['v'][-1][0]-cur['v'][0][0]) < 1e-6 and abs(cur['v'][-1][1]-cur['v'][0][1]) < 1e-6:
            cur['i'][0] = cur['i'][-1]; cur['v'].pop(); cur['i'].pop(); cur['o'].pop()
xs = [p[0] for c in contours for p in c['v']]; ys = [p[1] for c in contours for p in c['v']]
gx, gy, gw, gh = (min(xs)+max(xs))/2, (min(ys)+max(ys))/2, max(xs)-min(xs), max(ys)-min(ys)
k = (R * 1.25) / gh                                   # P height ≈ 62% of the disc diameter
def shp(c):
    f = lambda p: [round(cx + (p[0]-gx)*k, 2), round(cy + (p[1]-gy)*k, 2)]
    g = lambda p: [round(p[0]*k, 2), round(p[1]*k, 2)]
    return {"ty":"sh","nm":"P","ks":{"a":0,"k":{"c":True,"v":[f(p) for p in c['v']],"i":[g(p) for p in c['i']],"o":[g(p) for p in c['o']]}}}
logo = {"ty":"gr","nm":"P logo","it":[shp(c) for c in contours] + [
    {"ty":"fl","nm":"F","c":{"a":0,"k":rgb('#FCC25D')},"o":{"a":0,"k":100},"r":2},
    {"ty":"tr","o":{"a":0,"k":100},"r":{"a":0,"k":0},"p":{"a":0,"k":[0,0]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}]}
new_items = [logo, circle(R, '#292569', 'Disc'), circle(R + 2.2, '#FCC25D', 'Ring')]   # lottie draws first item on top
badge['it'] = new_items + [g for g in badge['it'] if g not in circles]
# ---- 3. glasses (user, 2026-10-14): two rounded lenses + bridge + arms, drawn
#         inside the head's bobbing eyes group so they move with the face
eyes = head['it'][1]
NAVY = rgb('#1B1848')
def stroke(w): return {"ty":"st","nm":"S","c":{"a":0,"k":NAVY},"o":{"a":0,"k":100},"w":{"a":0,"k":w},"lc":2,"lj":2}
def tr0(): return {"ty":"tr","o":{"a":0,"k":100},"r":{"a":0,"k":0},"p":{"a":0,"k":[0,0]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}
def lens(x, y): return {"ty":"gr","nm":"Lens","it":[{"ty":"rc","nm":"R","d":1,"s":{"a":0,"k":[46,34]},"p":{"a":0,"k":[x,y]},"r":{"a":0,"k":11}},
    {"ty":"fl","nm":"F","c":{"a":0,"k":[1,1,1,1]},"o":{"a":0,"k":14},"r":1}, stroke(4.2), tr0()]}
def line(pts, w): return {"ty":"gr","nm":"L","it":[{"ty":"sh","nm":"P","ks":{"a":0,"k":{"c":False,"v":pts,"i":[[0,0]]*len(pts),"o":[[0,0]]*len(pts)}}}, stroke(w), tr0()]}
ey = 194.5
glasses = {"ty":"gr","nm":"Glasses","it":[
    lens(219.96, ey), lens(290.30, ey),
    line([[243.0, ey-3], [267.3, ey-3]], 4.2),                 # bridge
    line([[196.96, ey-4], [184.0, ey-9]], 4.2),                # left arm
    line([[313.30, ey-4], [326.3, ey-9]], 4.2),                # right arm
    tr0()]}
eyes['it'].insert(0, glasses)
d['nm'] = 'drtim-doctor'
json.dump(d, open(OUT, 'w'), separators=(',', ':'))
print('wrote', OUT, 'badge at', cx, cy)
