/**
 * Pages « Bénévole + discipline » (ex. /benevole/trail).
 * Chaque page vise une recherche précise (« bénévole trail », « devenir bénévole triathlon »…)
 * avec un contenu propre : missions, conseils, FAQ et les courses à venir de la discipline.
 */
export interface Discipline {
  slug: string;
  /** Valeur de type_sport en base (voir TYPES_SPORT). */
  sport: string;
  /** Nom court affiché (liens, fil d'Ariane). */
  label: string;
  title: string;
  description: string;
  h1: string;
  intro: string[];
  missions: { titre: string; texte: string }[];
  conseils: string[];
  faq: { q: string; a: string }[];
}

export const DISCIPLINES: Discipline[] = [
  {
    slug: "trail",
    sport: "Trail",
    label: "Trail",
    title: "Bénévole trail : trouve une course près de chez toi",
    description:
      "Deviens bénévole sur un trail : ravitaillement, balisage, signaleur. Trouve les trails qui recherchent des bénévoles près de chez toi et postule gratuitement.",
    h1: "Devenir bénévole sur un trail",
    intro: [
      "Sur un trail, les bénévoles font la course autant que les coureurs. Sans eux, pas de balisage dans la forêt, pas de ravitaillement au sommet, pas de signaleur au carrefour du chemin.",
      "Pas besoin d'être traileur ni d'avoir de l'expérience : les organisateurs cherchent surtout des personnes motivées, à l'heure et de bonne humeur. Tu vis la course de l'intérieur, tu encourages les coureurs et tu repars souvent avec le t-shirt et le repas d'après-course.",
    ],
    missions: [
      { titre: "Ravitaillement", texte: "Servir l'eau, les boissons et le salé-sucré aux coureurs, remplir les gourdes, encourager chacun." },
      { titre: "Balisage et débalisage", texte: "Poser la rubalise et les flèches la veille, puis tout retirer après le passage du dernier coureur." },
      { titre: "Signaleur", texte: "Sécuriser une traversée de route ou une bifurcation et orienter les coureurs au bon endroit." },
      { titre: "Serre-file", texte: "Fermer la course derrière le dernier coureur, avec un bon niveau de marche ou de course." },
      { titre: "Accueil et dossards", texte: "Remettre les dossards, renseigner les coureurs et gérer l'arrivée." },
    ],
    conseils: [
      "Prévois des vêtements chauds et de pluie : en montagne ou en forêt, on attend parfois longtemps au même poste.",
      "Charge ton téléphone et note le numéro du responsable bénévoles.",
      "Pour un poste isolé, emporte de l'eau, à manger et une lampe frontale si la course commence tôt ou finit tard.",
    ],
    faq: [
      {
        q: "Faut-il savoir courir pour être bénévole sur un trail ?",
        a: "Non. La plupart des missions (ravitaillement, accueil, signaleur) ne demandent aucune condition physique. Seuls les postes de serre-file ou de balisage en montagne demandent de savoir marcher longtemps.",
      },
      {
        q: "Est-ce que le bénévolat sur un trail est rémunéré ?",
        a: "Non, c'est du bénévolat. En échange, les organisateurs offrent souvent le repas, un t-shirt ou un cadeau, et parfois une inscription gratuite sur une prochaine course.",
      },
      {
        q: "Comment trouver un trail qui cherche des bénévoles ?",
        a: "Les trails qui recherchent des bénévoles sont listés sur cette page. Crée ton compte Ravito gratuitement, choisis une course et postule en un clic : l'organisateur te répond directement.",
      },
    ],
  },
  {
    slug: "course-a-pied",
    sport: "Running",
    label: "Course à pied",
    title: "Bénévole course à pied : 10 km, semi, marathon",
    description:
      "Deviens bénévole sur une course à pied, un 10 km, un semi-marathon ou un marathon : ravitaillement, signaleur, accueil. Postule gratuitement sur Ravito.",
    h1: "Devenir bénévole sur une course à pied",
    intro: [
      "Du 5 km de quartier au marathon, chaque course sur route a besoin de dizaines de bénévoles : au départ, sur le parcours, aux ravitaillements et à l'arrivée.",
      "C'est la façon la plus simple de commencer le bénévolat sportif : les missions sont faciles à apprendre, l'ambiance est festive et tu es au cœur de l'événement.",
    ],
    missions: [
      { titre: "Ravitaillement", texte: "Tendre les gobelets, préparer les fruits et garder le poste propre au passage des coureurs." },
      { titre: "Signaleur", texte: "Bloquer un croisement, sécuriser le parcours et guider les coureurs dans les virages." },
      { titre: "Remise des dossards", texte: "Accueillir les coureurs la veille ou le matin, vérifier les inscriptions et remettre les dossards." },
      { titre: "Zone d'arrivée", texte: "Remettre les médailles, les sacs de récupération et orienter les coureurs après la ligne." },
      { titre: "Consigne et vestiaires", texte: "Garder les sacs des coureurs pendant la course et les leur rendre à l'arrivée." },
    ],
    conseils: [
      "Arrive en avance : les postes sont installés avant le départ et les routes ferment tôt.",
      "Porte des chaussures confortables, tu seras debout plusieurs heures.",
      "N'hésite pas à encourager les coureurs par leur prénom quand il est écrit sur le dossard, ils adorent ça.",
    ],
    faq: [
      {
        q: "Peut-on être bénévole sur un marathon sans expérience ?",
        a: "Oui. Les organisateurs forment les bénévoles le jour même et donnent un responsable de poste à qui poser ses questions.",
      },
      {
        q: "Combien de temps dure une mission de bénévole sur une course ?",
        a: "En général entre 3 et 6 heures pour une course sur route, un peu plus pour un marathon. L'annonce de chaque course précise les horaires et les missions.",
      },
      {
        q: "Peut-on venir à plusieurs ou en famille ?",
        a: "Oui, c'est même très apprécié. Chaque personne crée son compte Ravito et postule sur la même course, en précisant dans son message qu'elle vient avec d'autres bénévoles.",
      },
    ],
  },
  {
    slug: "triathlon",
    sport: "Triathlon",
    label: "Triathlon",
    title: "Bénévole triathlon : natation, vélo, course à pied",
    description:
      "Deviens bénévole sur un triathlon : parc à vélos, sécurité natation, signaleur vélo, ravitaillement. Trouve un triathlon qui cherche des bénévoles et postule.",
    h1: "Devenir bénévole sur un triathlon",
    intro: [
      "Un triathlon, c'est trois courses en une : natation, vélo et course à pied. Il faut donc beaucoup de bénévoles, sur l'eau, sur la route et dans le parc à vélos.",
      "Les missions sont variées et l'ambiance est unique, surtout dans les zones de transition où tout se joue en quelques secondes.",
    ],
    missions: [
      { titre: "Parc à vélos", texte: "Contrôler l'entrée des athlètes, vérifier les casques et garder l'aire de transition en ordre." },
      { titre: "Sécurité natation", texte: "Surveiller les nageurs depuis le bord ou un kayak (souvent réservé aux bénévoles expérimentés)." },
      { titre: "Signaleur vélo", texte: "Sécuriser un carrefour sur le parcours vélo et ralentir la circulation." },
      { titre: "Ravitaillement course à pied", texte: "Servir l'eau et les boissons sur la dernière partie de l'épreuve." },
      { titre: "Arrivée et récupération", texte: "Remettre les médailles et accompagner les athlètes vers la zone de récupération." },
    ],
    conseils: [
      "Les triathlons commencent souvent tôt le matin : vérifie l'heure de rendez-vous la veille.",
      "Pour un poste près de l'eau, prévois une tenue qui peut être mouillée.",
      "Le règlement est strict dans le parc à vélos : écoute bien les consignes de l'arbitre.",
    ],
    faq: [
      {
        q: "Faut-il savoir nager pour être bénévole sur un triathlon ?",
        a: "Non, sauf pour les postes de sécurité sur l'eau. Toutes les autres missions se passent sur la terre ferme.",
      },
      {
        q: "Quelles sont les missions les plus demandées sur un triathlon ?",
        a: "Les signaleurs sur le parcours vélo et les bénévoles du parc à vélos sont les plus recherchés, car le parcours vélo est long et traverse souvent des routes ouvertes.",
      },
      {
        q: "Comment postuler comme bénévole sur un triathlon ?",
        a: "Choisis un triathlon dans la liste de cette page, crée ton compte Ravito gratuitement et postule en un clic. L'organisateur reçoit ta candidature et te répond directement.",
      },
    ],
  },
  {
    slug: "cyclisme",
    sport: "Cyclosportive",
    label: "Cyclisme",
    title: "Bénévole cyclosportive et course vélo",
    description:
      "Deviens bénévole sur une cyclosportive ou une course cycliste : signaleur, ravitaillement, accueil. Trouve un événement vélo près de chez toi et postule.",
    h1: "Devenir bénévole sur une cyclosportive",
    intro: [
      "Les cyclosportives et courses vélo parcourent des dizaines de kilomètres sur des routes ouvertes. Les bénévoles signaleurs sont indispensables pour que chaque cycliste passe en sécurité.",
      "C'est aussi l'occasion de voir passer le peloton de près et de découvrir l'organisation d'un grand événement sportif.",
    ],
    missions: [
      { titre: "Signaleur", texte: "Sécuriser un carrefour, signaler un danger et faire ralentir les véhicules au passage des coureurs." },
      { titre: "Ravitaillement", texte: "Préparer et tendre bidons, barres et fruits aux cyclistes, souvent en haut d'une côte." },
      { titre: "Accueil et retrait des plaques", texte: "Remettre les plaques de cadre et les puces de chronométrage." },
      { titre: "Moto ou voiture d'assistance", texte: "Suivre la course pour aider en cas de crevaison ou de chute (selon le permis et l'organisation)." },
    ],
    conseils: [
      "Le gilet jaune et le drapeau sont fournis par l'organisateur : garde-les bien visibles.",
      "Repère la veille ton carrefour et l'itinéraire pour t'y rendre avant la fermeture des routes.",
      "Prends de quoi patienter : les cyclistes passent en groupes, avec parfois de longues attentes entre deux pelotons.",
    ],
    faq: [
      {
        q: "Faut-il un permis pour être signaleur sur une course vélo ?",
        a: "Pour les épreuves sur route, les signaleurs doivent souvent être majeurs et titulaires du permis de conduire. L'annonce de chaque course précise les conditions.",
      },
      {
        q: "Combien de bénévoles faut-il pour une cyclosportive ?",
        a: "Souvent plusieurs dizaines, voire plus de cent pour les grandes épreuves, car chaque carrefour dangereux doit être tenu par un signaleur.",
      },
      {
        q: "Comment devenir bénévole sur une cyclosportive ?",
        a: "Consulte les événements vélo de cette page, crée ton compte Ravito gratuitement et postule. L'organisateur te contacte pour confirmer ton poste.",
      },
    ],
  },
];

export function findDiscipline(slug: string) {
  return DISCIPLINES.find((d) => d.slug === slug);
}
