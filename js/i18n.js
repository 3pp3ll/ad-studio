/* Interface dictionary. Each entry is [Arabic, English]; UI.ar and UI.en are built from it.
   Use t('key') for every interface string. The ad language (draft.lang) is separate from this. */
const I18N = {
  app: ['استوديو تصميم وتسويق', 'Design & Marketing Studio'],
  sar: ['ر.س', 'SAR'], kb: ['كيلوبايت', 'KB'], mb: ['ميجا', 'MB'],
  deleted: ['محذوف', 'Deleted'], confirm: ['تأكيد', 'Confirm'], cancel: ['إلغاء', 'Cancel'], done: ['تم', 'Done'],
  save_l: ['حفظ', 'Save'], add_l: ['إضافة', 'Add'], soon: ['قريباً', 'Soon'], busy: ['جارٍ التوليد عبر OpenRouter…', 'Generating with OpenRouter…'],
  logout: ['خروج', 'Sign out'], seg_label: ['الواجهة', 'Workspace'], seg_user: ['تطبيق المستخدم', 'User app'], seg_admin: ['لوحة الإدارة', 'Admin'],
  switch_lang: ['تبديل لغة الواجهة', 'Switch interface language'], theme: ['المظهر', 'Theme'],
  theme_auto: ['تلقائي', 'Auto'], theme_light: ['فاتح', 'Light'], theme_dark: ['داكن', 'Dark'], nav_label: ['التنقل', 'Navigation'],

  nav_home: ['الرئيسية', 'Home'], nav_create: ['إنشاء إعلان', 'Create ad'], nav_image: ['توليد صورة', 'Generate image'], nav_video: ['توليد فيديو', 'Generate video'],
  nav_library: ['مكتبة الإعلانات', 'Ads library'], nav_suggest: ['اقتراحاتكم', 'Suggestions'], nav_campaigns: ['دفتر الحملات', 'Campaigns'], nav_plans: ['الباقات', 'Plans'],
  'nav_a-home': ['الرئيسية', 'Overview'], 'nav_a-users': ['المستخدمون', 'Users'], 'nav_a-plans': ['الباقات', 'Plans'], 'nav_a-ads': ['الإعلانات', 'Ads'],
  'nav_a-sugg': ['الاقتراحات', 'Suggestions'], 'nav_a-errors': ['حل الأخطاء', 'Error handler'], 'nav_a-usage': ['سجل الذكاء الاصطناعي', 'AI usage log'],
  'nav_a-campaigns': ['الحملات', 'Campaigns'], 'nav_a-fin': ['التحليل المالي', 'Finance'], 'nav_a-settings': ['الإعدادات', 'Settings'],

  plat_twitter: ['تويتر X', 'X (Twitter)'], plat_instagram: ['إنستغرام', 'Instagram'], plat_snap: ['سناب', 'Snapchat'], plat_tiktok: ['تيك توك', 'TikTok'], plat_facebook: ['فيسبوك', 'Facebook'], plat_whatsapp: ['واتساب', 'WhatsApp'], plat_youtube: ['يوتيوب', 'YouTube'],
  style_formal: ['رسمي', 'Formal'], style_young: ['شبابي', 'Youthful'], style_story: ['قصصي', 'Story'], style_commercial: ['تجاري', 'Commercial'], style_short: ['مختصر', 'Short'], style_kids: ['أطفال', 'Kids'],
  goal_sales: ['زيادة مبيعات', 'More sales'], goal_launch: ['إطلاق منتج', 'Product launch'], goal_followers: ['زيادة متابعين', 'More followers'], goal_visits: ['زيارات', 'Visits'],
  lang_ar: ['عربي (AR)', 'Arabic (AR)'], lang_en: ['إنجليزي (EN)', 'English (EN)'], lang_zh: ['صيني (ZH)', 'Chinese (ZH)'], lang_ko: ['كوري (KO)', 'Korean (KO)'],
  lang_ja: ['ياباني (JA)', 'Japanese (JA)'], lang_es: ['إسباني (ES)', 'Spanish (ES)'], lang_pt: ['برتغالي (PT)', 'Portuguese (PT)'], lang_fr: ['فرنسي (FR)', 'French (FR)'],
  plan_free: ['المجانية', 'Free'], plan_mid: ['المتوسطة', 'Standard'], plan_gold: ['الذهبية', 'Gold'],
  d_all: ['كل الأوقات', 'All time'], d_today: ['اليوم', 'Today'], d_week: ['آخر 7 أيام', 'Last 7 days'], d_month: ['آخر 30 يوماً', 'Last 30 days'],
  p_all: ['كل المنصات', 'All platforms'], s_all: ['كل الأنواع', 'All styles'],

  signup_t: ['إنشاء حساب', 'Create account'], signup_sub: ['تُفعَّل الباقة المجانية تلقائياً عند التسجيل.', 'The Free plan starts automatically when you sign up.'],
  f_name: ['اسم المستخدم', 'Username'], f_email: ['البريد الإلكتروني', 'Email'], f_pass: ['كلمة المرور', 'Password'],
  pass_hint: ['8 خانات على الأقل، فيها حرف كبير وحرف صغير ورقم ورمز.', 'At least 8 characters with an uppercase letter, a lowercase letter, a number and a symbol.'],
  f_phone: ['رقم الجوال (اختياري)', 'Mobile number (optional)'], have_acc: ['لديك حساب؟', 'Already have an account?'],
  login_t: ['تسجيل الدخول', 'Sign in'], forgot: ['نسيت كلمة المرور', 'Forgot password'], new_acc: ['إنشاء حساب جديد', 'Create a new account'],
  login_hint: ['حسابات تجريبية: demo@example.com للمستخدم وowner@example.com للإدارة. كلمة المرور لكليهما demo-pass.', 'Demo accounts: demo@example.com (user) and owner@example.com (admin). The password for both is demo-pass.'],
  forgot_msg: ['إذا كان {e} مسجّلاً فسيصله رابط إعادة التعيين. (محاكاة: لا يُرسل بريد في هذا النموذج)', 'If {e} is registered, a reset link will be sent. (Simulated: no email is sent in this prototype)'],
  e_email_first: ['اكتب بريدك الإلكتروني أولاً.', 'Enter your email first.'], e_name: ['اكتب اسم المستخدم.', 'Enter a username.'], e_email: ['اكتب بريداً إلكترونياً صحيحاً.', 'Enter a valid email address.'],
  e_email_used: ['هذا البريد مسجّل مسبقاً. سجّل الدخول أو استخدم بريداً آخر.', 'This email is already registered. Sign in or use another email.'],
  e_pass: ['كلمة المرور يجب أن تكون 8 خانات على الأقل وفيها حرف كبير وحرف صغير ورقم ورمز.', 'The password needs at least 8 characters with an uppercase letter, a lowercase letter, a number and a symbol.'],
  e_login: ['البريد أو كلمة المرور غير صحيحة.', 'Wrong email or password.'],

  hello: ['أهلاً {name}', 'Hello {name}'], acc_no: ['رقم الحساب', 'Account ID'], cur_plan: ['الباقة الحالية: {plan}', 'Current plan: {plan}'], change_plan: ['تغيير الباقة', 'Change plan'],
  ads_left: ['إعلانات متبقية', 'Ads left'], imgs_left: ['صور متاحة', 'Images left'], an_left: ['تحليلات متاحة', 'Analyses left'], vids_left: ['ثواني فيديو متاحة', 'Video seconds left'],
  new_ad: ['إنشاء إعلان جديد', 'Create a new ad'], recent_ads: ['آخر الإعلانات', 'Recent ads'], all_ads: ['كل الإعلانات', 'All ads'], no_ads: ['لا توجد إعلانات بعد. أنشئ إعلانك الأول.', 'No ads yet. Create your first one.'],
  storage: ['مساحة التخزين', 'Storage'], st_of: ['{used} من {lim} ميجا', '{used} of {lim} MB'],

  edit_t: ['تعديل الإعلان', 'Edit ad'], create_t: ['إنشاء إعلان', 'Create ad'], an_avail: ['تحليلات متاحة: {n}', 'Analyses left: {n}'],
  f_product: ['المنتج / الخدمة', 'Product / service'], f_audience: ['الجمهور المستهدف', 'Target audience'], f_platform: ['المنصة', 'Platform'], f_style: ['أسلوب الإعلان', 'Ad style'], f_goal: ['الهدف', 'Goal'], f_lang: ['لغة الإعلان', 'Ad language'],
  tpl_note: ['القوالب التجريبية بغير العربية صيغة واحدة مبسّطة. الأساليب الكاملة بهذه اللغة تحتاج ربط OpenRouter.', 'Without OpenRouter, non-Arabic ads use one simple template. Full styles in this language need the OpenRouter link.'],
  b_improve: ['تحسين الإعلان', 'Improve ad'], b_variants: ['توليد صيغ متعددة', 'Generate variants'], b_titles: ['اقتراح عناوين', 'Suggest headlines'], b_tags: ['اقتراح هاشتاقات', 'Suggest hashtags'], b_toimage: ['توليد صورة للإعلان', 'Generate an image'],
  results: ['النتائج', 'Results'], r_text: ['الإعلان المحسّن', 'Improved ad'], f_adtext: ['نص الإعلان', 'Ad text'],
  chars_of: ['{n} حرفاً من {max} المسموحة في {plat}', '{n} of {max} characters allowed on {plat}'], chars: ['{n} حرفاً', '{n} characters'], over_limit: ['تجاوز الحد', 'Over the limit'],
  sec_variants: ['الصيغ', 'Variants'], use_it: ['اعتمدها', 'Use this'], sec_titles: ['العناوين', 'Headlines'], sec_tags: ['الهاشتاقات', 'Hashtags'], r_image: ['الصورة', 'Image'],
  r_empty: ['اضغط «تحسين الإعلان» لتظهر النتائج هنا.', 'Press "Improve ad" to see results here.'],
  b_save: ['حفظ الإعلان', 'Save ad'], b_saveimg: ['حفظ الصورة', 'Save image'], b_dlimg: ['تحميل الصورة', 'Download image'], alt_adimg: ['صورة إعلان {p}', 'Ad image for {p}'], no_img_s: ['بلا صورة', 'No image'],

  image_t: ['توليد الصورة', 'Generate image'], ratio: ['{plat} · نسبة {rt}', '{plat} · {rt} ratio'], imgs_avail: ['صور متاحة: {n}', 'Images left: {n}'],
  f_imgdesc: ['وصف الصورة', 'Image description'], b_genimg: ['توليد صورة', 'Generate image'], b_back: ['العودة للإعلان', 'Back to the ad'], out_image: ['الصورة الناتجة', 'Result'], no_image: ['لم تُولَّد صورة بعد.', 'No image generated yet.'],
  ref_t: ['المرفقات: صور وفيديو (اختياري)', 'Attachments: images and video (optional)'], ref_label: ['مرجع', 'Reference'], ref_remove: ['إزالة المرفق', 'Remove attachment'], ref_attach: ['إرفاق صور أو فيديو', 'Attach images or video'], f_refnote: ['وصف المرفقات (اختياري)', 'About the attachments (optional)'],
  vids_avail: ['ثواني فيديو متاحة: {n}', 'Video seconds left: {n}'],
  need_or: ['توليد الفيديو يحتاج ربط OpenRouter. يفعّله المشرف من لوحة الإدارة ثم الإعدادات.', 'Video generation needs the OpenRouter link. An admin turns it on under Admin, then Settings.'],
  f_viddesc: ['وصف المقطع', 'Clip description'], out_video: ['المقطع الناتج', 'Result'], b_dlvid: ['تحميل الفيديو', 'Download video'],
  vid_saved: ['حُفظ المقطع مع الإعلان في المكتبة ({size}).', 'The clip is saved with the ad in the library ({size}).'], no_video: ['لم يُولَّد مقطع بعد.', 'No clip generated yet.'],

  n_ads: ['{n} إعلان', '{n} ads'], lib_note: ['كل ما تولّده من نصوص وصور وفيديو يُحفظ هنا تلقائياً ويُحسب من مساحتك.', 'Everything you generate (text, images, video) is saved here automatically and counts toward your storage.'],
  f_date: ['التاريخ', 'Date'], f_adtype: ['نوع الإعلان', 'Ad style'], sec_text: ['نص الإعلان', 'Ad text'], sec_media: ['الصور والفيديو', 'Images and video'],
  vid_missing: ['الفيديو محفوظ على جهاز آخر وغير متوفر هنا.', 'The video was saved on another device and is not available here.'],
  b_editad: ['تعديل الإعلان', 'Edit ad'], b_delad: ['حذف الإعلان', 'Delete ad'], lib_empty: ['لا توجد إعلانات تطابق الفلاتر.', 'No ads match the filters.'],

  f_sug: ['اقتراحك', 'Your suggestion'], b_send: ['إرسال الاقتراح', 'Send suggestion'],
  sug_note: ['سيتم تحليل اقتراحك وإرساله للإدارة. صاحب الاقتراح المقبول يحصل على 5 إعلانات مجانية.', 'Your suggestion is analysed and sent to the admins. An accepted suggestion earns 5 free ads.'],
  sug_prev: ['اقتراحاتك السابقة', 'Your previous suggestions'], st_new: ['قيد المراجعة', 'Under review'], st_accepted: ['مقبول', 'Accepted'], st_rejected: ['مرفوض', 'Rejected'], st_fresh: ['جديد', 'New'], rewarded: ['مُكافأ', 'Rewarded'],

  camp_t: ['دفتر أفكار الحملات', 'Campaign ideas'], camp_note: ['هذه الصفحة معاينة لما سيأتي. الأزرار غير مفعّلة بعد.', 'This page previews what is coming. The buttons are not active yet.'],
  camp_list: ['قائمة الحملات', 'Campaigns'], camp_add: ['إضافة حملة جديدة', 'Add a campaign'], camp1: ['حملة رمضان · 6 إعلانات مرتبطة', 'Ramadan campaign · 6 linked ads'], camp2: ['حملة العودة للمدارس · 3 إعلانات مرتبطة', 'Back-to-school campaign · 3 linked ads'],
  draft_l: ['مسودة', 'Draft'], camp_an: ['تحليل الحملة', 'Analyse campaign'], camp_plan: ['اقتراح خطة نشر', 'Suggest a posting plan'], camp_link: ['ربط الحملة بالإعلانات', 'Link ads to the campaign'],

  plans_sub: ['الأسعار والحدود أرقام مبدئية تُعدَّل من لوحة الإدارة.', 'Prices and limits are starting values, editable from the admin dashboard.'],
  plan_x: ['الباقة {name}', '{name} plan'], your_plan: ['باقتك', 'Your plan'], per_month: ['شهرياً', 'month'], free: ['مجاناً', 'Free'],
  n_ad: ['{n} إعلان', '{n} ads'], n_img: ['{n} صورة', '{n} images'], n_an: ['{n} تحليل', '{n} analyses'], n_vid: ['{n} ثانية فيديو', '{n} seconds of video'], n_mb: ['{n} ميجا تخزين', '{n} MB storage'], deep: ['تحليل عميق للإعلان', 'Deep ad analysis'],
  subscribed: ['مشترك حالياً', 'Current plan'], subscribe: ['اشترك', 'Subscribe'], pay_note: ['الدفع عبر Stripe. في هذا النموذج الدفع محاكاة ولا تُطلب بيانات بطاقة.', 'Payment runs through Stripe. In this prototype payment is simulated and no card details are requested.'],

  a_home_t: ['لوحة التحكم', 'Dashboard'], s_users: ['المستخدمون', 'Users'], s_ads: ['الإعلانات', 'Ads'], s_imgs: ['الصور', 'Images'], s_sugg: ['الاقتراحات', 'Suggestions'], s_openerr: ['أخطاء مفتوحة', 'Open errors'], s_subs: ['الاشتراكات', 'Subscriptions'],
  f_today: ['أرباح اليوم', 'Revenue today'], f_month: ['أرباح الشهر', 'Revenue this month'], f_year: ['أرباح السنة', 'Revenue this year'], f_net: ['صافي ربح الشهر', 'Net profit this month'],
  err_attn: ['أخطاء تحتاج انتباهاً', 'Errors needing attention'], est_open: ['مفتوح', 'Open'], est_fixed: ['أُصلح تلقائياً', 'Auto-fixed'], est_sent: ['عند المطوّر', 'With developer'], est_closed: ['مغلق', 'Closed'],
  no_open_err: ['لا أخطاء مفتوحة.', 'No open errors.'], open_errs: ['فتح نظام الأخطاء', 'Open the error handler'], new_sugg: ['اقتراحات جديدة', 'New suggestions'], no_new_sugg: ['لا اقتراحات جديدة.', 'No new suggestions.'], open_sugg: ['فتح الاقتراحات', 'Open suggestions'],

  users_t: ['إدارة المستخدمين', 'Users'], n_users: ['{n} مستخدم', '{n} users'], th_name: ['الاسم', 'Name'], th_plan: ['الباقة والمكافأة', 'Plan and bonus'], th_store: ['المساحة', 'Storage'], th_admin: ['إداري؟', 'Admin?'],
  th_joined: ['تاريخ التسجيل', 'Joined'], th_actions: ['الإجراءات', 'Actions'], bonus_edit: ['تعديل المكافأة', 'Edit bonus'], store_edit: ['تعديل المساحة', 'Edit storage'],
  b_edit: ['تعديل', 'Edit'], b_upgrade: ['ترقية الباقة', 'Change plan'], b_reward: ['إضافة مكافأة', 'Add bonus'], b_role: ['تعديل الدور', 'Edit role'], b_mkadmin: ['ترقية لإداري', 'Make admin'], b_del: ['حذف', 'Delete'],
  no_l: ['لا', 'No'], stopped: ['موقوف', 'Suspended'], active: ['فعّال', 'Active'], all_pages: ['كل الصفحات', 'All pages'],

  plansadm_t: ['إدارة الباقات', 'Plans'], b_addplan: ['إضافة باقة جديدة', 'Add a plan'], th_planname: ['الباقة', 'Plan'], th_price: ['السعر (ر.س)', 'Price (SAR)'], th_ads: ['الإعلانات', 'Ads'], th_imgs: ['الصور', 'Images'],
  th_an: ['التحليلات', 'Analyses'], th_vids: ['ثواني الفيديو', 'Video seconds'], th_storemb: ['المساحة (ميجا)', 'Storage (MB)'], th_subs: ['المشتركون', 'Subscribers'], th_status: ['الحالة', 'Status'],
  n_subs: ['{n} مشترك', '{n} subscribers'], b_stop: ['إيقاف', 'Suspend'], b_activate: ['تفعيل', 'Activate'], plans_saved_note: ['التعديلات تُحفظ مباشرة وتظهر في صفحة الباقات لدى المستخدمين.', 'Changes save immediately and show on the users’ Plans page.'],
  adsadm_t: ['إدارة الإعلانات', 'Ads'], no_ads_adm: ['لا توجد إعلانات.', 'No ads.'],

  suggadm_t: ['إدارة الاقتراحات', 'Suggestions'], n_sugg: ['{n} اقتراح', '{n} suggestions'], ai_an: ['تحليل الذكاء الاصطناعي:', 'AI analysis:'], cat_l: ['التصنيف «{cat}».', 'Category: {cat}.'],
  cat_img: ['تحسين توليد الصور', 'Image generation'], cat_plans: ['الباقات والأسعار', 'Plans and pricing'], cat_plat: ['دعم منصات جديدة', 'New platforms'], cat_camp: ['الحملات', 'Campaigns'], cat_perf: ['الأداء', 'Performance'], cat_gen: ['عام', 'General'],
  note_hi: ['اقتراح واضح وقابل للتنفيذ، يُنصح بدراسته.', 'Clear and actionable. Worth reviewing.'], note_lo: ['اقتراح عام يحتاج تفاصيل أكثر قبل التنفيذ.', 'General; needs more detail before it can be acted on.'], rating: ['التقييم {n}/5', 'Rating {n}/5'],
  b_accept: ['قبول', 'Accept'], b_reject: ['رفض', 'Reject'], b_rewardowner: ['مكافأة صاحب الاقتراح', 'Reward the author'],

  err_t: ['نظام حل الأخطاء', 'AI error handler'], err_count: ['{o} مفتوح من {n}', '{o} open of {n}'], ai_fix: ['الحل المقترح:', 'Suggested fix:'], b_autofix: ['إصلاح تلقائي', 'Auto-fix'], b_todev: ['إرسال للمطوّر', 'Send to developer'], b_close: ['إغلاق الخطأ', 'Close'],
  usage_sub: ['كل عملية تُسجَّل هنا. العمليات المنفّذة فعلياً عبر OpenRouter تظهر باسم نموذجها، والباقي يبيّن المزوّد المخطط.', 'Every operation is logged here. Operations that really ran through OpenRouter show their model; the rest show the planned provider.'],
  th_user: ['المستخدم', 'User'], th_op: ['العملية', 'Operation'], th_model: ['النموذج', 'Model'],
  op_improve: ['تحسين الإعلان', 'Improve ad'], op_variants: ['توليد صيغ', 'Variants'], op_titles: ['اقتراح عناوين', 'Headlines'], op_tags: ['اقتراح هاشتاقات', 'Hashtags'], op_image: ['توليد صورة', 'Image'], op_suggest: ['تحليل اقتراح', 'Suggestion analysis'], op_video: ['توليد فيديو', 'Video'],
  campadm_t: ['إدارة الحملات', 'Campaigns'], campadm_note: ['تُفعَّل هذه الصفحة مع إطلاق دفتر أفكار الحملات، وتشمل لاحقاً ربط منصة بيع الأفكار الخام.', 'This page goes live with the campaign notebook and will later link the raw-ideas marketplace.'],
  camp_users: ['حملات المستخدمين', 'User campaigns'], camp_none: ['لا توجد حملات بعد', 'No campaigns yet'], camp_plans: ['خطط النشر', 'Posting plans'],

  fin_sub: ['محسوب من بيانات النموذج التجريبية. التكاليف تقديرية.', 'Calculated from the prototype’s sample data. Costs are estimates.'], fin_subs: ['الاشتراكات', 'Subscriptions'], paid_subs: ['عدد الاشتراكات المدفوعة', 'Paid subscriptions'], cancels: ['عدد الإلغاءات', 'Cancellations'],
  avg_cost: ['متوسط تكلفة كل مستخدم', 'Average cost per user'], net_calc: ['حساب صافي ربح الشهر', 'Net profit this month'], rev_month: ['إيرادات الشهر', 'Revenue this month'], c_or: ['تكلفة استخدام OpenRouter', 'OpenRouter usage'],
  c_stripe: ['رسوم Stripe', 'Stripe fees'], c_img: ['رسوم الصور', 'Image costs'], c_vid: ['رسوم الفيديوهات', 'Video costs'], net: ['صافي الربح', 'Net profit'],

  set_t: ['إعدادات النظام', 'System settings'], or_t: ['ربط OpenRouter', 'OpenRouter link'], on_l: ['الربط مفعّل', 'Link on'], off_l: ['غير مفعّل', 'Off'],
  f_apiurl: ['رابط API (أو رابط البروكسي)', 'API URL (or your proxy URL)'], f_apikey: ['مفتاح API (اتركه فارغاً مع البروكسي)', 'API key (leave empty with a proxy)'], f_txtmodel: ['نموذج كتابة المحتوى', 'Text model'],
  f_imgmodel: ['نموذج تصميم الصور (Nano Banana)', 'Image model (Nano Banana)'], f_vidmodel: ['نموذج الفيديو (Grok)', 'Video model (Grok)'], f_videp: ['مسار توليد الفيديو', 'Video endpoint path'], f_vidsec: ['مدة الفيديو الافتراضية (6 إلى 15 ثانية)', 'Default video length (6 to 15 seconds)'],
  or_live: ['استخدام OpenRouter فعلياً بدل القوالب التجريبية', 'Use OpenRouter for real instead of the built-in templates'], b_test: ['اختبار الاتصال', 'Test connection'],
  or_note: ['المفتاح المكتوب هنا يُحفظ في متصفح هذا الجهاز ويراه كل من يستخدمه، فهو للتجربة فقط. للنشر استخدم البروكسي (server/worker.js) وضع رابطه في «رابط API» واترك المفتاح فارغاً. الاتصال يعمل من الملف المحمّل أو من موقعك، أما النسخة المنشورة داخل Claude فتحجب الاتصال الخارجي.', 'A key typed here is stored in this browser and visible to anyone using it, so it is for testing only. For a public site use the proxy (server/worker.js): put its URL in "API URL" and leave the key empty. Calls work from the downloaded file or your own site; the copy published inside Claude blocks outside connections.'],
  mail_t: ['البريد', 'Email'], f_mailname: ['اسم المرسل', 'Sender name'], f_mailfrom: ['بريد الإرسال', 'Sender address'], pay_t: ['الدفع', 'Payments'], stripe_live: ['وضع Stripe الحقيقي (بدل الاختبار)', 'Stripe live mode (instead of test)'],
  f_currency: ['العملة', 'Currency'], cur_sar: ['ريال سعودي', 'Saudi riyal'], cur_usd: ['دولار أمريكي', 'US dollar'], camp_set: ['الحملات', 'Campaigns'], camp_show: ['إظهار دفتر الحملات للمستخدمين', 'Show the campaign notebook to users'],
  camp_set_note: ['الميزة ما زالت «قريباً»، والتفعيل لا يغيّر شيئاً في النموذج.', 'The feature is still "Soon"; switching this on changes nothing in the prototype.'], dash_t: ['لوحة التحكم', 'Dashboard'], f_dashhome: ['الصفحة الأولى عند فتح لوحة الإدارة', 'First page when opening the admin dashboard'],
  sec_t: ['الأمان', 'Security'], twofa: ['إلزام التحقق بخطوتين للإدارة (يُفعَّل مع الخادم)', 'Require two-step verification for admins (takes effect with a server)'], f_lock: ['قفل الحساب بعد محاولات فاشلة', 'Lock the account after failed attempts'],
  admins_t: ['حسابات الإدارة', 'Admin accounts'], b_addadmin: ['إضافة حساب إدارة', 'Add an admin'], th_role: ['الدور', 'Role'], th_perms: ['الصلاحيات', 'Access'], b_perms: ['منح صلاحيات', 'Role and access'], b_reset: ['إعادة ضبط بيانات النموذج', 'Reset prototype data'],

  m_ls_full: ['امتلأت مساحة التخزين في المتصفح. احذف إعلانات قديمة ليُحفظ الجديد.', 'Browser storage is full. Delete old ads so new ones can be saved.'],
  m_no_persist: ['هذا المتصفح لا يتيح الحفظ الدائم للملفات؛ ستبقى متاحة حتى إغلاق الصفحة.', 'This browser does not allow permanent file storage; files stay available until the page closes.'],
  m_save_fail: ['تعذّر حفظ الملف على هذا الجهاز؛ سيبقى متاحاً حتى إغلاق الصفحة.', 'The file could not be saved on this device; it stays available until the page closes.'],
  e_ref_missing: ['المرفق غير متوفر على هذا الجهاز.', 'The attachment is not available on this device.'],
  e_net: ['لا يمكن الوصول إلى الخادم. تأكد من الرابط والإنترنت؛ والنسخة المنشورة داخل Claude تحجب الاتصال الخارجي.', 'The server cannot be reached. Check the URL and your connection; the copy published inside Claude blocks outside connections.'],
  m_or_fail: ['تعذّر الاتصال بـOpenRouter: {e} استُخدم القالب التجريبي.', 'OpenRouter call failed: {e} The built-in template was used.'], e_no_image: ['لم يُرجع النموذج صورة.', 'The model returned no image.'],
  m_ref_vid_fail: ['النموذج لم يقبل صورة البداية؛ يُولَّد المقطع من الوصف فقط.', 'The model did not accept the reference image; generating from the description only.'],
  e_vid_failed: ['فشل التوليد لدى المزوّد.', 'Generation failed at the provider.'], e_vid_timeout: ['انتهت مهلة الانتظار.', 'Timed out waiting.'], m_vid_wait: ['جارٍ توليد المقطع، قد يستغرق بضع دقائق…', 'Generating the clip; this can take a few minutes…'], e_vid_dl: ['تعذّر تنزيل المقطع.', 'The clip could not be downloaded.'],
  e_need_draft: ['اكتب المنتج والجمهور المستهدف أولاً.', 'Enter the product and the target audience first.'],
  quota_t: ['وصلت إلى حد باقتك', 'You have reached your plan limit'], quota_body: ['{what} في الباقة {plan}. رقِّ باقتك لتكمل.', '{what} on the {plan} plan. Upgrade to continue.'],
  quota_ads: ['انتهى رصيد الإعلانات', 'You have used all your ads'], quota_images: ['انتهى رصيد الصور', 'You have used all your images'], quota_analyses: ['انتهى رصيد التحليلات', 'You have used all your analyses'], quota_vidSecs: ['رصيد ثواني الفيديو لا يكفي لهذا المقطع', 'Not enough video seconds for this clip'],
  b_upgrade_plan: ['ترقية الباقة', 'Upgrade plan'], full_t: ['امتلأت مساحتك', 'Your storage is full'], full_body: ['استخدمت {used} من {lim} ميجا. احذف إعلانات قديمة من المكتبة أو رقِّ باقتك.', 'You have used {used} of {lim} MB. Delete old ads from the library or upgrade your plan.'],
  m_var_used: ['اعتُمدت الصيغة', 'Variant applied'], m_ref_type: ['اختر صوراً أو مقاطع فيديو فقط.', 'Choose image or video files only.'],
  m_img_fail: ['تعذّر توليد الصورة عبر OpenRouter: {e} عُرضت صورة تجريبية ولم تُخصم من رصيدك.', 'Image generation through OpenRouter failed: {e} A sample image is shown and nothing was deducted.'], m_img_ok: ['تم توليد الصورة وحفظها في المكتبة', 'Image generated and saved to the library'],
  m_vid_need: ['توليد الفيديو يحتاج تفعيل ربط OpenRouter من إعدادات الإدارة.', 'Video generation needs the OpenRouter link switched on in the admin settings.'], m_vid_sent: ['أُرسل الطلب…', 'Request sent…'], m_vid_ok: ['تم توليد الفيديو وحفظه في المكتبة', 'Video generated and saved to the library'], m_vid_fail: ['تعذّر توليد الفيديو: {e}', 'Video generation failed: {e}'],
  m_need_key: ['أضف مفتاح API أو رابط البروكسي أولاً.', 'Add an API key or a proxy URL first.'], m_test_ok: ['الاتصال يعمل', 'The connection works'], m_test_fail: ['فشل الاختبار: {e}', 'Test failed: {e}'],
  m_dl_ok: ['تم تنزيل الصورة', 'Image downloaded'], dl_note: ['التنزيل المباشر غير متاح داخل هذه المعاينة. اضغط مطوّلاً على الصورة (أو بالزر الأيمن) واختر حفظ الصورة.', 'Direct download is not available inside this preview. Long-press (or right-click) the image and choose Save image.'],
  m_saved: ['حُفظ الإعلان في المكتبة', 'Ad saved to the library'], del_ad_t: ['حذف الإعلان', 'Delete ad'], del_ad_b: ['سيُحذف الإعلان وصوره وفيديوهاته نهائياً من المكتبة.', 'The ad and its images and videos will be permanently deleted from the library.'], m_ad_deleted: ['حُذف الإعلان', 'Ad deleted'],
  e_sug: ['اكتب اقتراحك أولاً.', 'Write your suggestion first.'], m_sug_ok: ['شكراً لك. سيتم تحليل اقتراحك وإرساله للإدارة.', 'Thank you. Your suggestion will be analysed and sent to the admins.'],
  sub_t: ['الاشتراك في الباقة {plan}', 'Subscribe to the {plan} plan'], sub_amount: ['المبلغ: {amt} شهرياً.', 'Amount: {amt} per month.'], sub_note: ['في التطبيق الفعلي تنتقل هنا إلى صفحة الدفع الآمنة لدى Stripe. في هذا النموذج الدفع محاكاة فقط.', 'In the real app you go to Stripe’s secure checkout here. In this prototype payment is only simulated.'],
  sub_free: ['سيُلغى اشتراكك المدفوع وتعود إلى الباقة المجانية.', 'Your paid subscription will be cancelled and you return to the Free plan.'], m_now_plan: ['أنت الآن على الباقة {plan}', 'You are now on the {plan} plan'], sim_pay: ['محاكاة الدفع', 'Simulate payment'],

  eu_t: ['تعديل المستخدم', 'Edit user'], f_storemb_opt: ['المساحة بالميجا (فارغ = حسب الباقة)', 'Storage in MB (empty = follows the plan)'], f_bonus: ['المكافأة (إعلانات إضافية)', 'Bonus (extra ads)'], e_email_other: ['هذا البريد مستخدم في حساب آخر.', 'This email belongs to another account.'],
  up_t: ['باقة {name}', 'Plan for {name}'], m_plan_changed: ['تم تغيير الباقة', 'Plan changed'], m_bonus_added: ['أُضيفت 5 إعلانات مكافأة إلى {name}', '5 bonus ads added for {name}'],
  bonus_t: ['مكافأة {name}', 'Bonus for {name}'], f_bonus_n: ['عدد الإعلانات المجانية الإضافية', 'Number of extra free ads'], bonus_zero: ['اكتب 0 لإلغاء المكافأة.', 'Enter 0 to remove the bonus.'], m_bonus_set: ['عُدّلت المكافأة', 'Bonus updated'], m_bonus_clear: ['أُلغيت المكافأة', 'Bonus removed'],
  store_t: ['مساحة {name}', 'Storage for {name}'], f_storemb: ['المساحة بالميجا', 'Storage in MB'], store_note: ['المستخدم حالياً: {used} ميجا. اترك الحقل فارغاً ليتبع الباقة ({plan} ميجا).', 'Currently used: {used} MB. Leave empty to follow the plan ({plan} MB).'], m_store_set: ['عُدّلت المساحة', 'Storage updated'],
  adm_t: ['صلاحيات {name}', 'Admin access for {name}'], role_none: ['ليس إدارياً', 'Not an admin'], extra_pages: ['صفحات إضافية فوق صلاحيات الدور', 'Extra pages on top of the role'],
  e_last_super: ['لا يمكن تخفيض أو إيقاف أو حذف آخر Super Admin نشط.', 'The last active Super Admin cannot be demoted, suspended or deleted.'], m_role_set: ['حُدّثت الصلاحيات', 'Access updated'],
  delu_t: ['حذف المستخدم', 'Delete user'], delu_b: ['سيُحذف حساب {name} وإعلاناته وملفاته نهائياً.', 'The account of {name}, with its ads and files, will be permanently deleted.'],
  f_planprice: ['السعر الشهري (ر.س)', 'Monthly price (SAR)'], e_planname: ['اكتب اسم الباقة.', 'Enter a plan name.'], plansubs_t: ['مشتركو الباقة {name}', 'Subscribers of the {name} plan'], no_subs: ['لا مشتركين.', 'No subscribers.'],
  editad_t: ['تعديل نص الإعلان', 'Edit ad text'], m_sug_accept: ['قُبل الاقتراح ومُنح صاحبه 5 إعلانات مجانية', 'Suggestion accepted; the author received 5 free ads'], m_reward_given: ['مُنحت المكافأة: 5 إعلانات إضافية', 'Reward given: 5 extra ads'],
  m_e_fixed: ['طُبّق الإصلاح المقترح (محاكاة)', 'Suggested fix applied (simulated)'], m_e_sent: ['أُرسل للمطوّر', 'Sent to the developer'], m_e_closed: ['أُغلق الخطأ', 'Error closed'],
  e_no_users: ['كل المستخدمين لديهم أدوار إدارية. أنشئ حساباً جديداً أولاً.', 'Every user already has an admin role. Create a new account first.'],
  reset_t: ['إعادة ضبط بيانات النموذج', 'Reset prototype data'], reset_b: ['ستعود كل البيانات إلى الأمثلة الأولى وتُحذف الملفات المحفوظة.', 'All data returns to the starting examples and saved files are deleted.'], b_resetok: ['إعادة ضبط', 'Reset'], m_saved_edit: ['حُفظ التعديل', 'Change saved']
};
Object.assign(I18N, {
  nav_scenes: ['المشاهد', 'Scenes'], n_sec: ['{n} ثانية', '{n} seconds'], f_vidlen: ['مدة المقطع', 'Clip length'], f_script: ['النص الحواري (إن وُجد متحدثون)', 'Dialogue script (if anyone speaks)'],
  sc_total: ['مدة الإعلان الكلية', 'Total ad length'], sc_sum: ['مجموع المشاهد {sum} من {total} ثانية', 'Scenes add up to {sum} of {total} seconds'],
  sc_add: ['إضافة صور أو مقاطع', 'Add images or clips'], sc_add_img: ['إضافة صورة الإعلان', 'Add the ad image'], sc_add_vid: ['إضافة فيديو الإعلان', 'Add the ad video'], sc_fit: ['وزّع المدة بالتساوي', 'Split the time evenly'],
  sc_none: ['لا توجد مشاهد بعد. أضف صوراً أو مقاطع لتبدأ.', 'No scenes yet. Add images or clips to start.'], sc_image: ['صورة', 'Image'], sc_clip: ['مقطع', 'Clip'], sc_dur: ['المدة (ث)', 'Seconds'], sc_cap: ['النص الظاهر على المشهد', 'Caption on the scene'],
  sc_up: ['تقديم', 'Earlier'], sc_down: ['تأخير', 'Later'], sc_save: ['حفظ المشاهد مع الإعلان', 'Save scenes with the ad'], sc_preview: ['المعاينة', 'Preview'], sc_play: ['تشغيل المعاينة', 'Play preview'], sc_stop: ['إيقاف', 'Stop'],
  sc_stage_empty: ['تظهر المعاينة هنا', 'The preview appears here'], sc_missing: ['غير متوفر', 'Missing'],
  sc_note: ['المعاينة تُشغَّل داخل المتصفح فقط. تصدير الإعلان كملف فيديو واحد (MP4) يحتاج الخادم ويأتي في المرحلة التالية.', 'The preview plays in the browser only. Exporting the ad as one video file (MP4) needs the server and comes in the next phase.'],
  sc_type: ['اختر صوراً أو مقاطع فيديو فقط.', 'Choose image or video files only.'], sc_max: ['الحد الأقصى 8 مشاهد.', 'The maximum is 8 scenes.'], sc_big: ['الملف أكبر من المساحة المتبقية.', 'The file is larger than your remaining storage.'],
  sc_from_img: ['صورة الإعلان', 'Ad image'], sc_from_vid: ['فيديو الإعلان', 'Ad video'], sc_lib: ['{n} مشاهد · {s} ثانية', '{n} scenes · {s} seconds'],
  addons_t: ['إضافات للباقة', 'Add-ons'], buy: ['شراء', 'Buy'], extra_have: ['رصيدك الإضافي:', 'Your extras:'], sub_amount1: ['المبلغ: {amt} (مرة واحدة).', 'Amount: {amt} (one-time).'], m_addon_ok: ['أُضيفت الإضافة إلى حسابك', 'The add-on was added to your account'],
  addon_add: ['إضافة جديدة', 'New add-on'], addon_kind: ['النوع', 'Type'], addon_amount: ['الكمية', 'Amount'], addon_new: ['إضافة جديدة', 'New add-on'],
  addons_note: ['الإضافات تظهر للمستخدمين في صفحة الباقات ويشترونها فوق باقتهم. الأسماء والأنواع والكميات والأسعار تُحفظ مباشرة.', 'Add-ons show on the users\u2019 Plans page and are bought on top of a plan. Names, types, amounts and prices save immediately.'],
  ak_storage: ['مساحة (ميجا)', 'Storage (MB)'], ak_images: ['صور', 'Images'], ak_vidSecs: ['ثواني فيديو', 'Video seconds'], ak_ads: ['إعلانات', 'Ads'], ak_analyses: ['تحليلات', 'Analyses'],
  unit_storage: ['ميجا', 'MB'], unit_images: ['صورة', 'images'], unit_vidSecs: ['ثانية فيديو', 'video seconds'], unit_ads: ['إعلان', 'ads'], unit_analyses: ['تحليل', 'analyses']
});
Object.assign(I18N, {
  f_category: ['نوع المنتج', 'Product type'],
  pc_general: ['عام', 'General'], pc_decor: ['ديكور', 'Decor'], pc_furniture: ['أثاث', 'Furniture'], pc_fashion: ['أزياء وملابس', 'Fashion'], pc_food: ['مطاعم وأغذية', 'Food and restaurants'],
  pc_beauty: ['عطور وتجميل', 'Beauty and perfume'], pc_electronics: ['إلكترونيات', 'Electronics'], pc_realestate: ['عقار', 'Real estate'], pc_services: ['خدمات', 'Services'], pc_kids: ['منتجات أطفال', 'Kids products'],
  b_decor: ['تصميم ديكور', 'Design decor'], by_refs: ['بناءً على المرفقات', 'Based on the attachments'], m_decor_step: ['جارٍ تصميم الديكور على المرفقات…', 'Designing the decor on your attachments…'],
  ref_count: ['{n} مرفقات · {size}', '{n} attachments · {size}'], ref_max: ['الحد الأقصى 6 مرفقات.', 'The maximum is 6 attachments.'], e_frame: ['تعذّرت قراءة الفيديو المرفق.', 'The attached video could not be read.']
});
Object.assign(I18N, {
  nav_account: ['إعدادات الحساب', 'Account settings'], acc_profile: ['بياناتي', 'My details'], clear: ['تنظيف الشاشة لإعلان جديد', 'Clear the screen for a new ad'], m_cleared: ['الشاشة جاهزة لإعلان جديد. ما حفظته باقٍ في المكتبة.', 'Ready for a new ad. Saved work stays in the library.'],
  soc_t: ['حسابات التواصل الاجتماعي', 'Social accounts'], soc_add: ['إضافة حساب غير موجود في القائمة', 'Add an account that is not listed'], linked: ['مرتبط', 'linked'],
  soc_note: ['اضغط المنصة والصق رابط حسابك فيها. الأيقونة الملوّنة تعني أن الحساب مرتبط، واضغطها مرة أخرى لتعديل الرابط أو حذفه.', 'Press a platform icon and paste your profile link. A highlighted icon means the account is linked; press it again to edit or remove the link.'],
  soc_name: ['اسم الحساب أو المنصة', 'Account or platform name'], soc_url: ['رابط حسابك', 'Your profile link'], soc_url_note: ['افتح حسابك في المنصة وانسخ رابطه، ويبدأ بـ https://', 'Open your profile on the platform and copy its link; it starts with https://'],
  soc_del: ['حذف الحساب', 'Remove account'], e_url: ['اكتب رابطاً صحيحاً يبدأ بـ https://', 'Enter a valid link starting with https://'], e_soc_name: ['اكتب اسم الحساب.', 'Enter the account name.'], m_soc_saved: ['حُفظ الحساب', 'Account saved'], m_soc_deleted: ['حُذف الحساب', 'Account removed'],
  f_shareto: ['حساب النشر', 'Post to'], b_share: ['مشاركة', 'Share'], share_t: ['مشاركة على {name}', 'Share on {name}'], share_open: ['فتح {name} لإكمال النشر', 'Open {name} to finish posting'],
  share_copied: ['نُسخ نص الإعلان والهاشتاقات.', 'The ad text and hashtags were copied.'], share_copy: ['انسخ نص الإعلان من المربع.', 'Copy the ad text from the box.'],
  share_filled: ['سيفتح منشور جديد والنص مكتوب فيه.', 'A new post opens with the text filled in.'], share_paste: ['ستنتقل إلى المنصة؛ الصق النص هناك.', 'You will go to the platform; paste the text there.'],
  share_media: ['الصورة والفيديو لا ينتقلان تلقائياً، حمّلهما وأرفقهما في المنصة.', 'Images and video do not transfer automatically; download them and attach them on the platform.'],
  share_noacc: ['لم تربط حساباً لهذه المنصة بعد، فسيفتح موقعها الرئيسي. اربطه من إعدادات الحساب.', 'No account is linked for this platform yet, so its main site opens. Link one under Account settings.']
});
Object.assign(I18N, {
  addon_mode: ['التسعير', 'Pricing'], am_pack: ['مجموعة ثابتة', 'Fixed bundle'], am_unit: ['بالوحدة (يختار المستخدم الكمية)', 'Per unit (user picks the amount)'],
  ao_per: ['{price} لكل {amt} {unit}', '{price} per {amt} {unit}'], ao_pack: ['{amt} {unit} بسعر {price}', '{amt} {unit} for {price}'], ao_need: ['الكمية المطلوبة', 'Amount needed'], ao_count: ['العدد', 'Quantity'],
  ao_pay: ['الدفع وإضافة الرصيد', 'Pay and add to my account'], inv_total: ['المبلغ النهائي', 'Total'], paid_ok: ['تم الدفع وأُضيف الرصيد. تصدير الفاتورة:', 'Paid and credited. Export the invoice:'],
  inv_export: ['تصدير الفاتورة', 'Export invoice'], inv_mine: ['فواتيري', 'My invoices'], inv_t: ['الفاتورة', 'Invoice'],
  inv_sim: ['عملية تجريبية: الدفع في هذا النموذج محاكاة، وهذه ليست فاتورة ضريبية.', 'Test transaction: payment in this prototype is simulated, and this is not a tax invoice.'],
  m_exported: ['تم التصدير', 'Exported'], m_export_fail: ['تعذّر التصدير.', 'The export failed.'], m_dl_frame: ['التنزيل لا يعمل داخل هذه المعاينة. افتح الملف المحمّل أو موقعك.', 'Downloads do not work inside this preview. Open the downloaded file or your own site.'],
  sm_post: ['نشر على {plat}', 'Post to {plat}'], sm_export: ['تصدير كامل المحتوى', 'Export everything'], sm_zip: ['ملف مضغوط (ZIP)', 'ZIP file'], sm_pptx: ['ملف PowerPoint', 'PowerPoint file'], sm_mail: ['البريد (النص فقط)', 'Email (text only)'], sm_drive: ['فتح Google Drive', 'Open Google Drive'],
  sm_note: ['الملف المضغوط فيه النص وكل الصور والفيديو. PowerPoint فيه النص والصور، والفيديو يُذكر بالاسم فقط. للبريد أو Drive: نزّل الملف المضغوط ثم أرفقه أو ارفعه.', 'The ZIP has the text and every image and video. The PowerPoint has the text and images; videos are listed by name. For email or Drive: download the ZIP, then attach or upload it.'],
  x_img: ['صورة الإعلان', 'Ad image'], x_vid: ['فيديو الإعلان', 'Ad video'], x_vids: ['الفيديو', 'Video'], x_vids_note: ['ملفات الفيديو غير مضمّنة في هذا العرض. تجدها في الملف المضغوط:', 'Video files are not embedded in this deck. They are in the ZIP export:'],
  socic_t: ['أيقونات المنصات', 'Platform icons'], socic_up: ['رفع أيقونة', 'Upload icon'],
  socic_note: ['ارفع شعار كل منصة من صفحة العلامة التجارية الرسمية لها، فيظهر للمستخدمين في إعدادات الحساب بدل الاسم. على موقعك يمكن أيضاً وضع الملفات في assets/social باسم المنصة مثل instagram.svg.', 'Upload each platform logo from its official brand page; users then see it in Account settings instead of the name. On your own site you can also place files in assets/social named after the platform, e.g. instagram.svg.']
});
Object.assign(I18N, {
  my_acc: ['حسابي', 'My account'], about_t: ['عن الشركة', 'About'], terms_t: ['الشروط والأحكام', 'Terms'], privacy_t: ['سياسة الخصوصية', 'Privacy'],
  foot_copy: ['منصة {product} © {year}', '{product} © {year}'], f_cr: ['س.ت.', 'CR'], f_vat: ['الرقم الضريبي', 'VAT no.'], contact: ['اتصل بنا', 'Contact us'], support_l: ['الدعم', 'Support'], legal_l: ['الشؤون القانونية', 'Legal'],
  co_t: ['بيانات الشركة', 'Company details'], co_note: ['كل ما تكتبه هنا يُحفظ مباشرة ويظهر في الترويسة والتذييل وصفحة «عن الشركة». الحقول الفارغة لا تظهر للمستخدمين.', 'Everything here saves as you type and shows in the header, the footer and the About page. Empty fields are not shown to users.'],
  co_nameAr: ['اسم الشركة (عربي)', 'Company name (Arabic)'], co_nameEn: ['اسم الشركة (إنجليزي)', 'Company name (English)'], co_brandAr: ['الاسم المختصر في الترويسة (عربي)', 'Short name in the header (Arabic)'], co_brandEn: ['الاسم المختصر في الترويسة (إنجليزي)', 'Short name in the header (English)'],
  co_productAr: ['اسم المنصة (عربي)', 'Product name (Arabic)'], co_productEn: ['اسم المنصة (إنجليزي)', 'Product name (English)'],
  co_logo: ['شعار الترويسة وأيقونة المتصفح', 'Header logo and browser icon'], co_flogo: ['شعار التذييل', 'Footer logo'], co_upload: ['رفع صورة', 'Upload image'], co_default: ['الافتراضي', 'Default'], co_logo_code: ['أو كود SVG أو رابط https', 'Or SVG code or an https link'],
  co_cr: ['السجل التجاري', 'Commercial registration'], co_vat: ['الرقم الضريبي', 'VAT number'], co_email: ['البريد العام', 'General email'], co_esupport: ['بريد الدعم', 'Support email'], co_elegal: ['البريد القانوني', 'Legal email'], co_phone: ['رقم الهاتف', 'Phone'], co_address: ['العنوان', 'Address'],
  co_tagline: ['شعار نصي للشركة (يُظهر صفحة «عن الشركة»)', 'Company tagline (turns on the About page)'], co_aboutlead: ['السطر الأول في صفحة «عن الشركة»', 'First line of the About page'], co_about: ['نص صفحة «عن الشركة»', 'About page text'], co_fnote: ['نص إضافي في التذييل', 'Extra footer note'],
  co_links: ['روابط التذييل (JSON) مثل [{"label":"المدونة","href":"https://..."}]', 'Footer links (JSON) e.g. [{"label":"Blog","href":"https://..."}]'], co_terms: ['نص الشروط والأحكام', 'Terms text'], co_privacy: ['نص سياسة الخصوصية', 'Privacy policy text'], co_showlegal: ['إظهار الصفحات القانونية في التذييل', 'Show the legal pages in the footer'],
  e_logo: ['اكتب كود SVG يبدأ بـ <svg أو رابطاً يبدأ بـ https://', 'Enter SVG code starting with <svg or a link starting with https://'], e_links: ['صيغة الروابط غير صحيحة. كل رابط يحتاج label و href يبدأ بـ https://', 'The links format is invalid. Each link needs a label and an href starting with https://'],
  pw_t: ['تغيير كلمة المرور', 'Change password'], pw_cur: ['كلمة المرور الحالية', 'Current password'], pw_new: ['كلمة المرور الجديدة', 'New password'], pw_save: ['حفظ كلمة المرور', 'Save password'], pw_wrong: ['كلمة المرور الحالية غير صحيحة.', 'The current password is wrong.'], pw_done: ['تم تغيير كلمة المرور.', 'Password changed.'],
  co_icon: ['أيقونة الترويسة والمتصفح', 'Header and browser icon'], co_icon_m: ['أيقونة تدرّج M', 'Gradient M icon'], co_icon_logo: ['الشعار الأصلي (المنطاد)', 'Original logo (balloon)'],
  brand_dark: ['تطبيق الألوان على الوضع الليلي أيضاً', 'Also apply the colours to the night theme'],
  brand_t: ['ألوان الواجهة', 'Interface colours'], brand_primary: ['اللون الأساسي', 'Primary colour'], brand_accent: ['اللون الثانوي', 'Secondary colour'], brand_logo: ['ألوان الشعار', 'Logo colours'], brand_sample: ['معاينة', 'Preview'],
  page_t: ['لون الصفحة (النهاري)', 'Page colour (light theme)'], page_white: ['أبيض', 'White'], page_mist: ['رمادي مزرق', 'Blue-grey'], page_sand: ['عاجي دافئ', 'Warm ivory'],
  bg_t: ['خلفية الوضع النهاري', 'Day theme background'],
  bg_none: ['بدون', 'None'], bg_balloon: ['المنطاد', 'Balloon'], bg_waves: ['الموجات', 'Waves'], bg_soft: ['تدرّج هادئ', 'Soft gradient'], bg_custom: ['صورتي', 'My image'],
  bg_note: ['تظهر في الوضع النهاري فقط. الصورة المرفوعة تُصغَّر وتُغطّى بطبقة بيضاء خفيفة ليبقى النص واضحاً.', 'Light theme only. An uploaded image is downscaled and gets a light white veil so text stays readable.'],
  brand_note: ['اللونان يُطبَّقان على الأزرار والروابط والشارات في الوضع النهاري، وفي الليلي إن فعّلت الخيار. لون الأزرار يُعتَم قليلاً عند الحاجة ليبقى النص الأبيض واضحاً. «الافتراضي» يرجع الألوان الأصلية.', 'Both colours apply to buttons, links and badges in light and dark mode. "Default" restores the original palette.']
});
const UI = { ar: {}, en: {} };
for (const k in I18N) { UI.ar[k] = I18N[k][0]; UI.en[k] = I18N[k][1]; }
const L = () => (typeof S !== 'undefined' && S && S.settings && S.settings.uiLang === 'en') ? 'en' : 'ar';
function t(k, v) {
  let s = UI[L()][k];
  if (s == null) s = UI.ar[k] != null ? UI.ar[k] : k;
  return v ? s.replace(/\{(\w+)\}/g, (m, n) => v[n] != null ? v[n] : '') : s;
}
