// ============================================
// Invitation Generator - Main Script
// ============================================

// DOM Elements
const logoInput = document.getElementById('logoInput');
const logoPreview = document.getElementById('logoPreview');
const logoPlaceholder = document.getElementById('logoPlaceholder');
const eventTitle = document.getElementById('eventTitle');
const eventDate = document.getElementById('eventDate');
const eventTime = document.getElementById('eventTime');
const eventLocation = document.getElementById('eventLocation');
const eventDetails = document.getElementById('eventDetails');
const namesList = document.getElementById('namesList');
const namesCount = document.getElementById('namesCount');
const fontSelect = document.getElementById('fontSelect');
const textColor = document.getElementById('textColor');
const accentColor = document.getElementById('accentColor');
const previewBtn = document.getElementById('previewBtn');
const generateBtn = document.getElementById('generateBtn');
const previewSection = document.getElementById('previewSection');
const previewGuestName = document.getElementById('previewGuestName');
const previewEventTitle = document.getElementById('previewEventTitle');
const previewDate = document.getElementById('previewDate');
const previewTime = document.getElementById('previewTime');
const previewLocation = document.getElementById('previewLocation');
const previewDetails = document.getElementById('previewDetails');
const downloadSingleBtn = document.getElementById('downloadSingleBtn');
const progressSection = document.getElementById('progressSection');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const resultsSection = document.getElementById('resultsSection');
const resultsInfo = document.getElementById('resultsInfo');
const downloadZipBtn = document.getElementById('downloadZipBtn');
const resetBtn = document.getElementById('resetBtn');
const gallery = document.getElementById('gallery');
const generationContainer = document.getElementById('generationContainer');
const bgImage = document.getElementById('bgImage');
const bgFallback = document.getElementById('bgFallback');
const inviteLogo = document.getElementById('inviteLogo');

// State
let generatedImages = [];
let currentLogo = null;

// ============================================
// Logo Upload
// ============================================
logoPlaceholder.addEventListener('click', () => logoInput.click());

logoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            currentLogo = event.target.result;
            logoPreview.src = currentLogo;
            logoPreview.classList.add('active');
            logoPlaceholder.style.display = 'none';
            inviteLogo.src = currentLogo;
        };
        reader.readAsDataURL(file);
    }
});

// ============================================
// Names Count
// ============================================
namesList.addEventListener('input', () => {
    const names = namesList.value.split('\n').filter(n => n.trim() !== '');
    namesCount.textContent = `${names.length} اسم`;
});

// ============================================
// Live Preview Update
// ============================================
function updatePreview(name = 'أحمد محمد') {
    previewGuestName.textContent = name || 'أحمد محمد';
    previewEventTitle.textContent = eventTitle.value || 'عنوان المناسبة';
    previewDate.textContent = eventDate.value || 'التاريخ';
    previewTime.textContent = eventTime.value || 'الوقت';
    previewLocation.textContent = eventLocation.value || 'المكان';
    previewDetails.textContent = eventDetails.value || '';
    previewDetails.style.display = eventDetails.value ? 'block' : 'none';

    // Update font
    previewGuestName.style.fontFamily = fontSelect.value;
    previewEventTitle.style.fontFamily = fontSelect.value;

    // Update colors
    previewGuestName.style.color = accentColor.value;
    previewEventTitle.style.color = textColor.value;
}

[eventTitle, eventDate, eventTime, eventLocation, eventDetails, fontSelect, textColor, accentColor].forEach(el => {
    el.addEventListener('input', () => updatePreview());
});

// ============================================
// Preview Button
// ============================================
previewBtn.addEventListener('click', () => {
    updatePreview();
    previewSection.style.display = 'block';
    previewSection.scrollIntoView({ behavior: 'smooth' });
});

// ============================================
// Download Single Preview
// ============================================
downloadSingleBtn.addEventListener('click', async () => {
    const card = document.getElementById('inviteCard');
    try {
        const canvas = await html2canvas(card, {
            scale: 3,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null,
            logging: false
        });

        const link = document.createElement('a');
        link.download = `دعوة_${previewGuestName.textContent}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        link.click();
    } catch (err) {
        alert('حدث خطأ أثناء التحميل: ' + err.message);
    }
});

// ============================================
// Generate All Invitations
// ============================================
generateBtn.addEventListener('click', async () => {
    // Validation
    if (!eventTitle.value.trim()) {
        alert('❌ الرجاء إدخال عنوان المناسبة');
        eventTitle.focus();
        return;
    }
    if (!eventDate.value.trim()) {
        alert('❌ الرجاء إدخال التاريخ');
        eventDate.focus();
        return;
    }
    if (!eventTime.value.trim()) {
        alert('❌ الرجاء إدخال الوقت');
        eventTime.focus();
        return;
    }
    if (!eventLocation.value.trim()) {
        alert('❌ الرجاء إدخال المكان');
        eventLocation.focus();
        return;
    }

    const names = namesList.value.split('\n').filter(n => n.trim() !== '');
    if (names.length === 0) {
        alert('❌ الرجاء إدخال قائمة المدعوين');
        namesList.focus();
        return;
    }

    // Show progress
    previewSection.style.display = 'none';
    progressSection.style.display = 'block';
    resultsSection.style.display = 'none';
    progressSection.scrollIntoView({ behavior: 'smooth' });

    generatedImages = [];
    const total = names.length;

    // Create generation card (hidden)
    const genCard = document.createElement('div');
    genCard.className = 'invite-card';
    genCard.style.width = '1080px';
    genCard.style.height = '1920px';
    genCard.style.position = 'absolute';
    genCard.style.left = '-9999px';
    genCard.innerHTML = `
        <div class="invite-bg">
            <img src="${bgImage.src}" class="bg-image active" style="display: block;">
            <div class="bg-fallback" style="display: none;"></div>
        </div>
        <div class="invite-content" style="padding: 90px 75px;">
            <div class="invite-header" style="margin-bottom: 60px;">
                <img src="${currentLogo || 'assets/logo.png'}" class="invite-logo" style="max-width: 210px; max-height: 150px;">
                <div class="invite-badge" style="padding: 18px 54px; font-size: 2.7rem; border-radius: 60px;">دعوة</div>
            </div>
            <div class="invite-body" style="gap: 45px;">
                <div class="guest-name" style="font-size: 4.8rem;"></div>
                <div class="event-title" style="font-size: 3.3rem;"></div>
                <div class="event-details" style="gap: 24px; margin-top: 30px;">
                    <div class="detail-item" style="padding: 24px 45px; font-size: 2.55rem; border-radius: 30px;">
                        <span class="detail-icon" style="font-size: 3rem;">📅</span>
                        <span class="detail-date"></span>
                    </div>
                    <div class="detail-item" style="padding: 24px 45px; font-size: 2.55rem; border-radius: 30px;">
                        <span class="detail-icon" style="font-size: 3rem;">🕐</span>
                        <span class="detail-time"></span>
                    </div>
                    <div class="detail-item" style="padding: 24px 45px; font-size: 2.55rem; border-radius: 30px;">
                        <span class="detail-icon" style="font-size: 3rem;">📍</span>
                        <span class="detail-location"></span>
                    </div>
                </div>
                <div class="invite-footer" style="margin-top: 45px; font-size: 2.7rem;"></div>
            </div>
        </div>
    `;
    generationContainer.appendChild(genCard);

    // Update styles for generation
    const genGuestName = genCard.querySelector('.guest-name');
    const genEventTitle = genCard.querySelector('.event-title');
    const genDate = genCard.querySelector('.detail-date');
    const genTime = genCard.querySelector('.detail-time');
    const genLocation = genCard.querySelector('.detail-location');
    const genFooter = genCard.querySelector('.invite-footer');

    genGuestName.style.fontFamily = fontSelect.value;
    genEventTitle.style.fontFamily = fontSelect.value;
    genGuestName.style.color = accentColor.value;
    genEventTitle.style.color = textColor.value;

    // Generate for each name
    for (let i = 0; i < total; i++) {
        const name = names[i].trim();

        // Update progress
        const progress = ((i + 1) / total) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${i + 1} / ${total} - ${name}`;

        // Update card content
        genGuestName.textContent = name;
        genEventTitle.textContent = eventTitle.value;
        genDate.textContent = eventDate.value;
        genTime.textContent = eventTime.value;
        genLocation.textContent = eventLocation.value;

        if (eventDetails.value.trim()) {
            genFooter.textContent = eventDetails.value;
            genFooter.style.display = 'block';
        } else {
            genFooter.style.display = 'none';
        }

        // Wait for fonts and images
        await document.fonts.ready;
        await new Promise(resolve => setTimeout(resolve, 100));

        // Capture
        try {
            const canvas = await html2canvas(genCard, {
                scale: 1,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                logging: false,
                width: 1080,
                height: 1920
            });

            const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
            generatedImages.push({
                name: name,
                dataUrl: dataUrl
            });
        } catch (err) {
            console.error('Error generating for', name, err);
        }
    }

    // Cleanup
    generationContainer.removeChild(genCard);

    // Show results
    progressSection.style.display = 'none';
    resultsSection.style.display = 'block';
    resultsInfo.textContent = `تم توليد ${generatedImages.length} دعوة من أصل ${total}`;
    resultsSection.scrollIntoView({ behavior: 'smooth' });

    // Build gallery
    gallery.innerHTML = '';
    generatedImages.forEach((img, idx) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <img src="${img.dataUrl}" alt="${img.name}" loading="lazy">
            <div class="gallery-item-name">${img.name}</div>
        `;
        item.addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = `دعوة_${img.name}.jpg`;
            link.href = img.dataUrl;
            link.click();
        });
        gallery.appendChild(item);
    });
});

// ============================================
// Download ZIP
// ============================================
downloadZipBtn.addEventListener('click', async () => {
    if (generatedImages.length === 0) return;

    const zip = new JSZip();
    const folder = zip.folder('الدعوات');

    generatedImages.forEach((img, idx) => {
        const base64Data = img.dataUrl.split(',')[1];
        folder.file(`دعوة_${idx + 1}_${img.name}.jpg`, base64Data, { base64: true });
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `دعوات_${eventTitle.value || 'المناسبة'}_${new Date().toLocaleDateString('ar-SA')}.zip`);
});

// ============================================
// Reset
// ============================================
resetBtn.addEventListener('click', () => {
    if (confirm('هل تريد مسح كل البيانات وبدء من جديد؟')) {
        eventTitle.value = '';
        eventDate.value = '';
        eventTime.value = '';
        eventLocation.value = '';
        eventDetails.value = '';
        namesList.value = '';
        namesCount.textContent = '0 اسم';
        generatedImages = [];

        previewSection.style.display = 'none';
        progressSection.style.display = 'none';
        resultsSection.style.display = 'none';
        gallery.innerHTML = '';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// ============================================
// Background Image Check
// ============================================
bgImage.onload = () => {
    bgImage.classList.add('active');
    bgFallback.style.display = 'none';
};

bgImage.onerror = () => {
    bgImage.classList.remove('active');
    bgFallback.style.display = 'flex';
};

// Initial preview
updatePreview();