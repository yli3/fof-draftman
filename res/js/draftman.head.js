/* Constants */
var draftmanConst = {
    FILENAME_ROOKIES : 'rookies.csv',
    FILENAME_PLAYER_INFO : 'player_information.csv',
    FILENAME_DRAFT_PERSONAL : 'draft_personal.csv',
    FILENAME_PLAYERS_PERSONAL : 'players_personal.csv',
    FILENAME_PLAYER_RECORD : 'player_record.csv',
    FILENAME_TEAM_INFORMATION: 'team_information.csv',
    FILENAME_STELMACK_CSV: 'stelmack.csv',
    HTML_INCLUDE_DIR: 'res/inc/',
    PLAYER_STORE_NAME : 'draftClass',
    DBINFO_STORE_NAME : 'dbInfo',
    DRAFTMAN_SAVENAME_DEFAULT : 'draftclass.draftman',
    DRAFTMAN_FILE_EXTENSION : '.draftman',
    DB_NAME : 'draftclass01',
    KEYCODE_LEFT : 81, //q
    KEYCODE_UP : 75, //k
    KEYCODE_RIGHT : 69, //e
    KEYCODE_DOWN : 74, //j
    KEYCODE_REJECT: 88, //x
    KEYCODE_DRAFTED: 68, //d 
    KEYCODE_MARK: 77, //m
    KEYCODE_SUPERMARK: 83, //s
    KEYCODE_INTERVIEW: 73, //i
    ACTION_REJECT : 'reject',
    ACTION_MARK : 'mark',
    ACTION_SUPERMARK : 'supermark',
    ACTION_DRAFTED : 'drafted',
    ACTION_INTERVIEW: 'interviewCandidate',
    KEYCODE_0: 48,
    KEYCODE_1: 49,
    KEYCODE_2: 50,
    KEYCODE_3: 51,
    KEYCODE_4: 52,
    KEYCODE_5: 53,
    KEYCODE_6: 54,
    KEYCODE_7: 55,
    KEYCODE_NUM0: 96,
    KEYCODE_NUM1: 97,
    KEYCODE_NUM2: 98,
    KEYCODE_NUM3: 99,
    KEYCODE_NUM4: 100,
    KEYCODE_NUM5: 101,
    KEYCODE_NUM6: 102,
    KEYCODE_NUM7: 103,
    KEYCODE_FA: 70, //f (u is 85),
    QUAL_GOOD : 'qual_good',
    QUAL_GREAT : 'qual_great',
    QUAL_BAD : 'qual_bad',
    QUAL_AWFUL : 'qual_awful',
    NO_COMBINE_SCORE_DISPLAY : '&mdash;',
    FA_GRADE_DISPLAY : 'FA',
    NO_GRADE_DISPLAY : '&nbsp;&nbsp;',
    NOTE_ICON : '<img class="icon" src="res/img/note.jpg">',
    INTERVIEW_ICON: '<img class="icon" src="res/img/interview_icon.png">',
    RED_FLAG_ICON: '<img class="main_red_flag" src="res/img/red_flag.png">',
    ACTIVE_CLASS: 'active',
    FADED_CLASS: 'faded',
    SUCCESS_MSG: '<p class="success">Success!</p>',
    FAIL_MSG: '<p class="error">Error!</p>',
};

draftmanConst.roundGradeKeyCodes =  [
    draftmanConst.KEYCODE_0, draftmanConst.KEYCODE_1, draftmanConst.KEYCODE_2, draftmanConst.KEYCODE_3, draftmanConst.KEYCODE_4, draftmanConst.KEYCODE_5, draftmanConst.KEYCODE_6, draftmanConst.KEYCODE_7, draftmanConst.KEYCODE_NUM0, draftmanConst.KEYCODE_NUM1, draftmanConst.KEYCODE_NUM2, draftmanConst.KEYCODE_NUM3, draftmanConst.KEYCODE_NUM4, draftmanConst.KEYCODE_NUM5, draftmanConst.KEYCODE_NUM6, draftmanConst.KEYCODE_NUM7, draftmanConst.KEYCODE_FA
];

draftmanConst.posGNormal = [
    'QB', 'RB', 'FB', 'TE', 'WR', 'T', 'G', 'C', 'DE', 'DT', 'ILB', 'OLB', 'CB', 'S'
];

draftmanConst.posGSpecial = [
    'K', 'P', 'LS'
];

/* Files */

var draftmanFile = {
    noClassImported: draftmanConst.HTML_INCLUDE_DIR + 'noClassImported.htm',
    importDump: draftmanConst.HTML_INCLUDE_DIR + 'importDump.htm',
}

/* global IDs */
var draftmanID = {
    content: document.getElementById('content'),
    importDraft : document.getElementById('importDraft'),
    importSave : document.getElementById('importSave'),
    buttonSave : document.getElementById('buttonSave'),
    importStelmack : document.getElementById('importStelmack'),
    main: document.getElementById('main'),
    mainmsg: document.getElementById('mainmsg'),
    msgLoading: document.getElementById('msgLoading'),
    msgBox : document.getElementById('msgBox'),
    drPlayerTable : document.getElementById('drPlayerTable'),
    drInfoPane : document.getElementById('drInfoPane'),
    drInfoPlayerName : document.getElementById('drInfoPlayerName'),
    drInfoPlayerInfo : document.getElementById('drInfoPlayerInfo'),
    drInfoPlayerBars : document.getElementById('drInfoPlayerBars'),
    drInfoPlayerNotes : document.getElementById('drInfoPlayerNotes'),
    draftmanNotepad : document.getElementById('draftmanNotepad'),
    gradeMenu: document.getElementById('gradeMenu'),
    showOnlyMenu: document.getElementById('showOnlyMenu'),
    dumpContent: document.getElementById('dumpContent'),
    extraMenu: document.getElementById('extraMenu'),
    filterMenus: document.getElementById('filterMenus'),
};

var draftmanIDNames = {
    content: 'content',
    importDraft : 'importDraft',
    importSave : 'importSave',
    buttonSave : 'buttonSave',
    importStelmack : 'importStelmack',
    main: 'main',
    mainmsg: 'mainmsg',
    msgLoading: 'msgLoading',
    msgBox : 'msgBox',
    drPlayerTable : 'drPlayerTable',
    drInfoPane : 'drInfoPane',
    drInfoPlayerName : 'drInfoPlayerName',
    drInfoPlayerInfo : 'drInfoPlayerInfo',
    drInfoPlayerBars : 'drInfoPlayerBars',
    drInfoPlayerNotes : 'drInfoPlayerNotes',
    draftmanNotepad : 'draftmanNotepad',
    gradeMenu: 'gradeMenu',
    showOnlyMenu: 'showOnlyMenu',
    dumpContent: 'dumpContent',
    extraMenu: 'extraMenu',
    filterMenus: 'filterMenus',
};

/* global vars */

var draftmanGlobal = {
    scrollNodeParent : null,
    scrollNodeList : null,
    scrollCount : 0,
    scrollToggle : false
};

/* draftman tables */
var draftmanTables = {};

draftmanTables.combineQuality = {
    QB: {
        sol: {lo: 28, hi: 34, top:45},
        dash: {lo:484, hi:474, top:454},
        bench: {lo:10, hi:13, top:17},
        agil: {lo: 780, hi:762, top:711},
        jmp: {lo:102, hi:112, top:118},
        pspec: {lo:67, hi:77, top:90},
    },
    RB: {
        sol: {lo: 10, hi:24, top:33},
        dash: {lo:465, hi:458, top:446},
        bench: {lo:15, hi:18, top:22},
        agil: {lo: 735, hi:725, top:700},
        jmp: {lo:114, hi:124, top:128},
        pspec: {lo:11, hi:24, top:38},
    },
    FB: {
        sol: {lo: 16, hi: 25, top:34},
        dash: {lo:478, hi:471, top:459},
        bench: {lo:20, hi:24, top:28},
        agil: {lo: 760, hi:745, top:719},
        jmp: {lo:102, hi:113, top:117},
        pspec: {lo:22, hi:35, top:46},
    },
    TE: {
        sol: {lo: 15, hi: 27, top:37},
        dash: {lo:478, hi:472, top:460},
        bench: {lo:15, hi:26, top:30},
        agil: {lo: 775, hi:765, top:735},
        jmp: {lo:102, hi:114, top:122},
        pspec: {lo:32, hi:40, top:50},
    },
    WR: {
        sol: {lo: 14, hi: 24, top:35},
        dash: {lo:451, hi:446, top:438},
        bench: {lo:11, hi:14, top:17},
        agil: {lo: 720, hi:710, top:690},
        jmp: {lo:114, hi:124, top:131},
        pspec: {lo:33, hi:51, top:60},
    },
    T: {
        sol: {lo: 17, hi: 28, top: 37},
        dash: {lo:527, hi:519, top:502},
        bench: {lo:20, hi:32, top:37},
        agil: {lo: 780, hi:770, top:752},
        jmp: {lo:90, hi:102, top:110},
    },
    G: {
        sol: {lo: 18, hi: 28, top: 38},
        dash: {lo:527, hi:519, top:504},
        bench: {lo:24, hi:31, top:37},
        agil: {lo: 790, hi:780, top:762},
        jmp: {lo:88, hi:102, top:108},
    },
    C: {
        sol: {lo: 20, hi: 30, top: 39},
        dash: {lo:531, hi:523, top:506},
        bench: {lo:20, hi:29, top:33},
        agil: {lo: 800, hi:790, top:770},
        jmp: {lo:88, hi:98, top:107},
    },
    DE: {
        sol: {lo: 12, hi: 27, top:36},
        dash: {lo:485, hi:479, top:468},
        bench: {lo:21, hi:30, top:35},
        agil: {lo: 760, hi:740, top:717},
        jmp: {lo:106, hi:114, top:125},
    },
    DT: {
        sol: {lo: 11, hi: 25, top:35},
        dash: {lo:507, hi:502, top:494},
        bench: {lo:21, hi:32, top:37},
        agil: {lo: 780, hi:760, top:735},
        jmp: {lo:98, hi:108, top:116},
    },
    ILB: {
        sol: {lo: 20, hi: 30, top:41},
        dash: {lo:486, hi:480, top:468},
        bench: {lo:19, hi:25, top:29},
        agil: {lo: 760, hi:749, top:711},
        jmp: {lo:104, hi:114, top:120},
        pspec: {lo:27, hi:35, top:45},
    },
    OLB: {
        sol: {lo: 13, hi: 28, top:39},
        dash: {lo:471, hi:465, top:455},
        bench: {lo:12, hi:21, top:25},
        agil: {lo: 740, hi:731, top:707},
        jmp: {lo:108, hi:118, top:126},
        pspec: {lo:27, hi:35, top:45},
    },
    CB: {
        sol: {lo: 12, hi: 25, top:36},
        dash: {lo:452, hi:447, top:440},
        bench: {lo:11, hi:15, top:17},
        agil: {lo: 720, hi:711, top:690},
        jmp: {lo:114, hi:124, top:130},
        pspec: {lo:37, hi:45, top:55},
    },
    S: {
        sol: {lo: 14, hi: 32, top:43},
        dash: {lo:459, hi:454, top:444},
        bench: {lo:12, hi:18, top:22},
        agil: {lo: 735, hi:725, top:702},
        jmp: {lo:110, hi:120, top:128},
        pspec: {lo:37, hi:45, top:55},
    },
    P: {
        sol: {lo: 17, hi: 28, top:40},
        dash: {lo:514, hi:497, top:479},
        bench: {lo:8, hi:13, top:18},
    },
    K: {
        sol: {lo: 19, hi: 29, top:40},
        dash: {lo:523, hi:506, top:495},
        bench: {lo:7, hi:12, top:17},
        jmp: {lo:104, hi:112, top:118},
    }
};
/* deprecate
draftmanTables.combineGradeBoundaries = {

    QB: {
        dash: {min:510, bad:480, good:447, max:430},
        sol: {min:15, bad:28, good:42, max:55},
        bench: {min:6, bad:10, good:18, max:22},
        agil: {min:820, bad:780, good:710, max:695},
        jmp: {min:90, bad:102, good:117, max:120},
        pspec: {min:0, bad:0, good:0, max:0}
    },
    
    RB: {
        dash: {min:480, bad:465, good:439, max:430},
        sol: {min:8, bad:13, good:40, max:43},
        bench: {min:9, bad:15, good:22, max:27},
        agil: {min:760, bad:735, good:700, max:682},
        jmp: {min:102, bad:114, good:128, max:132},
        pspec: {min:4, bad:11, good:38, max:40}
    },
    
    FB: {
        dash: {min:495, bad:490, good:462, max:452},
        sol: {min:10, bad:13, good:40, max:43},
        bench: {min:14, bad:20, good:30, max:34},
        agil: {min:770, bad:760, good:715, max:692},
        jmp: {min:80, bad:102, good:118, max:120},
        pspec: {min:7, bad:22, good:48, max:50}
    },
    
    TE: {
        dash: {min:491, bad:478, good:457, max:444},
        sol: {min:10, bad:13, good:43, max:47},
        bench: {min:15, bad:15, good:36, max:36},
        agil: {min:815, bad:775, good:740, max:712},
        jmp: {min:90, bad:102, good:124, max:128},
        pspec: {min:14, bad:32, good:50, max:55}
    },
    
    WR: {
        dash: {min:467, bad:451, good:436, max:425},
        sol: {min:7, bad:10, good:42, max:45},
        bench: {min:5, bad:11, good:17, max:21},
        agil: {min:730, bad:720, good:690, max:672},
        jmp: {min:102, bad:114, good:134, max:136},
        pspec: {min:20, bad:42, good:65, max:70}
    },
    
    C: {
        dash: {min:540, bad:531, good:500, max:487},
        sol: {min:0, bad:13, good:49, max:50},
        bench: {min:10, bad:18, good:39, max:40},
        agil: {min:815, bad:800, good:767, max:752},
        jmp: {min:75, bad:85, good:108, max:110},
        pspec: {min:0, bad:20, good:40, max:60}
    },
    
    G: {
        dash: {min:540, bad:527, good:499, max:488},
        sol: {min:0, bad:11, good:47, max:50},
        bench: {min:21, bad:21, good:43, max:43},
        agil: {min:800, bad:790, good:757, max:745},
        jmp: {min:80, bad:88, good:108, max:110},
        pspec: {min:0, bad:20, good:40, max:60}
    },
    
    T: {
        dash: {min:550, bad:527, good:500, max:486},
        sol: {min:0, bad:9, good:47, max:50},
        bench: {min:19, bad:20, good:43, max:43},
        agil: {min:790, bad:780, good:749, max:740},
        jmp: {min:80, bad:90, good:111, max:114},
        pspec: {min:0, bad:20, good:40, max:60}
    },
    
    DE: {
        dash: {min:502, bad:485, good:465, max:453},
        sol: {min:9, bad:12, good:42, max:46},
        bench: {min:18, bad:21, good:37, max:40},
        agil: {min:780, bad:760, good:714, max:695},
        jmp: {min:94, bad:106, good:130, max:130},
        pspec: {min:0, bad:20, good:40, max:60}
    },
    
    DT: {
        dash: {min:515, bad:507, good:495, max:480},
        sol: {min:8, bad:8, good:42, max:45},
        bench: {min:21, bad:22, good:40, max:43},
        agil: {min:790, bad:780, good:735, max:720},
        jmp: {min:90, bad:98, good:114, max:120},
        pspec: {min:0, bad:20, good:40, max:60}
    },
    
    ILB: {
        dash: {min:486, bad:486, good:465, max:455},
        sol: {min:13, bad:14, good:48, max:51},
        bench: {min:14, bad:14, good:32, max:35},
        agil: {min:780, bad:760, good:723, max:707},
        jmp: {min:90, bad:104, good:123, max:124},
        pspec: {min:18, bad:27, good:46, max:48}
    },
    
    OLB: {
        dash: {min:471, bad:471, good:455, max:445},
        sol: {min:11, bad:11, good:49, max:49},
        bench: {min:10, bad:11, good:27, max:30},
        agil: {min:760, bad:740, good:710, max:695},
        jmp: {min:94, bad:108, good:127, max:128},
        pspec: {min:18, bad:27, good:45, max:50}
    },
    
    CB: {
        dash: {min:460, bad:452, good:440, max:430},
        sol: {min:9, bad:9, good:46, max:46},
        bench: {min:6, bad:6, good:20, max:21},
        agil: {min:730, bad:720, good:690, max:680},
        jmp: {min:102, bad:114, good:134, max:136},
        pspec: {min:25, bad:37, good:52, max:60}
    },
    
    S: {
        dash: {min:470, bad:459, good:445, max:435},
        sol: {min:12, bad:14, good:53, max:53},
        bench: {min:9, bad:10, good:23, max:27},
        agil: {min:740, bad:735, good:700, max:690},
        jmp: {min:94, bad:110, good:130, max:132},
        pspec: {min:25, bad:37, good:51, max:60}
    },
    
    P: {
        dash: {min:530, bad:515, good:490, max:470},
        sol: {min:14, bad:20, good:30, max:40},
        bench: {min:5, bad:9, good:14, max:20},
        agil: {min:0, bad:0, good:0, max:0},
        jmp: {min:0, bad:0, good:0, max:0},
        pspec: {min:0, bad:0, good:0, max:0}
    },
    
    K: {
        dash: {min:520, bad:505, good:495, max:470},
        sol: {min:14, bad:20, good:30, max:40},
        bench: {min:5, bad:9, good:14, max:18},
        agil: {min:0, bad:0, good:0, max:0},
        jmp: {min:90, bad:95, good:114, max:125},
        pspec: {min:0, bad:0, good:0, max:0}
    },
};*/

draftmanTables.combineGradeWeights = {
    QB: { dash: 1, sol: 1, bench: 1, agil: 1, jmp: 1, pspec: 1},
    RB: { dash: 1, sol: 1, bench: 1, agil: 1, jmp: 1, pspec: 1},
    FB: { dash: 1, sol: 1, bench: 1, agil: 1, jmp: 1, pspec: 1},
    TE: { dash: 1, sol: 1, bench: 1, agil: 1, jmp: 1, pspec: 1},
    WR: { dash: 1, sol: 1, bench: 1, agil: 1, jmp: 0, pspec: 1},
    C: { dash: 1, sol: 0, bench: 1, agil: 1, jmp: 1, pspec: 0},
    G: { dash: 1, sol: 0, bench: 1, agil: 1, jmp: 1, pspec: 0},
    T: { dash: 1, sol: 0, bench: 1, agil: 1, jmp: 1, pspec: 0},
    DE: { dash: 1, sol: 1, bench: 1, agil: 1, jmp: 1, pspec: 0},
    DT: { dash: 1, sol: 1, bench: 1, agil: 1, jmp: 1, pspec: 0},
    ILB: { dash: 1, sol: 1, bench: 1, agil: 1, jmp: 1, pspec: 1},
    OLB: { dash: 1, sol: 1, bench: 1, agil: 1, jmp: 1, pspec: 1},
    CB: { dash: 1, sol: 1, bench: 1, agil: 1, jmp: 0, pspec: 1},
    S: { dash: 1, sol: 1, bench: 1, agil: 1, jmp: 0, pspec: 1},
    P: { dash: 1, sol: 1, bench: 1, agil: 0, jmp: 0, pspec: 0},
    K: { dash: 1, sol: 1, bench: 1, agil: 0, jmp: 1, pspec: 0}
};

draftmanTables.shownBars = { // what bar keys each position has.
    QB: ['scrPas', 'shPas', 'medPas', 'lngPas', 'dpPas', 'trdPas', 'accPas', 'tim', 'sr', 'read', 'two', 'scram', 'hold'],
    RB: ['brkSp', 'powI', 'trdRun', 'hr', 'elu', 'sto', 'blitz', 'avd', 'gd', 'rr', 'trdRec', 'pRet', 'kRet', 'end','spec'], 
    FB: ['rblk', 'pblk', 'blkstr', 'powI','trdRun','hr','blitz','avd','rr','trdRec','end','spec'],
    TE: ['rblk','pblk','blkstr','avd','gd','rr','trdRec','bpr','courage','adjust','end','spec','snap'],
    WR:['avd','gd','rr','trdRec','bpr','courage','adjust','pRet','kRet','end','spec'],
    C:['rblk','pblk','blkstr','end','snap'],
    G:['rblk','pblk','blkstr','end'],
    T:['rblk','pblk','blkstr','end'],
    DE:['rund','prt','prs','pdiag','hit','end'],
    DT:['rund','prt','prs','pdiag','hit','end'],
    ILB:['rund','prt','m2m','zon','bnr','prs','pdiag','hit','end','spec'],
    OLB:['rund','prt','m2m','zon','bnr','prs','pdiag','hit','end','spec'],
    CB:['rund','m2m','zon','bnr','pdiag','hit','int','pRet','kRet','end','spec'],
    S:['rund','m2m','zon','bnr','pdiag','hit','int','pRet','kRet','end','spec'],
    P:['pPow','pHt','pDir','hold'],
    K:['pkAc','pkPow','koDist','koHang'],
    LS:['snap']
};

draftmanTables.barInfo = { // display names, and where bars are in bar array.
    scrPas: {displayName: 'Screen', lo: 0, hi: 51},
    shPas: {displayName: 'Short Pass', lo: 1, hi: 52},
    medPas: {displayName: 'Medium Pass', lo: 2, hi: 53},
    lngPas: {displayName: 'Long Pass', lo: 3, hi: 54},
    dpPas: {displayName: 'Deep Pass', lo: 4, hi: 55},
    trdPas: {displayName: '3rd Down Pass', lo: 5, hi: 56},
    scram: {displayName: 'Scrambling', lo: 6, hi: 57},
    accPas: {displayName: 'Accuracy', lo: 7, hi: 58},
    tim: {displayName: 'Timing', lo: 8, hi: 59},
    sr: {displayName: 'Sense Rush', lo: 9, hi: 60},
    read: {displayName: 'Read Defense', lo: 10, hi: 61},
    two: {displayName: '2 Minute Drill', lo: 11, hi: 62},
    brkSp: {displayName: 'Breakaway Speed', lo: 12, hi: 63},
    powI: {displayName: 'Power Inside', lo: 13, hi: 64},
    trdRun: {displayName: '3rd Down Runs', lo: 14, hi: 65},
    hr: {displayName: 'Hole Recognition', lo: 15, hi: 66},
    elu: {displayName: 'Elusiveness', lo: 16, hi: 67},
    sto: {displayName: 'Speed to Outside', lo: 17, hi: 68},
    blitz: {displayName: 'Blitz Pickup', lo: 18, hi: 69},
    avd: {displayName: 'Avoid Drops', lo: 19, hi: 70},
    gd: {displayName: 'Get Downfield', lo: 20, hi: 71},
    rr: {displayName: 'Route Running', lo: 21, hi: 72},
    trdRec: {displayName: '3rd Down Catch', lo: 22, hi: 73},
    bpr: {displayName: 'Big Play', lo: 23, hi: 74},
    courage: {displayName: 'Courage', lo: 24, hi: 75},
    adjust: {displayName: 'Adjust to Ball', lo: 25, hi: 76},
    pRet: {displayName: 'Punt Returns', lo: 26, hi: 77},
    kRet: {displayName: 'Kick Returns', lo: 27, hi: 78},
    rblk: {displayName: 'Run Block', lo: 28, hi: 79},
    pblk: {displayName: 'Pass Block', lo: 29, hi: 80},
    blkstr: {displayName: 'Block Strength', lo: 30, hi: 81},
    pPow: {displayName: 'Power', lo: 31, hi: 82},
    pHt: {displayName: 'Hangtime', lo: 32, hi: 83},
    pDir: {displayName: 'Direction', lo: 33, hi: 84},
    koDist: {displayName: 'KO Distance', lo: 34, hi: 85},
    koHang: {displayName: 'KO Hangtime', lo: 35, hi: 86},
    pkAc: {displayName: 'Accuracy', lo: 36, hi: 87},
    pkPow: {displayName: 'Power', lo: 37, hi: 88},
    rund: {displayName: 'Run Defense', lo: 38, hi: 89},
    prt: {displayName: 'Pass Rush Tech', lo: 39, hi: 90},
    m2m: {displayName: 'Man to Man', lo: 40, hi: 91},
    zon: {displayName: 'Zone', lo: 41, hi: 92},
    bnr: {displayName: 'Bump', lo: 42, hi: 93},
    prs: {displayName: 'Rush Strength', lo: 43, hi: 94},
    pdiag: {displayName: 'Play Diagnosis', lo: 44, hi: 95},
    hit: {displayName: 'Punishing Hits', lo: 45, hi: 96},
    int: {displayName: 'Interceptions', lo: 46, hi: 97},
    end: {displayName: 'Endurance', lo: 47, hi: 98},
    spec: {displayName: 'Special Teams', lo: 48, hi: 99},
    snap: {displayName: 'Long Snapping', lo: 49, hi: 100},
    hold: {displayName: 'Kick Holding', lo: 50, hi: 101}
};


draftmanTables.combineCorrelations = {
    QB: { 
        sol: ['read'],
        dash: ['scram'],
        bench: ['lngPas', 'dpPas'],
        agil: ['scrPas', 'sr'],
        jmp: ['trdPas', 'medPas'],
        pspec: ['accPas', 'tim']          
    },
    RB: { 
        sol: ['hr'],
        dash: ['brkSp','sto'],
        bench: ['powI'],
        agil: ['elu', 'gd', 'trdRun'],
        jmp: ['sto', 'end'],
        pspec: ['blitz', 'trdRec', 'rr']          
    },
    FB: { 
        sol: ['hr'],
        bench: ['powI'],
        //agil: [], I completely forget!
        jmp: ['rblk'],
        pspec: ['blitz', 'rr']          
    },
    TE: { 
        sol: ['rr'],
        dash: ['gd','bpr'],
        bench: ['blkstr'],
        agil: ['gd'],
        jmp: ['rblk'],
        pspec: ['avoid', 'adjust']          
    },
    WR: { 
        sol: ['rr'],
        dash: ['bpr', 'gd'],
        bench: ['courage'],
        agil: ['gd'],
        jmp: ['kRet', 'pRet'],
        pspec: ['avd', 'adjust']          
    },
    T: { 
        dash: ['rblk'],
        bench: ['blkstr'],
        agil: ['pblk'],
        jmp: ['end']       
    },
    G: { 
        dash: ['rblk'],
        bench: ['blkstr'],
        agil: ['pblk'],
        jmp: ['end']       
    },
    C: { 
        dash: ['rblk'],
        bench: ['blkstr'],
        agil: ['pblk'],
        jmp: ['end']       
    },
    DE: { 
        sol: ['pdiag'],
        dash: ['prt'],
        bench: ['prs', 'hit'],
        agil: ['rund'],
        jmp: ['end']
    },
    DT: { 
        sol: ['pdiag'],
        dash: ['prt'],
        bench: ['prs', 'hit'],
        agil: ['rund'],
        jmp: ['end']
    },
    ILB: { 
        sol: ['pdiag'],
        dash: ['prt'],
        bench: ['bnr', 'prs', 'hit'],
        agil: ['rund'],
        jmp: ['m2m'],
        pspec: ['zon']          
    },
    OLB: { 
        sol: ['pdiag'],
        dash: ['prt'],
        bench: ['bnr', 'prs', 'hit'],
        agil: ['rund'],
        jmp: ['m2m'],
        pspec: ['zon']          
    },
    CB: { 
        sol: ['pdiag'],
        dash: ['m2m', 'zon'],
        bench: ['bnr', 'hit'],
        agil: ['rund'],
        jmp: ['kRet', 'pRet'],
        pspec: ['zon', 'int']          
    }, 
    S: { 
        sol: ['pdiag'],
        dash: ['m2m', 'zon'],
        bench: ['bnr', 'hit'],
        agil: ['rund'],
        jmp: ['kRet', 'pRet'],
        pspec: ['zon', 'int']          
    },
    K: { 
        sol: ['pkAc'],
        dash: ['koDist'],
        bench: ['pkPow'],
        jmp: ['koHang', 'pkPow']
    },
    P: { 
        sol: ['pDir'],
        dash: ['pPow'],
        bench: ['pHt']       
    }
};

draftmanTables.combineData = {
    QB: {
        dash: {avg:4.86, stDev:0.11},
        sol: {avg:26.5, stDev: 6.5 },
        bench: {avg:10.5, stDev:1.5},
        agil: {avg:7.845, stDev:0.21},
        jmp: {avg:107, stDev:4},
        pspec: {avg:69, stDev:7}
    },
    RB: {
        dash: {avg:4.66, stDev:0.07},
        sol: {avg:18.5, stDev: 4.5 },
        bench: {avg:15, stDev:2},
        agil: {avg:7.395, stDev:0.14},
        jmp: {avg:119, stDev:4},
        pspec: {avg:19, stDev:4.5}
    },
    FB: {
        dash: {avg:4.785, stDev:0.07},
        sol: {avg:20, stDev:4},
        bench: {avg:20.5, stDev:2.5},
        agil: {avg:7.665, stDev:0.19},
        jmp: {avg:107, stDev:4},
        pspec: {avg:24.5, stDev:5.5}
    },
    TE: {
        dash: {avg:4.8, stDev:0.07},
        sol: {avg:21.5, stDev:4.5},
        bench: {avg:22.5, stDev:2.5},
        agil: {avg:7.845, stDev:0.21},
        jmp: {avg:107.5, stDev:4.5},
        pspec: {avg:32, stDev:7}
    },
    WR: {
        dash: {avg:4.55, stDev:0.08},
        sol: {avg:18.5, stDev:4.5},
        bench: {avg:11, stDev:2},
        agil: {avg:7.24, stDev:0.12},
        jmp: {avg:119.5, stDev:4.5},
        pspec: {avg:42.5, stDev:7.5}
    },
    C: {
        dash: {avg:5.31, stDev:0.07},
        sol: {avg:24.5, stDev:4.5},
        bench: {avg:25, stDev:3},
        agil: {avg:8.04, stDev:0.12},
        jmp: {avg:94, stDev:4},
    },
    G: {
        dash: {avg:5.28, stDev:0.08},
        sol: {avg:22.5, stDev:4.5},
        bench: {avg:27.5, stDev:2.5},
        agil: {avg:7.985, stDev:0.17},
        jmp: {avg:94, stDev:4},
    },
    T: {
        dash: {avg:5.3, stDev:0.1},
        sol: {avg:22, stDev:5},
        bench: {avg:28, stDev:3},
        agil: {avg:7.885, stDev:0.17},
        jmp: {avg:96, stDev:4},
    },
    P: {
        dash: {avg:5.095, stDev:0.11},
        sol: {avg:22, stDev:5},
        bench: {avg:10, stDev:2},
        agil: {avg:7.865, stDev:0.18},
        jmp: {avg:107, stDev:4},
    },
    K: {
        dash: {avg:5.15, stDev:0.08},
        sol: {avg:23.5, stDev:4.5},
        bench: {avg:9, stDev:2},
        agil: {avg:7.865, stDev:0.19},
        jmp: {avg:107, stDev:4},
    },
    DE: {
        dash: {avg:4.885, stDev:0.09},
        sol: {avg:21, stDev:5},
        bench: {avg:26.5, stDev:2.5},
        agil: {avg:7.665, stDev:0.19},
        jmp: {avg:111.5, stDev:4.5},
    },
    DT: {
        dash: {avg:5.115, stDev:0.09},
        sol: {avg:19.5, stDev:4.5},
        bench: {avg:28.5, stDev:2.5},
        agil: {avg:7.88, stDev:0.2},
        jmp: {avg:102, stDev:6},
    },
    ILB: {
        dash: {avg:4.875, stDev:0.07},
        sol: {avg:24.5, stDev:4.5},
        bench: {avg:21.5, stDev:2.5},
        agil: {avg:7.66, stDev:0.15},
        jmp: {avg:109, stDev:4},
        pspec: {avg:28, stDev:6}
    },
    OLB: {
        dash: {avg:4.735, stDev:0.08},
        sol: {avg:22.5, stDev:4.5},
        bench: {avg:17.5, stDev:2.5},
        agil: {avg:7.44, stDev:0.12},
        jmp: {avg:113, stDev:4},
        pspec: {avg:28, stDev:6}
    },
    CB: {
        dash: {avg:4.54, stDev:0.06},
        sol: {avg:19.5, stDev:4.5},
        bench: {avg:12, stDev:2},
        agil: {avg:7.24, stDev:0.12},
        jmp: {avg:119, stDev:4},
        pspec: {avg:37, stDev:7}
    },
    S: {
        dash: {avg:4.615, stDev:0.07},
        sol: {avg:26, stDev:5},
        bench: {avg:15, stDev:2},
        agil: {avg:7.395, stDev:0.14},
        jmp: {avg:113, stDev:3},
        pspec: {avg:37, stDev:7}
    },
    
    LS: {
        dash: {avg:5.31, stDev:0.07},
        sol: {avg:24.5, stDev:4.5},
        bench: {avg:25, stDev:3},
        agil: {avg:8.04, stDev:0.12},
        jmp: {avg:94, stDev:4}
    }
};

var fileHeaders = {
    STELMACK_EXPORT: [
        'Name',
        'Position',
        'PositionGroup',
        'College',
        'Birthdate',
        'Height',
        'Weight',
        'HeightBand',
        'WeightBand',
        'Solecismic',
        '40Time',
        'Bench',
        'Agility',
        'BroadJump',
        'PosDrill',
        'Developed',
        'Grade',
        'Interviewed',
        'Conflicts',
        'Affinities',
        'Formations',
        'OrgOrder',
        'DesiredOrder',
        'Drafted',
        'DraftedOrder',
        'Marked',
        'DraftPosition',
        'RatedPosition',
        'CombineSum',
        'Rating',
        'Draftable',
        'VeryGood',
        'Good',
        'Average',
        'FairPoor',
        'SlotScore'
    ]

};
//end