import asyncio, json, os
from playwright.async_api import async_playwright

async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True)
  context=await browser.new_context(viewport={"width":1280,"height":1800})
  page=await context.new_page()
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  await page.goto('http://localhost:8080/academy')
  await page.get_by_role('button',name='View Course',exact=True).first.wait_for(timeout=30000)
  assert await page.locator('iframe').count()==0, 'Catalog must not embed videos'
  await page.get_by_role('button',name='View Course',exact=True).first.click()
  await page.get_by_text('Course Content Locked',exact=True).wait_for()
  assert await page.locator('iframe').count()==0, 'Guest must not receive a player'
  course_id=page.url.rsplit('/',1)[-1]
  async def query(script):
   return await page.evaluate('async (args) => { const {supabase} = await import("/src/integrations/supabase/client.ts"); '+script+' }', {'id':course_id})
  guest=await query('const a=await supabase.from("courses").select("video_preview_url").eq("id",args.id); const b=await supabase.from("videos").select("id,source_url"); const c=await supabase.rpc("get_course_video",{_course_id:args.id}); return {sourceDenied:!!a.error,videos:b.data?.length,playDenied:!!c.error};')
  assert guest['sourceDenied'] and guest['videos']==0 and guest['playDenied'],guest
  await page.screenshot(path='/tmp/browser/academy-access/guest-locked.png')
  print('PASS: guest playback and direct source requests denied')
  if os.environ.get('LOVABLE_BROWSER_AUTH_STATUS')=='injected':
   key=os.environ.get('LOVABLE_BROWSER_SUPABASE_STORAGE_KEY')
   session=os.environ.get('LOVABLE_BROWSER_SUPABASE_SESSION_JSON')
   if key and session:
    await page.evaluate('(args)=>localStorage.setItem(args.key,args.session)',{'key':key,'session':session})
    await page.reload()
    await page.locator('iframe').wait_for(timeout=30000)
    signed=await query('const a=await supabase.from("courses").select("video_preview_url").eq("id",args.id); const b=await supabase.rpc("get_course_video",{_course_id:args.id}); const c=await supabase.rpc("redeem_course_access_code",{_course_id:args.id,_access_code:"INVALID-TEST-CODE-000"}); return {directDenied:!!a.error,playAllowed:!!b.data&&!b.error,invalidDenied:!!c.error};')
    assert signed['directDenied'] and signed['playAllowed'] and signed['invalidDenied'],signed
    print('PASS: signed-in authorized playback; invalid course code rejected')
  await page.goto('http://localhost:8080/')
  assert await page.locator('iframe').count()==0
  await page.goto('http://localhost:8080/courses-preview')
  await page.wait_for_url('**/academy')
  assert not errors,errors
  print('PASS: homepage has no course embeds; legacy previews lead to Academy; no runtime errors')
  await browser.close()
asyncio.run(main())
