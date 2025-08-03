// DOM Elements
const screens = document.querySelectorAll('.screen');
const navButtons = document.querySelectorAll('[data-screen]');
const sideMenu = document.getElementById('sideMenu');
const menuToggle = document.getElementById('menuToggle');
const menuClose = document.getElementById('menuClose');

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-screen');
    showScreen(target);
    sideMenu.classList.remove('open');
  });
});
menuToggle.addEventListener('click', () => sideMenu.classList.add('open'));
menuClose.addEventListener('click', () => sideMenu.classList.remove('open'));

function showScreen(id) {
  screens.forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (id === 'ranks' && !localStorage.getItem('tutorialRank')) {
    showTutorial(
      'របៀបទិញ Rank',
      ['ជ្រើសរើស Rank ដែលអ្នកចង់ទិញ', 'បញ្ចូល Username Roblox', 'ចុច "Sent" ដើម្បីទៅ Payment'],
      'tutorialRank'
    );
  }
  if (id === 'payment' && !localStorage.getItem('tutorialPayment')) {
    showTutorial(
      'របៀបបង់ប្រាក់',
      [
        'ស្កេន QR ដើម្បីបង់ប្រាក់',
        'Screenshot បង់ប្រាក់ ហើយដាក់ក្នុង Select Photo',
        'បញ្ចូល Username ឬ Link Discord',
        'ចុច "Sent" ដើម្បីបញ្ជូន',
      ],
      'tutorialPayment'
    );
  }
}

// Tutorial Modal Elements
const tutorialModal = document.getElementById('tutorialModal');
const tutorialTitle = document.getElementById('tutorialTitle');
const tutorialSteps = document.getElementById('tutorialSteps');
const tutorialAgree = document.getElementById('tutorialAgree');
let tutorialKey = '';

function showTutorial(title, steps, key) {
  tutorialKey = key;
  tutorialTitle.textContent = title;
  tutorialSteps.innerHTML = steps.map(step => `<li>${step}</li>`).join('');
  tutorialModal.style.display = 'flex';
}
tutorialAgree.addEventListener('click', () => {
  tutorialModal.style.display = 'none';
  if (tutorialKey) localStorage.setItem(tutorialKey, 'done');
});

// Rank select alert
const rankSelect = document.getElementById('rankSelect');
const rankAlert = document.getElementById('rankAlert');
if (rankSelect) {
  rankSelect.addEventListener('change', () => {
    let text = '';
    if (rankSelect.value === 'VIP RANK 5$') text = 'This Rank only 5$';
    else if (rankSelect.value === 'SUPER RANK 8$') text = 'This Rank only 8$';
    else if (rankSelect.value === 'OWNER RANK 12$') text = 'This Rank only 12$';
    rankAlert.textContent = text;
  });
}

// Send to Discord - Buy Rank
document.getElementById('sendToDiscord')?.addEventListener('click', () => {
  const rank = rankSelect.value;
  const username = document.getElementById('robloxUsername').value.trim();
  if (!rank || !username) {
    alert('Fill all fields');
    return;
  }
  showLoading(async () => {
    await fetch(
      'https://discord.com/api/webhooks/1401505761770737674/QiUL9jgAFzps83r4kjnmkpGv1yeRIYbuARj6rtHH2qRJxHxkcNjvZnErmzbbojtmez-t',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `Buy Rank Request:\nRank: ${rank}\nUsername: ${username}`,
        }),
      }
    );
    showScreen('payment');
  });
});

// Send Payment Proof
document.getElementById('sendPayment')?.addEventListener('click', async () => {
  const discordContact = document.getElementById('discordContact').value.trim();
  const fileInput = document.getElementById('fileInput');
  if (!discordContact || fileInput.files.length === 0) {
    alert('Fill all fields & upload screenshot');
    return;
  }
  showLoading(async () => {
    const formData = new FormData();
    formData.append('content', `Payment proof from: ${discordContact}`);
    formData.append('file', fileInput.files[0]);
    await fetch(
      'https://discord.com/api/webhooks/1401505761770737674/QiUL9jgAFzps83r4kjnmkpGv1yeRIYbuARj6rtHH2qRJxHxkcNjvZnErmzbbojtmez-t',
      {
        method: 'POST',
        body: formData,
      }
    );
    alert('Payment sent successfully!');
  });
});

// Loading overlay
function showLoading(callback) {
  let overlay = document.querySelector('.loading-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `<div style="color:#00ff6a;font-size:1.5rem;margin-bottom:10px;">Loading... <span id="loadingPercent">0%</span></div>
      <div style="width: 300px; height: 20px; background:#333; border-radius: 15px; overflow:hidden;">
        <div class="loading-fill" style="width:0; height:100%; background:#00ff6a; transition: width 0.1s;"></div>
      </div>`;
    Object.assign(overlay.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.85)',
      zIndex: '9999',
      userSelect: 'none',
    });
    document.body.appendChild(overlay);
  }
  overlay.style.display = 'flex';
  const fill = overlay.querySelector('.loading-fill');
  const text = overlay.querySelector('#loadingPercent');
  let percent = 0;
  const interval = setInterval(() => {
    percent += 5;
    fill.style.width = percent + '%';
    text.textContent = percent + '%';
    if (percent >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        overlay.style.display = 'none';
        callback();
      }, 400);
    }
  }, 50);
}
