const fs = require('fs');

(async () => {
  const fileBuffer = fs.readFileSync('client/public/images/branding/logo-transparent.png');
  const blob = new Blob([fileBuffer], { type: 'image/png' });
  const form = new FormData();
  form.append('image', blob, 'logo-transparent.png');
  
  const res = await fetch('http://localhost:3333/test', {
    method: 'POST',
    body: form
  });
  console.log(await res.text());
})();
