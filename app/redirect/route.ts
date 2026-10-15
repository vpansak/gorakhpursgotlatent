export function GET() {
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#090909" />
  <title>GGL on YouTube</title>
  <style>
    *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at top,#341010 0,#090909 58%);color:#fff;font-family:Arial,Helvetica,sans-serif;text-align:center}
    .card{width:min(100%,420px);padding:34px 24px;border:1px solid #6f2929;border-radius:24px;background:rgba(18,18,18,.94);box-shadow:0 18px 60px #0008}
    .logo{font-size:13px;letter-spacing:4px;color:#f4bd55;font-weight:800}.play{width:68px;height:48px;border-radius:14px;background:#e62117;display:grid;place-items:center;margin:24px auto;font-size:27px}
    h1{font-size:26px;line-height:1.2;margin:0 0 12px}p{color:#d5d5d5;line-height:1.55;margin:8px 0}.count{font-size:54px;font-weight:800;color:#ffd166;margin:18px 0 6px}.small{font-size:13px;color:#a9a9a9}.bar{height:5px;background:#353535;border-radius:8px;overflow:hidden;margin:20px 0}.fill{height:100%;width:0;background:#e62117;animation:progress 5s linear forwards}@keyframes progress{to{width:100%}}
    a{display:inline-block;margin-top:18px;padding:13px 20px;border-radius:999px;background:#e62117;color:white;text-decoration:none;font-weight:700}
  </style>
</head>
<body>
  <main class="card">
    <div class="logo">GORAKHPUR'S GOT LATENT</div>
    <div class="play">▶</div>
    <h1>Watch Full Video!</h1>
    <p>❤️ Like the video<br>🔔 Subscribe to our YouTube channel</p>
    <div class="count" id="count">5</div>
    <p class="small">Taking you to YouTube in <span id="label">5</span> seconds…</p>
    <div class="bar"><div class="fill"></div></div>
    <p class="small">Thank you for supporting GGL!</p>
    <a id="open" href="https://youtube.com/@gkpgotlatent?si=_APjsf1z4sjN5jpT">Open YouTube Now</a>
  </main>
  <script>
    (function(){
      var seconds = 5;
      var count = document.getElementById('count');
      var label = document.getElementById('label');
      var webUrl = 'https://youtube.com/@gkpgotlatent?si=_APjsf1z4sjN5jpT';
      var appUrl = 'intent://www.youtube.com/@gkpgotlatent?si=_APjsf1z4sjN5jpT#Intent;scheme=https;package=com.google.android.youtube;S.browser_fallback_url=https%3A%2F%2Fyoutube.com%2F%40gkpgotlatent%3Fsi%3D_APjsf1z4sjN5jpT;end';
      document.getElementById('open').addEventListener('click', function(e){
        e.preventDefault();
        window.location.href = appUrl;
      });
      var timer = setInterval(function(){
        seconds -= 1;
        count.textContent = seconds;
        label.textContent = seconds;
        if(seconds <= 0){
          clearInterval(timer);
          window.location.href = appUrl;
          setTimeout(function(){ window.location.replace(webUrl); }, 1200);
        }
      }, 1000);
    })();
  </script>
</body>
</html>`;
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
