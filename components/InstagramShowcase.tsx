'use client';

import { useEffect, useState } from 'react';
import { Camera as Instagram, Play, ChevronLeft, ChevronRight, Pause, Sparkles, ExternalLink, Images } from 'lucide-react';
import type { InstagramFeed } from '@/lib/instagram-types';

const PROFILE='https://www.instagram.com/gkp_got_latent/';
export default function InstagramShowcase({ initialFeed }: { initialFeed: InstagramFeed }) {
  const [feed,setFeed]=useState(initialFeed);
  const [index,setIndex]=useState(0);
  const [paused,setPaused]=useState(false);
  const [interacting,setInteracting]=useState(false);
  const [showReel,setShowReel]=useState(false);
  useEffect(()=>{
    const controller=new AbortController();
    const refresh=async()=>{if(document.hidden)return;try{const r=await fetch('/api/instagram',{signal:controller.signal});if(!r.ok)return;const next=await r.json();if(Array.isArray(next.posts)&&next.posts.length&&next.featured)setFeed(next);}catch{}};
    void refresh();const interval=window.setInterval(refresh,300000);
    return()=>{controller.abort();window.clearInterval(interval);};
  },[]);
  useEffect(()=>{
    const query=window.matchMedia('(prefers-reduced-motion: reduce)');
    if(query.matches)setPaused(true);
  },[]);
  useEffect(()=>{
    if(paused||interacting||feed.posts.length<2)return;
    const interval=window.setInterval(()=>{if(!document.hidden)setIndex(i=>(i+1)%feed.posts.length);},6000);
    return()=>window.clearInterval(interval);
  },[paused,interacting,feed.posts.length]);
  const move=(delta:number)=>setIndex(i=>(i+delta+feed.posts.length)%feed.posts.length);
  const dateLabel=(date:string)=>new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'short',year:'numeric',timeZone:'Asia/Kolkata'}).format(new Date(date));
  const views=new Intl.NumberFormat('en',{notation:'compact',maximumFractionDigits:1}).format(feed.featured.views);
  const featured=feed.posts.find(p=>p.permalink.includes('/De6SIoRAY2S/'))||initialFeed.posts[0];
  return <div id="instagram" className="home-section px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
    <section aria-labelledby="viral-reel-title" className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-br from-[#2a1b08] via-[#100e0b] to-black p-5 sm:p-9">
      <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="relative grid items-center gap-8 md:grid-cols-[1.1fr_.9fr]">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.16em] text-amber-300"><Sparkles className="h-4 w-4"/>A GGL moment worth celebrating</p>
          <h2 id="viral-reel-title" className="mt-4 text-3xl font-black leading-tight text-white sm:text-5xl">गोरखपुर से<br/><span className="text-amber-300">लाखों दिलों तक!</span></h2>
          <p className="mt-5 font-mono text-6xl font-black tracking-tight text-amber-300 sm:text-7xl">{views}</p>
          <p className="mt-1 text-lg font-bold text-white">views. One unforgettable GGL moment.</p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">Brijesh Birju के इस musical moment को इतना प्यार देने के लिए शुक्रिया! हर view, हर share और हर मुस्कान—ये जश्न पूरी GGL family के नाम। यहाँ कुछ भी हो सकता है!</p>
          <p className="mt-4 text-xs text-amber-100/70">{feed.featured.views.toLocaleString('en-IN')} views · {feed.featured.live?'Instagram sync':'Verified on Instagram'} · {dateLabel(feed.featured.checkedAt)}</p>
          <a href={feed.featured.permalink} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-black">Watch on Instagram <ExternalLink className="h-4 w-4"/></a>
        </div>
        <div className="mx-auto w-full max-w-[350px] overflow-hidden rounded-2xl border border-amber-400/25 bg-[#090909]">
          {showReel?<iframe title="GGL viral reel — Brijesh Birju" src="https://www.instagram.com/reel/De6SIoRAY2S/embed/" className="h-[550px] w-full border-0 bg-white" allow="autoplay; encrypted-media; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>:
            <button type="button" onClick={()=>setShowReel(true)} aria-label="Play the viral GGL reel" className="group relative block aspect-[3/4] w-full overflow-hidden text-left">
              <img src={featured.thumbnailUrl||'/ggl-logo.png'} alt="Brijesh Birju performing in the viral GGL reel" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy"/>
              <span className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"/>
              <span className="absolute inset-0 flex items-center justify-center"><span className="rounded-full border border-white/50 bg-black/60 p-5 text-amber-300"><Play className="h-9 w-9 fill-current"/></span></span>
              <span className="absolute inset-x-0 bottom-0 p-5"><span className="block text-xs font-bold text-amber-300">THE REEL THAT BROUGHT US TOGETHER</span><span className="mt-1 block text-lg font-black text-white">Brijesh Birju · GGL Episode 1</span></span>
            </button>}
        </div>
      </div>
    </section>
    <section aria-labelledby="instagram-feed-title" aria-roledescription="carousel" className="mx-auto mt-10 max-w-6xl" onMouseEnter={()=>setInteracting(true)} onMouseLeave={()=>setInteracting(false)} onFocusCapture={()=>setInteracting(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setInteracting(false);}}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="home-kicker"><Instagram className="h-4 w-4"/>@gkp_got_latent</p><h2 id="instagram-feed-title" className="mt-2 text-2xl font-black text-white sm:text-3xl">THE GGL FEED</h2><p className="mt-2 text-sm text-slate-400">Reels, photos and the moments in between.</p></div>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Previous Instagram posts" onClick={()=>move(-1)} className="rounded-xl border border-amber-400/30 p-3 text-amber-300"><ChevronLeft className="h-5 w-5"/></button>
          <button type="button" aria-label={paused?'Play Instagram slideshow':'Pause Instagram slideshow'} onClick={()=>setPaused(p=>!p)} className="rounded-xl border border-amber-400/30 p-3 text-amber-300">{paused?<Play className="h-5 w-5"/>:<Pause className="h-5 w-5"/>}</button>
          <button type="button" aria-label="Next Instagram posts" onClick={()=>move(1)} className="rounded-xl border border-amber-400/30 p-3 text-amber-300"><ChevronRight className="h-5 w-5"/></button>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0,1,2].map(offset=>{const post=feed.posts[(index+offset)%feed.posts.length];return <a key={offset} href={post.permalink} target="_blank" rel="noopener noreferrer" aria-label={`Open Instagram post: ${post.caption}`} className={`${offset===1?'hidden sm:block':offset===2?'hidden lg:block':''} group overflow-hidden rounded-2xl border border-white/10 bg-[#111113] transition hover:border-amber-400/50`}>
          <div className="relative aspect-[4/5] overflow-hidden bg-black"><img key={post.id} src={post.thumbnailUrl||'/ggl-logo.png'} alt={post.caption} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" onError={e=>{if(!e.currentTarget.src.endsWith('/ggl-logo.png'))e.currentTarget.src='/ggl-logo.png';}}/><span className="absolute right-3 top-3 rounded-full bg-black/75 p-2 text-white">{post.mediaType==='VIDEO'?<Play className="h-4 w-4"/>:post.mediaType==='CAROUSEL_ALBUM'?<Images className="h-4 w-4"/>:<Instagram className="h-4 w-4"/>}</span></div>
          <div className="p-4"><p className="line-clamp-2 text-sm leading-6 text-slate-300">{post.caption}</p><span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-300">Open on Instagram <ExternalLink className="h-3 w-3"/></span></div>
        </a>;})}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400"><p>{index%feed.posts.length+1} / {feed.posts.length} posts · {feed.mode==='live'?'Instagram feed synced':'Posts checked '+dateLabel(feed.checkedAt)}</p><a href={PROFILE} target="_blank" rel="noopener noreferrer" className="font-bold text-amber-300">Explore all on Instagram →</a></div>
    </section>
  </div>;
}
