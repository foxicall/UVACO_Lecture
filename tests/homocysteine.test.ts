import test from 'node:test';
import assert from 'node:assert/strict';
import {homocysteineNodes,homocysteineModes,vascularStages,homocysteineBenefits,homocysteineTests,homocysteineCofactors,homocysteineSources} from '../src/data/homocysteine';
import {products,productById} from '../src/data/uvaco-products';
import policy from '../scripts/source-redaction-policy.json';

test('homocysteine diagram keeps independent reaction stations and complete GSH synthesis',()=>{
 const nodes=new Map(homocysteineNodes.map(node=>[node.id,node]));
 assert.equal(nodes.size,homocysteineNodes.length);
 assert.deepEqual([...nodes.keys()].sort(),['methionine','sam','sah','hcy','folate','betaine','cystathionine','cysteine','gsh'].sort());
 for(const node of nodes.values())assert.ok(node.label&&node.summary.length>10&&node.detail.length>35,node.id);
 assert.match(nodes.get('folate')!.cofactor!,/5-MTHF/);assert.match(nodes.get('folate')!.cofactor!,/B12/);assert.match(nodes.get('folate')!.cofactor!,/MTR/);
 assert.match(nodes.get('betaine')!.cofactor!,/BHMT/);assert.match(nodes.get('betaine')!.detail,/肝.*腎/);
 assert.match(nodes.get('sah')!.cofactor!,/⇄/,'SAH hydrolysis is reversible');
 assert.match(nodes.get('cystathionine')!.cofactor!,/CBS/);assert.match(nodes.get('cystathionine')!.detail,/不可逆/);
 assert.match(nodes.get('cysteine')!.cofactor!,/CSE/);assert.match(nodes.get('cysteine')!.cofactor!,/B6/);
 for(const substrate of ['麩胺酸','甘胺酸','ATP'])assert.ok(nodes.get('gsh')!.cofactor!.includes(substrate),`GSH synthesis needs ${substrate}`);
 assert.deepEqual(Object.keys(homocysteineModes).sort(),['blocked','recycling']);
 assert.match(homocysteineModes.blocked.summary,/SAH/);assert.match(homocysteineModes.recycling.summary,/甜菜鹼/);
});

test('all nine requested ingredient links are valid, while teaching copy is product-free and anonymous',()=>{
 const cards=[...homocysteineNodes,...vascularStages,...homocysteineBenefits];
 const linked=new Set<string>();
 for(const card of cards){assert.equal(new Set(card.productIds).size,card.productIds.length);for(const id of card.productIds){assert.ok(productById.has(id),`${card.id}: unknown product ${id}`);linked.add(id);}}
 assert.deepEqual([...linked].sort(),['995','360','antrodia','dikang','huoyi','kangyue','kangbei','antrodia-drops','lisheng'].sort());
 const prose=JSON.stringify([cards.map(({productIds,...card})=>card),homocysteineModes,homocysteineTests,homocysteineCofactors,homocysteineSources]);
 for(const product of products)assert.ok(!prose.includes(product.name),`Early diagram prose contains ${product.name}`);
 for(const token of [...policy.names,...policy.phrases])assert.ok(!prose.toLowerCase().includes(token.toLowerCase()),`External attribution: ${token}`);
 assert.equal(vascularStages.length,4);assert.equal(homocysteineBenefits.length,5);
 assert.equal(new Set(cards.map(card=>card.id)).size,cards.length,'Section IDs must be unambiguous');
});

test('clinical drawer retains test interpretation and traceable scientific sources',()=>{
 for(const term of ['同半胱胺酸','SAM','甲硫胺酸','MMA','葉酸','B6','鋅','全血組織胺','腎功能'])assert.ok(homocysteineTests.some(item=>item.name.includes(term)),`Missing assessment item ${term}`);
 assert.ok(homocysteineTests.every(item=>item.detail.length>30));assert.equal(homocysteineCofactors.length,5);
 assert.equal(new Set(homocysteineSources.map(source=>source.url)).size,homocysteineSources.length);
 for(const source of homocysteineSources){assert.equal(new URL(source.url).protocol,'https:');assert.ok(source.label.length>5);}
 const hcy=homocysteineTests.find(item=>item.name.includes('同半胱胺酸'))!;
 assert.match(hcy.detail,/參考區間/);assert.match(hcy.detail,/腎功能/);
 assert.ok(!/6\.8\s*[–—-]\s*12\.0/.test(hcy.detail),'A single ideal range must not be presented as universal');
});
