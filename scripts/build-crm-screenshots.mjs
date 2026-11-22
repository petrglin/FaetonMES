/* Rebuild presentation UI screens in the approved store-efficiency dashboard style.
   Source data and original product imagery remain separate from these demo UI assets. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '../public/crm/easyorder/styled');
const ROOT = path.join(__dirname, '../');
const W = 1600, H = 1000;
// Bank of Russia official USD rate effective 2026-11-06, fixed for these demo assets.
const RUB_PER_USD = 81.7947;
const rubles = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const rub = usd => rubles.format(Number(usd.replaceAll(' ', '').replace(',', '.')) * RUB_PER_USD);
const rubWithSymbol = usd => rub(usd) + ' ₽';

function calendarCells(year, month) {
  const firstDay = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return Array.from({length: Math.ceil((firstDay + days) / 7) * 7}, (_, index) => {
    const day = index - firstDay + 1;
    return { day, value: new Date(Date.UTC(year, month - 1, day)).getUTCDate(), muted: day < 1 || day > days };
  });
}
const C = {blue:'#0059bd',navy:'#153655',text:'#203146',muted:'#65788d',line:'#dce5ee',light:'#edf4fd',bg:'#f3f6fa',green:'#15834b',greenBg:'#e8f5ed',amber:'#a56b16',amberBg:'#fff5df'};
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const rect = (x,y,w,h,fill='white',stroke='none',r=10) => '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+r+'" fill="'+fill+'" stroke="'+stroke+'"/>';
const txt = (x,y,s,size=16,color=C.text,weight=400,anchor='start') => '<text x="'+x+'" y="'+y+'" font-size="'+size+'" font-weight="'+weight+'" fill="'+color+'" text-anchor="'+anchor+'">'+esc(s)+'</text>';
const line = (x1,y1,x2,y2,color=C.line,width=1) => '<path d="M'+x1+' '+y1+' L'+x2+' '+y2+'" stroke="'+color+'" stroke-width="'+width+'" fill="none"/>';
function measure(s,size) { return Array.from(String(s)).reduce((n,c)=> n + size * (/[ilI1.,:;!'| ]/.test(c) ? .28 : /[MWШЩЖЮФ@]/.test(c) ? .84 : /[A-ZА-Я0-9]/.test(c) ? .63 : .55),0); }
function wrapLines(s,width,size) {
  const result=[]; let current='';
  for (const word of String(s).split(/\s+/)) {
    const candidate=current ? current+' '+word : word;
    if (current && measure(candidate,size)>width) {result.push(current);current=word;} else current=candidate;
  }
  if(current) result.push(current);
  return result;
}
function wrap(x,y,s,width,size=16,lh=23,color=C.text,weight=400,max=8) {
  const lines=wrapLines(s,width,size);
  return lines.slice(0,max).map((s,i)=>txt(x,y+i*lh,i===max-1&&lines.length>max?s+'…':s,size,color,weight)).join('');
}
const tag = (x,y,w,s,color=C.blue,fill=C.light) => rect(x,y,w,28,fill,'none',6)+txt(x+11,y+19,s,12,color,500);
const button = (x,y,w,s,primary=false) => rect(x,y,w,36,primary?C.blue:'white',primary?'none':C.line,6)+txt(x+w/2,y+23,s,13,primary?'white':C.blue,500,'middle');
const panel = (x,y,w,h,title) => rect(x,y,w,h,'white',C.line,12)+(title?txt(x+20,y+37,title,20,C.navy,500):'');
function icon(x,y,kind='box') {
  const p=kind==='people'?'M4 17v-2c0-3 12-3 12 0v2 M13 6a3 3 0 1 1-6 0a3 3 0 1 1 6 0':
    kind==='calendar'?'M3 5h14v12H3z M6 2v5 M14 2v5 M3 9h14':
    kind==='chart'?'M3 17h14 M5 14V9 M10 14V4 M15 14V7':
    kind==='chat'?'M3 3h14v10H9l-4 4v-4H3z':
    kind==='file'?'M5 2h8l4 4v12H5z M12 2v5h5 M8 11h6 M8 14h6':
    'M3 5h14v12H3z M3 9h14 M7 5V3';
  return '<g transform="translate('+x+' '+y+')" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"><path d="'+p+'"/></g>';
}
const menu=[['Рабочий стол','chart'],['Клиенты','people'],['Заказы','box'],['Замеры','calendar'],['Календарь','calendar'],['Общение','chat'],['Структура сбыта','people'],['Аналитика','chart'],['Управление','file']];
function shell(title,active='Заказы',subtitle='',sideExtra='') {
  let s=rect(0,0,W,H,C.bg,'none',0)+rect(0,0,W,60,C.navy,'none',0)+txt(24,39,'EasyOrder CRM',23,'white',500);
  [['Рабочий стол',270,132],['Клиенты',416,96],['Заказы',526,82],['Аналитика',622,114]].forEach(([label,x,w])=>{
    const selected=label===active;
    if(selected)s+=rect(x-10,14,w,32,'#2b5075','none',6);
    s+=txt(x,36,label,14,selected?'white':'#c6d5e5',selected?500:400);
  });
  s+=txt(1548,36,'АШ',14,'white',500,'end')+rect(1557,21,8,8,'#6fc799','none',4);
  s+=txt(24,109,title,28,C.navy,400);
  if(subtitle)s+=txt(26,133,subtitle,12,C.muted);
  s+=panel(20,152,220,824,'Рабочее место');
  menu.forEach(([label,kind],i)=>{
    const y=202+i*45,selected=label===active;
    if(selected)s+=rect(34,y-4,192,37,C.light,'none',7)+rect(34,y-4,3,37,C.blue,'none',1);
    s+='<g color="'+(selected?C.blue:C.muted)+'">'+icon(46,y+4,kind)+'</g>'+txt(77,y+21,label,14,selected?C.blue:C.text,selected?500:400);
  });
  s+=line(40,646,220,646)+txt(40,677,'Алексей Шмаков',15,C.navy,500)+txt(40,701,'Менеджер',12,C.muted)+sideExtra;
  s+=txt(40,949,'EasyOrder CRM',12,C.muted);
  return s;
}
function tabs(x,y,labels,selected=0) {
  let s='',cursor=x;
  labels.forEach((label,i)=>{
    const width=measure(label,14)+28;
    s+=txt(cursor+10,y+23,label,14,i===selected?C.blue:C.muted,i===selected?500:400);
    if(i===selected)s+=line(cursor+8,y+34,cursor+width-8,y+34,C.blue,2);
    cursor+=width+5;
  });
  return s;
}
function field(x,y,w,label,value,options={}) {
  return txt(x,y,label,13,C.muted)+rect(x,y+12,w,48,options.fill||'white',C.line,6)+txt(x+14,y+42,value,16,options.placeholder?C.muted:C.text)+(options.select?txt(x+w-18,y+41,'⌄',16,C.muted,'400','middle'):'');
}
function metric(x,y,w,label,value,color=C.blue) {
  return rect(x,y,w,99,'#f6f9fd','none',8)+txt(x+16,y+27,label,13,C.muted)+txt(x+16,y+72,value,29,color,500);
}
function table(x,y,cols,rows,{rowHeight=56,headHeight=58,font=15,highlight=-1,total=-1}={}) {
  const width=cols.reduce((n,c)=>n+c.width,0);
  let s=rect(x,y,width,headHeight,C.bg,'none',5),cx=x;
  cols.forEach(c=>{s+=wrap(cx+12,y+22,c.label,c.width-24,12,16,C.muted,500,2);cx+=c.width;});
  rows.forEach((row,i)=>{
    const top=y+headHeight+i*rowHeight;
    s+=rect(x,top,width,rowHeight,i===highlight||i===total?C.light:'white','none',0)+line(x,top+rowHeight,x+width,top+rowHeight);
    cx=x;
    row.forEach((cell,j)=>{
      const c=cols[j],data=typeof cell==='object'?cell:{label:cell};
      const indent=data.indent||0;
      const content=wrapLines(data.label,c.width-24-indent,font);
      const lines=content.slice(0,2);
      if(c.align==='right')s+=txt(cx+c.width-14,top+rowHeight/2+font*.34,data.label,font,data.color||C.text,i===total?500:400,'end');
      else lines.forEach((v,k)=>s+=txt(cx+12+indent,top+rowHeight/2+font*.34+(k-(lines.length-1)/2)*(font+4),v,font,data.color||C.text,i===total?500:data.weight||400));
      cx+=c.width;
    });
  });
  return s;
}
function graph(x,y,w,h,series,labels,max) {
  const left=x+44,right=x+w-20,top=y+20,bottom=y+h-36;
  let s='';
  for(let i=0;i<=4;i++){const yy=bottom-(bottom-top)*i/4;s+=line(left,yy,right,yy)+txt(left-10,yy+4,String(Number.isInteger(max*i/4) ? max*i/4 : (max*i/4).toFixed(1).replace('.',',')),11,C.muted,400,'end');}
  labels.forEach((l,i)=>s+=txt(left+(right-left)*i/(labels.length-1),bottom+22,l,11,C.muted,400,'middle'));
  series.forEach(({values,color,fill})=>{
    const points=values.map((v,i)=>[left+(right-left)*i/(values.length-1),bottom-(bottom-top)*v/max]);
    if(fill)s+='<path d="M'+points[0][0]+' '+bottom+' L'+points.map(p=>p.join(' ')).join(' L')+' L'+points.at(-1)[0]+' '+bottom+' Z" fill="'+color+'" opacity=".1"/>';
    s+='<path d="M'+points.map(p=>p.join(' ')).join(' L')+'" fill="none" stroke="'+color+'" stroke-width="2.5" stroke-linejoin="round"/>';
    points.forEach(([px,py])=>s+='<circle cx="'+px+'" cy="'+py+'" r="3.5" fill="white" stroke="'+color+'" stroke-width="2"/>');
  });
  return s;
}
function image(x,y,w,h,data) {return '<image x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" href="'+data+'" preserveAspectRatio="xMidYMid meet"/>';}
function doc(body) {return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'"><g font-family="Bahnschrift, Arial, sans-serif">'+body+'</g></svg>';}
const screens={};
screens.dashboard=()=>{
  let s=shell('Рабочий стол','Рабочий стол','Статистика, задачи и состояние рабочей среды');
  s+=metric(260,152,315,'Оборот за период',rubWithSymbol('60 558,58'))+metric(595,152,315,'Продажи · июль 2026','3',C.green)+metric(930,152,315,'Просчёты · июль 2026','4')+metric(1265,152,315,'Рекламации · июль 2026','1',C.amber);
  s+=panel(260,271,800,400,'Общая статистика · МебельСити 1')+tag(836,290,204,'Январь — июль 2026');
  s+=graph(280,337,756,258,[{values:[5,5,6,5,9,5,4],color:C.blue},{values:[3,2,6,4,7,4,3],color:C.green},{values:[0,0,1,0,0,1,1],color:'#c58b30'}],['Янв','Фев','Мар','Апр','Май','Июн','Июл'],10);
  [['Просчёты',C.blue],['Продажи',C.green],['Рекламации','#c58b30']].forEach(([label,color],i)=>{const x=296+i*220;s+=line(x,636,x+18,636,color,3)+txt(x+27,641,label,13,C.muted);});
  s+=panel(1080,271,500,400,'Эффективность продаж')+tag(1310,324,245,'Июнь 2026 · 146%',C.green,C.greenBg);
  s+=graph(1096,363,461,240,[{values:[62,58,144,84,166,146,45],color:C.blue,fill:true}],['Янв','Фев','Мар','Апр','Май','Июн','Июл'],200);
  s+=panel(260,691,800,285,'Мои задачи')+tag(845,712,190,'31 июля 2026')+rect(280,753,760,83,C.light,'none',8);
  s+=txt(302,784,'09:30',16,C.blue,500)+txt(390,784,'Проверить предложение ещё раз',18,C.navy,500)+txt(390,812,'Задача на рабочий день',13,C.muted);
  s+=button(280,910,180,'Открыть календарь');
  s+=panel(1080,691,500,285,'Рабочая среда');
  [['Design','10.4.2'],['Каталоги','FAETON_26_0302'],['Прайс-лист и отчёты','03.02.2026'],['EasyOrder Desktop','V1.0.0']].forEach(([label,value],i)=>{const yy=753+i*42;s+=txt(1100,yy,label,14,C.muted)+txt(1558,yy,value,14,C.text,500,'end');});
  s+=tag(1100,926,186,'Синхронизирован',C.green,C.greenBg);
  return s;
};
screens.clients=()=>{
  let s=shell('Петров Константин','Клиенты','Карточка клиента и контактная информация')+panel(260,152,1320,824);
  s+=tabs(280,169,['Информация о клиенте','Контакты · 1','Заказы · 62','Администрирование','История · 0'],1)+line(280,215,1560,215);
  s+=rect(284,241,350,695,'#f6f9fd','none',10)+rect(308,269,58,58,C.light,'none',29)+txt(320,307,'ПК',20,C.blue,500);
  s+=txt(308,366,'Петров Константин',22,C.navy,500)+tag(308,390,172,'Новый клиент')+txt(308,471,'Заказы клиента',13,C.muted)+txt(308,511,'62',32,C.blue,500);
  s+=button(308,551,300,'Открыть заказы')+txt(308,636,'История взаимодействий',16,C.navy,500)+wrap(308,670,'Все данные клиента и связанные заказы доступны в одной карточке.',291,15,24,C.muted);
  s+=txt(670,274,'Контактные лица',21,C.navy,500)+button(1377,246,179,'Добавить контакт',true);
  s+=rect(670,310,886,326,'white',C.line,10)+rect(694,335,42,42,C.light,'none',21)+txt(707,363,'С',16,C.blue,500)+txt(751,363,'Секретарь',21,C.navy,500);
  s+=field(694,418,406,'Электронная почта','test@faeton.ru')+field(1120,418,412,'Телефон','320-48-09');
  s+=rect(694,515,838,79,C.amberBg,'none',8)+txt(713,544,'Предпочтения по связи',13,C.amber,500)+txt(713,575,'Звонить ТОЛЬКО в рабочее время',17,C.text);
  s+=txt(670,696,'История',20,C.navy,500)+line(670,717,1556,717)+rect(670,739,886,117,'#f8fafc','none',8)+txt(1113,807,'История взаимодействий пока пуста',16,C.muted,400,'middle');
  s+=button(1383,910,173,'Редактировать');
  return s;
};
screens.order=()=>{
  let s=shell('Заказ №2020_1_13032026_1_48','Заказы','Параметры заказа и связанные данные')+tag(1424,84,151,'Отменён',C.amber,C.amberBg);
  s+=panel(260,152,930,824)+tabs(280,169,['Параметры заказа','Файлы','Рендеры','Состав заказа','Замер','Претензии','Платежи'],0)+line(280,215,1170,215);
  s+=txt(284,261,'Основная информация',21,C.navy,500)+field(284,298,880,'Клиент','Чибисов Сергей',{select:true});
  s+=field(284,397,425,'Дата заказа','16 марта 2026')+field(739,397,425,'Желаемая дата изготовления','21 апреля 2026');
  s+=field(284,496,425,'Дата доставки','27 апреля 2026')+field(739,496,425,'Статус заказа','Отменён',{select:true});
  s+=field(284,595,880,'Адрес доставки','Не указан',{placeholder:true});
  s+=txt(284,702,'Комментарий',13,C.muted)+rect(284,716,880,96,'white',C.line,6)+txt(299,750,'Заказ импортирован из Design',16);
  s+=button(284,908,230,'Создать задачу по заказу')+button(995,908,169,'Сохранить',true);
  s+=panel(1210,152,370,273,'Передача на фабрику')+wrap(1230,228,'Экспорт данных заказа в производственную систему.',326,16,25,C.muted)+button(1230,345,330,'Экспорт в inSight');
  s+=panel(1210,445,370,531,'Связанные данные');
  [['Состав заказа','Позиции и стоимость'],['Файлы и документы','KIT-файлы и вложения'],['Замер','Исполнители и сроки'],['Платежи','Расчёты по заказу']].forEach(([a,b],i)=>{const y=526+i*92;s+=txt(1230,y,a,17,C.blue,500)+txt(1230,y+26,b,13,C.muted)+line(1230,y+50,1560,y+50);});
  return s;
};
screens.composition=()=>{
  let s=shell('Состав заказа','Заказы','Каталог DYADKOVO_1 · иерархия изделий и компонентов')+panel(260,152,1320,824);
  s+=txt(284,191,'Стоимость по каталогу',14,C.muted)+txt(1556,196,rubWithSymbol('4 291,99'),28,C.blue,500,'end');
  s+=tabs(280,221,['Пеналы','Напольные секции','Стеновые секции','Длинномеры и аксессуары'],0);
  const rows=[
    [{label:'Пенал: 1 дверь 1316 / 1 дверь 716 · 2040В × 555Г · левый',weight:500,color:C.navy},'T206.60',rubWithSymbol('191,00'),'1',rubWithSymbol('191,00')],
    [{label:'(1.1) Фасад Афина 716 × 596 · глухой',indent:22},'F11',rubWithSymbol('30,10'),'1',rubWithSymbol('30,10')],
    [{label:'Ручка-скоба ВАЛЕНСИЯ · бронза · 96 мм',indent:40},'PULL.211.ATT',rubWithSymbol('4,00'),'1',rubWithSymbol('4,00')],
    [{label:'(2.1) Фасад Афина 1316 × 596 · глухой',indent:22},'F21',rubWithSymbol('53,32'),'1',rubWithSymbol('53,32')],
    [{label:'Ручка-скоба ВАЛЕНСИЯ · бронза · 96 мм',indent:40},'PULL.211.ATT',rubWithSymbol('4,00'),'1',rubWithSymbol('4,00')],
    [{label:'Модификация: левый бок из материала фасада',indent:22},'M.SIDEDOOR.L',rubWithSymbol('38,20'),'1',rubWithSymbol('38,20')],
    [{label:'Левый бок 2040 × 555 · материал фасада Афина',indent:22},'SIDEDOOR.L',rubWithSymbol('84,92'),'1',rubWithSymbol('84,92')]
  ];
  s+=table(280,284,[{label:'Изделие / компонент',width:565},{label:'Код',width:265},{label:'Цена',width:145,align:'right'},{label:'Количество',width:125,align:'right'},{label:'Сумма',width:180,align:'right'}],rows,{rowHeight:72,headHeight:58,highlight:0,font:15});
  s+=txt(284,887,'Показан фрагмент состава заказа. Стоимость указана по каталогу презентации.',13,C.muted)+button(284,917,200,'Добавить позицию')+button(1378,917,178,'Сохранить',true);
  return s;
};
screens.appointments=()=>{
  let s=shell('Замер по заказу №1774777691','Замеры','Назначение даты и ответственного исполнителя')+panel(260,152,1320,824);
  s+=tabs(280,168,['Параметры заказа','Файлы','Рендеры','Состав заказа','Замер','Претензии','Платежи'],4)+line(280,215,1560,215);
  s+=txt(284,267,'Назначение замера',22,C.navy,500)+field(284,316,530,'Дата замера','Выберите дату',{placeholder:true})+field(284,421,530,'Замерщик','Татьяна Старостина',{select:true});
  s+=rect(284,535,530,128,C.light,'none',9)+txt(305,568,'Работы в контексте заказа',17,C.navy,500)+wrap(305,600,'Исполнитель и дата замера сохраняются в карточке заказа.',480,15,24,C.muted);
  s+=button(284,702,530,'Замер произведён')+button(284,909,168,'Сохранить',true);
  s+=panel(852,241,704,621,'Апрель 2026')+button(1418,258,118,'Сегодня');
  const days=['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
  days.forEach((d,i)=>s+=txt(899+i*94,331,d,14,C.muted,500,'middle'));
  calendarCells(2026, 4).forEach(({ value, muted }, i) => {
    const x=868+(i%7)*96,y=351+Math.floor(i/7)*88;
    s+=rect(x,y,92,80,value===6&&!muted?C.light:'white',value===6&&!muted?'#9abce2':C.line,6)+txt(x+46,y+47,value,18,muted?'#a1afbd':value===6?C.blue:C.text,value===6?500:400,'middle');
  });
  s+=txt(875,831,'Выберите дату в календаре',13,C.muted);
  return s;
};
screens.calendar=()=>{
  let s=shell('Календарь задач','Календарь','Март 2026 · рабочий график и события')+panel(260,152,1320,824);
  s+=button(280,169,118,'Сегодня')+txt(920,194,'Март 2026',23,C.navy,500,'middle')+button(1376,169,180,'Месяц · Неделя');
  const days=['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'];
  const gx=280,gy=265,cw=1280/7,ch=114;
  days.forEach((d,i)=>s+=txt(gx+i*cw+cw/2,246,d,12,C.muted,500,'middle'));
  const events={17:[['14:30','Визит VIP-клиента']],29:[['11:46','Проверить смету'],['12:30','Демонстрация EasyOrder'],['13:31','Перерыв на обед']],30:[['11:00','Замер сложного объекта']],31:[['08:30','Проверить предложение']]};
  calendarCells(2026, 3).forEach(({ day, value, muted }, i) => {
    const x=gx+(i%7)*cw,y=gy+Math.floor(i/7)*ch;
    s+=rect(x,y,cw,ch,day===29?C.light:muted?'#f8fafc':'white',C.line,0)+txt(x+12,y+24,value,13,muted?'#9baab9':C.navy,500);
    if(!muted)(events[day]||[]).forEach(([time,title],j)=>{
      const yy=y+30+j*25;s+=rect(x+6,yy,cw-12,23,day===17?C.greenBg:'#e7f0fc','none',4)+txt(x+13,yy+10,time,9,C.blue,500)+wrap(x+13,yy+20,title,cw-26,10,12,C.navy,400,1);
    });
  });
  return s;
};
screens['store-statistics']=()=>{
  let s=shell('Эффективность салона · МебельСити 1','Аналитика','Показатели площади, экспозиции и рабочих мест');
  [['Площадь','125 м²'],['Площадь экспозиции','25 м²'],['Экспозиции','5'],['Менеджеры','3'],['Рабочие места','3']].forEach(([label,value],i)=>s+=metric(260+i*268,152,248,label,value));
  s+=panel(260,271,1320,705,'Эффективность по месяцам');
  const rows=[
    ['Июль 2026','30,31','151,53','757,63','1 262,71','1 262,71','3 788,13'],
    ['Июнь 2026','100,36','501,79','2 508,93','4 181,55','4 181,55','12 544,65'],
    ['Май 2026','114,10','570,48','2 852,40','4 754,01','4 754,01','14 262,02'],
    ['Апрель 2026','58,09','290,43','1 452,16','2 420,27','2 420,27','7 260,80'],
    ['Март 2026','99,49','497,44','2 487,20','4 145,33','4 145,33','12 435,98'],
    ['Февраль 2026','39,78','198,92','994,60','1 657,67','1 657,67','4 973,02'],
    ['Январь 2026','42,35','211,76','1 058,80','1 764,66','1 764,66','5 293,98'],
    ['Среднее','69,21','346,05','1 730,25','2 883,74','2 883,74','8 651,23']
  ];
  s+=table(280,334,[{label:'Месяц',width:150},{label:'На 1 м² площади, ₽',width:180,align:'right'},{label:'На 1 м² экспозиции, ₽',width:180,align:'right'},{label:'На экспозицию, ₽',width:180,align:'right'},{label:'На менеджера, ₽',width:180,align:'right'},{label:'На рабочее место, ₽',width:180,align:'right'},{label:'Оборот, ₽',width:230,align:'right'}],rows.map(([month, ...amounts]) => [month, ...amounts.map(rub)]),{headHeight:60,rowHeight:60,font:15,total:7});
  s+=txt(284,926,'Текущий месяц не учитывается при расчёте среднего значения.',13,C.muted)+button(1398,908,158,'Экспорт в Excel');
  return s;
};
screens['manager-statistics']=()=>{
  let s=shell('Статистика сотрудников · Hoff Москва 1','Аналитика','Результаты работы менеджеров и конверсия');
  s+=panel(260,152,330,824,'Сотрудники');
  const staff=['Васильев Игорь Вениаминович','Капустина Наталья Евгеньевна','Петрова Екатерина Павловна','Кабальцев Григорий Константинович'];
  staff.forEach((name,i)=>{const yy=218+i*140;s+=rect(276,yy,298,124,i===2?C.light:'#f8fafc',i===2?'#9abce2':C.line,8)+wrap(292,yy+32,name,266,16,24,i===2?C.blue:C.navy,500,2)+txt(292,yy+100,'Hoff Москва 1 · магазин',12,C.muted);});
  s+=panel(610,152,970,824)+txt(634,190,'Петрова Екатерина Павловна',23,C.navy,500)+txt(634,219,'Показатели за январь — июль 2026',13,C.muted);
  [['Продажи','41'],['Просчёты','60'],['Конверсия','68,3%']].forEach(([a,b],i)=>s+=metric(634+i*310,242,296,a,b,i===0?C.green:C.blue));
  const rows=[
    ['Июль 2026','6','10','60,0%','0','0','14 655,52'],
    ['Июнь 2026','6','10','60,0%','0','0','13 616,14'],
    ['Май 2026','5','6','83,3%','0','0','12 829,48'],
    ['Апрель 2026','5','9','55,6%','0','0','10 407,78'],
    ['Март 2026','6','9','66,7%','0','0','14 594,14'],
    ['Февраль 2026','7','10','70,0%','0','0','14 928,98'],
    ['Январь 2026','6','6','100,0%','1','0','13 554,76'],
    ['Итого','41','60','68,3%','1','0','94 587,70']
  ];
  s+=table(630,371,[{label:'Месяц',width:133},{label:'Продажи',width:105,align:'right'},{label:'Просчёты',width:120,align:'right'},{label:'Конверсия',width:135,align:'right'},{label:'Замеры',width:100,align:'right'},{label:'Брак',width:80,align:'right'},{label:'Оборот, ₽',width:257,align:'right'}],rows.map(row => [...row.slice(0, -1), rub(row.at(-1))]),{headHeight:57,rowHeight:56,font:14,total:7});
  s+=button(1388,918,168,'Экспорт в Excel');
  return s;
};
screens['network-statistics']=()=>{
  let s=shell('Узел дерева продаж · Москва 1','Структура сбыта','Дилер · сводная статистика сети');
  [['Магазины','3'],['Сабдилеры','0'],['Сотрудники','12']].forEach(([a,b],i)=>s+=metric(260+i*447,152,426,a,b));
  s+=panel(260,271,900,705,'Краткая статистика')+tabs(280,317,['Общая статистика','Сотрудники','Дочерние точки'],0);
  const rows=[['Просчёты','44','0'],['Заказы','32','0'],['Конверсия','72,7%','—'],['Замеры','0','0'],['Претензии','0','0'],['Оборот, ₽',rub('71 343,24'),rub('0,00')]];
  s+=table(280,379,[{label:'Показатель',width:450},{label:'Март 2026',width:205,align:'right'},{label:'Апрель 2026',width:205,align:'right'}],rows,{rowHeight:68,headHeight:56,font:17});
  s+=txt(284,893,'Конверсия не рассчитывается при отсутствии просчётов.',13,C.muted)+button(284,918,178,'Управление');
  s+=panel(1180,271,400,705,'Заказы по месяцам');
  for(let i=0;i<5;i++){const yy=780-i*85;s+=line(1224,yy,1540,yy)+txt(1215,yy+4,i*8,11,C.muted,400,'end');}
  s+=rect(1260,440,84,340,C.blue,'none',6)+txt(1302,424,'32',24,C.blue,500,'middle')+line(1400,780,1484,780,C.blue,3)+txt(1442,764,'0',24,C.blue,500,'middle');
  s+=txt(1302,814,'Март 2026',13,C.muted,400,'middle')+txt(1442,814,'Апрель 2026',13,C.muted,400,'middle')+tag(1200,881,360,'Конверсия в марте · 72,7%',C.green,C.greenBg);
  return s;
};
screens.chat=()=>{
  let s=shell('Общение по заказам','Общение','Чаты фабрики и участников сети продаж')+panel(260,152,1320,824);
  s+=tabs(280,169,['Тестовый чат · 0','Второй чат · 0'],0)+line(280,215,1560,215)+line(1210,215,1210,954);
  s+=txt(284,262,'Тестовый чат',22,C.navy,500)+tag(992,239,190,'3 участника');
  s+=rect(284,316,53,53,C.light,'none',27)+txt(296,350,'ПД',17,C.blue,500)+txt(354,338,'Павел Добровольский',16,C.navy,500)+txt(354,362,'23 марта 2026 · 15:43',12,C.muted);
  s+=rect(354,382,720,91,'#f3f6fa','none',10)+txt(375,423,'Алексей, Вы не забыли про мой заказ?',18);
  s+=rect(284,511,53,53,C.light,'none',27)+txt(295,545,'АШ',17,C.blue,500)+txt(354,533,'Алексей Шмаков',16,C.navy,500)+txt(354,557,'29 марта 2026 · 12:04',12,C.muted);
  s+=rect(354,577,720,91,C.light,'none',10)+txt(375,618,'Нет, сегодня вышлю Вам панораму VR',18);
  s+=rect(284,779,898,123,'white',C.line,8)+txt(304,816,'Напишите сообщение…',16,C.muted)+button(1007,920,175,'Написать',true);
  s+=txt(1230,261,'Участники',20,C.navy,500);
  ['Павел Добровольский','Алексей Шмаков','Татьяна Старостина'].forEach((name,i)=>{const yy=317+i*86;s+=rect(1230,yy,34,34,C.light,'none',17)+wrap(1276,yy+15,name,265,15,21,C.text,400,2);});
  return s;
};
screens.workflow=()=>{
  let s=shell('Бизнес-процесс заказа','Управление','Настройка состояний и разрешённых переходов')+button(1373,84,203,'Добавить статус',true);
  s+=panel(260,152,930,824,'Жизненный цикл заказа')+panel(1210,152,370,276,'Отменён')+tag(1230,211,210,'105 заказов',C.amber,C.amberBg)+wrap(1230,271,'Самостоятельный статус отмены заказа.',320,16,25,C.muted)+button(1230,355,330,'Редактировать');
  const data=[
    {y:227,title:'Первичный просчёт',count:'119 заказов',initial:true,next:'Требуется замер · Был просчёт в Design'},
    {y:441,title:'Требуется замер',count:'140 заказов',next:'Был просчёт в Design'},
    {y:655,title:'Был просчёт в Design',count:'121 заказ',next:'Идёт согласование'}
  ];
  data.forEach((d,i)=>{
    s+=rect(294,d.y,862,167,i===2?C.light:'#f8fafc',i===2?'#9abce2':C.line,10)+txt(316,d.y+38,d.title,22,i===2?C.blue:C.navy,500)+tag(949,d.y+18,184,d.count);
    if(d.initial)s+=tag(316,d.y+56,194,'Начальное состояние',C.green,C.greenBg);
    s+=txt(316,d.y+112,'Доступные переходы',12,C.muted)+txt(316,d.y+141,d.next,16,C.text);
    if(i<2)s+=line(725,d.y+174,725,d.y+199,'#8baed0',2)+'<path d="M720 '+(d.y+193)+' L725 '+(d.y+200)+' L730 '+(d.y+193)+'" fill="none" stroke="#8baed0" stroke-width="2"/>';
  });
  s+=tag(598,873,260,'Идёт согласование')+txt(284,949,'Переходы определяются настройками бизнес-процесса.',13,C.muted);
  s+=panel(1210,448,370,528,'Параметры статуса')+txt(1230,512,'Выбранное состояние',13,C.muted)+wrap(1230,547,'Был просчёт в Design',320,20,27,C.blue,500);
  s+=txt(1230,620,'Разрешён переход из',13,C.muted);
  ['Первичный просчёт','Требуется замер','Идёт согласование'].forEach((a,i)=>s+=tag(1230,644+i*42,330,a));
  s+=button(1230,832,330,'Редактировать статус')+button(1230,884,330,'Сделать начальным');
  return s;
};
async function buildFilesScreen() {
  const extracted=path.join(ROOT,'../../work/easyorder-pdf/page-5-image-1-Im1.jpg');
  const original=fs.existsSync(extracted) ? extracted : path.join(ROOT,'public/crm/easyorder/files.webp');
  const thumbRects=[[41,235,100,48],[177,233,100,50],[313,234,100,50],[449,234,100,50],[584,234,100,50]];
  const images=[];
  for(let i=0;i<thumbRects.length;i++){
    const [left,top,width,height]=thumbRects[i];
    const buffer=await sharp(original).extract({left,top,width,height}).png().toBuffer();
    fs.writeFileSync(path.join(OUT,'source-render-'+(i+1)+'.png'),buffer);
    images.push('data:image/png;base64,'+buffer.toString('base64'));
  }
  const preview=await sharp(original).extract({left:57,top:404,width:334,height:160}).png().toBuffer();
  fs.writeFileSync(path.join(OUT,'source-render-preview.png'),preview);
  const previewData='data:image/png;base64,'+preview.toString('base64');
  return ()=>{
    let s=shell('Файлы и визуализации заказа','Заказы','Заказ №2020_1_13032026_1_48')+panel(260,152,1320,824);
    s+=tabs(280,169,['Параметры заказа','Файлы и документы','Рендеры','Состав заказа','Замер','Претензии','Платежи'],2);
    images.forEach((data,i)=>{
      const x=280+i*256;
      s+=rect(x,237,236,190,i===4?C.light:'#f8fafc',i===4?'#9abce2':C.line,8)+image(x+12,249,212,116,data)+txt(x+16,393,i===0?'Anons.jpg':'Anons'+(i+1)+'.jpg',15,i===4?C.blue:C.text,500);
    });
    s+=panel(280,450,780,498,'Просмотр · Anons5.jpg')+image(300,515,740,354,previewData)+txt(300,932,'Визуализация из исходной презентации',13,C.muted);
    s+=panel(1080,450,476,498,'Информация о файле');
    [['Имя файла','Anons5.jpg'],['Размер','434,99 КБ'],['Тип','Изображение JPG'],['Связь','Визуализация заказа']].forEach(([label,value],i)=>{const y=526+i*76;s+=txt(1100,y,label,13,C.muted)+txt(1100,y+29,value,17);});
    s+=button(1100,866,436,'Скачать изображение')+button(1100,914,436,'Открыть оригинал');
    return s;
  };
}
(async()=>{
  fs.mkdirSync(OUT,{recursive:true});
  screens.files=await buildFilesScreen();
  const manifest={};
  for(const [name,build] of Object.entries(screens)){
    const svg=doc(build());
    fs.writeFileSync(path.join(OUT,name+'.svg'),svg);
    const info=await sharp(Buffer.from(svg)).webp({quality:96,effort:6}).toFile(path.join(OUT,name+'.webp'));
    manifest[name]={src:'/crm/easyorder/styled/'+name+'.webp',width:info.width,height:info.height};
    console.log(name+': '+info.width+'x'+info.height+' · '+Math.round(info.size/1024)+' KB');
  }
  fs.writeFileSync(path.join(OUT,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  const monitoring = path.join(OUT, '../store-efficiency-dashboard');
  await sharp(monitoring+'.svg').webp({quality:96,effort:6}).toFile(monitoring+'.webp');
})().catch(error=>{console.error(error);process.exitCode=1;});
