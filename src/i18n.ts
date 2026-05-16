// src/i18n.ts
// Dynamic i18n system - fetches translations from backend API
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// ============================================
// LOCAL FALLBACK (dùng khi API chưa sẵn sàng)
// ============================================
const fallbackResources = {
  vi: {
    translation: {
      nav: { home: 'Trang chủ', about: 'Giới thiệu', skills: 'Kỹ năng', projects: 'Dự án', achievements: 'Thành tựu', contact: 'Liên hệ' },
      hero: { role: 'Lập trình viên Frontend', tagline: '"Kiến tạo trải nghiệm kỹ thuật số mượt mà với React & tư duy UI/UX"', cta_project: 'Xem Dự án', cta_cv: 'Tải CV', cta_transcript: 'Bảng Điểm Excel', scroll: 'Cuộn để khám phá' },
      about: { title: 'Giới thiệu', description: 'Lập trình viên Frontend đầy nhiệt huyết với nền tảng vững chắc trong việc xây dựng ứng dụng web tập trung vào người dùng và responsive. Thành thạo ReactJS, TypeScript và các framework CSS hiện đại, với tư duy UI/UX được phát triển qua Figma.', gpa: 'Điểm GPA', status: 'Trạng thái', excellent_student: 'Sinh viên Xuất sắc', projects: 'Dự án', technologies: 'Công nghệ', experience: 'Kinh nghiệm' },
      skills: { title: 'Bản Giao Hưởng Công Nghệ', piano_hint: '— Click vào phím để tấu bản giao hưởng tech của bạn —', frontend: 'Frontend', uiux: 'UI/UX', tools: 'Công cụ & Công nghệ', soft_skills: 'Kỹ năng mềm', languages: 'Ngôn ngữ', native: 'Bản địa', english_level: 'Giao tiếp tốt', problem_solving: 'Giải quyết vấn đề', teamwork: 'Làm việc nhóm', time_management: 'Quản lý thời gian' },
      projects: { title: 'Kiệt Tác Số', view_demo: 'Xem thiết kế', view_code: 'Mã nguồn', design_accuracy: 'Độ chính xác thiết kế', grade: 'Điểm số', responsive: 'Responsive', tech_stack: 'Công nghệ sử dụng', role_frontend: 'Frontend Developer & UI/UX Designer', role_wordpress: 'WordPress Developer / Quản trị web', badminton_desc: 'Thiết kế và phát triển website thương mại điện tử cầu lông.', wordpress_desc: 'Tùy chỉnh theme WordPress, tối ưu SEO & hiệu suất.' },
      achievements: { title: 'Thành tựu', excellent_student_desc: 'Đạt thành tích học tập xuất sắc với GPA 3.65/4.0', good_student_desc: 'Duy trì thành tích học tập tốt qua nhiều học kỳ', hackathon_desc: 'Đề tài: Thiết kế ứng dụng di động Beauty Spa.', hackathons: 'Hackathon', awards: 'Giải thưởng', projects: 'Dự án', clients: 'Khách hàng hài lòng' },
      contact: { title: 'Kết nối với tôi', get_in_touch: 'Liên hệ', description: 'Tôi luôn sẵn sàng thảo luận về các cơ hội mới. Đừng ngại liên hệ!', phone: 'Điện thoại', email: 'Email', location: 'Địa điểm', social_media: 'Tìm tôi trên:', send_message: 'Gửi tin nhắn', name: 'Tên', name_placeholder: 'Tên của bạn', email_placeholder: 'email@example.com', message: 'Tin nhắn', message_placeholder: 'Nội dung...', send: 'Gửi tin nhắn', sending: 'Đang gửi...', sent: 'Đã gửi thành công!', sent_description: 'Cảm ơn bạn. Tôi sẽ phản hồi sớm!', error_message: 'Gửi thất bại.' },
      footer: { rights: 'Đã đăng ký bản quyền.', back_to_top: 'Về đầu trang', built_with: 'Xây dựng với', using: 'sử dụng React & Tailwind', audio_credit: 'Trải nghiệm được nâng cao với sóng công nghệ' },
      music: { play: 'Phát nhạc', pause: 'Tạm dừng', symphony: 'Bản giao hưởng', vinyl: 'Đĩa than', track: 'Bài hát', album: 'Album số', hint: 'Click để thưởng thức nhạc 🎵' },
      language: { switch_title: 'Chọn ngôn ngữ', auto_detect: 'Tự động', current: 'Hiện tại' },
    },
  },
};

// ============================================
// DETECT NGÔN NGỮ ƯU TIÊN
// ============================================
const getInitialLanguage = (): string => {
  // 1. Ưu tiên localStorage (user đã chọn trước đó)
  const savedLang = localStorage.getItem('i18nextLng');
  if (savedLang) return savedLang;

  // 2. Auto-detect từ browser
  const browserLang = navigator.language?.split('-')[0]?.toLowerCase();
  if (['vi', 'en', 'ja', 'zh'].includes(browserLang)) return browserLang;

  // 3. Mặc định
  return 'vi';
};

// ============================================
// INIT i18n
// ============================================
i18n.use(initReactI18next).init({
  resources: fallbackResources,
  lng: getInitialLanguage(),
  fallbackLng: 'vi',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

// ============================================
// FETCH DANH SÁCH NGÔN NGỮ KHẢ DỤNG
// ============================================
export interface LanguageInfo {
  lang: string;
  label: string;
  flag: string;
  nativeName: string;
  isDefault: boolean;
}

const fallbackLanguages: LanguageInfo[] = [
  { lang: 'vi', label: 'Tiếng Việt', flag: '🇻🇳', nativeName: 'Tiếng Việt', isDefault: true },
  { lang: 'en', label: 'English', flag: '🇺🇸', nativeName: 'English', isDefault: false },
  { lang: 'zh', label: '中文', flag: '🇨🇳', nativeName: '简体中文', isDefault: false },
];

export const fetchAvailableLanguages = async (): Promise<LanguageInfo[]> => {
  try {
    const res = await fetch(`/api/translations`);
    const data = await res.json();

    if (data.success && data.data.length > 0) {
      const languages = data.data as LanguageInfo[];

      // Đồng bộ ngôn ngữ mặc định từ server
      const defaultLang = languages.find(l => l.isDefault);
      const isUserSelected = localStorage.getItem('i18nextLng_userSelected');

      // Nếu user chưa từng tự chọn ngôn ngữ, hoặc chưa có ngôn ngữ trong localStorage
      // Thì luôn ưu tiên ngôn ngữ mặc định mới nhất từ server
      if (!isUserSelected && defaultLang && i18n.language !== defaultLang.lang) {
        i18n.changeLanguage(defaultLang.lang);
        document.documentElement.lang = defaultLang.lang;
      }

      return languages;
    }
    return fallbackLanguages;
  } catch (error) {
    console.warn('[i18n] Failed to fetch available languages from API.', error);
    return fallbackLanguages;
  }
};

// ============================================
// CHANGE LANGUAGE
// ============================================
export const changeLanguage = async (lang: string): Promise<void> => {
  await i18n.changeLanguage(lang);
  localStorage.setItem('i18nextLng', lang);
  document.documentElement.lang = lang;
};

// Lắng nghe event đổi ngôn ngữ
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
  document.documentElement.lang = lng;
});

// Tự động gọi fetch khi load file để đồng bộ ngôn ngữ mặc định sớm nhất có thể
fetchAvailableLanguages();

export default i18n;