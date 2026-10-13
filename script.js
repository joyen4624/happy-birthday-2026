// ==========================================================
// KỊCH BẢN CHÍNH THIỆP SINH NHẬT (STORY SLIDER & INTERACTION)
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {
  const TOTAL_SLIDES = 5;
  const SLIDE_DURATION = 9000; // 9 giây mỗi slide nếu để tự động chạy
  
  let currentSlide = 0;
  let slideTimer = null;
  let slideStartTime = 0;
  let isPaused = false;
  let isCandleBlown = false;

  // Lấy dữ liệu config từ CARD_CONFIG hoặc LocalStorage nếu người dùng đã lưu tùy biến
  let config = window.CARD_CONFIG;
  const savedConfig = localStorage.getItem("birthday_card_custom_config_v3");
  if (savedConfig) {
    try {
      config = JSON.parse(savedConfig);
    } catch (e) {
      console.warn("Lỗi parse config từ localStorage", e);
    }
  }

  // DOM Elements
  const introOverlay = document.getElementById("introOverlay");
  const startCardBtn = document.getElementById("startCardBtn");
  const introGiftBox = document.getElementById("introGiftBox");

  const musicToggleBtn = document.getElementById("musicToggleBtn");
  const configModalBtn = document.getElementById("configModalBtn");

  const touchPrevZone = document.getElementById("touchPrevZone");
  const touchNextZone = document.getElementById("touchNextZone");
  const prevSlideBtn = document.getElementById("prevSlideBtn");
  const nextSlideBtn = document.getElementById("nextSlideBtn");

  const cakeContainer = document.getElementById("cakeContainer");
  const blowCandleBtn = document.getElementById("blowCandleBtn");
  const wishInstruction = document.getElementById("wishInstruction");

  const polaroidCard = document.getElementById("polaroidCard");
  const openLetterBtn = document.getElementById("openLetterBtn");
  const envelopeWrapper = document.getElementById("envelopeWrapper");
  const letterSheet = document.getElementById("letterSheet");
  const closeLetterBtn = document.getElementById("closeLetterBtn");

  const loveCouponCard = document.getElementById("loveCouponCard");
  const couponStamp = document.getElementById("couponStamp");
  const couponHint = document.getElementById("couponHint");
  const btnReplay = document.getElementById("btnReplay");
  let isCouponStamped = false;

  // Config Modal Elements
  const configModal = document.getElementById("configModal");
  const cfgCancelBtn = document.getElementById("cfgCancelBtn");
  const cfgSaveBtn = document.getElementById("cfgSaveBtn");
  const cfgNickname = document.getElementById("cfgNickname");
  const cfgFullname = document.getElementById("cfgFullname");
  const cfgGreeting = document.getElementById("cfgGreeting");
  const cfgLetter = document.getElementById("cfgLetter");
  const cfgSender = document.getElementById("cfgSender");

  // ==========================================================
  // 1. ÁP DỤNG DỮ LIỆU CẤU HÌNH VÀO GIAO DIỆN
  // ==========================================================
  function applyConfig() {
    const displayName = config.recipient.fullName || config.recipient.nickname || "Nguyễn Minh Trung";
    
    // Header
    document.getElementById("headerRecipientName").textContent = `${displayName} ❤️`;
    if (config.recipient.avatar) {
      document.getElementById("headerAvatar").src = config.recipient.avatar;
      document.getElementById("mainAvatar").src = config.recipient.avatar;
    }

    // Intro
    document.getElementById("introTitle").textContent = `Happy Birthday, ${displayName}!`;

    // Slide 1
    document.getElementById("s1Tagline").textContent = config.slide1.tagline || "Happy Birthday To My Man • 14.10.1994";
    document.getElementById("s1Title").textContent = config.slide1.title || "Chúc Mừng Sinh Nhật!";
    document.getElementById("s1Recipient").textContent = `${displayName} 💖`;
    document.getElementById("s1Subtitle").textContent = config.slide1.subtitle;

    // Slide 2: Memory & Reasons
    if (config.slide2.memoryImage) {
      document.getElementById("memoryImg").src = config.slide2.memoryImage;
    }
    document.getElementById("memoryCaption").textContent = config.slide2.memoryCaption || "Khoảnh khắc bên em 📸";

    const reasonsGrid = document.getElementById("reasonsGrid");
    reasonsGrid.innerHTML = "";
    (config.slide2.reasons || []).forEach(r => {
      const card = document.createElement("div");
      card.className = "reason-card";
      card.innerHTML = `
        ${r.icon ? `<span class="reason-icon">${r.icon}</span>` : ''}
        <div class="reason-title">${r.title}</div>
        <div class="reason-text">${r.desc}</div>
      `;
      card.addEventListener("click", (e) => {
        if (window.soundController) window.soundController.playPop();
        if (window.particleSystem) {
          const rect = card.getBoundingClientRect();
          window.particleSystem.burstHearts(10, rect.left + rect.width / 2, rect.top);
        }
      });
      reasonsGrid.appendChild(card);
    });

    // Slide 3: Candle wish text
    if (!isCandleBlown) {
      wishInstruction.textContent = config.slide3.instruction;
    }

    // Slide 4: Secret Letter
    document.getElementById("letterTitle").textContent = config.slide4.letterTitle;
    const letterBody = document.getElementById("letterBody");
    letterBody.innerHTML = "";
    (config.slide4.letterParagraphs || []).forEach(p => {
      const pEl = document.createElement("p");
      pEl.textContent = p;
      letterBody.appendChild(pEl);
    });
    document.getElementById("letterSignature").textContent = config.slide4.letterSign || "Mãi yêu em 💕";

    // Slide 5
    document.getElementById("s5Title").textContent = config.slide5.title;
    document.getElementById("s5Subtitle").textContent = config.slide5.subtitle;
    const couponPerksEl = document.getElementById("couponPerks");
    if (couponPerksEl && config.slide5.perks) {
      couponPerksEl.innerHTML = "";
      config.slide5.perks.forEach(p => {
        const li = document.createElement("li");
        li.textContent = p;
        couponPerksEl.appendChild(li);
      });
    }
  }

  applyConfig();

  // ==========================================================
  // 2. STORY SLIDER & PROGRESS BARS
  // ==========================================================
  function updateStoryBars() {
    for (let i = 0; i < TOTAL_SLIDES; i++) {
      const seg = document.querySelector(`.progress-bar-segment:nth-child(${i + 1})`);
      const fill = document.getElementById(`fill-${i}`);

      if (i < currentSlide) {
        seg.classList.add("completed");
        fill.style.width = "100%";
      } else if (i === currentSlide) {
        seg.classList.remove("completed");
        fill.style.width = "0%";
      } else {
        seg.classList.remove("completed");
        fill.style.width = "0%";
      }
    }
  }

  function showSlide(index) {
    if (index < 0) index = 0;
    if (index >= TOTAL_SLIDES) index = TOTAL_SLIDES - 1;

    currentSlide = index;

    // Toggle class active
    document.querySelectorAll(".slide").forEach((el, idx) => {
      if (idx === currentSlide) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    });

    updateStoryBars();
    startProgressTimer();
  }

  function nextSlide() {
    if (currentSlide < TOTAL_SLIDES - 1) {
      showSlide(currentSlide + 1);
    } else {
      // Đang ở slide cuối
      if (window.particleSystem) window.particleSystem.burstHearts(30);
    }
  }

  function prevSlide() {
    if (currentSlide > 0) {
      showSlide(currentSlide - 1);
    }
  }

  function startProgressTimer() {
    clearInterval(slideTimer);
    if (isPaused) return;

    slideStartTime = Date.now();
    const currentFill = document.getElementById(`fill-${currentSlide}`);

    slideTimer = setInterval(() => {
      if (isPaused) return;
      const elapsed = Date.now() - slideStartTime;
      const percent = Math.min(100, (elapsed / SLIDE_DURATION) * 100);

      if (currentFill) {
        currentFill.style.width = `${percent}%`;
      }

      if (elapsed >= SLIDE_DURATION) {
        clearInterval(slideTimer);
        if (currentSlide < TOTAL_SLIDES - 1) {
          nextSlide();
        }
      }
    }, 100);
  }

  // ==========================================================
  // 3. ĐIỀU HƯỚNG CẢM ỨNG & NÚT BẤM
  // ==========================================================
  touchPrevZone.addEventListener("click", () => {
    if (window.soundController) window.soundController.playPop();
    prevSlide();
  });

  touchNextZone.addEventListener("click", () => {
    if (window.soundController) window.soundController.playPop();
    nextSlide();
  });

  prevSlideBtn.addEventListener("click", () => {
    if (window.soundController) window.soundController.playPop();
    prevSlide();
  });

  nextSlideBtn.addEventListener("click", () => {
    if (window.soundController) window.soundController.playPop();
    nextSlide();
  });

  // Hỗ trợ vuốt tay (Swipe Gestures)
  let touchStartX = 0;
  let touchStartY = 0;
  const viewport = document.getElementById("appViewport");

  viewport.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  viewport.addEventListener("touchend", (e) => {
    const diffX = e.changedTouches[0].clientX - touchStartX;
    const diffY = e.changedTouches[0].clientY - touchStartY;

    // Vuốt ngang
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }, { passive: true });

  // ==========================================================
  // 4. MỞ THIỆP & BẬT NHẠC (INTRO OVERLAY)
  // ==========================================================
  function unlockExperience() {
    introOverlay.classList.add("hidden");
    if (window.soundController) {
      window.soundController.playBGM();
      musicToggleBtn.classList.add("playing");
      musicToggleBtn.innerHTML = "🎶";
    }
    if (window.particleSystem) {
      window.particleSystem.burstHearts(25);
    }
    showSlide(0);
  }

  startCardBtn.addEventListener("click", unlockExperience);
  introGiftBox.addEventListener("click", unlockExperience);

  // Nút bật / tắt nhạc
  musicToggleBtn.addEventListener("click", () => {
    if (window.soundController) {
      const isPlaying = window.soundController.toggle();
      if (isPlaying) {
        musicToggleBtn.classList.add("playing");
        musicToggleBtn.innerHTML = "🎶";
      } else {
        musicToggleBtn.classList.remove("playing");
        musicToggleBtn.innerHTML = "🔇";
      }
    }
  });

  // ==========================================================
  // 5. TƯƠNG TÁC THỔI NẾN (SLIDE 3)
  // ==========================================================
  function blowCandle() {
    if (isCandleBlown) return;
    isCandleBlown = true;

    if (window.soundController) {
      window.soundController.playBlowCandle();
    }

    // Hiệu ứng tắt nến và khói
    cakeContainer.classList.add("candle-blown");

    // Đợi 0.4s rồi nổ pháo hoa và phát âm thanh chúc mừng
    setTimeout(() => {
      if (window.soundController) {
        window.soundController.playSparkleChime();
      }
      if (window.particleSystem) {
        const rect = cakeContainer.getBoundingClientRect();
        window.particleSystem.fireConfetti(rect.left + rect.width / 2, rect.top + 60, 130);
      }

      wishInstruction.innerHTML = `
        <strong style="color: var(--primary-deep); font-size: 16px; display: block; margin-bottom: 6px;">
          ${config.slide3.wishedMessage}
        </strong>
        ${config.slide3.wishedSubtext}
      `;
      blowCandleBtn.style.display = "none";

      // Rung nhẹ điện thoại nếu hỗ trợ
      if (navigator.vibrate) navigator.vibrate([100, 50, 150]);
    }, 400);
  }

  cakeContainer.addEventListener("click", blowCandle);
  blowCandleBtn.addEventListener("click", blowCandle);

  // Tương tác chạm ảnh Polaroid
  polaroidCard.addEventListener("click", () => {
    if (window.soundController) window.soundController.playPop();
    if (window.particleSystem) {
      const rect = polaroidCard.getBoundingClientRect();
      window.particleSystem.burstHearts(18, rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
  });

  // ==========================================================
  // 6. TÂM THƯ BÍ MẬT (SLIDE 4)
  // ==========================================================
  function openLetter() {
    isPaused = true; // Dừng story để đọc thư thảnh thơi
    document.getElementById("envelopeFlap").style.transform = "rotateX(180deg)";
    
    if (window.soundController) {
      window.soundController.playSparkleChime();
    }

    setTimeout(() => {
      letterSheet.classList.add("open");
      if (window.particleSystem) {
        window.particleSystem.burstHearts(20);
      }
    }, 350);
  }

  function closeLetter() {
    letterSheet.classList.remove("open");
    document.getElementById("envelopeFlap").style.transform = "rotateX(0deg)";
    isPaused = false;
    startProgressTimer();
  }

  envelopeWrapper.addEventListener("click", openLetter);
  openLetterBtn.addEventListener("click", openLetter);
  closeLetterBtn.addEventListener("click", closeLetter);

  // ==========================================================
  // 7. FINALE TƯƠNG TÁC (SLIDE 5: PHIẾU ĐẶC QUYỀN & XEM LẠI)
  // ==========================================================
  if (loveCouponCard) {
    loveCouponCard.addEventListener("click", () => {
      if (!isCouponStamped) {
        isCouponStamped = true;
        if (couponStamp) couponStamp.classList.add("stamped");
        if (couponHint) couponHint.textContent = "Đã nhận đặc quyền ❤️";
        
        if (window.soundController) {
          window.soundController.playSparkleChime();
        }
        if (window.particleSystem) {
          const rect = loveCouponCard.getBoundingClientRect();
          window.particleSystem.burstHearts(30, rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
        if (navigator.vibrate) navigator.vibrate([80, 50, 100]);
      } else {
        if (window.soundController) window.soundController.playPop();
        if (window.particleSystem) window.particleSystem.burstHearts(15);
      }
    });
  }

  btnReplay.addEventListener("click", () => {
    isCandleBlown = false;
    isCouponStamped = false;
    cakeContainer.classList.remove("candle-blown");
    blowCandleBtn.style.display = "inline-flex";
    if (couponStamp) couponStamp.classList.remove("stamped");
    if (couponHint) couponHint.textContent = "Chạm để đóng dấu 💌";
    applyConfig();
    showSlide(0);
  });

  // ==========================================================
  // 8. MODAL TÙY BIẾN NHANH
  // ==========================================================
  configModalBtn.addEventListener("click", () => {
    isPaused = true;
    cfgNickname.value = config.recipient.nickname || "";
    cfgFullname.value = config.recipient.fullName || "";
    cfgGreeting.value = config.slide1.subtitle || "";
    cfgLetter.value = (config.slide4.letterParagraphs || []).join("\n\n");
    cfgSender.value = config.slide4.letterSign || "";
    configModal.classList.add("open");
  });

  cfgCancelBtn.addEventListener("click", () => {
    configModal.classList.remove("open");
    isPaused = false;
    startProgressTimer();
  });

  cfgSaveBtn.addEventListener("click", () => {
    config.recipient.fullName = cfgFullname.value.trim() || cfgNickname.value.trim() || "Nguyễn Minh Trung";
    config.recipient.nickname = cfgNickname.value.trim();
    if (cfgGreeting.value.trim()) {
      config.slide1.subtitle = cfgGreeting.value.trim();
    }
    if (cfgLetter.value.trim()) {
      config.slide4.letterParagraphs = cfgLetter.value.trim().split("\n\n").filter(p => p.trim());
    }
    if (cfgSender.value.trim()) {
      config.slide4.letterSign = cfgSender.value.trim();
    }

    localStorage.setItem("birthday_card_custom_config_v3", JSON.stringify(config));
    applyConfig();
    configModal.classList.remove("open");
    isPaused = false;
    startProgressTimer();
    
    if (window.particleSystem) window.particleSystem.burstHearts(20);
  });
});
