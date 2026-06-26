import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  ArrowLeft, ChevronRight, Star, Clock, Zap, Flame, Heart,
  Volume2, VolumeX, Plus, Minus, RotateCcw, Share2, ExternalLink,
} from "lucide-react";

/* ----------------------------------------------------------------------------
   LAPER DOANG — "Semua dopamine-nya. Tanpa kalorinya."
   Versi Indonesia, terinspirasi tampilan GoFood. Pesan, lacak driver, dapet
   sensasinya — tanpa ada yang dateng beneran. Buat dopamine, bukan buat makan.
----------------------------------------------------------------------------- */

const css = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

.ld-app{
  --ink:#13241b; --paper:#f4faf5; --card:#ffffff; --line:#e4efe7;
  --grn:#06b14f; --grn-deep:#04903f; --grn-soft:#e7f7ed;
  --muted:#7b8a81;
  --dopa-a:#ff3d81; --dopa-b:#8b5cf6;
  --gold:#ffb020;
  font-family:'Plus Jakarta Sans',system-ui,-apple-system,Segoe UI,sans-serif;
  color:var(--ink);
  background:
    radial-gradient(1200px 600px at 75% -10%, #d8f3e0 0%, rgba(216,243,224,0) 55%),
    radial-gradient(900px 500px at -10% 110%, #e6dcff 0%, rgba(230,220,255,0) 55%),
    #eef4ef;
  min-height:100vh; width:100%;
  display:flex; justify-content:center; align-items:flex-start;
  -webkit-font-smoothing:antialiased;
}
.ld-app *{box-sizing:border-box;}
.ld-app button{font-family:inherit; cursor:pointer; border:none; background:none; color:inherit;}
.ld-app button:focus-visible{outline:3px solid var(--grn); outline-offset:2px; border-radius:14px;}

.ld-shell{
  position:relative; width:100%; max-width:430px; min-height:100vh;
  background:var(--paper); overflow:hidden; isolation:isolate;
  box-shadow:0 30px 80px -30px rgba(0,40,15,.32);
}
@media(min-width:480px){ .ld-shell{ margin:22px 0; border-radius:34px; min-height:780px;} }

/* header */
.ld-header{
  position:sticky; top:0; z-index:20; display:flex; align-items:center; gap:10px;
  padding:14px 16px 12px; background:rgba(244,250,245,.88); backdrop-filter:blur(10px);
  border-bottom:1px solid var(--line);
}
.ld-brand{display:flex; align-items:center; gap:9px; margin-right:auto;}
.ld-logo{
  width:34px; height:34px; border-radius:11px; display:grid; place-items:center; font-size:17px;
  background:linear-gradient(135deg,var(--grn),#2bd66a); box-shadow:0 6px 14px -4px rgba(6,177,79,.55); color:#fff;
}
.ld-wordmark{font-family:'Baloo 2',sans-serif; font-weight:800; font-size:19px; letter-spacing:-.02em; line-height:1;}
.ld-pill{
  display:flex; align-items:center; gap:7px; padding:6px 9px 6px 8px; border-radius:999px;
  background:linear-gradient(135deg, rgba(255,61,129,.12), rgba(139,92,246,.12));
  border:1px solid rgba(139,92,246,.2);
}
.ld-pill b{font-family:'Baloo 2',sans-serif; font-size:13px; line-height:1; color:#6d28d9;}
.ld-meter{width:40px; height:7px; border-radius:99px; background:#efe6f7; overflow:hidden;}
.ld-meter-fill{height:100%; border-radius:99px; background:linear-gradient(90deg,var(--dopa-a),var(--dopa-b)); transition:width .5s cubic-bezier(.2,.8,.2,1);}
.ld-icon{width:34px; height:34px; border-radius:11px; display:grid; place-items:center; color:var(--muted); background:#fff; border:1px solid var(--line);}
.ld-icon:active{transform:scale(.93);}

/* screens */
.ld-screen{padding:16px 16px 132px; animation:ld-in .34s cubic-bezier(.2,.8,.2,1);}
@keyframes ld-in{from{opacity:0; transform:translateY(10px);} to{opacity:1; transform:none;}}

.ld-h1{font-family:'Baloo 2',sans-serif; font-weight:800; font-size:26px; line-height:1.06; letter-spacing:-.02em; margin:6px 0 4px;}
.ld-h1 .em{background:linear-gradient(90deg,var(--dopa-a),var(--dopa-b)); -webkit-background-clip:text; background-clip:text; color:transparent;}
.ld-sub{color:var(--muted); font-size:13.5px; font-weight:500; margin:0 0 18px; line-height:1.45;}
.ld-label{font-size:11px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin:0 2px 10px;}

/* resto cards */
.ld-list{display:flex; flex-direction:column; gap:11px;}
.ld-card{display:flex; align-items:center; gap:13px; padding:11px; background:var(--card); border:1px solid var(--line); border-radius:20px; text-align:left; width:100%; transition:transform .15s, box-shadow .2s;}
.ld-card:active{transform:scale(.985);}
.ld-card:hover{box-shadow:0 14px 30px -18px rgba(0,40,15,.3);}
.ld-tile{width:62px; height:62px; border-radius:16px; display:grid; place-items:center; font-size:31px; flex:none; box-shadow:inset 0 0 0 1px rgba(255,255,255,.3);}
.ld-cbody{min-width:0; flex:1;}
.ld-name{font-family:'Baloo 2',sans-serif; font-weight:700; font-size:16px; letter-spacing:-.01em; margin:0 0 3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
.ld-meta{display:flex; align-items:center; gap:7px; font-size:12.5px; color:var(--muted); font-weight:600; flex-wrap:wrap;}
.ld-meta .dot{width:3px; height:3px; border-radius:99px; background:#cfdbd3;}
.ld-meta .star{color:#f59e0b; display:inline-flex; align-items:center; gap:3px;}
.ld-chev{color:#cdd9d0; flex:none;}
.ld-disclaim{text-align:center; color:#aebbb2; font-size:11.5px; font-weight:600; margin:20px 8px 0;}

/* menu */
.ld-back{display:inline-flex; align-items:center; gap:6px; font-weight:700; font-size:14px; color:var(--ink); padding:8px 0; margin-bottom:4px;}
.ld-rhead{display:flex; align-items:center; gap:14px; margin:4px 2px 16px;}
.ld-rtile{width:72px; height:72px; border-radius:20px; display:grid; place-items:center; font-size:38px; flex:none;}
.ld-rtitle{font-family:'Baloo 2',sans-serif; font-weight:800; font-size:21px; letter-spacing:-.02em; margin:0 0 4px;}
.ld-item{display:flex; align-items:center; gap:12px; padding:12px 4px; border-bottom:1px solid var(--line);}
.ld-iemoji{width:46px; height:46px; border-radius:14px; background:var(--grn-soft); display:grid; place-items:center; font-size:24px; flex:none;}
.ld-iinfo{flex:1; min-width:0;}
.ld-iname{font-weight:700; font-size:14.5px; margin:0 0 2px;}
.ld-ikcal{font-size:12px; color:var(--muted); font-weight:600;}
.ld-iprice{font-family:'Baloo 2',sans-serif; font-weight:700; font-size:14px; color:var(--grn-deep); margin-right:2px; white-space:nowrap;}
.ld-add{width:34px; height:34px; border-radius:11px; background:var(--grn); color:#fff; display:grid; place-items:center; flex:none; transition:transform .12s; box-shadow:0 6px 14px -6px rgba(6,177,79,.7);}
.ld-add:active{transform:scale(.88);}
.ld-step{display:flex; align-items:center; gap:4px; flex:none;}
.ld-sbtn{width:30px; height:30px; border-radius:10px; background:var(--grn-soft); color:var(--grn-deep); display:grid; place-items:center;}
.ld-sbtn:active{transform:scale(.9);}
.ld-qty{font-family:'Baloo 2',sans-serif; font-weight:700; min-width:20px; text-align:center; font-size:15px;}
.ld-bump{animation:ld-bump .3s ease;}
@keyframes ld-bump{0%{transform:scale(1);}40%{transform:scale(1.3);}100%{transform:scale(1);}}

/* bottom bar */
.ld-bar{position:absolute; left:0; right:0; bottom:0; z-index:25; padding:13px 16px calc(16px + env(safe-area-inset-bottom)); background:linear-gradient(180deg, rgba(244,250,245,0), var(--paper) 36%);}
.ld-cta{width:100%; display:flex; align-items:center; justify-content:space-between; gap:10px; padding:15px 18px; border-radius:18px; background:linear-gradient(135deg,var(--grn),var(--grn-deep)); color:#fff; box-shadow:0 16px 34px -14px rgba(4,144,63,.7); font-family:'Baloo 2',sans-serif; font-weight:700; font-size:16px; transition:transform .14s;}
.ld-cta:active{transform:scale(.98);}
.ld-cta:disabled{opacity:.4; box-shadow:none; cursor:not-allowed;}
.ld-count{background:rgba(255,255,255,.22); border-radius:99px; padding:3px 10px; font-size:13px;}

/* checkout */
.ld-sec{font-family:'Baloo 2',sans-serif; font-weight:700; font-size:15px; margin:18px 2px 10px;}
.ld-summary{background:var(--card); border:1px solid var(--line); border-radius:18px; padding:6px 14px; margin-bottom:6px;}
.ld-srow{display:flex; align-items:center; justify-content:space-between; padding:9px 0; font-size:13.5px; border-bottom:1px solid var(--line);}
.ld-srow:last-child{border-bottom:none;}
.ld-srow .lab{color:var(--muted); font-weight:600;}
.ld-srow .val{font-weight:700;}
.ld-srow.tot .lab{color:var(--ink); font-family:'Baloo 2',sans-serif;}
.ld-srow.tot .val{font-family:'Baloo 2',sans-serif; font-size:16px;}
.ld-strike{color:var(--muted); text-decoration:line-through; font-weight:600; margin-right:7px; font-size:13px;}
.ld-free{color:var(--grn-deep);}
.ld-note{background:var(--grn-soft); border-radius:14px; padding:11px 14px; font-size:12.5px; font-weight:600; color:var(--grn-deep); margin:8px 0 4px;}
.ld-pays{display:flex; gap:8px; flex-wrap:wrap; margin-bottom:4px;}
.ld-pay{display:flex; align-items:center; gap:8px; padding:11px 13px; border-radius:14px; border:1.5px solid var(--line); background:#fff; font-weight:700; font-size:13px; transition:all .15s;}
.ld-pay .pi{width:26px; height:26px; border-radius:8px; display:grid; place-items:center; font-size:12px; color:#fff; font-weight:800;}
.ld-pay.on{border-color:var(--grn); background:var(--grn-soft);}
.ld-pay small{display:block; color:var(--muted); font-weight:600; font-size:10.5px;}

/* tracking */
.ld-thead{text-align:center; margin:6px 0 14px;}
.ld-eta{font-family:'Baloo 2',sans-serif; font-weight:800; font-size:46px; letter-spacing:-.03em; line-height:1; background:linear-gradient(135deg,var(--dopa-a),var(--dopa-b)); -webkit-background-clip:text; background-clip:text; color:transparent;}
.ld-etalab{display:inline-flex; align-items:center; gap:6px; color:var(--muted); font-weight:700; font-size:13px; margin-top:6px;}
.ld-map{width:100%; border-radius:22px; overflow:hidden; border:1px solid var(--line); box-shadow:0 18px 40px -24px rgba(0,40,15,.4); background:#dff0e6; display:block;}
.ld-map svg{display:block; width:100%; height:auto;}
.ld-prog{height:9px; border-radius:99px; background:#e8efe9; overflow:hidden; margin:16px 0 18px;}
.ld-progfill{height:100%; border-radius:99px; background:linear-gradient(90deg,var(--grn),var(--dopa-a)); transition:width .12s linear;}

.ld-stages{display:flex; flex-direction:column; margin-bottom:16px;}
.ld-stage{display:flex; align-items:center; gap:11px; padding:7px 2px; transition:opacity .3s;}
.ld-dot{width:30px; height:30px; border-radius:99px; display:grid; place-items:center; font-size:15px; background:#eaf1ec; flex:none; transition:all .3s;}
.ld-stage.done .ld-dot{background:linear-gradient(135deg,var(--grn),#2bd66a); color:#fff; box-shadow:0 6px 14px -5px rgba(6,177,79,.6);}
.ld-stage.cur .ld-dot{background:linear-gradient(135deg,var(--dopa-a),var(--dopa-b)); color:#fff; animation:ld-pulse 1.4s infinite;}
.ld-stage .stx{font-weight:600; font-size:14px;}
.ld-stage.todo{opacity:.4;}
@keyframes ld-pulse{0%{box-shadow:0 0 0 0 rgba(255,61,129,.45);}70%{box-shadow:0 0 0 10px rgba(255,61,129,0);}100%{box-shadow:0 0 0 0 rgba(255,61,129,0);}}

.ld-driver{display:flex; align-items:center; gap:13px; padding:13px; background:var(--card); border:1px solid var(--line); border-radius:20px; margin-bottom:12px;}
.ld-dav{width:50px; height:50px; border-radius:99px; background:linear-gradient(135deg,#d7f3e0,#e6dcff); display:grid; place-items:center; font-size:26px; flex:none; position:relative;}
.ld-dav .veh{position:absolute; right:-4px; bottom:-4px; width:24px; height:24px; border-radius:99px; background:#fff; display:grid; place-items:center; font-size:13px; box-shadow:0 3px 8px rgba(0,0,0,.15);}
.ld-dinfo{flex:1; min-width:0;}
.ld-dname{font-family:'Baloo 2',sans-serif; font-weight:700; font-size:15.5px;}
.ld-dmeta{font-size:12.5px; color:var(--muted); font-weight:600; display:flex; align-items:center; gap:5px;}
.ld-bub{margin:0 0 12px; padding:11px 14px; background:var(--grn-soft); border:1px solid #cfeeda; border-radius:15px; border-bottom-left-radius:4px; font-size:13.5px; font-weight:600; color:var(--grn-deep); animation:ld-bub .3s ease;}
@keyframes ld-bub{from{opacity:0; transform:translateY(6px) scale(.97);} to{opacity:1; transform:none;}}

.ld-row2{display:flex; gap:10px;}
.ld-b2{flex:1; display:inline-flex; align-items:center; justify-content:center; gap:7px; padding:13px; border-radius:15px; font-weight:700; font-size:14px; border:1px solid var(--line); background:#fff; color:var(--ink); transition:transform .12s;}
.ld-b2:active{transform:scale(.96);}
.ld-b2.speed{background:linear-gradient(135deg,#fff0f5,#f3ecff); border-color:#f0d9ff; color:#8b2fb0;}
.ld-b2.tip{color:#d6336c;}
.ld-b2.on{background:linear-gradient(135deg,var(--dopa-a),var(--dopa-b)); color:#fff; border-color:transparent;}

/* delivered */
.ld-deliver{position:relative; text-align:center; padding-top:8px;}
.ld-bigwrap{position:relative; height:138px; display:grid; place-items:center; margin-bottom:4px;}
.ld-big{font-size:82px; animation:ld-drop .7s cubic-bezier(.2,1.4,.4,1);}
@keyframes ld-drop{0%{transform:translateY(-40px) scale(.4); opacity:0;}60%{transform:translateY(6px) scale(1.12);}100%{transform:none; opacity:1;}}
.ld-dt{font-family:'Baloo 2',sans-serif; font-weight:800; font-size:27px; letter-spacing:-.02em; margin:2px 0 4px;}
.ld-dt .em{background:linear-gradient(90deg,var(--dopa-a),var(--dopa-b)); -webkit-background-clip:text; background-clip:text; color:transparent;}
.ld-ds{color:var(--muted); font-weight:600; font-size:13.5px; margin:0 0 18px; line-height:1.4;}
.ld-bag{display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-bottom:18px;}
.ld-bagit{display:inline-flex; align-items:center; gap:7px; padding:8px 12px; background:#fff; border:1px solid var(--line); border-radius:99px; font-weight:600; font-size:13px;}
.ld-bagit .q{color:var(--muted); font-weight:700;}
.ld-stats{display:flex; gap:10px; margin-bottom:20px;}
.ld-stat{flex:1; background:var(--card); border:1px solid var(--line); border-radius:18px; padding:14px 8px;}
.ld-stat .v{font-family:'Baloo 2',sans-serif; font-weight:800; font-size:18px; letter-spacing:-.01em;}
.ld-stat .v.g{color:var(--grn-deep);} .ld-stat .v.p{color:#8b5cf6;} .ld-stat .v.o{color:var(--gold);}
.ld-stat .k{font-size:10.5px; color:var(--muted); font-weight:700; text-transform:uppercase; letter-spacing:.04em; margin-top:3px;}
.ld-primary{width:100%; padding:16px; border-radius:18px; background:linear-gradient(135deg,var(--grn),var(--grn-deep)); color:#fff; font-family:'Baloo 2',sans-serif; font-weight:700; font-size:16.5px; box-shadow:0 16px 34px -14px rgba(4,144,63,.7); transition:transform .14s; margin-bottom:10px; display:inline-flex; align-items:center; justify-content:center; gap:9px;}
.ld-primary:active{transform:scale(.98);}
.ld-share{width:100%; padding:14px; border-radius:16px; background:#25D366; color:#fff; font-family:'Baloo 2',sans-serif; font-weight:700; font-size:15px; display:inline-flex; align-items:center; justify-content:center; gap:9px; margin-bottom:10px; transition:transform .14s; box-shadow:0 12px 26px -12px rgba(37,211,102,.7);}
.ld-share:active{transform:scale(.98);}
.ld-real{width:100%; padding:13px; border-radius:15px; background:#fff; border:1px solid var(--line); font-weight:700; font-size:14px; color:var(--ink); display:inline-flex; align-items:center; justify-content:center; gap:8px;}
.ld-real:active{transform:scale(.98);}

/* overlays */
.ld-pop-over{position:absolute; inset:0; z-index:40; display:grid; place-items:center; background:rgba(244,250,245,.93); backdrop-filter:blur(4px); animation:ld-in .2s;}
.ld-check{width:96px; height:96px; border-radius:99px; background:linear-gradient(135deg,var(--grn),#2bd66a); display:grid; place-items:center; box-shadow:0 22px 44px -14px rgba(6,177,79,.7); animation:ld-drop .55s cubic-bezier(.2,1.4,.4,1);}
.ld-poptxt{font-family:'Baloo 2',sans-serif; font-weight:700; font-size:18px; margin-top:16px; animation:ld-in .4s .1s both;}

.ld-confetti{position:absolute; inset:0; overflow:hidden; pointer-events:none; z-index:5;}
.ld-conf{position:absolute; top:-16px; will-change:transform; animation:ld-fall linear forwards;}
@keyframes ld-fall{0%{transform:translateY(-20px) rotate(0); opacity:1;}85%{opacity:1;}100%{transform:translateY(720px) rotate(720deg); opacity:0;}}

.ld-hearts{position:absolute; inset:0; pointer-events:none; z-index:45; overflow:hidden;}
.ld-heart{position:absolute; bottom:120px; font-size:22px; animation:ld-rise 1.3s ease-out forwards;}
@keyframes ld-rise{0%{transform:translateY(0) scale(.6); opacity:0;}20%{opacity:1; transform:translateY(-16px) scale(1.1);}100%{transform:translateY(-180px) scale(.9); opacity:0;}}

.ld-lvl{position:absolute; top:14px; left:50%; transform:translateX(-50%); z-index:46; padding:9px 16px; border-radius:99px; background:linear-gradient(135deg,var(--dopa-a),var(--dopa-b)); color:#fff; font-family:'Baloo 2',sans-serif; font-weight:800; font-size:13px; box-shadow:0 14px 30px -10px rgba(139,92,246,.6); animation:ld-lvl 2.2s ease forwards;}
@keyframes ld-lvl{0%{opacity:0; transform:translateX(-50%) translateY(-14px) scale(.8);}12%{opacity:1; transform:translateX(-50%) translateY(0) scale(1);}80%{opacity:1;}100%{opacity:0; transform:translateX(-50%) translateY(-10px);}}

@media (prefers-reduced-motion: reduce){ .ld-app *{animation-duration:.001ms !important; transition-duration:.001ms !important;} }
`;

/* ---------------------------------- data ---------------------------------- */
const RESTOS = [
  { id:"tempong", name:"Omeh Nasi Tempong", cat:"Banyuwangi • Sambal", emoji:"🌶️", rating:4.9, eta:"19", km:"2,3",
    tile:"linear-gradient(135deg,#e52d27,#b31217)",
    menu:[
      {id:"tp1",name:"Nasi Tempong Ayam Goreng",emoji:"🍗",price:25000,kcal:680},
      {id:"tp2",name:"Nasi Tempong Tempe Tahu",emoji:"🟫",price:18000,kcal:520},
      {id:"tp3",name:"Nasi Tempong Ikan Asin",emoji:"🐟",price:22000,kcal:560},
      {id:"tp4",name:"Nasi Tempong Telur Dadar",emoji:"🍳",price:20000,kcal:600},
      {id:"tp5",name:"Sambal Tempong Extra",emoji:"🌶️",price:5000,kcal:60},
      {id:"tp6",name:"Pelas Daun Singkong",emoji:"🥬",price:8000,kcal:140},
      {id:"tp7",name:"Es Teh Manis",emoji:"🧊",price:6000,kcal:120},
      {id:"tp8",name:"Es Jeruk",emoji:"🍊",price:8000,kcal:110},
    ]},
  { id:"gyoza", name:"Preteeeeen Gyoza", cat:"Jepang • Gyoza", emoji:"🥟", rating:4.8, eta:"17", km:"1,8",
    tile:"linear-gradient(135deg,#cb2d3e,#ef473a)",
    menu:[
      {id:"gz1",name:"Gyoza Ayam (6 pcs)",emoji:"🥟",price:28000,kcal:340},
      {id:"gz2",name:"Gyoza Udang (6 pcs)",emoji:"🍤",price:32000,kcal:360},
      {id:"gz3",name:"Gyoza Sayur (6 pcs)",emoji:"🥬",price:24000,kcal:300},
      {id:"gz4",name:"Gyoza Pedas (6 pcs)",emoji:"🌶️",price:29000,kcal:350},
      {id:"gz5",name:"Karaage Ayam",emoji:"🍗",price:27000,kcal:520},
      {id:"gz6",name:"Takoyaki (6 pcs)",emoji:"🐙",price:25000,kcal:400},
      {id:"gz7",name:"Edamame",emoji:"🫛",price:15000,kcal:180},
      {id:"gz8",name:"Ocha (Teh Hijau)",emoji:"🍵",price:10000,kcal:5},
    ]},
  { id:"geprek", name:"Geprek Si Abang", cat:"Ayam Geprek", emoji:"🍗", rating:4.8, eta:"12", km:"1,4",
    tile:"linear-gradient(135deg,#ff7a18,#ff3b3b)",
    menu:[
      {id:"g1",name:"Ayam Geprek Original",emoji:"🍗",price:22000,kcal:560},
      {id:"g2",name:"Geprek Keju Mozzarella",emoji:"🧀",price:32000,kcal:740},
      {id:"g3",name:"Nasi Putih",emoji:"🍚",price:5000,kcal:200},
      {id:"g4",name:"Es Teh Manis",emoji:"🧊",price:6000,kcal:120},
      {id:"g5",name:"Kerupuk",emoji:"🍘",price:3000,kcal:90},
    ]},
  { id:"nasgor", name:"Nasi Goreng Pak Budi", cat:"Warung • Nasi", emoji:"🍳", rating:4.7, eta:"15", km:"2,1",
    tile:"linear-gradient(135deg,#ffb020,#ff7a00)",
    menu:[
      {id:"n1",name:"Nasi Goreng Spesial",emoji:"🍳",price:25000,kcal:640},
      {id:"n2",name:"Mie Goreng Jawa",emoji:"🍜",price:23000,kcal:600},
      {id:"n3",name:"Sate Ayam (10 tusuk)",emoji:"🍢",price:30000,kcal:520},
      {id:"n4",name:"Es Jeruk",emoji:"🍊",price:8000,kcal:110},
      {id:"n5",name:"Tempe Goreng",emoji:"🟫",price:8000,kcal:230},
    ]},
  { id:"bakso", name:"Bakso Urat Mas Slamet", cat:"Bakso • Mie Ayam", emoji:"🍜", rating:4.9, eta:"14", km:"1,1",
    tile:"linear-gradient(135deg,#fa709a,#fee140)",
    menu:[
      {id:"b1",name:"Bakso Urat Jumbo",emoji:"🍜",price:28000,kcal:480},
      {id:"b2",name:"Mie Ayam Bakso",emoji:"🍲",price:25000,kcal:560},
      {id:"b3",name:"Pangsit Goreng",emoji:"🥟",price:12000,kcal:280},
      {id:"b4",name:"Es Teh",emoji:"🧊",price:5000,kcal:100},
      {id:"b5",name:"Kerupuk Pangsit",emoji:"🍘",price:5000,kcal:120},
    ]},
  { id:"martabak", name:"Martabak Bangka 88", cat:"Martabak • Terang Bulan", emoji:"🥞", rating:4.8, eta:"22", km:"3,0",
    tile:"linear-gradient(135deg,#f7971e,#8b5a2b)",
    menu:[
      {id:"m1",name:"Martabak Coklat Keju",emoji:"🍫",price:65000,kcal:1320},
      {id:"m2",name:"Martabak Telur Spesial",emoji:"🥚",price:55000,kcal:980},
      {id:"m3",name:"Terang Bulan Keju Susu",emoji:"🧀",price:60000,kcal:1180},
      {id:"m4",name:"Teh Botol",emoji:"🍶",price:7000,kcal:130},
    ]},
  { id:"kopi", name:"Kopi Tetangga", cat:"Kopi • Minuman", emoji:"☕", rating:4.7, eta:"13", km:"0,8",
    tile:"linear-gradient(135deg,#a47148,#e0c3a0)",
    menu:[
      {id:"k1",name:"Kopi Susu Gula Aren",emoji:"☕",price:22000,kcal:240},
      {id:"k2",name:"Es Americano",emoji:"🧊",price:20000,kcal:15},
      {id:"k3",name:"Butter Croissant",emoji:"🥐",price:28000,kcal:380},
      {id:"k4",name:"Cireng Bumbu Rujak",emoji:"🫓",price:15000,kcal:320},
    ]},
  { id:"padang", name:"Padang Minang Raya", cat:"Masakan Padang", emoji:"🍛", rating:4.8, eta:"18", km:"2,6",
    tile:"linear-gradient(135deg,#c0392b,#7b3f00)",
    menu:[
      {id:"p1",name:"Rendang Daging",emoji:"🥩",price:35000,kcal:620},
      {id:"p2",name:"Ayam Pop",emoji:"🍗",price:28000,kcal:480},
      {id:"p3",name:"Gulai Tunjang",emoji:"🍲",price:30000,kcal:540},
      {id:"p4",name:"Nasi Padang Komplit",emoji:"🍛",price:40000,kcal:900},
    ]},
  { id:"boba", name:"Boba Kekinian", cat:"Boba • Es", emoji:"🧋", rating:4.6, eta:"16", km:"1,9",
    tile:"linear-gradient(135deg,#b06ab3,#4568dc)",
    menu:[
      {id:"o1",name:"Brown Sugar Boba",emoji:"🧋",price:25000,kcal:380},
      {id:"o2",name:"Cheese Tea",emoji:"🧀",price:27000,kcal:340},
      {id:"o3",name:"Taro Latte",emoji:"💜",price:24000,kcal:360},
      {id:"o4",name:"Thai Tea",emoji:"🍵",price:20000,kcal:300},
    ]},
  { id:"seblak", name:"Seblak Teh Neng", cat:"Seblak • Jajanan", emoji:"🌶️", rating:4.7, eta:"15", km:"1,3",
    tile:"linear-gradient(135deg,#ff512f,#dd2476)",
    menu:[
      {id:"s1",name:"Seblak Ceker Jumbo",emoji:"🌶️",price:20000,kcal:420},
      {id:"s2",name:"Cilok Kuah",emoji:"🍡",price:12000,kcal:280},
      {id:"s3",name:"Batagor",emoji:"🥟",price:18000,kcal:360},
      {id:"s4",name:"Es Cendol",emoji:"🥤",price:13000,kcal:240},
    ]},
];

const DRIVERS = [
  { name:"Budi", avatar:"🧑🏽", plat:"B 4821 KGT" },
  { name:"Agus", avatar:"🧔🏽", plat:"B 1907 PXR" },
  { name:"Slamet", avatar:"👨🏽", plat:"D 5523 WAH" },
  { name:"Wahyu", avatar:"🧑🏾", plat:"B 3340 JKO" },
  { name:"Dewi", avatar:"👩🏽", plat:"B 2218 RZL" },
  { name:"Eko", avatar:"👨🏻", plat:"L 7781 EKO" },
];

const STAGES = [
  { p:0,    icon:"✅", label:"Pesanan dikonfirmasi" },
  { p:0.12, icon:"👨‍🍳", label:"Lagi dimasak di dapur" },
  { p:0.40, icon:"🛍️", label:"Driver ambil pesanan" },
  { p:0.54, icon:"🛵", label:"Otw ke lokasi kamu" },
  { p:0.86, icon:"📍", label:"Hampir sampai" },
  { p:1,    icon:"🎉", label:"Pesanan sampai" },
];

const msgs = (r) => ([
  { p:0.10, t:`Pesanan diterima! Meluncur ke ${r} ya kak 🛵` },
  { p:0.34, t:`Lagi ambil pesanan kakak nih 🍱` },
  { p:0.50, t:`Otw ke lokasi kakak, gas! 🚀` },
  { p:0.68, t:`Baru masuk ke jalan kakak 📍` },
  { p:0.82, t:`Udah keliatan rumahnya kak! 👀` },
  { p:0.93, t:`Udah di depan, keluar ya kak 🛎️` },
]);

const PAYS = [
  { id:"gopay", name:"GoPay", note:"Saldo Rp 1.000.000", color:"#00AA13", initials:"go" },
  { id:"ovo",   name:"OVO",   note:"Saldo Rp 850.000",   color:"#4B2A87", initials:"O" },
  { id:"dana",  name:"DANA",  note:"Saldo Rp 640.000",   color:"#118EEA", initials:"d" },
  { id:"cash",  name:"Tunai", note:"Bayar di tempat",    color:"#3aab5a", initials:"Rp" },
];

const ONGKIR = 12000, LAYANAN = 3000;
const rp = (n) => "Rp " + n.toLocaleString("id-ID");
const ROUTE = "M298 40 C 232 78, 262 150, 176 150 C 116 150, 104 152, 48 184";
const CONF_COLORS = ["#06b14f","#ff3d81","#8b5cf6","#ffb020","#2bd66a","#36c5f0","#fe9090"];
const reduced = typeof window !== "undefined" && window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* --------------------------------- app ------------------------------------ */
export default function LaperDoang() {
  const [screen, setScreen] = useState("beranda"); // beranda | menu | checkout | lacak | selesai
  const [restoId, setRestoId] = useState(null);
  const [cart, setCart] = useState({});
  const [pay, setPay] = useState("gopay");
  const [order, setOrder] = useState(null);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [driver, setDriver] = useState(DRIVERS[0]);
  const [muted, setMuted] = useState(false);
  const [deliveries, setDeliveries] = useState(0);
  const [bumpId, setBumpId] = useState(null);
  const [showPop, setShowPop] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [lvlUp, setLvlUp] = useState(false);
  const [tipped, setTipped] = useState(false);

  const resto = useMemo(() => RESTOS.find(r => r.id === restoId) || null, [restoId]);

  const totals = useMemo(() => {
    let subtotal = 0, count = 0, kcal = 0; const items = [];
    if (resto) for (const it of resto.menu) {
      const q = cart[it.id] || 0;
      if (q > 0) { subtotal += it.price * q; count += q; kcal += it.kcal * q; items.push({ ...it, qty: q }); }
    }
    return { subtotal, count, kcal, items };
  }, [cart, resto]);

  /* ---- sound ---- */
  const ac = useRef(null);
  const tone = useCallback((freqs, dur = 0.35, gain = 0.07) => {
    if (muted) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!ac.current) ac.current = new Ctx();
      const a = ac.current; if (a.state === "suspended") a.resume();
      freqs.forEach((f, i) => {
        const o = a.createOscillator(), g = a.createGain();
        o.type = "sine"; o.frequency.value = f;
        const t = a.currentTime + i * 0.11;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + dur + 0.05);
      });
    } catch (e) { /* */ }
  }, [muted]);
  const pop = () => tone([660], 0.12, 0.05);
  const chime = () => tone([523.25, 659.25, 783.99, 1046.5], 0.4, 0.08);

  /* ---- payoff via refs ---- */
  const dRef = useRef(0);
  const onDelivered = () => {
    const nc = dRef.current + 1; dRef.current = nc; setDeliveries(nc);
    if (nc % 5 === 0) { setLvlUp(true); setTimeout(() => setLvlUp(false), 2200); }
    chime(); setScreen("selesai");
  };
  const onDeliveredRef = useRef(onDelivered);
  onDeliveredRef.current = onDelivered;

  /* ---- cart ---- */
  const openResto = (id) => { setRestoId(id); setCart({}); setScreen("menu"); };
  const add = (id) => { setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 })); setBumpId(id); pop(); setTimeout(() => setBumpId(null), 300); };
  const dec = (id) => setCart(c => { const q = (c[id] || 0) - 1; const n = { ...c }; if (q <= 0) delete n[id]; else n[id] = q; return n; });

  const goCheckout = () => { if (totals.count === 0) return; setScreen("checkout"); };

  const placeOrder = () => {
    setOrder({ items: totals.items, subtotal: totals.subtotal, kcal: totals.kcal, count: totals.count });
    setDriver(DRIVERS[Math.floor(Math.random() * DRIVERS.length)]);
    setProgress(0); setSpeed(1); setTipped(false);
    setScreen("lacak"); setShowPop(true);
    setTimeout(() => setShowPop(false), 1250);
  };

  /* ---- sim ---- */
  const doneRef = useRef(false);
  useEffect(() => {
    if (screen !== "lacak") { doneRef.current = false; return; }
    const BASE = 25, tick = 40;
    const id = setInterval(() => {
      setProgress(prev => {
        const next = Math.min(1, prev + (tick / 1000) / BASE * speed);
        if (next >= 1 && !doneRef.current) { doneRef.current = true; setTimeout(() => onDeliveredRef.current(), 250); }
        return next;
      });
    }, tick);
    return () => clearInterval(id);
  }, [screen, speed]);

  /* ---- driver on map ---- */
  const pathRef = useRef(null);
  const [len, setLen] = useState(0);
  const [dpos, setDpos] = useState({ x: 298, y: 40 });
  useEffect(() => { if (screen === "lacak" && pathRef.current) setLen(pathRef.current.getTotalLength()); }, [screen]);
  useEffect(() => {
    if (screen !== "lacak" || !pathRef.current) return;
    const L = pathRef.current.getTotalLength();
    const pt = pathRef.current.getPointAtLength(progress * L);
    setDpos({ x: pt.x, y: pt.y });
  }, [progress, screen, len]);

  /* ---- hearts / tip ---- */
  const spawnHearts = (n = 5) => {
    const base = Date.now();
    const batch = Array.from({ length: n }, (_, i) => ({ id: base + i, left: 30 + Math.random() * 40, delay: i * 70 }));
    setHearts(h => [...h, ...batch]);
    batch.forEach(b => setTimeout(() => setHearts(h => h.filter(x => x.id !== b.id)), 1300 + b.delay));
  };
  const tip = () => { if (tipped) return; setTipped(true); spawnHearts(6); tone([784, 988], 0.25, 0.05); };

  /* ---- viral loop + affiliate slot ---- */
  const shareWA = () => {
    const names = order ? order.items.map(i => i.name).join(", ") : "makanan";
    const text = `Gue baru aja "pesan" ${names} di Laper Doang 🛵 Semua dopamine-nya, tanpa kalorinya 😌 Cobain juga, gratis!`;
    try { window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank"); } catch (e) {}
  };
  // Slot afiliasi "pesan beneran": ganti URL ini dengan deep link GoFood / Grab / link afiliasi Involve Asia.
  const orderReal = () => { try { window.open("https://gofood.co.id", "_blank"); } catch (e) {} };

  /* ---- derived ---- */
  const cur = STAGES.reduce((acc, s, i) => (progress >= s.p ? i : acc), 0);
  const etaSec = Math.max(0, Math.ceil((1 - progress) * 25 / speed));
  const etaTxt = `${Math.floor(etaSec / 60)}:${String(etaSec % 60).padStart(2, "0")}`;
  const msg = msgs(resto?.name || "resto").reduce((acc, m) => (progress >= m.p ? m : acc), null);
  const level = Math.floor(deliveries / 5);
  const meterPct = ((deliveries % 5) / 5) * 100;
  const grandTotal = totals.subtotal + ONGKIR + LAYANAN;

  const confetti = useMemo(() => reduced ? [] : Array.from({ length: 90 }, (_, i) => ({
    id: i, left: Math.random() * 100, size: 6 + Math.random() * 7,
    color: CONF_COLORS[i % CONF_COLORS.length], dur: 2.6 + Math.random() * 2,
    delay: Math.random() * 0.5, round: Math.random() > 0.5,
  })), [screen === "selesai"]);

  const toHome = () => { setScreen("beranda"); setRestoId(null); setCart({}); setProgress(0); setSpeed(1); };
  const savedTotal = order ? order.subtotal + ONGKIR + LAYANAN : 0;

  /* ------------------------------- render -------------------------------- */
  return (
    <div className="ld-app">
      <style>{css}</style>
      <div className="ld-shell">

        <header className="ld-header">
          <div className="ld-brand">
            <div className="ld-logo">🛵</div>
            <div className="ld-wordmark">Laper Doang</div>
          </div>
          <div className="ld-pill" title="Level dopamine kamu">
            <Zap size={14} color="#8b5cf6" fill="#8b5cf6" />
            <b>Lv.{level + 1}</b>
            <div className="ld-meter"><div className="ld-meter-fill" style={{ width: `${meterPct}%` }} /></div>
          </div>
          <button className="ld-icon" onClick={() => setMuted(m => !m)} aria-label={muted ? "Bunyikan" : "Bisukan"}>
            {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>
        </header>

        {/* BERANDA */}
        {screen === "beranda" && (
          <main className="ld-screen">
            <h1 className="ld-h1">Semua <span className="em">dopamine</span>-nya.<br />Tanpa kalorinya.</h1>
            <p className="ld-sub">Pesan apa aja, lacak drivernya, nikmatin sensasinya. Gak ada yang dateng beneran — emang gitu konsepnya.</p>
            <p className="ld-label">Lagi ngidam apa?</p>
            <div className="ld-list">
              {RESTOS.map(r => (
                <button key={r.id} className="ld-card" onClick={() => openResto(r.id)}>
                  <div className="ld-tile" style={{ background: r.tile }}>{r.emoji}</div>
                  <div className="ld-cbody">
                    <p className="ld-name">{r.name}</p>
                    <div className="ld-meta">
                      <span className="star"><Star size={12} fill="#f59e0b" color="#f59e0b" />{r.rating}</span>
                      <span className="dot" />
                      <span><Clock size={11} style={{ verticalAlign: "-1px", marginRight: 3 }} />{r.eta} mnt</span>
                      <span className="dot" />
                      <span>{r.km} km</span>
                      <span className="dot" />
                      <span>{r.cat}</span>
                    </div>
                  </div>
                  <ChevronRight className="ld-chev" size={22} />
                </button>
              ))}
            </div>
            <p className="ld-disclaim">🫶 Gak ada makanan beneran yang dateng. Itu intinya.</p>
          </main>
        )}

        {/* MENU */}
        {screen === "menu" && resto && (
          <main className="ld-screen">
            <button className="ld-back" onClick={toHome}><ArrowLeft size={18} />Kembali</button>
            <div className="ld-rhead">
              <div className="ld-rtile" style={{ background: resto.tile }}>{resto.emoji}</div>
              <div>
                <h2 className="ld-rtitle">{resto.name}</h2>
                <div className="ld-meta">
                  <span className="star"><Star size={12} fill="#f59e0b" color="#f59e0b" />{resto.rating}</span>
                  <span className="dot" /><span>{resto.eta} mnt</span>
                  <span className="dot" /><span>{resto.km} km</span>
                </div>
              </div>
            </div>
            <div>
              {resto.menu.map(it => {
                const q = cart[it.id] || 0;
                return (
                  <div className="ld-item" key={it.id}>
                    <div className="ld-iemoji">{it.emoji}</div>
                    <div className="ld-iinfo">
                      <p className="ld-iname">{it.name}</p>
                      <span className="ld-ikcal">🔥 {it.kcal} kkal yang gak bakal masuk</span>
                    </div>
                    <span className="ld-iprice">{rp(it.price)}</span>
                    {q === 0 ? (
                      <button className={"ld-add" + (bumpId === it.id ? " ld-bump" : "")} onClick={() => add(it.id)} aria-label={`Tambah ${it.name}`}>
                        <Plus size={18} />
                      </button>
                    ) : (
                      <div className="ld-step">
                        <button className="ld-sbtn" onClick={() => dec(it.id)} aria-label="Kurangi"><Minus size={15} /></button>
                        <span className={"ld-qty" + (bumpId === it.id ? " ld-bump" : "")}>{q}</span>
                        <button className="ld-sbtn" onClick={() => add(it.id)} aria-label="Tambah"><Plus size={15} /></button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="ld-bar">
              <button className="ld-cta" disabled={totals.count === 0} onClick={goCheckout}>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="ld-count">{totals.count}</span>
                  Lanjut ke pembayaran
                </span>
                <span>{rp(totals.subtotal)}</span>
              </button>
            </div>
          </main>
        )}

        {/* CHECKOUT */}
        {screen === "checkout" && resto && (
          <main className="ld-screen">
            <button className="ld-back" onClick={() => setScreen("menu")}><ArrowLeft size={18} />Ubah pesanan</button>
            <h2 className="ld-rtitle" style={{ margin: "4px 2px 2px" }}>Konfirmasi pesanan</h2>
            <p className="ld-sub" style={{ marginBottom: 8 }}>{resto.name}</p>

            <div className="ld-summary">
              {totals.items.map(it => (
                <div className="ld-srow" key={it.id}>
                  <span className="lab">{it.qty}× {it.emoji} {it.name}</span>
                  <span className="val">{rp(it.price * it.qty)}</span>
                </div>
              ))}
              <div className="ld-srow"><span className="lab">Subtotal</span><span className="val">{rp(totals.subtotal)}</span></div>
              <div className="ld-srow"><span className="lab">Ongkir</span><span className="val">{rp(ONGKIR)}</span></div>
              <div className="ld-srow"><span className="lab">Biaya layanan</span><span className="val">{rp(LAYANAN)}</span></div>
              <div className="ld-srow tot">
                <span className="lab">Total bayar</span>
                <span className="val"><span className="ld-strike">{rp(grandTotal)}</span><span className="ld-free">Rp 0</span></span>
              </div>
            </div>
            <div className="ld-note">😌 Karena ini cuma buat dopamine, kamu bayar Rp 0. Hemat {rp(grandTotal)} malam ini.</div>

            <p className="ld-sec">Metode pembayaran</p>
            <div className="ld-pays">
              {PAYS.map(p => (
                <button key={p.id} className={"ld-pay" + (pay === p.id ? " on" : "")} onClick={() => setPay(p.id)}>
                  <span className="pi" style={{ background: p.color }}>{p.initials}</span>
                  <span>{p.name}<small>{p.note}</small></span>
                </button>
              ))}
            </div>

            <div className="ld-bar">
              <button className="ld-cta" onClick={placeOrder}>
                <span>Pesan & lacak</span>
                <span>Rp 0</span>
              </button>
            </div>
          </main>
        )}

        {/* LACAK */}
        {screen === "lacak" && resto && (
          <main className="ld-screen">
            <div className="ld-thead">
              <div className="ld-eta">{etaTxt}</div>
              <div className="ld-etalab"><Clock size={14} />{STAGES[cur].label}</div>
            </div>

            <div className="ld-map">
              <svg viewBox="0 0 340 210" preserveAspectRatio="xMidYMid meet">
                <rect x="0" y="0" width="340" height="210" fill="#dcefe2" />
                <rect x="18" y="22" width="78" height="56" rx="12" fill="#c7e7cf" />
                <rect x="232" y="120" width="86" height="70" rx="12" fill="#c7e7cf" />
                <rect x="120" y="0" width="44" height="80" rx="6" fill="#bfe0f2" opacity="0.8" />
                <g stroke="#fff" strokeWidth="11" strokeLinecap="round" opacity="0.9">
                  <line x1="0" y1="96" x2="340" y2="96" />
                  <line x1="186" y1="0" x2="186" y2="210" />
                  <line x1="70" y1="0" x2="70" y2="210" />
                  <line x1="0" y1="168" x2="340" y2="168" />
                </g>
                <path ref={pathRef} d={ROUTE} fill="none" stroke="#a8d8ba" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 9" opacity="0.85" />
                <path d={ROUTE} fill="none" stroke="#06b14f" strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={len} strokeDashoffset={len * (1 - progress)} style={{ transition: "stroke-dashoffset .12s linear" }} />
                <g transform="translate(298,40)">
                  <circle r="15" fill="#fff" /><circle r="15" fill="none" stroke="#cdeed8" strokeWidth="2" />
                  <text textAnchor="middle" dy="6" fontSize="16">{resto.emoji}</text>
                </g>
                <g transform="translate(48,184)">
                  <circle r="15" fill="#fff" /><circle r="15" fill="none" stroke="#d8d2ff" strokeWidth="2" />
                  <text textAnchor="middle" dy="6" fontSize="15">🏠</text>
                </g>
                <g transform={`translate(${dpos.x},${dpos.y})`}>
                  <circle r="18" fill="#06b14f" opacity="0.18">
                    {!reduced && <animate attributeName="r" values="14;20;14" dur="1.6s" repeatCount="indefinite" />}
                  </circle>
                  <circle r="13" fill="#13241b" />
                  <text textAnchor="middle" dy="5" fontSize="14">🛵</text>
                </g>
              </svg>
            </div>

            <div className="ld-prog"><div className="ld-progfill" style={{ width: `${progress * 100}%` }} /></div>

            {msg && <p className="ld-bub" key={msg.p}>{msg.t}</p>}

            <div className="ld-driver">
              <div className="ld-dav">{driver.avatar}<span className="veh">🛵</span></div>
              <div className="ld-dinfo">
                <p className="ld-dname">{driver.name}</p>
                <span className="ld-dmeta"><Star size={12} fill="#f59e0b" color="#f59e0b" />4.9 · {driver.plat}</span>
              </div>
              <button className={"ld-b2 tip" + (tipped ? " on" : "")} style={{ flex: "none", padding: "11px 14px" }} onClick={tip}>
                <Heart size={15} fill={tipped ? "#fff" : "none"} />{tipped ? "Makasih!" : "Tip"}
              </button>
            </div>

            <div className="ld-stages">
              {STAGES.slice(0, 5).map((s, i) => (
                <div key={i} className={"ld-stage " + (i < cur ? "done" : i === cur ? "cur" : "todo")}>
                  <span className="ld-dot">{i < cur ? "✓" : s.icon}</span>
                  <span className="stx">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="ld-row2">
              <button className={"ld-b2 speed" + (speed > 1 ? " on" : "")} onClick={() => setSpeed(s => s > 1 ? 1 : 3)}>
                <Flame size={15} fill={speed > 1 ? "#fff" : "none"} />{speed > 1 ? "Buru-buru!" : "Laper banget!"}
              </button>
              <button className="ld-b2" onClick={toHome}>Batalin</button>
            </div>
          </main>
        )}

        {/* SELESAI */}
        {screen === "selesai" && order && (
          <main className="ld-screen">
            <div className="ld-deliver">
              {confetti.length > 0 && (
                <div className="ld-confetti">
                  {confetti.map(c => (
                    <span key={c.id} className="ld-conf" style={{
                      left: `${c.left}%`, width: c.size, height: c.size, background: c.color,
                      borderRadius: c.round ? "50%" : "2px",
                      animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s`,
                    }} />
                  ))}
                </div>
              )}
              <div className="ld-bigwrap"><div className="ld-big">{order.items[0]?.emoji || "🎉"}</div></div>
              <h2 className="ld-dt"><span className="em">Dopamine</span> terkirim!</h2>
              <p className="ld-ds">{driver.name} udah nganterin ke depan pintu. Bayangin aja aromanya.</p>

              <div className="ld-bag">
                {order.items.map(it => (
                  <span className="ld-bagit" key={it.id}>{it.emoji} {it.name}<span className="q">×{it.qty}</span></span>
                ))}
              </div>

              <div className="ld-stats">
                <div className="ld-stat"><div className="v g">{rp(savedTotal)}</div><div className="k">Duit yang dihemat</div></div>
                <div className="ld-stat"><div className="v o">{order.kcal.toLocaleString("id-ID")}</div><div className="k">Kalori yang lolos</div></div>
                <div className="ld-stat"><div className="v p">+{order.count * 10}</div><div className="k">Poin dopamine</div></div>
              </div>

              <button className="ld-primary" onClick={toHome}><RotateCcw size={18} />Pesan lagi</button>
              <button className="ld-share" onClick={shareWA}><Share2 size={17} />Pamer ke grup WhatsApp</button>
              <button className="ld-real" onClick={orderReal}>Laper beneran? Pesan di GoFood <ExternalLink size={15} /></button>
            </div>
          </main>
        )}

        {/* overlays */}
        {showPop && (
          <div className="ld-pop-over">
            <div>
              <div className="ld-check">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ld-poptxt">Pesanan dibuat! 🎉</p>
            </div>
          </div>
        )}

        {lvlUp && <div className="ld-lvl">⚡ DOPAMINE LEVEL {level + 1}!</div>}

        {hearts.length > 0 && (
          <div className="ld-hearts">
            {hearts.map(h => (
              <span key={h.id} className="ld-heart" style={{ left: `${h.left}%`, animationDelay: `${h.delay}ms` }}>❤️</span>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
