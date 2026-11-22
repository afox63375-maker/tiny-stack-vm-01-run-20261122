import{readdirSync,readFileSync,writeFileSync,mkdirSync}from"node:fs";
import{join}from"node:path";
const I=process.env.MAKEFUN_INPUT_DIR||"/input",O=process.env.MAKEFUN_OUTPUT_DIR||"/output";
function run(p,q){
 const D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),o=new Uint8Array(65536);
 let sp=0,cp=0,ol=0,ip=0,pc=0,st=0;
 const F=c=>({o:o.slice(0,ol),c});
 for(;;){
  if(st===1e6)return F(10);
  if(pc<0||pc>=p.length)return F(9);
  const op=p[pc];
  let im=0,po=0,pu=0;
  if(op<8){im=op===1?1:op===2?4:0;po=[0,0,0,1,1,2,2,3][op];pu=[0,1,1,0,2,2,3,3][op];}
  else if(op>=16&&op<=34&&op!==23&&op!==27){po=2;pu=1;}
  else if(op===23||op===27){po=1;pu=1;}
  else if(op>=48&&op<=51){im=2;po=op===48||op===51?0:1;}
  else if(op===52){}
  else if(op===64){po=1;pu=1;}
  else if(op===65){po=2;}
  else if(op===80||op===81||op===83){po=1;}
  else if(op===82){pu=1;}
  else return F(5);
  const nx=pc+1+im;
  if(nx>p.length)return F(9);
  st++;
  if(sp<po)return F(2);
  if(sp-po+pu>256)return F(3);
  pc=nx;
  if(op===0)return F(0);
  if(op===1){D[sp++]=(p[nx-1]<<24)>>24;continue;}
  if(op===2){D[sp++]=p[nx-4]|p[nx-3]<<8|p[nx-2]<<16|p[nx-1]<<24;continue;}
  if(op===3){sp--;continue;}
  if(op===4){D[sp]=D[sp-1];sp++;continue;}
  if(op===5){const t=D[sp-1];D[sp-1]=D[sp-2];D[sp-2]=t;continue;}
  if(op===6){D[sp]=D[sp-2];sp++;continue;}
  if(op===7){const a=D[sp-3];D[sp-3]=D[sp-2];D[sp-2]=D[sp-1];D[sp-1]=a;continue;}
  if(op===23){D[sp-1]=-D[sp-1]|0;continue;}
  if(op===27){D[sp-1]=~D[sp-1];continue;}
  if(op>=16&&op<=34){
   const b=D[sp-1],a=D[sp-2];let r=0;
   if(op===16)r=a+b|0;
   else if(op===17)r=a-b|0;
   else if(op===18)r=Math.imul(a,b);
   else if(op===19){if(!b)return F(4);r=a===-2147483648&&b===-1?a:(a/b)|0;}
   else if(op===20){if(!b)return F(4);r=b===-1?0:a%b|0;}
   else if(op===21){if(!b)return F(4);r=Math.floor((a>>>0)/(b>>>0))|0;}
   else if(op===22){if(!b)return F(4);r=(a>>>0)%(b>>>0)|0;}
   else if(op===24)r=a&b;
   else if(op===25)r=a|b;
   else if(op===26)r=a^b;
   else if(op===28)r=a<<(b&31);
   else if(op===29)r=a>>(b&31);
   else if(op===30)r=(a>>>(b&31))|0;
   else if(op===32)r=a===b?1:0;
   else if(op===33)r=a<b?1:0;
   else r=(a>>>0)<(b>>>0)?1:0;
   sp-=2;D[sp++]=r;continue;
  }
  if(op>=48&&op<=50){
   const rel=((p[nx-2]|p[nx-1]<<8)<<16)>>16;
   if(op===48){pc=nx+rel;continue;}
   const v=D[--sp];
   if(op===49?v===0:v!==0)pc=nx+rel;
   continue;
  }
  if(op===51){if(cp===64)return F(7);C[cp++]=nx;pc=p[nx-2]|p[nx-1]<<8;continue;}
  if(op===52){if(cp===0)return F(8);pc=C[--cp];continue;}
  if(op===64){const a=D[sp-1];if(a<0||a>255)return F(6);D[sp-1]=M[a];continue;}
  if(op===65){const a=D[sp-1];if(a<0||a>255)return F(6);sp-=2;M[a]=D[sp];continue;}
  if(op===80){const s=String(D[sp-1]);if(ol+s.length>65536)return F(11);sp--;for(let i=0;i<s.length;i++)o[ol++]=s.charCodeAt(i);continue;}
  if(op===81){if(ol+1>65536)return F(11);o[ol++]=D[--sp]&255;continue;}
  if(op===82){D[sp++]=ip<q.length?q[ip++]:-1;continue;}
  return F(D[--sp]&255);
 }
}
for(const d of readdirSync(I).sort()){
 const r=run(readFileSync(join(I,d,"program.bin")),readFileSync(join(I,d,"input.bin")));
 mkdirSync(join(O,d),{recursive:true});
 writeFileSync(join(O,d,"stdout.bin"),r.o);
 writeFileSync(join(O,d,"exit.txt"),r.c+"\n");
}
