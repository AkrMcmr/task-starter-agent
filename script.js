// タスク開始支援エージェント ウェブサイト JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // ナビゲーションのアクティブ状態管理
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');
    
    // スクロール時のナビゲーション更新
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
    
    // スムーススクロール
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 70,
                behavior: 'smooth'
            });
        });
    });
    
    // プレースホルダー画像の処理
    const placeholderImages = document.querySelectorAll('.placeholder-image');
    placeholderImages.forEach(img => {
        if (!img.getAttribute('src')) {
            img.textContent = '画像準備中';
        }
    });
    
    // ダウンロードボタンのクリックイベント
    const downloadButtons = document.querySelectorAll('.download-card .button');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // ダウンロードファイルが存在しない場合は通知
            const href = this.getAttribute('href');
            if (!href || href === '#') {
                e.preventDefault();
                alert('ダウンロードファイルは準備中です。後ほどお試しください。');
            }
        });
    });
    
    // フィーチャーカードのアニメーション
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }, index * 100);
    });
});
