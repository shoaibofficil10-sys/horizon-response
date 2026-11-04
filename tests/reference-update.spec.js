import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Horizon content keeps the reference identity and unsupported claims out of the site',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await expect(page.locator('.intro-copy>p')).toHaveCount(4);
 await expect(page.locator('.intro-copy')).toContainText('Horizon Response Services');
 await expect(page.locator('.intro-copy strong')).toHaveCount(4);
 await expect(page.locator('body')).not.toContainText('Legion');
 await expect(page.locator('body')).not.toContainText('Decades of Experience');
 await expect(page.locator('a[href*="legionsecurity"]')).toHaveCount(0);
 await expect(page.locator('.hero-actions a').first()).toHaveAttribute('href','#contact');
});

test('advantage uses the existing accordion design and keyboard controls',async({page})=>{
 await page.goto('/');const items=page.locator('.horizon-advantage details');
 await expect(items).toHaveCount(7);
 await items.nth(0).locator('summary').click();await expect(items.nth(0)).toHaveAttribute('open','');
 await items.nth(1).locator('summary').focus();await page.keyboard.press('Enter');
 await expect(items.nth(1)).toHaveAttribute('open','');
 await expect(items.nth(0)).not.toHaveAttribute('open','');
 await page.keyboard.press('Space');await expect(items.nth(1)).not.toHaveAttribute('open','');
});

test('quote popup validates inline, traps focus and downloads the selected request honestly',async({page})=>{
 const posts=[];page.on('request',request=>{if(request.method()==='POST')posts.push(request.url())});
 await page.goto('/');await page.locator('#service-campus .quote-trigger').click();
 await expect(page.locator('#quote-service')).toHaveValue('Campus Security');
 await expect(page.locator('body')).toHaveClass(/modal-open/);
 await page.getByRole('button',{name:'Request Quote',exact:true}).click();
 await expect(page.locator('#quote-name-error')).toContainText('full name');
 await expect(page.locator('#quote-name')).toBeFocused();
 await page.locator('#quote-name').fill('Jamie Quote');await page.locator('#quote-email').fill('invalid');await page.locator('#quote-phone').fill('123');
 await page.getByRole('button',{name:'Request Quote',exact:true}).click();
 await expect(page.locator('#quote-email-error')).toContainText('valid email');
 await expect(page.locator('#quote-phone-error')).toContainText('7 digits');
 await page.locator('#quote-email').fill('jamie@example.com');await page.locator('#quote-phone').fill('0400 123 456');
 await page.locator('#quote-location').fill('Brisbane');await page.locator('#quote-message').fill('Campus visitor guidance during an evening event.');
 await page.getByRole('button',{name:'Request Quote',exact:true}).click();
 await expect(page.locator('#quote-result')).toBeVisible();await expect(page.locator('#quote-result')).toContainText('No enquiry has been sent');
 const event=page.waitForEvent('download');await page.getByRole('button',{name:'Download request'}).click();const download=await event;
 const stream=await download.createReadStream();let content='';for await(const part of stream)content+=part.toString();
 expect(content).toContain('Campus Security');expect(content).toContain('Jamie Quote');expect(content).toContain('0400 123 456');
 expect(posts).toEqual([]);
 await page.keyboard.press('Escape');await expect(page.locator('#quote-dialog')).not.toBeVisible();
 await page.locator('#service-alarm .quote-trigger').click();await page.mouse.click(3,3);await expect(page.locator('#quote-dialog')).not.toBeVisible();
});

test('reference sections and quote modal remain responsive and accessible',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [320,390,768,1024,1440]){
  await page.setViewportSize({width,height:1000});await page.goto('/');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:1000});await page.goto('/');
  let result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  await page.locator('#service-static .quote-trigger').click();
  result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
 }
});
