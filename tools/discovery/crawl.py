import sys, os, re, json, time, hashlib, urllib.request, urllib.parse
from html.parser import HTMLParser
OUT = sys.argv[1]
os.makedirs(os.path.join(OUT,'html'), exist_ok=True)
BASE='https://www.clayandstone.co.th'
UA='Mozilla/5.0 (compatible; site-audit-prototype/1.0)'
def fetch(u):
    req=urllib.request.Request(u,headers={'User-Agent':UA,'Accept-Language':'th,en'})
    try:
        with urllib.request.urlopen(req,timeout=30) as r:
            return r.status, r.geturl(), r.read().decode('utf-8','replace')
    except urllib.error.HTTPError as e:
        return e.code, u, ''
    except Exception as e:
        return -1, u, str(e)
sm=open(os.path.join(OUT,'sitemap.xml'),encoding='utf-8').read()
seeds=re.findall(r'<loc>([^<]+)</loc>',sm)
queue=list(seeds); seen=set(); results={}
def norm(href, cur):
    u=urllib.parse.urljoin(cur, href)
    p=urllib.parse.urlparse(u)
    if p.netloc not in ('www.clayandstone.co.th','clayandstone.co.th'): return None
    if p.scheme not in ('http','https'): return None
    path=p.path.rstrip('/') or '/'
    if re.search(r'\.(jpg|jpeg|png|webp|svg|gif|pdf|mp4|css|js|avif)$',path,re.I): return None
    return BASE+path
while queue:
    u=queue.pop(0)
    if u in seen: continue
    seen.add(u)
    st,final,html=fetch(u)
    fn=re.sub(r'[^a-zA-Z0-9]+','_',urllib.parse.urlparse(u).path.strip('/')) or 'root'
    if html and st==200:
        open(os.path.join(OUT,'html',fn+'.html'),'w',encoding='utf-8').write(html)
    links=set()
    for h in re.findall(r'href="([^"#]+)',html):
        n=norm(h,u)
        if n: links.add(n)
    results[u]={'status':st,'final':final,'file':fn+'.html','links':sorted(links),'in_sitemap':u in seeds}
    for l in links:
        if l not in seen and l not in queue and len(seen)+len(queue)<400: queue.append(l)
    time.sleep(0.4)
    print(st,u,len(links),flush=True)
json.dump(results,open(os.path.join(OUT,'crawl.json'),'w',encoding='utf-8'),indent=1,ensure_ascii=False)
