const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type, duration = 0.1, frequency = 440) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
        case 'click':
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(2000, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
            break;
            
        case 'glitch':
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(Math.random() * 2000 + 100, audioContext.currentTime);
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(1000, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            break;
            
        case 'ping':
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(2000, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            break;
            
        case 'powerOn':
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(50, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.5);
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            break;
    }
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

function createBackgroundNoise() {
    const bufferSize = 2 * audioContext.sampleRate;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    
    const whiteNoise = audioContext.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, audioContext.currentTime);
    
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);
    
    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    whiteNoise.start(0);
    return whiteNoise;
}

const data = {
    username: "lord_of_the_craim",
    domain: "craim-lab",
    os: "Linux x86_64",
    host: "Russia",
    uptime: "14 years",
    shell: "gemini 3 (vibecoding)",
    langs: "ru (native)",
    project: "Telegram Mini App",
    site: "https://craim-lab.ru"
};

async function typeText(element, text, delay = 50) {
    element.style.opacity = 1;
    for (let i = 0; i < text.length; i++) {
        element.textContent += text[i];
        playSound('click', 0.05);
        await new Promise(r => setTimeout(r, delay));
    }
    element.innerHTML += '<span class="cursor"></span>';
}

async function runAnimation() {
    let backgroundNoise;
    document.addEventListener('click', () => {
        audioContext.resume();
        if (!backgroundNoise) {
            backgroundNoise = createBackgroundNoise();
        }
    }, { once: true });

    const terminal = document.getElementById('terminal');
    const glitch = document.getElementById('glitch');

    await new Promise(r => setTimeout(r, 2000));
    playSound('powerOn', 0.5);

    const prompt = `[${data.username}@${data.domain}]:~$ `;
    await typeText(document.getElementById('line1'), prompt, 60);
    await new Promise(r => setTimeout(r, 500));

    const lines = [
        `OS: ${data.os}`,
        `Host: ${data.host}`,
        `Uptime: ${data.uptime}`,
        `Shell: ${data.shell}`,
        `Langs: ${data.langs}`,
        `Project: ${data.project}`
    ];

    for (let i = 0; i < lines.length; i++) {
        document.getElementById(`line${i + 2}`).style.opacity = 1;
        document.getElementById(`line${i + 2}`).innerHTML = lines[i] + '<span class="cursor"></span>';
        playSound('click', 0.1);
        await new Promise(r => setTimeout(r, 300));
    }

    await new Promise(r => setTimeout(r, 500));

    const linkLine = document.getElementById('line8');
    linkLine.innerHTML = `<span class="link">${data.site}</span><span class="cursor"></span>`;
    linkLine.style.opacity = 1;
    playSound('ping', 0.2);
    linkLine.querySelector('.link').classList.add('highlight');
    await new Promise(r => setTimeout(r, 1000));

    await new Promise(r => setTimeout(r, 1000));
    glitch.classList.add('active');
    playSound('glitch', 0.5);
    await new Promise(r => setTimeout(r, 500));
    glitch.classList.remove('active');

    await new Promise(r => setTimeout(r, 500));
    document.querySelector('.crt').classList.add('breathing');
}

runAnimation();
