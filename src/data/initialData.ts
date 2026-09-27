import { Scripture, ReadingPlan, SoapEntry, JournalEntry, PrayerItem, PinnedItem } from '../types';

export const ASSET_IMAGES = {
  oceanSanctuary: '/src/assets/images/ocean_bible_sanctuary_1790452022688.jpg',
  oceanWaves: '/src/assets/images/ocean_waves_tranquil_1790452036891.jpg',
};

// 1933/1983 Afrikaanse Bybelvers-biblioteek
export const SCRIPTURE_LIBRARY: Scripture[] = [
  {
    id: 'phil-4-6-7-1983',
    reference: 'Filippense 4:6-7',
    book: 'Filippense',
    chapter: 4,
    verse: '6-7',
    text: 'Moet oor niks besorg wees nie, maar maak in alles julle begeertes deur gebed en smeking en met danksegging aan God bekend. En die vrede van God, wat alle verstand te bowe gaan, sal oor julle harte en gedagtes die wag hou in Christus Jesus.',
    translation: '1983-vertaling',
    theme: 'Vrede & Angs',
    testament: 'Nuwe Testament'
  },
  {
    id: '2kor-10-4-5-1983',
    reference: '2 Korintiërs 10:4-5',
    book: '2 Korintiërs',
    chapter: 10,
    verse: '4-5',
    text: 'Die wapens van ons stryd is nie dié van die wêreld nie, maar kragtig deur God om vestings te breek. Ons breek valse redenasies af en elke hoogmoedige versperring wat teen die kennis van God opgerig word, en ons neem elke gedagte gevange om dit aan Christus gehoorsaam te maak.',
    translation: '1983-vertaling',
    theme: 'Slagveld van die Denke',
    testament: 'Nuwe Testament'
  },
  {
    id: 'rom-12-2-1983',
    reference: 'Romeine 12:2',
    book: 'Romeine',
    chapter: 12,
    verse: '2',
    text: 'Julle moenie aan hierdie sondige wêreld gelykvormig wees nie, maar laat God julle verander deur julle denke te vernuwe, sodat julle kan onderskei wat die goeie en welgevallige en volmaakte wil van God is.',
    translation: '1983-vertaling',
    theme: 'Vernuwing van Denke',
    testament: 'Nuwe Testament'
  },
  {
    id: 'spr-3-5-6-1983',
    reference: 'Spreuke 3:5-6',
    book: 'Spreuke',
    chapter: 3,
    verse: '5-6',
    text: 'Vertrou volkome op die Here en moenie op jou eie insigte staatmaak nie. Ken Hom in alles wat jy doen en Hy sal jou die regte pad laat loop.',
    translation: '1983-vertaling',
    theme: 'Vertroue & Leiding',
    testament: 'Ou Testament'
  },
  {
    id: 'jes-40-31-1983',
    reference: 'Jesaja 40:31',
    book: 'Jesaja',
    chapter: 40,
    verse: '31',
    text: 'Maar dié wat op die Here vertrou, kry nuwe krag. Hulle vlieg met arendsvlerke, hulle hardloop en word nie moeg nie, hulle loop en raak nie afgemat nie.',
    translation: '1983-vertaling',
    theme: 'Krag & Hoop',
    testament: 'Ou Testament'
  },
  {
    id: 'ps-23-1-3-1983',
    reference: 'Psalm 23:1-3',
    book: 'Psalms',
    chapter: 23,
    verse: '1-3',
    text: 'Die Here is my herder, ek kom niks kort nie. Hy laat my rus in groen weivelde. Hy bring my by waters waar daar vrede is. Hy gee my nuwe krag. Hy lei my op die regte paaie tot eer van sy Naam.',
    translation: '1983-vertaling',
    theme: 'Vrede & Rus',
    testament: 'Ou Testament'
  },
  {
    id: 'mat-6-33-34-1983',
    reference: 'Matteus 6:33-34',
    book: 'Matteus',
    chapter: 6,
    verse: '33-34',
    text: 'Nee, beywer julle eers vir die koninkryk van God en vir die wil van God, dan sal Hy julle ook al hierdie dinge gee. Moet julle dus nie oor môre bekommer nie, want môre bring sy eie bekommernis. Elke dag het genoeg aan sy eie kwaad.',
    translation: '1983-vertaling',
    theme: 'Begin Jou Dag Reg',
    testament: 'Nuwe Testament'
  },
  {
    id: 'joh-14-27-1983',
    reference: 'Johannes 14:27',
    book: 'Johannes',
    chapter: 14,
    verse: '27',
    text: 'Vrede laat Ek vir julle na; my vrede gee Ek vir julle. Die vrede wat Ek vir julle gee, is nie die soort wat die wêreld gee nie. Julle moet nie ontsteld wees nie, en julle moet nie bang wees nie.',
    translation: '1983-vertaling',
    theme: 'Vrede & Rus',
    testament: 'Nuwe Testament'
  },
  {
    id: 'jer-29-11-1983',
    reference: 'Jeremia 29:11',
    book: 'Jeremia',
    chapter: 29,
    verse: '11',
    text: 'Ek weet wat Ek vir julle beplan, sê die Here: voorspoed en nie rampspoed nie; Ek wil vir julle ’n toekoms gee, ’n verwagting!',
    translation: '1983-vertaling',
    theme: 'Hoop & Toekoms',
    testament: 'Ou Testament'
  },
  {
    id: 'rom-8-28-1983',
    reference: 'Romeine 8:28',
    book: 'Romeine',
    chapter: 8,
    verse: '28',
    text: 'Ons weet dat God alles ten goede laat meewerk vir dié wat Hom liefhet, dié wat volgens sy besluit geroep is.',
    translation: '1983-vertaling',
    theme: 'Goddelike Voorsienigheid',
    testament: 'Nuwe Testament'
  },
  {
    id: 'klaag-3-22-23-1983',
    reference: 'Klaagliedere 3:22-23',
    book: 'Klaagliedere',
    chapter: 3,
    verse: '22-23',
    text: 'Dit is danksy die genade van die Here dat ons nie vergaan het nie, want sy ontferming het geen einde nie; dit is elke môre nuut. Groot is u trou!',
    translation: '1983-vertaling',
    theme: 'Genade vir Elke Dag',
    testament: 'Ou Testament'
  },
  {
    id: 'jak-1-5-1983',
    reference: 'Jakobus 1:5',
    book: 'Jakobus',
    chapter: 1,
    verse: '5',
    text: 'As een van julle wysheid kortkom, moet hy dit van God bid, en Hy sal dit aan hom gee, want God gee aan almal sonder voorbehoud en sonder verwyt.',
    translation: '1983-vertaling',
    theme: 'Wysheid & Gebed',
    testament: 'Nuwe Testament'
  },
  {
    id: '1thess-5-16-18-1983',
    reference: '1 Tessalonisense 5:16-18',
    book: '1 Tessalonisense',
    chapter: 5,
    verse: '16-18',
    text: 'Wees altyd bly. Bid gedurig. Wees in alle omstandighede dankbaar, want dit is wat God in Christus Jesus van julle verwag.',
    translation: '1983-vertaling',
    theme: 'Dankbaarheid & Gebed',
    testament: 'Nuwe Testament'
  },
  {
    id: 'ps-103-1-4-1983',
    reference: 'Psalm 103:1-4',
    book: 'Psalms',
    chapter: 103,
    verse: '1-4',
    text: 'Loof die Here, o my siel, en alles wat binne-in my is, sy heilige Naam! Loof die Here, o my siel, en vergeet geeneen van sy weldade nie—wat al jou ongeregtigheid vergewe, wat al jou siektes genees, wat jou lewe verlos van die graf, wat jou kroon met goedertierenheid en barmhartighede.',
    translation: '1933/53-vertaling',
    theme: 'Lof & Dankbaarheid',
    testament: 'Ou Testament'
  },
  {
    id: 'ps-46-1-2-1983',
    reference: 'Psalm 46:2-3',
    book: 'Psalms',
    chapter: 46,
    verse: '2-3',
    text: 'God is vir ons ’n toevlug en ’n beskerming; Hy was nog altyd ’n hulp in tye van nood. Daarom sal ons nie vrees nie, al gee die aarde pad en al wankel die berge in die dieptes van die see.',
    translation: '1983-vertaling',
    theme: 'Toevlug & Krag',
    testament: 'Ou Testament'
  },
  {
    id: '2kor-12-9-1983',
    reference: '2 Korintiërs 12:9',
    book: '2 Korintiërs',
    chapter: 12,
    verse: '9',
    text: 'Maar Hy het vir my gesê: “My genade is vir jou genoeg, want my krag kom juis tot volle werking wanneer jy swak is.” Daarom sal ek baie liewer oor my swakhede roem, sodat die krag van Christus my beskutting kan wees.',
    translation: '1983-vertaling',
    theme: 'Genade & Krag',
    testament: 'Nuwe Testament'
  },
  {
    id: 'heb-11-1-1983',
    reference: 'Hebreërs 11:1',
    book: 'Hebreërs',
    chapter: 11,
    verse: '1',
    text: 'Om te glo, is om seker te wees van die dinge wat ons hoop, om oortuig te wees van die dinge wat ons nie sien nie.',
    translation: '1983-vertaling',
    theme: 'Geloof',
    testament: 'Nuwe Testament'
  },
  {
    id: 'efes-3-20-1983',
    reference: 'Efesiërs 3:20-21',
    book: 'Efesiërs',
    chapter: 3,
    verse: '20-21',
    text: 'Aan Hom wat deur sy krag wat in ons werk, magtig is om oneindig meer te doen as wat ons bid of dink, aan Hom kom die eer toe in die kerk en in Christus Jesus tot in alle geslagte, vir ewig en altyd! Amen.',
    translation: '1983-vertaling',
    theme: 'Beantwoorde Gebed',
    testament: 'Nuwe Testament'
  }
];

// Oordenkings oor die denke en die 1983-Bybelvertaling
export const READING_PLANS: ReadingPlan[] = [
  {
    id: 'slagveld-van-die-denke',
    title: 'Slagveld van die Denke: 7 Dae na Geestelike Vryheid',
    subtitle: 'Wen die stryd in jou gedagtewêreld en leef in oorwinning',
    description: 'Die grootste oorlog van die lewe vind tussen ons ore plaas. Leer om negatiewe patrone, selfverwyt en bekommernis af te breek met die gesag van God se Woord.',
    category: 'Slagveld van die Denke',
    durationDays: 7,
    authorNote: 'Geïnspireer deur Bybelse leringe oor die vernuwing van die denke en die 1983-Bybelvertaling.',
    days: [
      {
        day: 1,
        title: 'Die Oorlog Vind Plaas in Jou Denke',
        passageRef: '2 Korintiërs 10:3-5 (1983-vertaling)',
        passageText: 'Hoewel ons natuurlik nog in die wêreld leef, voer ons nie die stryd met wêreldse wapens nie. Die wapens van ons stryd is nie dié van die wêreld nie, maar kragtig deur God om vestings te breek. Ons breek valse redenasies af en elke hoogmoedige versperring wat teen die kennis van God opgerig word, en ons neem elke gedagte gevange om dit aan Christus gehoorsaam te maak.',
        devotionalNote: '\'n Wyse waarheid herinner ons: "Jy kan nie kies watter gedagtes by jou opkom nie, maar jy kán besluit watter gedagtes jy toelaat om huis te maak." \'n Vesting is \'n leuen wat jy so lank geglo het dat dit soos die waarheid voel. Vandag breek ons daardie vestings af met die Woord.',
        reflectionQuestion: 'Watter leuen of negatiewe gedagte oor jouself moet jy vandag gevange neem en vervang met God se waarheid?',
        declaration: 'Ek weier om passief te wees oor my gedagtes. Ek kies om vandag te dink oor wat God oor my sê!'
      },
      {
        day: 2,
        title: 'Laat God Jou Denke Vernuwe',
        passageRef: 'Romeine 12:1-2 (1983-vertaling)',
        passageText: 'Julle moenie aan hierdie sondige wêreld gelykvormig wees nie, maar laat God julle verander deur julle denke te vernuwe, sodat julle kan onderskei wat die goeie en welgevallige en volmaakte wil van God is.',
        devotionalNote: 'Transformasie begin nie van buite af nie; dit begin in jou gedagtewêreld. As jy jou lewe wil verander, moet jy verander wat jy dink. Die Bybel herinner ons: "Waar die verstand gaan, volg die man." Voed jou gemoed met die Woord van lewe.',
        reflectionQuestion: 'Watter wêreldse vrees of standaard probeer jou denke vorm, en watter skrifgedeelte spreek lewe daaroor?',
        declaration: 'My denke word daagliks vernuwe deur God se Woord. Ek leef nie in vrees nie, maar in krag, liefde en selfbeheersing.'
      },
      {
        day: 3,
        title: 'Waaroor Moet Ons Dán Dink?',
        passageRef: 'Filippense 4:8-9 (1983-vertaling)',
        passageText: 'Verder, broers: Alles wat waar is, alles wat edel is, alles wat reg is, alles wat rein is, alles wat mooi is, alles wat prysenswaardig is – watter deug of lofwaardige saak daar ook mag wees – daarop moet julle julle gedagtes rig... En die God van vrede sal met julle wees.',
        devotionalNote: 'Jy kan nie gelyktydig aan iets goeds en iets slegs dink nie. Die beste manier om \'n bose gedagte uit te dryf, is om dit doelbewus met \'n goddelike gedagte te verdring. Moenie net stilbly wanneer angs praat nie—praat Filippense 4:8 hardop uit!',
        reflectionQuestion: 'Noem drie dinge wat vandag rein, mooi en prysenswaardig is waarop jy jou gedagtes kan anker.',
        declaration: 'Vandag kies ek doelbewus om te dink aan dinge wat lewe bring, hoop gee en God se Naam verheerlik.'
      },
      {
        day: 4,
        title: 'Moenie Jou Gedagtes Oorlaai Met Môre Nie',
        passageRef: 'Matteus 6:31-34 (1983-vertaling)',
        passageText: 'Moet julle dus nie bekommer en sê: "Wat sal ons eet?" of "Wat sal ons drink?" of "Wat sal ons aantrek?" nie... Julle hemelse Vader weet tog dat julle dit alles nodig het. Beywer julle eers vir die koninkryk van God... Moet julle dus nie oor môre bekommer nie, want môre bring sy eie bekommernis.',
        devotionalNote: 'Onthou: "Bekommernis is soos om in \'n wiegstoel te sit—dit hou jou besig, maar dit bring jou nêrens." God gee genade vir vandag, nie vir môre nie. As jy probeer om môre se probleme vandag te dra, sal jy altyd moeg en oorweldig voel.',
        reflectionQuestion: 'Watter toekomstige situasie kan jy vandag in die hande van jou getroue hemelse Vader los?',
        declaration: 'Ek leef vandag in God se genade. Ek los môre in Sy hande en geniet die hede.'
      },
      {
        day: 5,
        title: 'Vry van Bitterheid en Verwyt',
        passageRef: 'Efesiërs 4:31-32 (1983-vertaling)',
        passageText: 'Moet nooit bitter, opvlieënd of kwaad wees nie; moenie skreeu of vloek nie, en laat vaar alle kwaadwilligheid. Wees goedgesind en hartlik teenoor mekaar, en vergewe mekaar soos God julle ook in Christus vergewe het.',
        devotionalNote: 'Onvergewensgesindheid is gif wat jy drink terwyl jy hoop die ander persoon gaan dood. Vergifnis beteken nie jy sê wat gebeur het was reg nie; dit beteken jy weier dat daardie pyn jou toekoms beheer.',
        reflectionQuestion: 'Is daar iemand wie jy vry moet skeld van jou verwyt sodat jou eie hart weer kan vry asemhaal?',
        declaration: 'Ek kies om vinnig te vergewe. Ek hou geen rekord van kwaad nie, want Christus het my soveel vergewe.'
      },
      {
        day: 6,
        title: 'Moet Nooit, Ooit Moed Opgee Nie',
        passageRef: 'Galasiërs 6:9 (1983-vertaling)',
        passageText: 'Laat ons dan nie moeg word om goed te doen nie, want as ons nie verslap nie, sal ons op die regte tyd die oes insamel.',
        devotionalNote: 'Die Skrif herinner ons gereeld: "God is besig om agter die skerms te werk, selfs wanneer jy niks sien nie." Geestelike groei is soos \'n saad in die grond; daar is eers stilte voor die deurbraak kom. Moenie die handdoek ingooi net voor jou oes nie.',
        reflectionQuestion: 'Waar voel jy tans versoek om moed op te gee, en hoe kan jy vandag een klein tree van geloof gee?',
        declaration: 'Ek sal nie moeg word nie. Op die regte tyd sal ek maai as ek nie verslap nie. God is getrou!'
      },
      {
        day: 7,
        title: 'Geniet Jou Alledaagse Lewe',
        passageRef: 'Johannes 10:10 (1983-vertaling)',
        passageText: 'Die dief kom net om te steel en te slag en uit te roei. Ek het gekom sodat hulle die lewe kan hê, en dit in oorvloed.',
        devotionalNote: 'Jesus het nie net gesterf sodat ons eendag hemel toe kan gaan nie; Hy het gesterf sodat ons die reis vandag kan geniet! Moenie jou lewe uitstel tot alles perfek is nie. Geniet vandag jou koffie, jou familie en jou wandel met God.',
        reflectionQuestion: 'Hoe kan jy vandag eenvoudige vreugde beleef in die klein, gewone dinge van jou dag?',
        declaration: 'Ek geniet my lewe vandag! Ek vier God se teenwoordigheid in elke gewone oomblik.'
      }
    ]
  },
  {
    id: 'begin-jou-dag-reg',
    title: 'Begin Jou Dag Reg: 7 Dae van Oggendkrag & Vrede',
    subtitle: 'Stel jou ingesteldheid voor die storm van die dag begin',
    description: 'Praktiese lewensbeginsel: Hoe jy jou oggend begin, bepaal hoe jy jou dag leef. Begin met lof, gee jou planne oor, en stap in vrede die wêreld in.',
    category: 'Begin Jou Dag Reg',
    durationDays: 7,
    authorNote: 'Geïnspireer deur Bybelse oggendbeginsels en die 1983-Bybelvertaling.',
    days: [
      {
        day: 1,
        title: 'Ontmoet God Voor Jy Die Wêreld Ontmoet',
        passageRef: 'Psalm 5:4 (1983-vertaling)',
        passageText: 'Here, in die môre hoor U my stem; in die môre rig ek my gebed tot U en wag ek op U.',
        devotionalNote: 'Gee vir God die eerste vrugte van jou dag. As jy eers jou foon optel en nuus of sosiale media lees, voed jy jou denke met die wêreld se lawaai. Gee die eerste vyftien minute aan God, en kyk hoe Hy jou hele dag se pas bepaal.',
        reflectionQuestion: 'Wat kan jy vanoggend verwyder sodat jy meer stilte saam met God kan hê?',
        declaration: 'Here, my eerste gedagtes behoort aan U. U vrede is my skild vandag.'
      },
      {
        day: 2,
        title: 'Nuwe Barmhartighede Elke Môre',
        passageRef: 'Klaagliedere 3:22-24 (1983-vertaling)',
        passageText: 'Dit is danksy die genade van die Here dat ons nie vergaan het nie, want sy ontferming het geen einde nie; dit is elke môre nuut. Groot is u trou! Ek sê vir myself: Die Here is my lewe, daarom hoop ek op Hom.',
        devotionalNote: 'Gister se foute het gister gebly. Vandag is \'n spiksplinternuwe dag met vars genade. Moenie gister se skuldgevoel vandag saamsleep nie. Staan op, skud die stof af en ontvang God se vars vergifnis.',
        reflectionQuestion: 'Watter fout van gister moet jy vandag onder die bloed van Jesus los?',
        declaration: 'God se genade vir my is vanoggend splinternuut. Ek leef vry van gister se laste!'
      },
      {
        day: 3,
        title: 'Omgord Jou Met Sagmoedigheid',
        passageRef: 'Kolossense 3:12-14 (1983-vertaling)',
        passageText: 'Julle is die uitverkore volk van God wat Hy baie liefhet. Daarom moet julle meelewend, goedgesind, nederig, sagmoedig en verdraagsaam wees. Wees geduldig met mekaar...',
        devotionalNote: 'Voordat jy uit jou huis stap, trek geestelike klere aan. Onthou: "Jy sal vandag mense teëkom wat ongeskik, haastig of selfsugtig is. Besluit vóóraf hoe jy gaan reageer: met geduld en genade."',
        reflectionQuestion: 'Met watter persoon moet jy vandag ekstra geduld en liefde beoefen?',
        declaration: 'Ek kies om vandag nie maklik beledig te word nie. Ek wandel in God se geduld en sagmoedigheid.'
      }
    ]
  }
];

// Aanvanklike redigeerbare S.O.A.P.-inskrywings in Afrikaans
export const INITIAL_SOAP_ENTRIES: SoapEntry[] = [
  {
    id: 'soap-vandag',
    date: '2026-09-26',
    title: 'Slagveld van die Denke: Oorwinning oor Angs',
    scriptureRef: 'Filippense 4:6-7 (1983-vertaling)',
    scriptureText: 'Moet oor niks besorg wees nie, maar maak in alles julle begeertes deur gebed en smeking en met danksegging aan God bekend. En die vrede van God, wat alle verstand te bowe gaan, sal oor julle harte en gedagtes die wag hou in Christus Jesus.',
    observation: 'Paulus gee \'n duidelike strategie: moenie passief bly by angs nie. Bring die versoek, maar vleg dit saam met danksegging. Danksegging herinner my gees dat God in die verlede getrou was. Die vrede wat belowe word, is soos \'n wagpos wat wag hou oor my gedagtes.',
    application: 'Vandag, die oomblik wanneer my denke wil dwaal na finansiële of werksbekommernis, gaan ek hardop stop en sê: "Ek neem hierdie gedagte gevange. Here, dankie dat U my Herder is en dat U reeds in my toekoms is."',
    prayer: 'Hemelse Vader, dankie dat ek nie my eie lewe hoef te beheer of te bestuur sonder U nie. Ek gee my bekommernisse vandag vir U oor. Wag oor my denke en laat U bonatuurlike vrede vandag in my hart heers. In die Naam van Jesus, Amen.',
    updatedAt: '2026-09-26T08:30:00Z'
  },
  {
    id: 'soap-gister',
    date: '2026-09-25',
    title: 'Nuwe Krag vir dié wat Wag',
    scriptureRef: 'Jesaja 40:31 (1983-vertaling)',
    scriptureText: 'Maar dié wat op die Here vertrou, kry nuwe krag. Hulle vlieg met arendsvlerke, hulle hardloop en word nie moeg nie, hulle loop en raak nie afgemat nie.',
    observation: 'Om te "wag" op die Here is nie passiewe luiheid nie; dit is \'n aktiewe verwagting en vertroue. Menslike energie loop droog, maar God se krag is onuitputlik.',
    application: 'Wanneer ek vanmiddag moeg voel, gaan ek nie kla of koffie drink om myself kunsmatig te druk nie; ek gaan vir 10 minute stil raak en die Heilige Gees vra om my krag te hernuwe.',
    prayer: 'Here, U weet waar my krag min is. Ek rus vandag in U grootheid en vlieg bo die storm met arendsvlerke. Amen.',
    updatedAt: '2026-09-25T07:15:00Z'
  }
];

// Aanvanklike Joernaalinskrywings met toegewyde Dankbaarheidsruimte
export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'joernaal-vandag',
    date: '2026-09-26',
    title: 'Oggendstilte en Diep Vrede by die See',
    reflection: 'Vroegoggend wakker geword met die geluid van die seebries. Het \'n oordenking oor Filippense 4 gelees. Besef hoe maklik ek myself toelaat om in die strik van bekommernis te trap oor dinge wat nog nie eers gebeur het nie. Vandag kies ek vrede.',
    gratitudes: [
      'Die vars oggendlug en die gesuis van die golwe wat my herinner aan God se grootheid',
      '\'n Bemoedigende boodskap van my suster gisteraand wat presies op die regte tyd gekom het',
      'Skoon drinkwater, warm rooibostee en \'n veilige dak oor my kop',
      'God se eindelose geduld en genade wanneer ek weer moet leer om te vertrou'
    ],
    scriptureRef: 'Filippense 4:6-7 (1983-vertaling)',
    tags: ['Vrede', 'Oggendrus', 'Slagveld van die Denke'],
    createdAt: '2026-09-26T07:45:00Z'
  },
  {
    id: 'joernaal-winter-2026',
    date: '2026-06-18',
    title: 'Winterrus & Genade vir Elke Dag',
    reflection: 'Het vandag besef dat ek nie almal se verwagtinge hoef te dra nie. Soos die wyse gesegde lui: "Doen jou bes en vertrou God vir die res." Dit bring soveel verligting om te weet my waarde is in Christus, nie in my prestasies nie.',
    gratitudes: [
      'Gesellige kaggelvuur op \'n koue wintersaand',
      'Goeie gesondheid en die krag om daagliks te kan stap',
      'Die vrede wat kom wanneer ek nee sê vir dinge wat my energie tap'
    ],
    scriptureRef: 'Klaagliedere 3:22-23 (1983-vertaling)',
    tags: ['Genade', 'Rus', 'Vryheid'],
    createdAt: '2026-06-18T20:10:00Z'
  },
  {
    id: 'joernaal-herfs-2026',
    date: '2026-03-12',
    title: 'Gebedsverhoring & Lofprysing',
    reflection: 'Ongelooflike nuus vandag ontvang oor die mediese toetse. God is werklik getrou. Al die weke van wag en gebed was nie tevergeefs nie. My hart loop oor van dankbaarheid.',
    gratitudes: [
      'Gunstige dokterstoetse en skoon uitslae',
      'Vriende wat saam in geloof gestaan en gebid het',
      'Finansiële deurbraak wat net betyds opgedaag het'
    ],
    scriptureRef: 'Psalm 103:2 (1983-vertaling)',
    tags: ['Beantwoorde Gebed', 'Genesing', 'Danksegging'],
    createdAt: '2026-03-12T18:00:00Z'
  }
];

// Aanvanklike Gebede met gebedsdatum, beantwoord-opsie en beantwoord-datum
export const INITIAL_PRAYERS: PrayerItem[] = [
  {
    id: 'gebed-beantwoord-werk',
    title: 'Nuwe Werksgeleentheid & Wysheid vir Kontrak',
    request: 'Here, ek bid vir duidelikheid en oop deure met betrekking tot die nuwe posisie. Gee my wysheid om te weet of hierdie skuif in U wil is vir ons gesin.',
    scriptureRef: 'Spreuke 3:5-6 (1983-vertaling)',
    scriptureText: 'Vertrou volkome op die Here en moenie op jou eie insigte staatmaak nie. Ken Hom in alles wat jy doen en Hy sal jou die regte pad laat loop.',
    category: 'Leiding',
    prayerDate: '2026-01-15',
    isAnswered: true,
    answeredDate: '2026-02-28',
    answeredNotes: 'God het bo my verwagting geantwoord! Die maatskappy het \'n permanente aanbod gemaak met beter ure wat my toelaat om saans by die kinders te wees. \'n Direkte antwoord op Spreuke 3:5-6!',
    speechRecorded: false,
    createdAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'gebed-beantwoord-genesing-ma',
    title: 'Volkome Genesing na Ma se Knie-operasie',
    request: 'Ons bid vir bekwame hande vir die chirurg, geen infeksie nie, en \'n vinnige herstel sonder aanhoudende pyn vir Mamma.',
    scriptureRef: 'Psalm 103:2-3 (1983-vertaling)',
    scriptureText: 'Loof die Here, o my siel, en vergeet geeneen van sy weldade nie—wat al jou ongeregtigheid vergewe, wat al jou siektes genees.',
    category: 'Genesing',
    prayerDate: '2026-04-10',
    isAnswered: true,
    answeredDate: '2026-05-22',
    answeredNotes: 'Die spesialis was verstom oor haar vinnige vordering. Sy loop reeds sonder krukke en met minimale ongemak. Alle lof aan die Here!',
    speechRecorded: true,
    createdAt: '2026-04-10T14:30:00Z'
  },
  {
    id: 'gebed-beantwoord-versoening',
    title: 'Herstel van Verhouding met Johan',
    request: 'Here, neem die bitterheid en misverstande weg. Gee sagmoedige harte en die geleentheid om rustig oor koffie sake uit te praat.',
    scriptureRef: 'Efesiërs 4:32 (1983-vertaling)',
    scriptureText: 'Wees goedgesind en hartlik teenoor mekaar, en vergewe mekaar soos God julle ook in Christus vergewe het.',
    category: 'Familie',
    prayerDate: '2026-03-02',
    isAnswered: true,
    answeredDate: '2026-04-18',
    answeredNotes: 'Johan het my onverwags gekontak en gevra om te ontmoet. Ons kon mekaar om verskoning vra en in vrede skei. Die verhouding is herstel en stewiger as ooit.',
    speechRecorded: false,
    createdAt: '2026-03-02T11:20:00Z'
  },
  {
    id: 'gebed-aktief-vrede-nag',
    title: 'Oorwinning oor Nagtelike Angs & Gedagtestryd',
    request: 'Ek bid vir bonatuurlike rus wanneer ek snags wakker skrik. Dat ek my denke sal vul met Filippense 4 en nie sal toelaat dat vrees my slaap steel nie.',
    scriptureRef: 'Filippense 4:6-7 (1983-vertaling)',
    scriptureText: 'Moet oor niks besorg wees nie, maar maak in alles julle begeertes deur gebed en smeking en met danksegging aan God bekend.',
    category: 'Persoonlik',
    prayerDate: '2026-09-10',
    isAnswered: false,
    speechRecorded: true,
    createdAt: '2026-09-10T22:30:00Z'
  },
  {
    id: 'gebed-aktief-kinders',
    title: 'Wysheid en Geestelike Beskerming vir die Kinders',
    request: 'Here, beskerm my kinders se harte en denke teen slegte invloede by die skool. Stuur godvresende vriende en onderwysers oor hul pad.',
    scriptureRef: 'Jakobus 1:5 (1983-vertaling)',
    scriptureText: 'As een van julle wysheid kortkom, moet hy dit van God bid, en Hy sal dit aan hom gee.',
    category: 'Familie',
    prayerDate: '2026-09-18',
    isAnswered: false,
    speechRecorded: false,
    createdAt: '2026-09-18T08:15:00Z'
  }
];

// Aanvanklike vasgepende items van Pinterest / Internet (Visiebord)
export const INITIAL_PINNED_ITEMS: PinnedItem[] = [
  {
    id: 'pin-1',
    title: 'Slagveld van die Denke: Geestelike Aanhaling',
    sourceUrl: 'https://www.pinterest.com/search/pins/?q=battlefield%20of%20the%20mind',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    caption: '“Jy kan nie ’n positiewe lewe hê met ’n negatiewe verstand nie. Kies vandag vrede.” — Vernuwing van Denke',
    category: 'Aanhaling',
    createdAt: '2026-09-20T10:00:00Z'
  },
  {
    id: 'pin-2',
    title: 'Oseaan-stilte & Psalm 23:2 Meditasie',
    sourceUrl: 'https://www.pinterest.com/search/pins/?q=psalm%2023%20waters%20of%20rest',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    caption: '“Hy bring my by waters waar daar vrede is. Hy gee my nuwe krag.” (1983-vertaling)',
    category: 'Pinterest Inspirasie',
    createdAt: '2026-09-22T14:30:00Z'
  },
  {
    id: 'pin-3',
    title: 'Oggend Bybelstudie Estetika & Koffie',
    sourceUrl: 'https://www.pinterest.com/search/pins/?q=christian%20morning%20quiet%20time',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    caption: 'Begin jou dag reg: 15 minute in stilte voor die dag se geraas begin.',
    category: 'Gemoedsbord',
    createdAt: '2026-09-24T06:45:00Z'
  }
];
