'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { BRAND } from './brand';

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
    'vision.sign': '— L’équipe {brand}, Rabat Agdal',

    'solutions.eyebrow': '04 — Solutions',
    'solutions.title': 'Des produits, pas des promesses.',
    'solutions.flagship.tag': 'Solution phare',
    'solutions.flagship.name': 'OCR·SAGE',
    'solutions.flagship.headline':
      'De la facture papier au virement validé.',
    'solutions.flagship.sub':
      '22 règles de contrôle. 0 erreur tolérée. Réconciliation automatique des dossiers de paiement.',
    'solutions.demo.drop': 'Déposez un document ou cliquez pour lancer l’analyse',
    'solutions.demo.ok': 'CONFORME',
    'solutions.demo.ko': 'NON CONFORME',
    'solutions.demo.reset': 'Relancer',
    'solutions.demo.hint': 'Le moteur identifie le type de document, puis en extrait les éléments clés.',
    'solutions.demo.detected': 'Type détecté',
    'solutions.demo.confidence': 'confiance',
    'solutions.demo.fields': 'Éléments extraits',
    'solutions.demo.controls': 'Contrôles de conformité',
    'solutions.demo.stage.read': 'Lecture du fichier',
    'solutions.demo.stage.ocr': 'OCR — extraction du texte',
    'solutions.demo.stage.classify': 'Classification du document',
    'solutions.demo.stage.extract': 'Extraction des champs',
    'solutions.demo.stage.control': 'Contrôles de conformité',
    'solutions.demo.type.invoice': 'Facture fournisseur',
    'solutions.demo.type.statement': 'Relevé bancaire',
    'solutions.demo.type.order': 'Bon de commande',
    'solutions.demo.field.supplier': 'Fournisseur',
    'solutions.demo.field.invNo': 'N° facture',
    'solutions.demo.field.date': 'Date',
    'solutions.demo.field.due': 'Échéance',
    'solutions.demo.field.ht': 'Montant HT',
    'solutions.demo.field.vat': 'TVA (20%)',
    'solutions.demo.field.ttc': 'Montant TTC',
    'solutions.demo.field.ice': 'ICE',
    'solutions.demo.field.iban': 'IBAN',
    'solutions.demo.field.bank': 'Banque',
    'solutions.demo.field.period': 'Période',
    'solutions.demo.field.balanceOpen': 'Solde initial',
    'solutions.demo.field.balanceClose': 'Solde final',
    'solutions.demo.field.poNo': 'N° commande',
    'solutions.demo.rule.1': 'Format IBAN',
    'solutions.demo.rule.2': 'Cohérence TTC',
    'solutions.demo.rule.3': 'TVA déclarée',
    'solutions.demo.rule.4': 'N° facture unique',
    'solutions.demo.rule.5': 'Validité ICE',
    'solutions.demo.rule.6': 'Conformité OHADA',
    'solutions.demo.rule.7': 'Délais de paiement',
    'solutions.demo.rule.8': 'Signature électronique',
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
    'why.title': 'Pourquoi {brand}.',
    'why.col.us': '{brand}',
    'why.col.foreign': 'Solutions étrangères',
    'why.col.manual': 'Manuel',
    'why.row.1': 'Souveraineté des données',
    'why.row.2': 'IA de pointe',
    'why.row.3': 'Expertise comptable',
    'why.row.4': 'Conformité marocaine',
    'why.row.5': 'Automatisation',
    'why.row.6': 'Coût optimisé (MAD)',

    'team.eyebrow': '08 — Fondateurs',
    'team.title': 'Deux fondateurs. Une vision.',
    'team.body':
      '{brand} naît de la rencontre de deux expertises de vingt ans — l’ingénierie IT & IA et l’expertise comptable — réunies pour bâtir les systèmes de gestion de demain, augmentés par l’intelligence artificielle.',
    'team.label.founder': 'Fondateur',
    'team.role.cofounder': 'Co-fondateur',
    'team.f1.domain': 'Expert IT & IA · 20 ans',
    'team.f2.domain': 'Expertise comptable · 20 ans',
    'team.f1.title': 'Il bâtit les systèmes de demain, augmentés par l’IA',
    'team.f2.title': 'Il réinvente le métier du chiffre avec l’IA',
    'team.f1.tagline':
      'Vingt ans en IT et intelligence artificielle. Il a fondé plusieurs startups et livré des projets parmi les plus complexes, aux côtés d’Europcar, Renault, CALF et Casino.',
    'team.f2.tagline':
      'Vingt ans d’expertise comptable et financière. Il transforme la rigueur du métier en outils de gestion et de conformité de nouvelle génération, augmentés par l’IA.',
    'team.f1.markers.label': 'Clients accompagnés',
    'team.f1.m.1': 'Europcar',
    'team.f1.m.2': 'Renault',
    'team.f1.m.3': 'CALF',
    'team.f1.m.4': 'Casino',
    'team.f2.markers.label': 'Domaines',
    'team.f2.m.1': 'Expertise comptable',
    'team.f2.m.2': 'Audit',
    'team.f2.m.3': 'Conformité',
    'team.stat.1': 'ans d’expertise par fondateur',
    'team.stat.2': 'ingénieurs en informatique',
    'team.stat.3': 'basés au Maroc',
    'team.stat.4': 'souveraineté des données',

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
    'footer.legal.rc': 'RC Rabat',
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
    'vision.sign': '— The {brand} team, Rabat Agdal',

    'solutions.eyebrow': '04 — Solutions',
    'solutions.title': 'Products, not promises.',
    'solutions.flagship.tag': 'Flagship',
    'solutions.flagship.name': 'OCR·SAGE',
    'solutions.flagship.headline': 'From paper invoice to validated payment.',
    'solutions.flagship.sub':
      '22 control rules. Zero errors tolerated. Automatic reconciliation of payment files.',
    'solutions.demo.drop': 'Drop a document or click to run the analysis',
    'solutions.demo.ok': 'COMPLIANT',
    'solutions.demo.ko': 'NON COMPLIANT',
    'solutions.demo.reset': 'Restart',
    'solutions.demo.hint': 'The engine identifies the document type, then extracts its key elements.',
    'solutions.demo.detected': 'Detected type',
    'solutions.demo.confidence': 'confidence',
    'solutions.demo.fields': 'Extracted fields',
    'solutions.demo.controls': 'Compliance controls',
    'solutions.demo.stage.read': 'Reading file',
    'solutions.demo.stage.ocr': 'OCR — text extraction',
    'solutions.demo.stage.classify': 'Document classification',
    'solutions.demo.stage.extract': 'Field extraction',
    'solutions.demo.stage.control': 'Compliance controls',
    'solutions.demo.type.invoice': 'Supplier invoice',
    'solutions.demo.type.statement': 'Bank statement',
    'solutions.demo.type.order': 'Purchase order',
    'solutions.demo.field.supplier': 'Supplier',
    'solutions.demo.field.invNo': 'Invoice no.',
    'solutions.demo.field.date': 'Date',
    'solutions.demo.field.due': 'Due date',
    'solutions.demo.field.ht': 'Net amount',
    'solutions.demo.field.vat': 'VAT (20%)',
    'solutions.demo.field.ttc': 'Gross amount',
    'solutions.demo.field.ice': 'ICE',
    'solutions.demo.field.iban': 'IBAN',
    'solutions.demo.field.bank': 'Bank',
    'solutions.demo.field.period': 'Period',
    'solutions.demo.field.balanceOpen': 'Opening balance',
    'solutions.demo.field.balanceClose': 'Closing balance',
    'solutions.demo.field.poNo': 'PO number',
    'solutions.demo.rule.1': 'IBAN format',
    'solutions.demo.rule.2': 'Gross amount consistency',
    'solutions.demo.rule.3': 'VAT declared',
    'solutions.demo.rule.4': 'Unique invoice no.',
    'solutions.demo.rule.5': 'ICE validity',
    'solutions.demo.rule.6': 'OHADA compliance',
    'solutions.demo.rule.7': 'Payment terms',
    'solutions.demo.rule.8': 'E-signature',
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
    'why.title': 'Why {brand}.',
    'why.col.us': '{brand}',
    'why.col.foreign': 'Foreign solutions',
    'why.col.manual': 'Manual',
    'why.row.1': 'Data sovereignty',
    'why.row.2': 'Frontier AI',
    'why.row.3': 'Accounting expertise',
    'why.row.4': 'Moroccan compliance',
    'why.row.5': 'Automation',
    'why.row.6': 'Optimized cost (MAD)',

    'team.eyebrow': '08 — Founders',
    'team.title': 'Two founders. One vision.',
    'team.body':
      '{brand} is born from two twenty-year expertises — IT & AI engineering and chartered accounting — joined to build tomorrow’s management systems, augmented by artificial intelligence.',
    'team.label.founder': 'Founder',
    'team.role.cofounder': 'Co-founder',
    'team.f1.domain': 'IT & AI expert · 20 years',
    'team.f2.domain': 'Accounting expertise · 20 years',
    'team.f1.title': 'He builds tomorrow’s systems, augmented by AI',
    'team.f2.title': 'He reinvents accounting with AI',
    'team.f1.tagline':
      'Twenty years in IT and artificial intelligence. He has founded several startups and delivered some of the most complex projects, alongside Europcar, Renault, CALF and Casino.',
    'team.f2.tagline':
      'Twenty years of accounting and financial expertise. He turns the rigor of the craft into next-generation management and compliance tools, augmented by AI.',
    'team.f1.markers.label': 'Clients served',
    'team.f1.m.1': 'Europcar',
    'team.f1.m.2': 'Renault',
    'team.f1.m.3': 'CALF',
    'team.f1.m.4': 'Casino',
    'team.f2.markers.label': 'Fields',
    'team.f2.m.1': 'Accounting',
    'team.f2.m.2': 'Audit',
    'team.f2.m.3': 'Compliance',
    'team.stat.1': 'years of expertise per founder',
    'team.stat.2': 'software engineers',
    'team.stat.3': 'based in Morocco',
    'team.stat.4': 'data sovereignty',

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
      'Free personalized demo. We travel to Rabat, Casablanca, Tangier, Marrakech.',
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
    'footer.legal.rc': 'RC Rabat',
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
    'vision.sign': '— فريق {brand}، الرباط أكدال',

    'solutions.eyebrow': '04 — الحلول',
    'solutions.title': 'منتجات لا وعود.',
    'solutions.flagship.tag': 'الحل الرئيسي',
    'solutions.flagship.name': 'OCR·SAGE',
    'solutions.flagship.headline': 'من الفاتورة الورقية إلى التحويل المعتمد.',
    'solutions.flagship.sub':
      '٢٢ قاعدة تحكم. صفر خطأ. مطابقة آلية لملفات الدفع.',
    'solutions.demo.drop': 'أفلت مستندًا أو انقر لتشغيل التحليل',
    'solutions.demo.ok': 'مطابق',
    'solutions.demo.ko': 'غير مطابق',
    'solutions.demo.reset': 'إعادة',
    'solutions.demo.hint': 'يحدّد المحرّك نوع المستند ثم يستخرج عناصره الأساسية.',
    'solutions.demo.detected': 'النوع المكتشف',
    'solutions.demo.confidence': 'ثقة',
    'solutions.demo.fields': 'العناصر المستخرجة',
    'solutions.demo.controls': 'ضوابط المطابقة',
    'solutions.demo.stage.read': 'قراءة الملف',
    'solutions.demo.stage.ocr': 'OCR — استخراج النص',
    'solutions.demo.stage.classify': 'تصنيف المستند',
    'solutions.demo.stage.extract': 'استخراج الحقول',
    'solutions.demo.stage.control': 'ضوابط المطابقة',
    'solutions.demo.type.invoice': 'فاتورة مورّد',
    'solutions.demo.type.statement': 'كشف حساب بنكي',
    'solutions.demo.type.order': 'سند طلب',
    'solutions.demo.field.supplier': 'المورّد',
    'solutions.demo.field.invNo': 'رقم الفاتورة',
    'solutions.demo.field.date': 'التاريخ',
    'solutions.demo.field.due': 'تاريخ الاستحقاق',
    'solutions.demo.field.ht': 'المبلغ دون ضريبة',
    'solutions.demo.field.vat': 'ض.ق.م (20%)',
    'solutions.demo.field.ttc': 'المبلغ الإجمالي',
    'solutions.demo.field.ice': 'المعرّف الموحّد',
    'solutions.demo.field.iban': 'IBAN',
    'solutions.demo.field.bank': 'البنك',
    'solutions.demo.field.period': 'الفترة',
    'solutions.demo.field.balanceOpen': 'الرصيد الافتتاحي',
    'solutions.demo.field.balanceClose': 'الرصيد الختامي',
    'solutions.demo.field.poNo': 'رقم الطلب',
    'solutions.demo.rule.1': 'صيغة IBAN',
    'solutions.demo.rule.2': 'اتساق المبلغ الإجمالي',
    'solutions.demo.rule.3': 'التصريح بالضريبة',
    'solutions.demo.rule.4': 'رقم فاتورة فريد',
    'solutions.demo.rule.5': 'صلاحية المعرّف الموحّد',
    'solutions.demo.rule.6': 'مطابقة OHADA',
    'solutions.demo.rule.7': 'آجال الأداء',
    'solutions.demo.rule.8': 'توقيع إلكتروني',
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
    'why.title': 'لماذا {brand}.',
    'why.col.us': '{brand}',
    'why.col.foreign': 'الحلول الأجنبية',
    'why.col.manual': 'يدوي',
    'why.row.1': 'سيادة البيانات',
    'why.row.2': 'ذكاء اصطناعي متقدم',
    'why.row.3': 'خبرة محاسبية',
    'why.row.4': 'الامتثال المغربي',
    'why.row.5': 'الأتمتة',
    'why.row.6': 'كلفة محسّنة (درهم)',

    'team.eyebrow': '08 — المؤسسون',
    'team.title': 'مؤسّسان. رؤية واحدة.',
    'team.body':
      'يولد {brand} من التقاء خبرتين بعشرين عامًا — هندسة تقنية المعلومات والذكاء الاصطناعي، والخبرة المحاسبية — اجتمعتا لبناء أنظمة التدبير للغد، معزَّزة بالذكاء الاصطناعي.',
    'team.label.founder': 'مؤسّس',
    'team.role.cofounder': 'شريك مؤسس',
    'team.f1.domain': 'خبير تقنية المعلومات والذكاء الاصطناعي · 20 عامًا',
    'team.f2.domain': 'خبرة محاسبية · 20 عامًا',
    'team.f1.title': 'يبني أنظمة الغد، معزَّزة بالذكاء الاصطناعي',
    'team.f2.title': 'يعيد ابتكار مهنة المحاسبة بالذكاء الاصطناعي',
    'team.f1.tagline':
      'عشرون عامًا في تقنية المعلومات والذكاء الاصطناعي. أسّس عدّة شركات ناشئة وأنجز مشاريع من بين الأكثر تعقيدًا، إلى جانب Europcar وRenault وCALF وCasino.',
    'team.f2.tagline':
      'عشرون عامًا من الخبرة المحاسبية والمالية. يحوّل صرامة المهنة إلى أدوات تدبير وامتثال من الجيل الجديد، معزَّزة بالذكاء الاصطناعي.',
    'team.f1.markers.label': 'عملاء رافقهم',
    'team.f1.m.1': 'Europcar',
    'team.f1.m.2': 'Renault',
    'team.f1.m.3': 'CALF',
    'team.f1.m.4': 'Casino',
    'team.f2.markers.label': 'المجالات',
    'team.f2.m.1': 'الخبرة المحاسبية',
    'team.f2.m.2': 'التدقيق',
    'team.f2.m.3': 'الامتثال',
    'team.stat.1': 'عامًا من الخبرة لكل مؤسس',
    'team.stat.2': 'مهندسًا في المعلوميات',
    'team.stat.3': 'مقيمون في المغرب',
    'team.stat.4': 'سيادة البيانات',

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
      'عرض مخصص مجاني. ننتقل إلى الرباط والدار البيضاء وطنجة ومراكش.',
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
    'footer.legal.rc': 'RC الرباط',
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
    const saved = typeof window !== 'undefined' ? (localStorage.getItem('novaxium_locale') as Locale | null) : null;
    if (saved && ['fr', 'en', 'ar'].includes(saved)) setLocaleState(saved);
  }, []);

  useEffect(() => {
    const dir: 'ltr' | 'rtl' = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem('novaxium_locale', l); } catch {}
  }, []);

  const t = useCallback(
    (key: string) => (dict[locale][key] ?? dict.fr[key] ?? key).replace(/\{brand\}/g, BRAND.name),
    [locale]
  );

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
