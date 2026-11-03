(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;
  var msg = form.querySelector('.form-msg');
  var btn = form.querySelector('button[type=submit]');

  function say(text, cls) {
    msg.textContent = text;
    msg.className = 'form-msg ' + (cls || '');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    var data = Object.fromEntries(new FormData(form).entries());
    if (data.botcheck) return; // honeypot
    delete data.botcheck;
    data.name = (data.first_name + ' ' + data.last_name).trim();

    btn.disabled = true;
    say('Sending...');
    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok && j.success, j: j }; }); })
      .then(function (res) {
        if (res.ok) {
          form.reset();
          say('Thanks. We read every message and will reply personally.', 'ok');
        } else {
          say('Something went wrong. Please email us directly at elena.arida@ionianpinepartners.com.', 'err');
        }
      })
      .catch(function () {
        say('Something went wrong. Please email us directly at elena.arida@ionianpinepartners.com.', 'err');
      })
      .finally(function () { btn.disabled = false; });
  });
})();
