
import { Book, AppSettings, EmotionalVerse, DailyReading } from './types';

// Using a simplified list for the demo.
export const BOOKS: Book[] = [
  // Antigo Testamento
  { abbrev: 'gn', name: 'Gênesis', chapters: 50, testament: 'VT' },
  { abbrev: 'ex', name: 'Êxodo', chapters: 40, testament: 'VT' },
  { abbrev: 'lv', name: 'Levítico', chapters: 27, testament: 'VT' },
  { abbrev: 'nm', name: 'Números', chapters: 36, testament: 'VT' },
  { abbrev: 'dt', name: 'Deuteronômio', chapters: 34, testament: 'VT' },
  { abbrev: 'js', name: 'Josué', chapters: 24, testament: 'VT' },
  { abbrev: 'jz', name: 'Juízes', chapters: 21, testament: 'VT' },
  { abbrev: 'rt', name: 'Rute', chapters: 4, testament: 'VT' },
  { abbrev: '1sm', name: '1 Samuel', chapters: 31, testament: 'VT' },
  { abbrev: '2sm', name: '2 Samuel', chapters: 24, testament: 'VT' },
  { abbrev: '1rs', name: '1 Reis', chapters: 22, testament: 'VT' },
  { abbrev: '2rs', name: '2 Reis', chapters: 25, testament: 'VT' },
  { abbrev: '1cr', name: '1 Crônicas', chapters: 29, testament: 'VT' },
  { abbrev: '2cr', name: '2 Crônicas', chapters: 36, testament: 'VT' },
  { abbrev: 'ed', name: 'Esdras', chapters: 10, testament: 'VT' },
  { abbrev: 'ne', name: 'Neemias', chapters: 13, testament: 'VT' },
  { abbrev: 'et', name: 'Ester', chapters: 10, testament: 'VT' },
  { abbrev: 'job', name: 'Jó', chapters: 42, testament: 'VT' },
  { abbrev: 'sl', name: 'Salmos', chapters: 150, testament: 'VT' },
  { abbrev: 'pv', name: 'Provérbios', chapters: 31, testament: 'VT' },
  { abbrev: 'ec', name: 'Eclesiastes', chapters: 12, testament: 'VT' },
  { abbrev: 'ct', name: 'Cânticos', chapters: 8, testament: 'VT' },
  { abbrev: 'is', name: 'Isaías', chapters: 66, testament: 'VT' },
  { abbrev: 'jr', name: 'Jeremias', chapters: 52, testament: 'VT' },
  { abbrev: 'lm', name: 'Lamentações', chapters: 5, testament: 'VT' },
  { abbrev: 'ez', name: 'Ezequiel', chapters: 48, testament: 'VT' },
  { abbrev: 'dn', name: 'Daniel', chapters: 12, testament: 'VT' },
  { abbrev: 'os', name: 'Oséias', chapters: 14, testament: 'VT' },
  { abbrev: 'jl', name: 'Joel', chapters: 3, testament: 'VT' },
  { abbrev: 'am', name: 'Amós', chapters: 9, testament: 'VT' },
  { abbrev: 'ob', name: 'Obadias', chapters: 1, testament: 'VT' },
  { abbrev: 'jn', name: 'Jonas', chapters: 4, testament: 'VT' },
  { abbrev: 'mq', name: 'Miquéias', chapters: 7, testament: 'VT' },
  { abbrev: 'na', name: 'Naum', chapters: 3, testament: 'VT' },
  { abbrev: 'hc', name: 'Habacuque', chapters: 3, testament: 'VT' },
  { abbrev: 'sf', name: 'Sofonias', chapters: 3, testament: 'VT' },
  { abbrev: 'ag', name: 'Ageu', chapters: 2, testament: 'VT' },
  { abbrev: 'zc', name: 'Zacarias', chapters: 14, testament: 'VT' },
  { abbrev: 'ml', name: 'Malaquias', chapters: 4, testament: 'VT' },
  // Novo Testamento
  { abbrev: 'mt', name: 'Mateus', chapters: 28, testament: 'NT' },
  { abbrev: 'mc', name: 'Marcos', chapters: 16, testament: 'NT' },
  { abbrev: 'lc', name: 'Lucas', chapters: 24, testament: 'NT' },
  { abbrev: 'jo', name: 'João', chapters: 21, testament: 'NT' },
  { abbrev: 'at', name: 'Atos', chapters: 28, testament: 'NT' },
  { abbrev: 'rm', name: 'Romanos', chapters: 16, testament: 'NT' },
  { abbrev: '1co', name: '1 Coríntios', chapters: 16, testament: 'NT' },
  { abbrev: '2co', name: '2 Coríntios', chapters: 13, testament: 'NT' },
  { abbrev: 'gl', name: 'Gálatas', chapters: 6, testament: 'NT' },
  { abbrev: 'ef', name: 'Efésios', chapters: 6, testament: 'NT' },
  { abbrev: 'fp', name: 'Filipenses', chapters: 4, testament: 'NT' },
  { abbrev: 'cl', name: 'Colossenses', chapters: 4, testament: 'NT' },
  { abbrev: '1ts', name: '1 Tessalonicenses', chapters: 5, testament: 'NT' },
  { abbrev: '2ts', name: '2 Tessalonicenses', chapters: 3, testament: 'NT' },
  { abbrev: '1tm', name: '1 Timóteo', chapters: 6, testament: 'NT' },
  { abbrev: '2tm', name: '2 Timóteo', chapters: 4, testament: 'NT' },
  { abbrev: 'tt', name: 'Tito', chapters: 3, testament: 'NT' },
  { abbrev: 'fm', name: 'Filemom', chapters: 1, testament: 'NT' },
  { abbrev: 'hb', name: 'Hebreus', chapters: 13, testament: 'NT' },
  { abbrev: 'tg', name: 'Tiago', chapters: 5, testament: 'NT' },
  { abbrev: '1pe', name: '1 Pedro', chapters: 5, testament: 'NT' },
  { abbrev: '2pe', name: '2 Pedro', chapters: 3, testament: 'NT' },
  { abbrev: '1jo', name: '1 João', chapters: 5, testament: 'NT' },
  { abbrev: '2jo', name: '2 João', chapters: 1, testament: 'NT' },
  { abbrev: '3jo', name: '3 João', chapters: 1, testament: 'NT' },
  { abbrev: 'jd', name: 'Judas', chapters: 1, testament: 'NT' },
  { abbrev: 'ap', name: 'Apocalipse', chapters: 22, testament: 'NT' },
];

export const INITIAL_SETTINGS: AppSettings = {
  fontSize: 3,
  theme: 'light',
  fontFamily: 'serif',
};

// --- DAILY MESSAGES DATABASE ---
// Key format: "MONTH-DAY" where Month is 0-indexed (0 = Jan, 11 = Dec)
const FIXED_DAILY_READINGS: Record<string, DailyReading> = {
  // JANEIRO
  "0-1": {
    reference: "Salmos 139:14",
    verse: "Eu te louvarei porque de um modo terrível e tão maravilhoso fui formado; maravilhosas são as tuas obras, e a minha alma o sabe muito bem.",
    message: "Você não é um acidente. Não é um rascunho. Você é a obra-prima de Deus, tecido com as próprias mãos do Criador. Cada detalhe seu—seus sonhos, suas cicatrizes, até seus medos—foi pensado com amor. Hoje, olhe no espelho e veja o que Deus vê: alguém maravilhoso, único, insubstituível. Você é o tipo de obra que faz os anjos pararem para admirar."
  },
  "0-2": {
    reference: "Jeremias 29:11",
    verse: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz e não de mal, para vos dar o fim que esperais.",
    message: "Deus não está improvisando com sua vida. Ele já viu cada capítulo, cada reviravolta, cada lágrima que ainda não caiu. E enquanto você se preocupa com o amanhã, Ele sorri—porque já preparou algo melhor do que você consegue imaginar. Respire fundo. O final da sua história é glorioso. Deus mesmo garantiu isso."
  },
  "0-3": {
    reference: "Filipenses 4:13",
    verse: "Tudo posso naquele que me fortalece.",
    message: "Hoje, você vai enfrentar coisas que parecem grandes demais. E estão certas—são grandes demais para você sozinho. Mas você não está sozinho. Cristo está em você, e Ele nunca perdeu uma batalha. Então levante, respire fundo, e lembre-se: a força que ressuscitou Jesus está fluindo nas suas veias neste exato momento. Você pode. Porque Ele pode."
  },
  "0-4": {
    reference: "Isaías 41:10",
    verse: "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça.",
    message: "O medo bate à porta. Sussurra mentiras: \"Você não vai conseguir.\" Mas ouça mais fundo. Escuta? É a voz de Deus, mais forte que qualquer medo, dizendo: \"Eu estou aqui.\" Ele não prometeu que seria fácil. Mas prometeu que você não estaria sozinho. E essa promessa vale mais do que mil vitórias solitárias."
  },
  "0-5": {
    reference: "Provérbios 3:5-6",
    verse: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento. Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas.",
    message: "Você não precisa ter todas as respostas hoje. Não precisa ver o caminho todo. Só precisa dar o próximo passo, confiando que Deus vê o que você não vê. Ele está abrindo portas que você nem sabia que existiam. Está fechando outras para te proteger de dores que você nunca precisará conhecer. Confie. Ele sabe o que está fazendo."
  },
  "0-6": {
    reference: "Romanos 8:28",
    verse: "E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus, daqueles que são chamados por seu decreto.",
    message: "Aquela dor que parece sem sentido? Aquele erro que você não se perdoa? Deus está escrevendo algo lindo com isso. Ele é o mestre de transformar cinzas em beleza, lágrimas em testemunhos. O que parece o fim da história pode ser apenas Ele virando a página para o melhor capítulo. Espere. Você ainda vai ver a redenção com seus próprios olhos."
  },
  "0-7": {
    reference: "Mateus 11:28",
    verse: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.",
    message: "Você está cansado. Não apenas fisicamente—mas cansado de tentar ser forte, de fingir que está bem, de carregar tudo sozinho. Jesus vê. E Ele está estendendo as mãos, não para te cobrar, mas para te segurar. Hoje, permita-se ser fraco. Permita-se descansar. Suas forças podem falhar, mas Ele nunca falhará."
  },
  "0-8": {
    reference: "2 Coríntios 5:17",
    verse: "Assim que, se alguém está em Cristo, nova criatura é; as coisas velhas já passaram; eis que tudo se fez novo.",
    message: "Você não é definido pelos seus erros de ontem. Não é prisioneiro do passado. Em Cristo, você tem um recomeço todos os dias. Aquele pecado que te assombra? Perdoado. Aquela vergonha que você carrega? Lavada. Hoje é o primeiro dia da sua nova vida. Não olhe para trás. Deus já está fazendo algo novo em você."
  },
  "0-9": {
    reference: "João 14:27",
    verse: "Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá. Não se turbe o vosso coração, nem se atemorize.",
    message: "O mundo oferece paz temporária—uma distração, um escape. Mas Jesus oferece algo que as circunstâncias não podem roubar: paz no meio da tempestade. Hoje, mesmo que tudo ao redor esteja caótico, você pode ter tranquilidade interior. Porque a paz de Cristo não depende do que acontece fora de você, mas do que Ele faz dentro de você."
  },
  "0-10": {
    reference: "Salmos 46:1",
    verse: "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia.",
    message: "Quando tudo desmorona, Deus permanece. Quando as pessoas te decepcionam, Ele está firme. Quando você sente que está afundando, Ele é a rocha sob seus pés. Ele não é um Deus distante, observando de longe. Ele está bem aqui, bem agora, segurando você. E enquanto Ele te segura, nada pode te destruir."
  },
  "0-11": {
    reference: "1 Pedro 5:7",
    verse: "Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.",
    message: "Você não foi feito para carregar tudo isso sozinho. Aquela preocupação que não te deixa dormir? Deus quer carregá-la. Aquele medo que aperta seu peito? Ele já tem a resposta. Hoje, pratique soltar. Coloque nas mãos de Deus o que está pesado demais para as suas. Ele não apenas pode carregar—Ele quer."
  },
  "0-12": {
    reference: "Efésios 2:10",
    verse: "Pois somos feitura dele, criados em Cristo Jesus para boas obras, as quais Deus preparou para que andássemos nelas.",
    message: "Hoje, lembre-se: cada gesto seu, por menor que pareça, está tocando vidas de maneiras que você talvez nunca veja. Em algum lugar, alguém sorriu, respirou mais leve ou se sentiu amado, graças ao que você fez. E mesmo nos dias em que se sente pequeno ou esquecido, saiba: a gratidão de Deus e das pessoas ao seu redor está se acumulando silenciosamente, espalhando luz sobre você de formas que seu coração ainda não pode imaginar."
  },
  "0-13": {
    reference: "Salmos 23:4",
    verse: "Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.",
    message: "Você está atravessando um vale. É escuro, frio, solitário. Mas olhe ao seu lado—você não está sozinho. O Pastor está ali, guiando cada passo, protegendo de perigos que você nem vê. Esse vale não é permanente. É apenas passagem. E do outro lado, há pastagens verdes esperando por você. Continue andando. Ele está com você."
  },
  "0-14": {
    reference: "Hebreus 13:5",
    verse: "De maneira alguma te deixarei, nunca jamais te abandonarei.",
    message: "As pessoas vêm e vão. Promessas são quebradas. Mas Deus? Ele fica. Mesmo quando você se afasta, Ele permanece. Mesmo quando você falha, Ele não desiste. Mesmo quando você se sente indigno, Ele continua te chamando de filho. Hoje, descanse nesta certeza: o amor de Deus não tem condições. Ele está aqui para ficar."
  },
  "0-15": {
    reference: "Isaías 40:31",
    verse: "Mas os que esperam no Senhor renovarão as suas forças, subirão com asas como águias; correrão e não se cansarão; caminharão e não se fatigarão.",
    message: "Você sente que já não tem mais forças. Cada passo parece pesado. Mas espere em Deus—não como quem desiste, mas como quem confia. E então algo milagroso acontece: forças que não são suas começam a fluir. Você se levanta. Você corre de novo. Porque a força de Deus não acaba. Ela se renova a cada manhã, especialmente nos dias mais difíceis."
  },
  "0-16": {
    reference: "João 3:16",
    verse: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
    message: "Você quer saber quanto Deus te ama? Olhe para a cruz. Ali está a medida do amor divino—um amor que preferiu morrer a viver sem você. Hoje, nada do que você fizer pode aumentar esse amor. E nada pode diminuí-lo. Você é amado completamente, eternamente, incondicionalmente. E isso muda tudo."
  },
  "0-17": {
    reference: "Provérbios 16:3",
    verse: "Confia ao Senhor as tuas obras, e teus pensamentos serão estabelecidos.",
    message: "Aquele projeto que te tira o sono? Aquele sonho que parece impossível? Coloque nas mãos de Deus. Não como quem desiste, mas como quem reconhece que precisa de ajuda. Quando você faz sua parte e confia a Ele o resultado, algo sobrenatural acontece. Portas se abrem. Caminhos aparecem. O impossível se torna inevitável."
  },
  "0-18": {
    reference: "Salmos 37:4",
    verse: "Deleita-te no Senhor, e ele te concederá os desejos do teu coração.",
    message: "Os desejos do seu coração não são acidentais. Deus os plantou lá. Ele criou você com sonhos específicos porque tem um propósito específico para você. Hoje, pare de se sentir culpado por querer mais. Deus não quer te limitar—Ele quer te surpreender. Busque primeiro a Ele, e observe como Ele realiza em você muito mais do que você ousou pedir."
  },
  "0-19": {
    reference: "Romanos 8:38-39",
    verse: "Porque estou certo de que nem a morte, nem a vida... nem qualquer outra criatura nos poderá separar do amor de Deus, que está em Cristo Jesus, nosso Senhor.",
    message: "Nada—absolutamente nada—pode te arrancar do amor de Deus. Nem seus erros. Nem suas dúvidas. Nem seus dias ruins. Você está seguro, protegido, amado. E quando o inimigo sussurra que você foi longe demais, lembre-se: o amor de Deus é mais profundo que qualquer queda. Você está em casa. Para sempre."
  },
  "0-20": {
    reference: "Filipenses 4:6-7",
    verse: "Não andeis ansiosos de coisa alguma; em tudo, porém, sejam conhecidas, diante de Deus, as vossas petições, pela oração e pela súplica, com ações de graças. E a paz de Deus, que excede todo o entendimento, guardará o vosso coração.",
    message: "A ansiedade grita. A paz de Deus sussurra. Hoje, escolha o sussurro. Traga cada preocupação—por menor que seja—para Deus. Não apenas as grandes. As pequenas também. E observe como, misteriosamente, uma paz que desafia toda lógica começa a guardar seu coração. Você ainda pode não ter todas as respostas. Mas terá algo melhor: a presença de Deus."
  },
  "0-21": {
    reference: "2 Timóteo 1:7",
    verse: "Porque Deus não nos deu espírito de covardia, mas de poder, de amor e de moderação.",
    message: "O medo não vem de Deus. Aquela voz que te paralisa, que te faz duvidar, que te convence de que você não é capaz—essa não é a voz do seu Criador. Deus te deu poder. Te deu amor. Te deu uma mente sã. Hoje, recuse as mentiras do medo. Você foi criado para a coragem."
  },
  "0-22": {
    reference: "Salmos 34:18",
    verse: "Perto está o Senhor dos que têm o coração quebrantado e salva os contritos de espírito.",
    message: "Seu coração está quebrado hoje? Deus está mais perto agora do que nunca. Ele não se afasta da sua dor—Ele se aproxima. Senta-se ao seu lado no chão, recolhe cada pedaço quebrado, e começa a reconstruir. Você não precisa fingir que está bem. Pode chorar. Pode desabar. E enquanto você se permite sentir, Ele está te curando."
  },
  "0-23": {
    reference: "Tiago 1:17",
    verse: "Toda boa dádiva e todo dom perfeito vêm do alto, descendo do Pai das luzes.",
    message: "Aquela bênção inesperada? Foi Deus. Aquele sorriso que alegrou seu dia? Deus de novo. Aquele abraço no momento certo? Ainda Ele. Deus está espalhando presentes pela sua vida todos os dias—alguns pequenos, outros imensos. Hoje, pare e perceba. Conte as bênçãos. E agradeça ao Pai que nunca para de dar."
  },
  "0-24": {
    reference: "Colossenses 3:2",
    verse: "Pensai nas coisas que são de cima e não nas que são da terra.",
    message: "É fácil ficar preso nos problemas, nas contas, nas decepções. Mas Deus te convida a erguer os olhos. Existe um reino além deste mundo visível—um reino onde Ele já venceu, onde suas promessas são reais, onde seu futuro está garantido. Hoje, mude o foco. Não ignore seus problemas, mas também não deixe que eles sejam tudo que você vê."
  },
  "0-25": {
    reference: "Apocalipse 21:4",
    verse: "E lhes enxugará dos olhos toda lágrima, e a morte já não existirá, já não haverá luto, nem pranto, nem dor.",
    message: "As lágrimas de hoje não são permanentes. A dor que você sente agora não é o final da história. Um dia—talvez mais cedo do que você imagina—Deus enxugará cada lágrima. E tudo que causou dor será apenas uma memória distante, ofuscada pela glória do que Ele preparou. Hoje, chore se precisar. Mas lembre-se: a alegria está vindo."
  },
  "0-26": {
    reference: "Gálatas 5:1",
    verse: "Para a liberdade foi que Cristo nos libertou. Permanecei, pois, firmes e não vos submetais, de novo, a jugo de escravidão.",
    message: "Você foi libertado. Das correntes do pecado, da prisão da culpa, do peso do desempenho. Mas às vezes, esquecemos disso e voltamos a viver como escravos. Hoje, lembre-se: você é livre. Não precisa mais provar nada. Não precisa mais se prender ao passado. Cristo já pagou tudo. Viva como quem foi libertado."
  },
  "0-27": {
    reference: "Mateus 6:34",
    verse: "Não andeis, pois, inquietos com o dia de amanhã, porque o dia de amanhã cuidará de si mesmo. Basta a cada dia o seu mal.",
    message: "Amanhã ainda não chegou. E quando chegar, Deus estará lá esperando por você, com nova graça, novas forças, novas misericórdias. Hoje, você só precisa viver hoje. Não carregue o peso de um futuro que ainda não existe. Deus já está cuidando dele. Respire. Viva este momento. É tudo que você precisa agora."
  },
  "0-28": {
    reference: "Salmos 139:1-2",
    verse: "Senhor, tu me sondas e me conheces. Sabes quando me assento e quando me levanto; de longe entendes o meu pensamento.",
    message: "Deus te conhece. Não superficialmente—profundamente. Ele conhece seus pensamentos secretos, seus medos escondidos, seus sonhos não confessados. E ainda assim, Ele te ama. Não apesar de quem você é, mas exatamente por quem você é. Hoje, saiba: você é completamente conhecido e completamente amado. Que liberdade existe nisso!"
  },
  "0-29": {
    reference: "1 João 4:18",
    verse: "No amor não existe medo; antes, o perfeito amor lança fora o medo.",
    message: "O amor de Deus expulsa todo medo. Medo do futuro? O amor cuida. Medo de não ser suficiente? O amor aceita. Medo de ser abandonado? O amor permanece. Hoje, deixe o amor perfeito de Deus invadir cada canto escuro do seu coração. Onde Seu amor entra, o medo não tem escolha a não ser sair."
  },
  "0-30": {
    reference: "Efésios 3:20",
    verse: "Ora, àquele que é poderoso para fazer infinitamente mais do que tudo quanto pedimos ou pensamos, conforme o seu poder que opera em nós.",
    message: "Você está pensando pequeno demais. Aquilo que você considera impossível? Para Deus, é apenas o começo. Ele não está limitado pela sua imaginação. Ele quer fazer mais—muito mais—do que você ousa sonhar. Hoje, expanda suas expectativas. Peça grande. Sonhe grande. Porque o Deus que você serve é infinitamente maior."
  },
  "0-31": {
    reference: "Josué 1:9",
    verse: "Não to mandei eu? Sê forte e corajoso; não temas, nem te espantes, porque o Senhor, teu Deus, é contigo por onde quer que andares.",
    message: "Coragem não é ausência de medo. É dar o próximo passo mesmo tremendo. E você pode fazer isso porque não está sozinho. Aonde quer que você vá hoje—aquela conversa difícil, aquele desafio imenso, aquele passo de fé—Deus vai com você. Ele não te manda sozinho. Ele vai junto. Sempre."
  },
  
  // FEVEREIRO
  "1-1": {
    reference: "Salmos 30:5",
    verse: "O choro pode durar uma noite, mas a alegria vem pela manhã.",
    message: "Esta noite vai passar. A dor que parece interminável tem data de validade. A manhã está chegando—e com ela, alegria que você nem imagina. Deus não desperdiça suas lágrimas. Ele está preparando algo lindo do outro lado dessa escuridão. Aguente firme. A manhã já começou a clarear."
  },
  "1-2": {
    reference: "Romanos 12:2",
    verse: "E não vos conformeis com este mundo, mas transformai-vos pela renovação da vossa mente.",
    message: "Você não precisa aceitar os padrões do mundo. Não precisa viver como todos vivem, pensar como todos pensam, desistir como todos desistem. Deus está renovando sua mente—mudando como você vê a si mesmo, como vê os outros, como vê o futuro. Hoje, deixe Ele transformar você de dentro para fora. Você está sendo recriado."
  },
  "1-3": {
    reference: "Salmos 27:14",
    verse: "Espera pelo Senhor, anima-te, e ele fortalecerá o teu coração; espera, pois, pelo Senhor.",
    message: "Esperar não é fácil. Principalmente quando você quer respostas agora, soluções hoje, milagres imediatos. Mas há propósito na espera. Deus está fortalecendo seu coração, preparando você para o que está por vir. Não desperdice este tempo. Use-o para crescer, para confiar mais profundamente. A resposta está chegando. E quando vier, você estará pronto."
  },
  "1-4": {
    reference: "Provérbios 18:10",
    verse: "Torre forte é o nome do Senhor; a ela correrá o justo e estará em alto refúgio.",
    message: "Quando tudo desaba, corra para Deus. Não para longe Dele—para Ele. Seu nome é uma torre, um refúgio seguro onde nenhuma tempestade pode te alcançar. Hoje, qualquer que seja a batalha, qualquer que seja o caos, você tem um lugar seguro. Corra para os braços do Pai. Ali você está protegido."
  },
  "1-5": {
    reference: "1 Coríntios 10:13",
    verse: "Não vos sobreveio tentação que não fosse humana; mas Deus é fiel e não permitirá que sejais tentados além das vossas forças.",
    message: "Você sente que não aguenta mais? Deus sabe exatamente onde está seu limite. E Ele nunca—nunca—permite que você seja esmagado além do que pode suportar. Se você está passando por isso, é porque Ele sabe que você consegue. E Ele já preparou a saída. Continue. A vitória está mais perto do que parece."
  },
  "1-6": {
    reference: "Isaías 43:2",
    verse: "Quando passares pelas águas, eu serei contigo; quando, pelos rios, eles não te submergirão; quando passares pelo fogo, não te queimarás, nem a chama arderá em ti.",
    message: "Você vai passar por águas profundas. Vai enfrentar fogos intensos. Mas note: Deus não disse \"se passar\", disse \"quando passar\". Ele sabe que as provações vêm. Mas prometeu algo maior: estar com você. E quando Deus está presente, você não se afoga. Não se queima. Você atravessa. E sai transformado."
  },
  "1-7": {
    reference: "João 16:33",
    verse: "No mundo, passais por aflições; mas tende bom ânimo; eu venci o mundo.",
    message: "Jesus foi honesto: a vida aqui é difícil. Haverá aflições, tribulações, lágrimas. Mas Ele não parou por aí. Ele venceu! E porque Ele venceu, você também vence. As batalhas de hoje já têm um final garantido. Então respire fundo, levante a cabeça, e lembre-se: você está do lado vencedor."
  },
  "1-8": {
    reference: "Salmos 121:1-2",
    verse: "Elevo os olhos para os montes: de onde me virá o socorro? O meu socorro vem do Senhor, que fez o céu e a terra.",
    message: "De onde vem sua ajuda? Não das suas próprias forças. Não das circunstâncias favoráveis. Mas do Criador do universo, do Deus que falou e estrelas surgiram. Hoje, quando você olhar para as montanhas de problemas à sua frente, lembre-se de olhar além delas—para Aquele que faz montanhas se moverem."
  },
  "1-9": {
    reference: "Hebreus 12:1",
    verse: "Deixemos todo embaraço e o pecado que tão de perto nos rodeia e corramos, com perseverança, a carreira que nos está proposta.",
    message: "Há coisas te atrasando. Pesos que você carrega sem necessidade. Pecados que te prendem, vergonhas que te paralisam. Hoje, solte. Deixe cair. Você tem uma corrida pela frente, e Deus não quer que você apenas termine—quer que você corra livre, leve, cheio de alegria. Largue o peso. A linha de chegada está esperando."
  },
  "1-10": {
    reference: "Mateus 5:16",
    verse: "Assim brilhe também a vossa luz diante dos homens, para que vejam as vossas boas obras e glorifiquem a vosso Pai que está nos céus.",
    message: "Você é luz. Não porque é perfeito, mas porque Cristo brilha através de você. Hoje, não esconda isso. Não minimize sua influência. Cada palavra gentil, cada ato de bondade, cada momento de integridade está iluminando o caminho de alguém. Brilhe. O mundo está escuro demais para você ficar apagado."
  },
  
  // NATAL E DATAS ESPECIAIS (Exemplo de como adicionar datas futuras)
  "11-25": {
    reference: "Lucas 2:11",
    verse: "Pois, na cidade de Davi, vos nasceu hoje o Salvador, que é Cristo, o Senhor.",
    message: "O maior presente que você já recebeu não estava embrulhado em papel colorido. Estava envolto em faixas, deitado numa manjedoura. Deus desceu até nós. Ele quebrou a distância. Hoje, não importa o quão longe você se sinta, o Natal é a prova de que Ele veio buscar você. Celebre. O Salvador está aqui."
  }
};

// Fallback messages that cycle through the year to ensure every day has content
// even if not explicitly defined in the map above.
const GENERIC_DAILY_READINGS: DailyReading[] = [
  {
    reference: "Salmos 23:1",
    verse: "O Senhor é o meu pastor, nada me faltará.",
    message: "Você não precisa saber o caminho, só precisa conhecer o Pastor. Ele sabe onde estão as águas tranquilas. Ele sabe onde o pasto é verde. E Ele prometeu que, sob Seu cuidado, você terá tudo o que realmente precisa. Descanse na liderança Dele hoje."
  },
  {
    reference: "Isaías 26:3",
    verse: "Tu conservarás em paz aquele cuja mente está firme em ti; porque ele confia em ti.",
    message: "A paz não é a ausência de problemas; é a presença de Deus em seus pensamentos. Quando fixamos nossa mente Nele—Sua bondade, Seu poder, Seu amor—o caos ao redor perde seu poder de nos abalar. Foque em Deus hoje, e veja a paz retornar."
  },
  {
    reference: "Mateus 7:7",
    verse: "Pedi, e dar-se-vos-á; buscai, e encontrareis; batei, e abrir-se-vos-á.",
    message: "Deus não está se escondendo de você. Ele não está segurando as respostas para ver se você implora o suficiente. Ele é um Pai generoso que ama quando Seus filhos pedem. O que você precisa hoje? Peça. Com fé. Com ousadia. Ele está ouvindo."
  },
  {
    reference: "Salmos 91:1",
    verse: "Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará.",
    message: "Existe um lugar secreto onde o barulho do mundo não entra. Um lugar de proteção sob a sombra do próprio Deus. Hoje, você não precisa enfrentar a vida exposto aos elementos. Corra para o esconderijo. Habite na presença Dele. Ali, você está seguro."
  },
  {
    reference: "Romanos 8:1",
    verse: "Portanto, agora nenhuma condenação há para os que estão em Cristo Jesus.",
    message: "A voz da culpa gosta de relembrar seus erros passados. Mas a voz de Deus diz: 'Perdoado'. Se você está em Cristo, o julgamento acabou. Não viva mais sob a sombra da vergonha. Você é livre. Levante a cabeça e caminhe na luz da graça."
  },
  {
    reference: "Provérbios 4:23",
    verse: "Sobre tudo o que se deve guardar, guarda o teu coração, porque dele procedem as fontes da vida.",
    message: "Seu coração é precioso. Não deixe qualquer coisa entrar—amargura, inveja, medo. Seja o guardião da sua alma hoje. Filtre o que você ouve, o que vê, o que permite criar raiz. Mantenha a fonte limpa, e sua vida fluirá com mais clareza e alegria."
  },
  {
    reference: "Salmos 118:24",
    verse: "Este é o dia que fez o Senhor; regozijemo-nos e alegremo-nos nele.",
    message: "Este dia é um presente exclusivo. Nunca existiu antes, nunca existirá de novo. Deus o desenhou para você. Mesmo com seus desafios, há beleza escondida aqui. Escolha a alegria. Procure os presentes de Deus nas pequenas coisas hoje."
  },
  {
    reference: "1 João 3:1",
    verse: "Vede quão grande amor nos tem concedido o Pai, que fôssemos chamados filhos de Deus.",
    message: "Você não é apenas um servo. Não é apenas um seguidor. Você é filho. Filha. Você tem o DNA do céu. O Criador do universo olha para você e diz: 'Este é meu'. Deixe essa identidade definir sua autoestima hoje."
  },
  {
    reference: "Josué 1:5",
    verse: "Ninguém te poderá resistir, todos os dias da tua vida; como fui com Moisés, assim serei contigo.",
    message: "O Deus que abriu o Mar Vermelho é o mesmo Deus que caminha com você hoje. Ele não mudou. Seu poder não diminuiu. Se Ele está com você, nenhum obstáculo é grande demais. Enfrente seu dia com a confiança de quem tem o Todo-Poderoso ao seu lado."
  },
  {
    reference: "Salmos 103:2",
    verse: "Bendize, ó minha alma, ao Senhor, e não te esqueças de nenhum de seus benefícios.",
    message: "A memória é curta, especialmente para as coisas boas. Hoje, faça um exercício deliberado: lembre-se. Lembre-se de quando Ele te curou. De quando Ele proveu. De quando Ele te salvou. A gratidão é o antídoto para o desânimo."
  },
  {
    reference: "Isaías 54:17",
    verse: "Toda a ferramenta preparada contra ti não prosperará.",
    message: "Podem se levantar contra você. Podem falar. Podem planejar. Mas a palavra final é de Deus. E Ele decretou proteção sobre sua vida. O que foi feito para te destruir, Deus pode usar para te fortalecer. Mantenha-se firme. Sua defesa vem do Alto."
  },
  {
    reference: "Salmos 37:5",
    verse: "Entrega o teu caminho ao Senhor; confia nele, e ele o fará.",
    message: "Entregar significa soltar. Parar de tentar controlar cada detalhe. É dizer: 'Deus, assume o volante'. É assustador, mas é a única maneira de ver o impossível acontecer. Hoje, solte o controle. Deixe Deus ser Deus na sua vida."
  },
  {
    reference: "Mateus 19:26",
    verse: "Para os homens é impossível, mas para Deus tudo é possível.",
    message: "Risque a palavra 'impossível' do seu dicionário espiritual. Seu Deus é especialista em situações sem saída. Quando você não vê jeito, Ele está apenas começando a trabalhar. Acredite no milagre. Ele está mais perto do que você imagina."
  },
  {
    reference: "Salmos 55:22",
    verse: "Lança o teu cuidado sobre o Senhor, e ele te susterá.",
    message: "Imagine tirar o peso das suas costas e colocá-lo nas mãos fortes de Deus. Ele não se cansa. Ele não se sobrecarrega. Ele foi feito para carregar o que você não consegue. Transfira o peso hoje. Respire aliviado."
  },
  {
    reference: "2 Coríntios 12:9",
    verse: "A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza.",
    message: "Sua fraqueza não desqualifica você; ela é o palco onde o poder de Deus brilha mais forte. Você não precisa ser invencível. Só precisa estar disponível. Deixe a graça de Deus preencher as lacunas onde suas forças terminam."
  },
  {
    reference: "Salmos 119:105",
    verse: "Lâmpada para os meus pés é tua palavra, e luz para o meu caminho.",
    message: "Você não precisa ver a estrada inteira. Só precisa de luz para o próximo passo. A Palavra de Deus é essa luz. Ela não mostra o destino final, mas garante que você não tropece agora. Leia. Ouça. Deixe Ele guiar seus passos hoje."
  },
  {
    reference: "Gálatas 6:9",
    verse: "E não nos cansemos de fazer bem, porque a seu tempo ceifaremos, se não houvermos desfalecido.",
    message: "A colheita não acontece no dia do plantio. Há um tempo de espera, de silêncio, de trabalho invisível. Não desista agora. Suas sementes estão crescendo. Continue fazendo o bem. A recompensa está a caminho, e será abundante."
  },
  {
    reference: "Salmos 19:1",
    verse: "Os céus declaram a glória de Deus e o firmamento anuncia a obra das suas mãos.",
    message: "Olhe para cima hoje. A beleza do nascer do sol, a vastidão do céu—tudo isso é Deus se exibindo para você. É Ele dizendo: 'Eu sou grande, e eu cuido de você'. Deixe a natureza lembrar você da grandeza do seu Pai."
  },
  {
    reference: "Isaías 49:15",
    verse: "Porventura pode uma mulher esquecer-se tanto de seu filho que cria... mas ainda que esta se esquecesse, eu, todavia, não me esquecerei de ti.",
    message: "Você é inesquecível para Deus. Seu nome está gravado nas palmas das mãos Dele. Nos dias em que você se sentir invisível para o mundo, lembre-se: o Rei do Universo não tira os olhos de você nem por um segundo."
  },
  {
    reference: "Filipenses 1:6",
    verse: "Tendo por certo isto mesmo, que aquele que em vós começou a boa obra a aperfeiçoará até ao dia de Jesus Cristo.",
    message: "Deus não deixa obras inacabadas. Se Ele começou algo em você, Ele vai terminar. Tenha paciência com seu próprio processo. Você é uma obra em andamento, e o Artista não desistiu de você. O resultado final será magnífico."
  },
  {
    reference: "Salmos 32:7",
    verse: "Tu és o lugar em que me escondo; tu me preservas da angústia; tu me cinges de alegres cantos de livramento.",
    message: "Há dias em que precisamos apenas nos esconder em Deus. Deixar que Ele seja nosso escudo, nosso filtro contra a negatividade. E ali, no esconderijo, Ele troca nossa angústia por canções. Escute hoje: Ele está cantando liberdade sobre você."
  },
  {
    reference: "Romanos 5:8",
    verse: "Mas Deus prova o seu amor para conosco, em que Cristo morreu por nós, sendo nós ainda pecadores.",
    message: "Você não precisa se arrumar para ir a Deus. Ele te amou no seu pior momento. Ele escolheu você quando você não tinha nada a oferecer. Esse amor não é baseado em mérito; é baseado em graça. Aceite-o hoje. Você é amado, ponto final."
  },
  {
    reference: "Salmos 147:3",
    verse: "Sara os quebrantados de coração, e lhes ata as suas feridas.",
    message: "Deus é o médico das almas. Ele não tem medo das suas feridas abertas. Com mãos gentis e precisas, Ele limpa, cura e protege. Se você está doendo hoje, leve seu coração ao consultório do Pai. A cura dele é completa."
  },
  {
    reference: "Provérbios 17:17",
    verse: "Em todo o tempo ama o amigo e para a hora da angústia nasce o irmão.",
    message: "Você não foi feito para caminhar sozinho. Deus coloca pessoas em nossa vida como presentes. Hoje, seja esse amigo para alguém. Ou, se precisar, tenha coragem de pedir ajuda. A comunidade é a resposta de Deus para a solidão."
  },
  {
    reference: "Salmos 51:10",
    verse: "Cria em mim, ó Deus, um coração puro, e renova em mim um espírito reto.",
    message: "Todos nós precisamos de um 'reset' de vez em quando. Um momento para limpar o coração, realinhar as prioridades, pedir pureza. Hoje pode ser esse dia. Peça a Deus um coração novo. Ele adora responder a essa oração."
  },
  {
    reference: "Miquéias 7:8",
    verse: "Ó inimiga minha, não te alegres a meu respeito; ainda que eu tenha caído, levantar-me-ei; se morar nas trevas, o Senhor será a minha luz.",
    message: "Cair faz parte da jornada. Ficar no chão é uma escolha. Hoje, se você tropeçou, levante-se. Sacuda a poeira. A luz de Deus brilha mais forte nas suas trevas. Sua história não termina na queda; termina na vitória de quem se levantou com Deus."
  },
  {
    reference: "Salmos 107:1",
    verse: "Louvai ao Senhor, porque ele é bom, porque a sua benignidade dura para sempre.",
    message: "A bondade de Deus não tem prazo de validade. Ela não acaba quando você falha. Ela não seca quando a vida fica difícil. É uma fonte eterna. Beba dessa bondade hoje. Deixe-a renovar sua esperança."
  },
  {
    reference: "Isaías 30:15",
    verse: "No sossego e na confiança estaria a vossa força.",
    message: "O mundo diz: 'Corra, grite, lute'. Deus diz: 'Acalme-se'. Há uma força explosiva na serenidade. Quando você confia, você não precisa entrar em pânico. Hoje, experimente a força do sossego. Fique quieto e saiba que Ele é Deus."
  },
  {
    reference: "Lamentações 3:22-23",
    verse: "As misericórdias do Senhor são a causa de não sermos consumidos, porque as suas misericórdias não têm fim; novas são cada manhã.",
    message: "Você errou ontem? Hoje é uma nova página. As misericórdias de Deus foram reabastecidas enquanto você dormia. Há graça fresca disponível para você agora. Não arraste a culpa de ontem para o dia de hoje. Receba o novo."
  },
  {
    reference: "Salmos 126:3",
    verse: "Grandes coisas fez o Senhor por nós, pelas quais estamos alegres.",
    message: "Olhe para trás por um momento. Veja de onde Deus te tirou. Veja as batalhas que Ele venceu por você. Você tem um histórico de vitórias com Deus. Deixe isso encher seu coração de alegria e confiança para o que vem pela frente."
  }
];

export const EMOTIONAL_VERSES: EmotionalVerse[] = [
  // ANSIEDADE
  {
    id: 'ans_1',
    text: "Não andeis ansiosos por coisa alguma; antes em tudo sejam os vossos pedidos conhecidos diante de Deus pela oração e súplica com ações de graças; e a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos pensamentos em Cristo Jesus.",
    reference: "Filipenses 4:6-7",
    emotion: 'ansiedade',
    reflection: "Sabe aquele aperto no peito? Respire fundo agora. Você não precisa carregar o mundo nas costas. Fale com Deus sobre o que te preocupa, simples assim, como quem conversa com um amigo, e deixe Ele trazer a paz que falta."
  },
  {
    id: 'ans_2',
    text: "Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.",
    reference: "1 Pedro 5:7",
    emotion: 'ansiedade',
    reflection: "Imagine pegar cada preocupação sua e fisicamente entregá-la nas mãos de alguém que resolve o impossível. Deus não está apenas olhando; Ele está cuidando ativamente de você agora mesmo."
  },
  {
    id: 'ans_3',
    text: "Quando estou com medo, eu confio em ti.",
    reference: "Salmos 56:3",
    emotion: 'ansiedade',
    reflection: "Ter medo é humano, mas a confiança é uma escolha poderosa. Mesmo tremendo, você pode escolher acreditar que não está sozinho nessa tempestade."
  },

  // CANSAÇO
  {
    id: 'can_1',
    text: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.",
    reference: "Mateus 11:28",
    emotion: 'cansaco',
    reflection: "Você não precisa ser forte o tempo todo. Está tudo bem parar. Esse é um convite pessoal para soltar o peso, tirar a armadura e simplesmente descansar na presença de quem te entende."
  },
  {
    id: 'can_2',
    text: "Mas os que esperam no Senhor renovarão as forças, subirão com asas como águias; correrão, e não se cansarão; caminharão, e não se fatigarão.",
    reference: "Isaías 40:31",
    emotion: 'cansaco',
    reflection: "Sua bateria pode estar no fim, mas a fonte de energia de Deus é inesgotável. Espere um pouco. Não corra agora. Deixe Ele recarregar você para voos que você nem imagina ainda."
  },

  // TRISTEZA
  {
    id: 'tri_1',
    text: "Perto está o Senhor dos que têm o coração quebrantado, e salva os contritos de espírito.",
    reference: "Salmos 34:18",
    emotion: 'tristeza',
    reflection: "A tristeza às vezes nos faz sentir isolados, mas a verdade é o oposto: é na sua dor que Deus está mais próximo. Ele não se afasta das suas lágrimas; Ele se inclina para enxugá-las."
  },
  {
    id: 'tri_2',
    text: "O choro pode durar uma noite, mas a alegria vem pela manhã.",
    reference: "Salmos 30:5",
    emotion: 'tristeza',
    reflection: "Toda noite escura tem um fim, por mais longa que pareça. O que você sente agora é temporário. Aguente firme, porque o sol vai nascer de novo na sua vida."
  },

  // GRATIDÃO
  {
    id: 'gra_1',
    text: "Dêem graças em todas as circunstâncias, pois esta é a vontade de Deus para vocês em Cristo Jesus.",
    reference: "1 Tessalonicenses 5:18",
    emotion: 'gratidao',
    reflection: "A gratidão muda a nossa lente. Mesmo nos dias comuns ou difíceis, encontrar um pequeno motivo para agradecer abre portas para a alegria entrar."
  },

  // RAIVA
  {
    id: 'rai_1',
    text: "Todo o homem seja pronto para ouvir, tardio para falar, tardio para se irar.",
    reference: "Tiago 1:19",
    emotion: 'raiva',
    reflection: "A raiva é um sinal de alerta, não um guia de ação. Respire. Dê um passo atrás. Não deixe um momento de fúria destruir o que você levou anos para construir."
  },
  
  // ESPERANÇA
  {
    id: 'esp_1',
    text: "Porque sou eu que conheço os planos que tenho para vocês', diz o Senhor, 'planos de fazê-los prosperar e não de causar dano, planos de dar a vocês esperança e um futuro.",
    reference: "Jeremias 29:11",
    emotion: 'esperanca',
    reflection: "Sua história não acabou. O Autor da vida já escreveu os próximos capítulos e, acredite, eles são bons. O melhor ainda não aconteceu."
  }
];

// Helper function to get the correct message for ANY day of the year
export const getDailyReading = (date: Date): DailyReading => {
  const month = date.getMonth(); // 0-11
  const day = date.getDate(); // 1-31
  const key = `${month}-${day}`;
  
  // 1. Try to find a specific message for this date (e.g. Jan 1, Christmas)
  if (FIXED_DAILY_READINGS[key]) {
    return { ...FIXED_DAILY_READINGS[key], dateKey: key };
  }
  
  // 2. If no specific message, cycle through the generic list based on day of year
  // This ensures we cover all 365 days without needing a 10,000 line file right now.
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const index = dayOfYear % GENERIC_DAILY_READINGS.length;
  return GENERIC_DAILY_READINGS[index];
};
