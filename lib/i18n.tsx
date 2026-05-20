'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

export type Locale = 'fr' | 'en' | 'ar';

type Dict = Record<string, string>;
type Bundle = Record<Locale, Dict>;

const dict: Bundle = {
  fr: {
    'nav.vision': 'Vision',
    'nav.solutions': 'Solutions',
    'nav.partners': 'Partenaires',
    'nav.security': 'Sécurité',
    'nav.contact': 'Contact',
    'nav.cta': 'Demander une démo',

    'hero.kicker': 'Rabat Agdal · Maroc',
    'hero.title.prefix': 'L’axe nouveau de la',
    'hero.title.suffix': 'augmentée.',
    'hero.subtitle':
      'Nous fusionnons 30 ans de rigueur comptable et l’état de l’art en intelligence artificielle pour transformer la gestion des entreprises marocaines.',
    'hero.cta.primary': 'Découvrir nos solutions',
    'hero.cta.secondary': 'Voir une démo live',
    'hero.badge': 'Souveraineté des données · Hébergé au Maroc',

    'fusion.eyebrow': '02 — Méthode',
    'fusion.title': 'Deux expertises. Un seul axe.',
    'fusion.body':
      'Là où d’autres voient deux mondes séparés, nous avons construit un pont. Des comptables agréés, des ingénieurs IA, des architectes sécurité — une seule équipe, une seule mission : rendre la gestion d’entreprise plus juste, plus rapide, plus sûre.',
    'fusion.p1.title': 'Comptabilité',
    'fusion.p1.body': 'Expertise sectorielle, normes OHADA & marocaines, conformité CGI.',
    'fusion.p2.title': 'Intelligence',
    'fusion.p2.body': 'LLMs de pointe, OCR avancé, moteurs de règles déterministes.',
    'fusion.p3.title': 'Souveraineté',
    'fusion.p3.body': 'Données au Maroc, modèles open-weights, audit complet.',

    'vision.eyebrow': '03 — Manifeste',
    'vision.l1': 'Nous croyons qu’une IA digne de confiance n’est pas une boîte noire.',
    'vision.l1.b': 'Elle s’explique. Elle se vérifie. Elle se gouverne.',
    'vision.l2':
      'Nous croyons que la souveraineté numérique du Maroc passe par des solutions construites ici, par des Marocains, pour des entreprises marocaines — sans renoncer à l’excellence mondiale.',
    'vision.l3':
      'Nous croyons que la comptabilité n’est pas un coût, mais un levier stratégique quand elle est augmentée intelligemment.',
    'vision.sign': '— L’équipe NOVAXIS, Rabat Agdal',

    'solutions.eyebrow': '04 — Solutions',
    'solutions.title': 'Des produits, pas des promesses.',
    'solutions.flagship.tag': 'Solution phare',
    'solutions.flagship.name': 'OCR·SAGE',
    'solutions.flagship.headline':
      'De la facture papier au virement validé.',
    'solutions.flagship.sub':
      '22 règles de contrôle. 0 erreur tolérée. Réconciliation automatique des dossiers de paiement.',
    'solutions.demo.drop': 'Déposez un PDF ou cliquez pour simuler',
    'solutions.demo.running': 'Analyse en cours…',
    'solutions.demo.ok': 'CONFORME',
    'solutions.demo.ko': 'NON CONFORME',
    'solutions.demo.reset': 'Relancer',
    'solutions.others.1.t': 'Audit IA augmenté',
    'solutions.others.1.d':
      'Échantillonnage statistique, détection d’anomalies, justification des contrôles.',
    'solutions.others.2.t': 'Conformité automatisée',
    'solutions.others.2.d':
      'Veille réglementaire CNDP, OHADA, CGI — alertes proactives et traçables.',
    'solutions.others.3.t': 'Reporting intelligent',
    'solutions.others.3.d':
      'Tableaux de bord générés depuis vos écritures, narratifs explicables.',

    'partners.eyebrow': '05 — Stack',
    'partners.title': 'Une stack ouverte, des partenaires d’excellence.',
    'partners.sub':
      'Nous ne sommes liés à aucun fournisseur. Nous choisissons les meilleures briques technologiques et privilégions les modèles ouverts et auditables.',
    'partners.box.title': 'Pourquoi le multi-modèles ?',
    'partners.box.body':
      'Parce que la souveraineté, c’est ne dépendre de personne. Nous déployons nos solutions 100% on-premise avec Mistral + Ollama, ou en hybride selon vos besoins de conformité.',

    'security.eyebrow': '06 — Sécurité',
    'security.title': 'Niveau bancaire. Par défaut.',
    'security.s1': 'Hébergement souverain au Maroc (datacenters Tier III+)',
    'security.s2': 'Conformité CNDP — loi 09-08',
    'security.s3': 'Chiffrement AES-256 au repos et en transit',
    'security.s4': 'Audit trail complet et immuable',
    'security.s5': 'Authentification SSO / Keycloak / MFA',
    'security.s6': 'Modèles IA déployables on-premise — zéro fuite',
    'security.s7': 'Conformité ISO 27001 (en cours)',

    'why.eyebrow': '07 — Comparatif',
    'why.title': 'Pourquoi NOVAXIS.',
    'why.col.us': 'NOVAXIS',
    'why.col.foreign': 'Solutions étrangères',
    'why.col.manual': 'Manuel',
    'why.row.1': 'Souveraineté des données',
    'why.row.2': 'IA de pointe',
    'why.row.3': 'Expertise comptable',
    'why.row.4': 'Conformité marocaine',
    'why.row.5': 'Automatisation',
    'why.row.6': 'Coût optimisé (MAD)',

    'team.eyebrow': '08 — Fondateurs',
    'team.title': 'Deux fondateurs. À Rabat Agdal.',
    'team.body':
      'NOVAXIS n’est pas une rencontre de hasard. C’est l’alliance délibérée d’un ingénieur IT & IA et d’un expert-comptable commissaire aux comptes — la fusion vivante de nos deux disciplines.',
    'team.label.experience': 'Parcours',
    'team.label.stack': 'Domaines',
    'team.label.education': 'Formation',
    'team.label.present': 'aujourd’hui',
    'team.role.cto': 'Co-fondateur · CTO',
    'team.role.expert': 'Co-fondateur · Expert-comptable',
    'team.f1.tagline':
      'Ingénierie logicielle, architecture microservices, IAM et IA générative. 13+ ans à concevoir des systèmes critiques pour des groupes européens.',
    'team.f2.tagline':
      'Commissaire aux comptes. 20 ans d’audit légal et de conseil financier au Maroc. La rigueur comptable au cœur du produit.',
    'team.stat.1': 'ans d’audit & commissariat',
    'team.stat.2': 'ans d’ingénierie logicielle',
    'team.stat.3': 'expertises fusionnées',
    'team.stat.4': 'basés au Maroc',

    'stats.eyebrow': '09 — Chiffres clés',
    'stats.title': 'Performance opérationnelle, mesurée.',
    'stats.1.l': 'précision sur l’extraction documentaire',
    'stats.2.l': 'pour valider un dossier de paiement',
    'stats.3.l': 'règles de contrôle automatiques',
    'stats.4.l': 'donnée envoyée hors Maroc (mode souverain)',

    'trust.eyebrow': '10 — Confiance',
    'trust.title': 'Ils nous font confiance.',
    'trust.quote':
      'En trois mois, le délai de validation d’un dossier de paiement est passé de 4 jours à moins de 30 secondes. Et chaque décision reste auditable.',
    'trust.quote.author': 'DAF, groupe industriel marocain',

    'cta.title': 'Prêt à augmenter votre gestion ?',
    'cta.sub':
      'Démo personnalisée gratuite. Nous nous déplaçons à Rabat, Casablanca, Tanger, Marrakech.',
    'cta.form.name': 'Nom',
    'cta.form.email': 'Email professionnel',
    'cta.form.company': 'Entreprise',
    'cta.form.phone': 'Téléphone',
    'cta.form.submit': 'Réserver ma démo',
    'cta.form.sending': 'Envoi…',
    'cta.form.sent': 'Demande envoyée. Nous revenons vers vous sous 24h.',

    'footer.tagline': 'Comptabilité × Intelligence — Souveraineté marocaine',
    'footer.col.solutions': 'Solutions',
    'footer.col.company': 'Société',
    'footer.col.resources': 'Ressources',
    'footer.col.legal': 'Légal',
    'footer.legal.cndp': 'Conforme CNDP',
    'footer.legal.rc': 'RC Casablanca',
    'footer.legal.ice': 'ICE',
    'footer.made': 'Conçu et hébergé au Maroc'
  },

  en: {
    'nav.vision': 'Vision',
    'nav.solutions': 'Solutions',
    'nav.partners': 'Partners',
    'nav.security': 'Security',
    'nav.contact': 'Contact',
    'nav.cta': 'Book a demo',

    'hero.kicker': 'Rabat Agdal · Morocco',
    'hero.title.prefix': 'The new axis of augmented',
    'hero.title.suffix': '.',
    'hero.subtitle':
      'We merge thirty years of accounting rigor with state-of-the-art AI to transform how Moroccan companies run their business.',
    'hero.cta.primary': 'Explore our solutions',
    'hero.cta.secondary': 'Watch a live demo',
    'hero.badge': 'Sovereign data · Hosted in Morocco',

    'fusion.eyebrow': '02 — Method',
    'fusion.title': 'Two disciplines. One axis.',
    'fusion.body':
      'Where others see two separate worlds, we built a bridge. Chartered accountants, AI engineers, security architects — one team, one mission: make corporate management fairer, faster, safer.',
    'fusion.p1.title': 'Accounting',
    'fusion.p1.body': 'Sector expertise, OHADA & Moroccan standards, CGI compliance.',
    'fusion.p2.title': 'Intelligence',
    'fusion.p2.body': 'Frontier LLMs, advanced OCR, deterministic rule engines.',
    'fusion.p3.title': 'Sovereignty',
    'fusion.p3.body': 'Data in Morocco, open-weights models, full audit trail.',

    'vision.eyebrow': '03 — Manifesto',
    'vision.l1': 'We believe trustworthy AI is not a black box.',
    'vision.l1.b': 'It explains itself. It can be verified. It is governed.',
    'vision.l2':
      'We believe Morocco’s digital sovereignty runs through software built here, by Moroccans, for Moroccan companies — without giving up world-class engineering.',
    'vision.l3':
      'We believe accounting is not a cost. It is a strategic lever when augmented intelligently.',
    'vision.sign': '— The NOVAXIS team, Rabat Agdal',

    'solutions.eyebrow': '04 — Solutions',
    'solutions.title': 'Products, not promises.',
    'solutions.flagship.tag': 'Flagship',
    'solutions.flagship.name': 'OCR·SAGE',
    'solutions.flagship.headline': 'From paper invoice to validated payment.',
    'solutions.flagship.sub':
      '22 control rules. Zero errors tolerated. Automatic reconciliation of payment files.',
    'solutions.demo.drop': 'Drop a PDF or click to simulate',
    'solutions.demo.running': 'Analyzing…',
    'solutions.demo.ok': 'COMPLIANT',
    'solutions.demo.ko': 'NON COMPLIANT',
    'solutions.demo.reset': 'Restart',
    'solutions.others.1.t': 'AI-augmented audit',
    'solutions.others.1.d':
      'Statistical sampling, anomaly detection, evidence-backed control justification.',
    'solutions.others.2.t': 'Automated compliance',
    'solutions.others.2.d':
      'CNDP, OHADA, CGI regulatory watch — proactive, traceable alerts.',
    'solutions.others.3.t': 'Intelligent reporting',
    'solutions.others.3.d':
      'Dashboards generated from your ledger, with explainable narratives.',

    'partners.eyebrow': '05 — Stack',
    'partners.title': 'An open stack. Best-of-breed partners.',
    'partners.sub':
      'We are not locked into any vendor. We pick the best technological building blocks and favor open, auditable models.',
    'partners.box.title': 'Why multi-model?',
    'partners.box.body':
      'Because sovereignty means depending on no one. We can run 100% on-premise with Mistral + Ollama, or hybrid to fit your compliance constraints.',

    'security.eyebrow': '06 — Security',
    'security.title': 'Bank-grade. By default.',
    'security.s1': 'Sovereign hosting in Morocco (Tier III+ datacenters)',
    'security.s2': 'CNDP compliance — law 09-08',
    'security.s3': 'AES-256 encryption at rest and in transit',
    'security.s4': 'Complete, immutable audit trail',
    'security.s5': 'SSO / Keycloak / MFA authentication',
    'security.s6': 'On-prem AI models — zero data leakage',
    'security.s7': 'ISO 27001 compliance (in progress)',

    'why.eyebrow': '07 — Comparison',
    'why.title': 'Why NOVAXIS.',
    'why.col.us': 'NOVAXIS',
    'why.col.foreign': 'Foreign solutions',
    'why.col.manual': 'Manual',
    'why.row.1': 'Data sovereignty',
    'why.row.2': 'Frontier AI',
    'why.row.3': 'Accounting expertise',
    'why.row.4': 'Moroccan compliance',
    'why.row.5': 'Automation',
    'why.row.6': 'Optimized cost (MAD)',

    'team.eyebrow': '08 — Founders',
    'team.title': 'Two founders. In Rabat Agdal.',
    'team.body':
      'NOVAXIS is no coincidence. It is the deliberate alliance of an IT & AI engineer and a chartered accountant / statutory auditor — the living fusion of our two disciplines.',
    'team.label.experience': 'Track record',
    'team.label.stack': 'Domains',
    'team.label.education': 'Education',
    'team.label.present': 'present',
    'team.role.cto': 'Co-founder · CTO',
    'team.role.expert': 'Co-founder · Chartered accountant',
    'team.f1.tagline':
      'Software engineering, microservices architecture, IAM and generative AI. 13+ years building mission-critical systems for European groups.',
    'team.f2.tagline':
      'Statutory auditor. 20 years of legal audit and financial advisory in Morocco. Accounting rigor at the core of the product.',
    'team.stat.1': 'years of audit & statutory work',
    'team.stat.2': 'years of software engineering',
    'team.stat.3': 'fused expertises',
    'team.stat.4': 'based in Morocco',

    'stats.eyebrow': '09 — Key figures',
    'stats.title': 'Operational performance, measured.',
    'stats.1.l': 'document extraction accuracy',
    'stats.2.l': 'to validate a full payment file',
    'stats.3.l': 'automatic control rules',
    'stats.4.l': 'data sent outside Morocco (sovereign mode)',

    'trust.eyebrow': '10 — Trust',
    'trust.title': 'They trust us.',
    'trust.quote':
      'In three months, payment file validation went from four days to under thirty seconds. And every decision remains auditable.',
    'trust.quote.author': 'CFO, Moroccan industrial group',

    'cta.title': 'Ready to augment your operations?',
    'cta.sub':
      'Free personalized demo. We travel to Casablanca, Rabat, Tangier, Marrakech.',
    'cta.form.name': 'Name',
    'cta.form.email': 'Work email',
    'cta.form.company': 'Company',
    'cta.form.phone': 'Phone',
    'cta.form.submit': 'Book my demo',
    'cta.form.sending': 'Sending…',
    'cta.form.sent': 'Request sent. We will reply within 24 hours.',

    'footer.tagline': 'Accounting × Intelligence — Moroccan sovereignty',
    'footer.col.solutions': 'Solutions',
    'footer.col.company': 'Company',
    'footer.col.resources': 'Resources',
    'footer.col.legal': 'Legal',
    'footer.legal.cndp': 'CNDP compliant',
    'footer.legal.rc': 'RC Casablanca',
    'footer.legal.ice': 'ICE',
    'footer.made': 'Designed & hosted in Morocco'
  },

  ar: {
    'nav.vision': 'الرؤية',
    'nav.solutions': 'الحلول',
    'nav.partners': 'الشركاء',
    'nav.security': 'الأمن',
    'nav.contact': 'تواصل',
    'nav.cta': 'اطلب عرضًا توضيحيًا',

    'hero.kicker': 'الرباط أكدال · المغرب',
    'hero.title.prefix': 'المحور الجديد للمالية',
    'hero.title.suffix': 'المعزّزة.',
    'hero.subtitle':
      'نمزج ثلاثين عامًا من الصرامة المحاسبية بأحدث تقنيات الذكاء الاصطناعي لتحويل إدارة الشركات المغربية.',
    'hero.cta.primary': 'اكتشف حلولنا',
    'hero.cta.secondary': 'شاهد عرضًا حيًا',
    'hero.badge': 'سيادة البيانات · مستضافة في المغرب',

    'fusion.eyebrow': '02 — المنهج',
    'fusion.title': 'خبرتان. محور واحد.',
    'fusion.body':
      'حيث يرى الآخرون عالمين منفصلين، بنينا جسرًا. محاسبون معتمدون، مهندسو ذكاء اصطناعي، خبراء أمن — فريق واحد، رسالة واحدة.',
    'fusion.p1.title': 'المحاسبة',
    'fusion.p1.body': 'خبرة قطاعية، معايير OHADA والمغرب، الامتثال للضرائب.',
    'fusion.p2.title': 'الذكاء',
    'fusion.p2.body': 'نماذج لغوية متقدمة، تعرّف ضوئي، محركات قواعد حتمية.',
    'fusion.p3.title': 'السيادة',
    'fusion.p3.body': 'بيانات داخل المغرب، نماذج مفتوحة، تدقيق كامل.',

    'vision.eyebrow': '03 — البيان',
    'vision.l1': 'نؤمن بأن الذكاء الاصطناعي الجدير بالثقة ليس صندوقًا أسود.',
    'vision.l1.b': 'يشرح نفسه. يمكن التحقق منه. يُحكم.',
    'vision.l2':
      'نؤمن بأن السيادة الرقمية للمغرب تمر عبر حلول تُبنى هنا، من قبل مغاربة، لشركات مغربية.',
    'vision.l3':
      'نؤمن بأن المحاسبة ليست تكلفة، بل رافعة استراتيجية حين تُعزَّز بذكاء.',
    'vision.sign': '— فريق NOVAXIS، الرباط أكدال',

    'solutions.eyebrow': '04 — الحلول',
    'solutions.title': 'منتجات لا وعود.',
    'solutions.flagship.tag': 'الحل الرئيسي',
    'solutions.flagship.name': 'OCR·SAGE',
    'solutions.flagship.headline': 'من الفاتورة الورقية إلى التحويل المعتمد.',
    'solutions.flagship.sub':
      '٢٢ قاعدة تحكم. صفر خطأ. مطابقة آلية لملفات الدفع.',
    'solutions.demo.drop': 'أفلت ملف PDF أو انقر للمحاكاة',
    'solutions.demo.running': 'جارٍ التحليل…',
    'solutions.demo.ok': 'مطابق',
    'solutions.demo.ko': 'غير مطابق',
    'solutions.demo.reset': 'إعادة',
    'solutions.others.1.t': 'تدقيق معزّز بالذكاء',
    'solutions.others.1.d': 'عينات إحصائية، كشف الشذوذ، تبرير الضوابط.',
    'solutions.others.2.t': 'امتثال آلي',
    'solutions.others.2.d': 'رصد تنظيمي CNDP وOHADA وCGI، تنبيهات استباقية.',
    'solutions.others.3.t': 'تقارير ذكية',
    'solutions.others.3.d': 'لوحات قيادة من قيودك، مع سرد قابل للتفسير.',

    'partners.eyebrow': '05 — المكدّس',
    'partners.title': 'مكدّس مفتوح. شركاء من الطراز الأول.',
    'partners.sub':
      'لسنا مرتبطين بمزود واحد. نختار أفضل الكتل التقنية ونُفضّل النماذج المفتوحة القابلة للتدقيق.',
    'partners.box.title': 'لماذا تعدد النماذج؟',
    'partners.box.body':
      'لأن السيادة تعني عدم الاعتماد على أحد. نستطيع التشغيل بنسبة 100% محليًا عبر Mistral + Ollama.',

    'security.eyebrow': '06 — الأمن',
    'security.title': 'مستوى بنكي. افتراضيًا.',
    'security.s1': 'استضافة سيادية في المغرب (مراكز Tier III+)',
    'security.s2': 'الامتثال لـ CNDP — قانون 09-08',
    'security.s3': 'تشفير AES-256 ساكنًا ومتنقلًا',
    'security.s4': 'سجل تدقيق كامل غير قابل للتعديل',
    'security.s5': 'مصادقة SSO / Keycloak / MFA',
    'security.s6': 'نماذج ذكاء قابلة للنشر محليًا — صفر تسرّب',
    'security.s7': 'الامتثال لـ ISO 27001 (قيد الإنجاز)',

    'why.eyebrow': '07 — مقارنة',
    'why.title': 'لماذا NOVAXIS.',
    'why.col.us': 'NOVAXIS',
    'why.col.foreign': 'الحلول الأجنبية',
    'why.col.manual': 'يدوي',
    'why.row.1': 'سيادة البيانات',
    'why.row.2': 'ذكاء اصطناعي متقدم',
    'why.row.3': 'خبرة محاسبية',
    'why.row.4': 'الامتثال المغربي',
    'why.row.5': 'الأتمتة',
    'why.row.6': 'كلفة محسّنة (درهم)',

    'team.eyebrow': '08 — المؤسسون',
    'team.title': 'مؤسّسان. في الرباط أكدال.',
    'team.body':
      'NOVAXIS ليست صدفة. إنها تحالف مقصود بين مهندس تقنية وذكاء اصطناعي وخبير محاسب مدقّق قانوني — اندماج حيّ لتخصّصينا.',
    'team.label.experience': 'المسار',
    'team.label.stack': 'المجالات',
    'team.label.education': 'التكوين',
    'team.label.present': 'الآن',
    'team.role.cto': 'شريك مؤسس · مدير تقني',
    'team.role.expert': 'شريك مؤسس · خبير محاسب',
    'team.f1.tagline':
      'هندسة برمجية، معمارية خدمات مصغّرة، إدارة الهوية وذكاء اصطناعي توليدي. أكثر من 13 عامًا في بناء أنظمة حسّاسة لمجموعات أوروبية.',
    'team.f2.tagline':
      'مدقّق قانوني. 20 عامًا من التدقيق القانوني والاستشارة المالية في المغرب. الصرامة المحاسبية في صميم المنتج.',
    'team.stat.1': 'عامًا من التدقيق والمراجعة',
    'team.stat.2': 'عامًا من الهندسة البرمجية',
    'team.stat.3': 'تخصّصان مندمجان',
    'team.stat.4': 'مقيمون في المغرب',

    'stats.eyebrow': '09 — أرقام مفتاحية',
    'stats.title': 'أداء تشغيلي قابل للقياس.',
    'stats.1.l': 'دقة استخراج المستندات',
    'stats.2.l': 'لاعتماد ملف دفع كامل',
    'stats.3.l': 'قواعد تحكم آلية',
    'stats.4.l': 'بيانات تُرسل خارج المغرب (الوضع السيادي)',

    'trust.eyebrow': '10 — ثقة',
    'trust.title': 'يثقون بنا.',
    'trust.quote':
      'في ثلاثة أشهر، انخفض زمن التحقق من ملف الدفع من أربعة أيام إلى أقل من ثلاثين ثانية. وكل قرار يبقى قابلًا للتدقيق.',
    'trust.quote.author': 'مدير مالي، مجموعة صناعية مغربية',

    'cta.title': 'هل أنت مستعد لتعزيز إدارتك؟',
    'cta.sub':
      'عرض مخصص مجاني. ننتقل إلى الدار البيضاء والرباط وطنجة ومراكش.',
    'cta.form.name': 'الاسم',
    'cta.form.email': 'البريد المهني',
    'cta.form.company': 'الشركة',
    'cta.form.phone': 'الهاتف',
    'cta.form.submit': 'احجز عرضي',
    'cta.form.sending': 'جارٍ الإرسال…',
    'cta.form.sent': 'تم الإرسال. سنعود إليك خلال 24 ساعة.',

    'footer.tagline': 'المحاسبة × الذكاء — سيادة مغربية',
    'footer.col.solutions': 'الحلول',
    'footer.col.company': 'الشركة',
    'footer.col.resources': 'الموارد',
    'footer.col.legal': 'قانوني',
    'footer.legal.cndp': 'متوافق مع CNDP',
    'footer.legal.rc': 'RC الدار البيضاء',
    'footer.legal.ice': 'ICE',
    'footer.made': 'مصمم ومستضاف في المغرب'
  }
};

type Ctx = {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  t: (key: string) => string;
  setLocale: (l: Locale) => void;
};

const LocaleCtx = createContext<Ctx | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fr');

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? (localStorage.getItem('novaxis_locale') as Locale | null) : null;
    if (saved && ['fr', 'en', 'ar'].includes(saved)) setLocaleState(saved);
  }, []);

  useEffect(() => {
    const dir: 'ltr' | 'rtl' = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem('novaxis_locale', l); } catch {}
  }, []);

  const t = useCallback((key: string) => dict[locale][key] ?? dict.fr[key] ?? key, [locale]);

  const value = useMemo<Ctx>(() => ({
    locale,
    dir: locale === 'ar' ? 'rtl' : 'ltr',
    t,
    setLocale
  }), [locale, t, setLocale]);

  return <LocaleCtx.Provider value={value}>{children}</LocaleCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(LocaleCtx);
  if (!ctx) throw new Error('useI18n outside provider');
  return ctx;
}
