import test from 'node:test';
import assert from 'node:assert/strict';
import {anonymizeSourceText,anonymizeData,anonymizeGrounding,hasExternalAttribution} from '../src/lib/public-copy';
import policy from '../scripts/source-redaction-policy.json';

test('all excluded credits and spaced names are removed without relabelling the source as the host',()=>{
 for(const name of policy.names){
  for(const text of [name,[...name].join(' '),[...name].join('　')]){
   assert.ok(hasExternalAttribution(text));
   const value=anonymizeSourceText(`來源：${text}。甲基化與腸腦軸。`);
   assert.equal(hasExternalAttribution(value),false);
   assert.ok(value.includes('甲基化與腸腦軸'));
   assert.ok(!value.includes('林煒'));
  }
 }
 const source=`# 科學圖解\n- 主講人/來源：${policy.names[1]} 醫師（Daniel Wang）\n## 肝臟代謝\nUGT 結合反應`;
 const result=anonymizeSourceText(source);
 assert.equal(result.split('\n').length,source.split('\n').length);
 assert.ok(!result.includes('Daniel Wang'));
 assert.ok(result.includes('UGT 結合反應'));
 assert.equal(anonymizeSourceText('林煒醫師 精準營養導覽'),'林煒醫師 精準營養導覽');
 assert.equal(anonymizeSourceText('Redox resilience 氧化還原韌性'),'Redox resilience 氧化還原韌性');
});

test('anonymous AI objects retain valid actions and citation URLs without provider biography HTML',()=>{
 const original={sentences:[`${policy.names[0]}的來源提到細胞代謝。`],targetProductIds:['995'],nested:{value:3,active:true}};
 const clean=anonymizeData(original);
 assert.equal(hasExternalAttribution(JSON.stringify(clean)),false);
 assert.deepEqual(clean.targetProductIds,original.targetProductIds);
 assert.deepEqual(clean.nested,original.nested);
 assert.ok(original.sentences[0].includes(policy.names[0]));
 const url='https://pubmed.ncbi.nlm.nih.gov/12345/';
 const source=anonymizeGrounding({citations:[{title:`${policy.names[0]}：代謝研究`,url},{title:'人物頁',url:`https://example.com/${encodeURIComponent(policy.names[0])}`}],queries:[`${policy.names[0]} 甲基化`],searchEntryHtml:`<p>${policy.names[0]}</p>`,searched:true});
 assert.equal(source.citations.length,1);
 assert.equal(source.citations[0].url,url);
 assert.equal(source.searchEntryHtml,'');
 assert.equal(hasExternalAttribution(JSON.stringify(source)),false);
});
