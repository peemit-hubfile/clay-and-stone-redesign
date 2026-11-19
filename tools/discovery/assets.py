import sys, os, re, json, urllib.request, urllib.parse, hashlib
from PIL import Image
CRAWL=sys.argv[1]; PROJ=sys.argv[2]
S=json.load(open(os.path.join(CRAWL,'text','_summary.json'),encoding='utf-8'))
BASE='https://www.clayandstone.co.th/'
def page_url(f):
    p=f.replace('.html','')
    m={'en':'en','th':'th'}
    parts=p.split('_',1)
    lang=parts[0]; rest=parts[1] if len(parts)>1 else ''
    path={'about_us':'about-us','good_to_know':'good-to-know','contact_us':'contact-us','products_unwind_series':'products/unwind-series','products_alive_series':'products/alive-series','products_upcoming_product':'products/upcoming-product'}.get(rest)
    if path is None:
        if rest.startswith('blogs_'): path='blogs/'+rest[6:].replace('_','-')
        else: path=rest
    return BASE+lang+('/'+path if path else '')
# context from text dumps
ctx={}
for f in os.listdir(os.path.join(CRAWL,'text')):
    if not f.endswith('.txt'): continue
    lines=open(os.path.join(CRAWL,'text',f),encoding='utf-8').read().split('\n')
    lasth=''
    for i,l in enumerate(lines):
        if l.startswith('#'): lasth=l.lstrip('# ').strip()
        m=re.match(r'\[IMG alt="(.*?)"\] (\S+)',l)
        if m:
            nxt=''
            for k in range(i+1,min(i+4,len(lines))):
                if lines[k].startswith('#') or (lines[k] and not lines[k].startswith('[') and not lines[k].startswith('  ->')):
                    nxt=lines[k].lstrip('# ').strip()[:80]; break
            ctx.setdefault(m.group(2),[]).append((f,lasth[:80],nxt))
assets={}
def add(u,f,alt,kind='image'):
    if not u or not u.startswith('http'): return
    a=assets.setdefault(u,{'original_url':u,'pages':set(),'alt_texts':set(),'type':kind})
    a['pages'].add(page_url(f))
    if alt and alt.strip() and alt!='__wf_reserved_inherit': a['alt_texts'].add(alt.strip())
for f,v in S.items():
    for i in v['imgs']: add(i['src'],f,i['alt'])
    for b in v['bgs']: add(b,f,None)
    if v['meta'].get('og:image'): add(v['meta']['og:image'],f,None,'og-image')
def category(name,u,pages):
    n=name.lower()
    if 'webflow' in u and ('6022af993a6b2191db3ed10c' in u or 'plugins' in u): return 'ui-webflow'
    if 'icon' in n: return 'icons'
    if 'team-img' in n: return 'team'
    if 'mask group' in urllib.parse.unquote(n) or 'screenshot' in n: return 'testimonials'
    if 'line oa' in urllib.parse.unquote(n): return 'author'
    if '6a09582bef83c88724230a19' in u: return 'blog'
    if 'process' in n: return 'process'
    if 'homepage-img' in n or 'video_poster' in n: return 'home'
    if n.startswith('bi-img') or re.search(r'_bi-img',n): return 'series-identity'
    if 'alive' in n or any('alive' in p for p in pages) and not any('unwind' in p or 'projects' in p for p in pages): return 'alive'
    if re.search(r'(standard|loft|1bed|bed%202|bed 2|_0\d\.webp)',n) or any('projects' in p for p in pages): return 'projects'
    if 'unwind' in n or 'frame' in n: return 'unwind'
    return 'misc'
out=[]; root=os.path.join(PROJ,'public','images','source')
for idx,(u,a) in enumerate(sorted(assets.items())):
    fname=urllib.parse.unquote(u.split('/')[-1].split('%2F')[-1])
    fname=re.sub(r'[^A-Za-z0-9._-]+','-',fname).strip('-') or 'asset'
    if re.fullmatch(r'[0-9a-f]{24}_?-?\.?\w*',fname) or len(fname)<30 and '_' in fname and fname.split('_',1)[1].startswith('-'):
        pass
    cat=category(fname,u,a['pages'])
    # keep webflow id prefix for uniqueness
    local=os.path.join(root,cat,fname)
    os.makedirs(os.path.dirname(local),exist_ok=True)
    rec={'id':f'asset-{idx+1:03d}','original_url':u,'local_path':'/'+os.path.relpath(local,PROJ).replace(os.sep,'/'),'category':cat,
         'pages':sorted(a['pages']),'alt_text_original':sorted(a['alt_texts']) or None,
         'context':sorted(set((c[1],c[2]) for c in ctx.get(u,[])))[:3],'rights_status':'unverified - client approval required'}
    try:
        if not os.path.exists(local):
            req=urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0 (compatible; site-audit-prototype/1.0)'})
            with urllib.request.urlopen(req,timeout=60) as r: open(local,'wb').write(r.read())
        rec['bytes']=os.path.getsize(local)
        try:
            with Image.open(local) as im: rec['width'],rec['height']=im.size; rec['format']=im.format
        except Exception: rec['format']=fname.rsplit('.',1)[-1]
        rec['download']='ok'
    except Exception as e:
        rec['download']='failed: '+str(e)[:80]
    out.append(rec); print(rec['id'],cat,rec.get('download'),rec.get('width'),rec.get('height'),fname[:50],flush=True)
json.dump(out,open(os.path.join(CRAWL,'assets.json'),'w',encoding='utf-8'),ensure_ascii=False,indent=1)
