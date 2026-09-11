const languageButton = document.getElementById('language');
const revisedCopy = [
  ['#contact h2', 'İletişim', 'Contact'],
  ['.hero-copy .text-link', 'İletişime geç', 'Contact me'],
  ['.process-top span:first-child', 'ÇALIŞMA YAKLAŞIMI', 'WORKING APPROACH'],
  ['.process-bottom span:first-child', 'SÜREÇ ANALİZİ VE UYGULAMA', 'PROCESS ANALYSIS AND IMPLEMENTATION']
];
revisedCopy.forEach(([selector, turkish, english]) => {
  const element = document.querySelector(selector);
  element.dataset.tr = turkish;
  element.dataset.en = english;
  element.textContent = turkish;
});
let activeLanguage = 'tr';
const methodology = document.createElement('section');
methodology.className = 'methodology wrap';
methodology.innerHTML = `<h3 data-tr="Bir pilot çalışma nasıl ilerler?" data-en="How a pilot works">Bir pilot çalışma nasıl ilerler?</h3>
<div class="method-grid"><article><h4 data-tr="1. Mevcut süreci inceleme" data-en="1. Review the current process">1. Mevcut süreci inceleme</h4><p data-tr="İşin nasıl yapıldığını, kullanılan dosyaları ve tekrar eden sorunları birlikte inceleriz. Zaman kaybını ve hata kaynaklarını belirleyerek iyileştirme önceliğini seçeriz." data-en="We review how the work gets done, the files involved, and recurring problems. We identify time-consuming steps and sources of errors to choose an improvement priority.">İşin nasıl yapıldığını, kullanılan dosyaları ve tekrar eden sorunları birlikte inceleriz. Zaman kaybını ve hata kaynaklarını belirleyerek iyileştirme önceliğini seçeriz.</p></article>
<article><h4 data-tr="2. Sınırlı bir çözüm geliştirme" data-en="2. Build a focused solution">2. Sınırlı bir çözüm geliştirme</h4><p data-tr="Örneğin Excel raporlarını birleştirme, sipariş verilerini düzenleme veya tekrarlanan bir adımı otomatikleştirme üzerinde çalışırız. Veri kaynaklarını, teslimatı ve kontrol noktalarını baştan tanımlarız." data-en="The pilot might combine Excel reports, organize order data, or automate a repetitive step. We agree on data sources, deliverables, and review points before starting.">Örneğin Excel raporlarını birleştirme, sipariş verilerini düzenleme veya tekrarlanan bir adımı otomatikleştirme üzerinde çalışırız. Veri kaynaklarını, teslimatı ve kontrol noktalarını baştan tanımlarız.</p></article>
<article><h4 data-tr="3. Sonucu değerlendirme" data-en="3. Evaluate the outcome">3. Sonucu değerlendirme</h4><p data-tr="Hazırlama süresi, hata sayısı veya manuel işlem adedi gibi başlangıç ölçümleriyle sonucu karşılaştırırız. Fayda ve bakım ihtiyacını değerlendirerek devam kararını birlikte veririz." data-en="We compare results with baseline measures such as preparation time, errors, or manual steps. We assess the benefit and maintenance needs before deciding whether to continue.">Hazırlama süresi, hata sayısı veya manuel işlem adedi gibi başlangıç ölçümleriyle sonucu karşılaştırırız. Fayda ve bakım ihtiyacını değerlendirerek devam kararını birlikte veririz.</p></article></div>
<p class="method-note" data-tr="AI; belge içeriği çıkarma, sınıflandırma ve özetleme gibi uygun adımlarda kullanılabilir. Sayısal hesaplamalar tanımlı kurallarla doğrulanır; kritik işlemlerde insan kontrolü korunur. Çözüm ve ücret, mevcut süreç incelendikten sonra kapsamla birlikte belirlenir." data-en="AI can support suitable steps such as document extraction, classification, and summarization. Numerical calculations are validated against defined rules, with human review for critical actions. The solution and fee are scoped after reviewing the existing process.">AI; belge içeriği çıkarma, sınıflandırma ve özetleme gibi uygun adımlarda kullanılabilir. Sayısal hesaplamalar tanımlı kurallarla doğrulanır; kritik işlemlerde insan kontrolü korunur. Çözüm ve ücret, mevcut süreç incelendikten sonra kapsamla birlikte belirlenir.</p>`;
document.querySelector('.services').after(methodology);
const linkedIn = document.createElement('a');
linkedIn.href = 'https://www.linkedin.com/in/numan-ozan';
linkedIn.target = '_blank';
linkedIn.rel = 'noopener noreferrer';
linkedIn.textContent = 'LinkedIn ↗';
document.querySelector('footer').append(linkedIn);
function setLanguage(language) {
  activeLanguage = language;
  document.documentElement.lang = language;
  document.querySelectorAll('[data-tr][data-en]').forEach(element => {
    element.innerHTML = element.dataset[language];
  });
  languageButton.innerHTML = `${language === 'tr' ? 'EN' : 'TR'} <span aria-hidden="true">↗</span>`;
  languageButton.setAttribute('aria-label', language === 'tr' ? 'Switch to English' : 'Türkçeye geç');
  document.title = language === 'tr' ? 'Numan Ozan — Veri ve Operasyon' : 'Numan Ozan — Data & Operations';
}
languageButton.addEventListener('click', () => setLanguage(activeLanguage === 'tr' ? 'en' : 'tr'));
