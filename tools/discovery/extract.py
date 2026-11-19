import sys, os, re, json, html as H
from html.parser import HTMLParser
SRC=sys.argv[1]; OUT=sys.argv[2]; os.makedirs(OUT,exist_ok=True)
SKIP={'script','style','noscript','svg','template'}
BLOCK={'p','h1','h2','h3','h4','h5','h6','li','div','section','a','button','span','label','td','th','figcaption','blockquote','strong','em','summary','option','input','textarea','select'}
class P(HTMLParser):
    def __init__(s):
        super().__init__(convert_charrefs=True); s.stack=[]; s.out=[]; s.buf=''; s.skip=0; s.meta={}; s.imgs=[]; s.links=[]; s.jsonld=[]; s.inld=False; s.ld=''; s.scripts=[]; s.alts=[]; s.hreflang=[]; s.videos=[]; s.forms=[]; s.bgs=[]
        s.cur_a=None
    def flush(s):
        t=re.sub(r'\s+',' ',s.buf).strip()
        if t:
            tag=next((x for x in reversed(s.stack) if re.match(r'h[1-6]$',x)),None)
            s.out.append(('#'*int(tag[1])+' ' if tag else '')+t)
        s.buf=''
    def handle_starttag(s,t,a):
        a=dict(a)
        st=a.get('style') or ''
        m=re.search(r'url\(["\']?([^"\')]+)',st)
        if m: s.bgs.append(m.group(1))
        if t=='script':
            if a.get('type')=='application/ld+json': s.inld=True; s.ld=''
            if a.get('src'): s.scripts.append(a['src'])
        if t in SKIP: s.skip+=1; return
        if t=='html': s.meta['lang']=a.get('lang')
        if t=='meta':
            k=a.get('name') or a.get('property')
            if k: s.meta[k]=a.get('content')
        if t=='link':
            if a.get('rel')=='canonical': s.meta['canonical']=a.get('href')
            if a.get('hreflang'): s.hreflang.append((a.get('hreflang'),a.get('href')))
        if t=='img':
            s.imgs.append({'src':a.get('src'),'alt':a.get('alt'),'srcset':a.get('srcset'),'w':a.get('width'),'h':a.get('height'),'loading':a.get('loading')})
            s.flush(); s.out.append(f"[IMG alt=\"{a.get('alt') or ''}\"] {a.get('src')}")
        if t in ('video','source') and (a.get('src') or a.get('data-src')): s.videos.append(a.get('src') or a.get('data-src'))
        if a.get('data-video-urls'): s.videos.append(a.get('data-video-urls'))
        if a.get('data-poster-url'): s.videos.append('poster:'+a.get('data-poster-url'))
        if t=='iframe': s.videos.append('iframe:'+str(a.get('src'))); s.out.append('[IFRAME] '+str(a.get('src')))
        if t=='a':
            s.flush(); s.cur_a=a.get('href'); s.links.append(a.get('href'))
        if t in ('input','textarea','select'):
            s.forms.append({k:a.get(k) for k in ('type','name','placeholder','required','data-name') if a.get(k)})
            s.out.append(f"[FIELD {t} {a.get('type','')} name={a.get('name') or a.get('data-name')} ph={a.get('placeholder')}]")
        if t=='form': s.out.append(f"[FORM name={a.get('name') or a.get('data-name')} action={a.get('action')}]")
        if t in BLOCK or t=='br': s.flush()
        s.stack.append(t)
    def handle_endtag(s,t):
        if t=='script' and s.inld:
            s.inld=False; s.jsonld.append(s.ld)
        if t in SKIP: s.skip=max(0,s.skip-1); return
        if t in BLOCK: s.flush()
        if t=='a' and s.cur_a:
            s.out.append(f"  -> ({s.cur_a})"); s.cur_a=None
        while s.stack:
            x=s.stack.pop()
            if x==t: break
    def handle_data(s,d):
        if s.inld: s.ld+=d; return
        if s.skip: return
        s.buf+=d
summary={}
for f in sorted(os.listdir(SRC)):
    raw=open(os.path.join(SRC,f),encoding='utf-8').read()
    p=P(); p.feed(raw); p.flush()
    title=re.search(r'<title>(.*?)</title>',raw,re.S)
    p.meta['title']=H.unescape(title.group(1)).strip() if title else None
    # dedupe consecutive
    lines=[]
    for l in p.out:
        if not lines or lines[-1]!=l: lines.append(l)
    with open(os.path.join(OUT,f.replace('.html','.txt')),'w',encoding='utf-8') as o:
        o.write('META '+json.dumps(p.meta,ensure_ascii=False,indent=1)+'\n')
        o.write('HREFLANG '+json.dumps(p.hreflang)+'\n')
        o.write('JSONLD '+json.dumps(p.jsonld,ensure_ascii=False)[:4000]+'\n')
        o.write('VIDEOS '+json.dumps(p.videos)+'\n')
        o.write('BGS '+json.dumps(p.bgs)+'\n')
        o.write('-----\n'+'\n'.join(lines))
    summary[f]={'meta':p.meta,'hreflang':p.hreflang,'jsonld':len(p.jsonld),'imgs':p.imgs,'links':sorted(set(x for x in p.links if x)),'scripts':p.scripts,'videos':p.videos,'bgs':p.bgs,'forms':p.forms,
      'headings':[l for l in lines if l.startswith('#')]}
json.dump(summary,open(os.path.join(OUT,'_summary.json'),'w',encoding='utf-8'),ensure_ascii=False,indent=1)
