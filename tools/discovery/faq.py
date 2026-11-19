import sys, os, re, json
B=sys.argv[1]; OUT=sys.argv[2]
SRC={'home':('','/'),'unwind-series':('products_unwind_series','/products/unwind-series'),'alive-series':('products_alive_series','/products/alive-series'),'projects':('projects','/projects')}
def parse(f):
    L=open(f,encoding='utf-8').read().split('\n')
    try: s=L.index('FAQ')
    except ValueError: return []
    items=[];cur=None
    for l in L[s+1:]:
        if l in('Contact Us',): break
        m=re.match(r'^##### (\d+)\.\s*(.*)',l)
        if m:
            cur={'n':int(m.group(1)),'q':m.group(2).strip(),'parts':[],'links':[]}; items.append(cur); continue
        if not cur or l.startswith('###'): continue
        lm=re.match(r'^  -> \((.*)\)$',l)
        if lm:
            if cur['parts']: cur['links'].append({'text':cur['parts'][-1].strip(),'href':lm.group(1)})
            continue
        if l.strip() in('\u200d',''): cur['parts'].append('\n\n'); continue
        cur['parts'].append(l)
    for c in items:
        t=' '.join(c.pop('parts')); t=re.sub(r'[ \t]*\n\n[ \t]*','\n\n',t); t=re.sub(r'(\n\n)+','\n\n',t); t=re.sub(r' {2,}',' ',t).strip()
        c['a']=t
    return items
out=[]
for key,(slug,path) in SRC.items():
    per={}
    for lang in('en','th'):
        fn=os.path.join(B,lang+('_'+slug if slug else '')+'.txt')
        per[lang]=parse(fn)
    n=max(len(per['en']),len(per['th']))
    for i in range(n):
        e=per['en'][i] if i<len(per['en']) else None; t=per['th'][i] if i<len(per['th']) else None
        rec={'id':f'faq-{key}-{i+1:02d}','source_page':key,
             'source_url':{'en':'https://www.clayandstone.co.th/en'+(path if path!='/' else ''),'th':'https://www.clayandstone.co.th/th'+(path if path!='/' else '')},
             'question':{'en':e['q'] if e else None,'th':t['q'] if t else None},
             'answer':{'en':e['a'] if e else None,'th':t['a'] if t else None},
             'links':{'en':e['links'] if e else [],'th':t['links'] if t else []},
             'verification_status':'extracted-unverified','notes':[]}
        if key=='alive-series':
            rec['verification_status']='source-error'
            rec['notes'].append('Alive Series page FAQ is a copy of the Unwind Series Thai FAQ (shown in Thai on the EN page too). Do not reuse for Alive until the client supplies Alive-specific answers.')
        if e and t is None or t and e is None: rec['notes'].append('Missing translation in one language.')
        out.append(rec)
json.dump(out,open(OUT,'w',encoding='utf-8'),ensure_ascii=False,indent=2)
for r in out: print(r['id'],'|',(r['question']['en'] or '')[:60],'|',(r['question']['th'] or '')[:40])
