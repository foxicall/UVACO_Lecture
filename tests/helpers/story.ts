import type { Page } from 'playwright-core';
export async function followStory(page:Page,productName:string){
 await page.getByRole('button',{name:'接著，看身體怎麼了'}).click();
 await page.getByRole('button',{name:'再來，認識照顧與原料'}).click();
 await page.locator('.visual-product-bridges>button').filter({hasText:productName}).click();
}
