/* draftman.app.js
 * 
 *      @lastupdated = 2014.08.25
 *      @ver = 0.1
 *
 * Changelog:
 * 
 *      0.1: initial public release, 2014.08.25
 */



/*
 * 
 */
function mainLoop(displayParams) {
    var req = indexedDB.open(draftmanConst.DB_NAME);
    
    /* Open database */
    
    req.onupgradeneeded = function(e) {
        var db = e.target.result;
        dbCreateStore(db, draftmanConst.DBINFO_STORE_NAME);
        dbCreateStore(db, draftmanConst.PLAYER_STORE_NAME);
        
    };
    
    req.onerror = function(e) {
        console.log(this.error);
    };
    
    req.onsuccess = function(e) {
        var db = this.result;
        console.log('mainLoop indexedDB.open success!');
        
        /* Event Listeners for file functions */
        
        draftmanID.importDraft.addEventListener('change', function(e) {
            importDraftListener(db, draftmanID.importDraft);
        });
        
        draftmanID.importSave.addEventListener('change', function(e) {
            importSaveListener(db, draftmanID.importSave);
        });
        
        draftmanID.importStelmack.addEventListener('change', function(e) {
            importStelmackListener(db, draftmanID.importStelmack);
        });
        
        /* Event Listeners for display functions */
        document.body.addEventListener('keydown', function(e) {
            processKey(db, e.keyCode);
        });
        
        
        
        /* Display handling */
        displayPage(db, displayParams);
        
        
    };
       
}

/*
 *  @param input
 */
function importDraftListener(db, input) {
    var files = input.files;
    var fileProcessList = []; //rookies.csv must be first!
    
    
    var found = {};
    found.rookies = false;
    found.playerInfo = false;
    found.draftPersonal = false;
    found.playersPersonal = false;
    found.playerRecord = false;
    
    var foundFile = {};
    
    
    for (var i = 0,f ; f = files[i]; i++) {
        if(f.name.match(draftmanConst.FILENAME_ROOKIES)) {
            found.rookies = true; //apparently array push results in incorrect order. Not sure how!
            foundFile.rookies = f;
        }
        
        else if (f.name.match(draftmanConst.FILENAME_PLAYER_INFO)) {
            found.playerInfo = true;
            foundFile.playerInfo = f;
        }
        else if (f.name.match(draftmanConst.FILENAME_DRAFT_PERSONAL)) {
            found.draftPersonal = true;
            foundFile.draftPersonal = f;
        }
        
        else if (f.name.match(draftmanConst.FILENAME_PLAYERS_PERSONAL)) {
            found.playersPersonal = true;
            foundFile.playersPersonal = f;
        }
        
        else if (f.name.match(draftmanConst.FILENAME_PLAYER_RECORD)) {
            found.playerRecord = true;
            foundFile.playerRecord = f;
        }
        
    }
    
    
    if (found.rookies == true) {
        fileProcessList.push(foundFile.rookies);
    }
    
    if (found.playerInfo == true) {
        fileProcessList.push(foundFile.playerInfo);
    }
    
    if (found.draftPersonal == true) {
        fileProcessList.push(foundFile.draftPersonal);
    }
    
    if (found.playersPersonal == true) {
        fileProcessList.push(foundFile.playersPersonal);
    }
    
    if (found.playerRecord == true) {
        fileProcessList.push(foundFile.playerRecord);
    }
    
    // Output messages.
    //msgDraftListener(found);
    
    // Process fileProcessList.
    for (var i = 0; i < fileProcessList.length; i++) {
        loadFile(db, fileProcessList[i]);
    }
    
    return;
}

/* 
 *
 */
 
function importStelmackListener(db, input) {
    var file = input.files[0];
    
    // checking of csv handled within.
    loadFile(db, file); 
    
    return;

}

/*
 *  @param input
 */
function importSaveListener(db, input) {
    var file = input.files[0];
    
    var reader = new FileReader();
    
    reader.onload = function(e) {
        var arrayData = JSON.parse('[' + e.target.result + ']');
        // Update Player store from uploaded file.
        loadSave(db, arrayData);
        
        // Update DB info from uploaded file.
        updateDbInfoRecord(db, getTimestamp(), 'lastModified');
        updateDbInfoRecord(db, file.name, 'draftClassName');
        
        //Update page -- notworking?
        displayPage(db, getCurDisplayParams());
        
    };
    
    reader.readAsText(file);
    
    return;
}

/*
 * 
 */
function loadFile(db, file) {
    Papa.parse(file, {
        complete: function(results) {
            var arrayData = results.data;
            
            // Process according to file type.
            processFile(db, file, arrayData);
            
            // Update general database info.
            updateDbInfoRecord(db,getTimestamp(),'lastModified');
            
            //Update page -- notworking?
            displayPage(db, getCurDisplayParams());
        }
    });
    
    return;
}

/*
 * 
 */
function processFile(db, file, arrayData) {
    
    var transaction = db.transaction(draftmanConst.PLAYER_STORE_NAME, 'readwrite');
    var store = transaction.objectStore(draftmanConst.PLAYER_STORE_NAME);
    
    if (file.name.match(draftmanConst.FILENAME_ROOKIES)) {
        // Remove header row.
        arrayData.shift();
        
        // Clear store.
        store.clear();
        
        // Add entries.
        for (var i = 0; i < arrayData.length; i++) {
            var data = arrayData[i];
            var pid = data[0];
            var params = {
                fileName : file.name,
                data : data,
            };
            var storeObj = getPlayerObj(params);;
            store.add(storeObj, pid);
        }
    }
    
    else if ((file.name.match(draftmanConst.FILENAME_PLAYER_INFO))
        || (file.name.match(draftmanConst.FILENAME_DRAFT_PERSONAL))
        || (file.name.match(draftmanConst.FILENAME_PLAYERS_PERSONAL))
        || (file.name.match(draftmanConst.FILENAME_PLAYER_RECORD))) {
        
        // Remove header row.
        arrayData.shift();
        
        // Get all from store, update each object, then put back.
        
        store.openCursor().onsuccess = function(e) {
            var cursor = e.target.result;
            
            if(cursor) {
                // cursor.value contains query result.
                // can operate synchronously now.
                
                // check current cursor against entire file for ID match.
                var cid = cursor.value.pid;
               
            
                for (var i = 0; i < arrayData.length; i++) {
                    var data = arrayData[i];
                    var pid = data[0];
                
                    if(cid == pid) {
                        var retrievedObj = cursor.value;
                        var params = {
                            fileName : file.name,
                            data : data,
                            retrievedObj : retrievedObj
                        };
                        var updatedObj = getPlayerObj(params);
                        
                        store.put(updatedObj, cid);
                    }
                    
                }
                
                cursor.continue();
            }
        };
    
        
    }
    
    else {
        
        /* There's one more possibility: a stelmack DA CSV */
        var headers = arrayData[0];
        
        if(fileValidateByHeaders(headers, 'STELMACK_EXPORT')) {
            
            // Remove header row.
            arrayData.shift();
            
            // Get all from store, update each object, put it back
            store.openCursor().onsuccess = function(e) {
            
                var cursor = e.target.result;
                
                if(cursor) {
                    // cursor.value contains query result.
                    // can operate synchronously now.
                   
                
                    for (var i = 0; i < arrayData.length; i++) {
                        var data = arrayData[i];
                        
                        
                        // Stelmack.csv doesn't have PID, so check by name
                        if(playerNameMatchStelmack(data,cursor)) {
                            var retrievedObj = cursor.value;
                            var params = {
                                fileName : draftmanConst.FILENAME_STELMACK_CSV,
                                data : data,
                                retrievedObj : retrievedObj
                            };
                            var updatedObj = getPlayerObj(params);
                            
                            store.put(updatedObj, cursor.value.pid);
                        }
                        
                        else {
                            //console.log(data[0] + ' ' + cursor.value);
                        }
                        
                    }
                
                    cursor.continue();
                }
            }
        }
        
        
    
    }
    
    transaction.oncomplete = function(e) {
        console.log('processFile finished on ' + file.name + '!');
    };
    
    transaction.onerror = function(e) {
        console.log(this.error);
    };
    
    return;
}


/*
 *  @param params: {fileName, data, (optional) retrievedObj}
 */
function getPlayerObj(params) {
    var p = {}; // player object to be returned.
    var d = params.data;
    
        if(params.fileName.match(draftmanConst.FILENAME_ROOKIES)) {
            p.pid = d[0];
            p.namL = d[1];
            p.namF = d[2];
            p.posG = d[3];
            p.coll = d[4];
            p.ht = d[5];
            p.wt = d[6];
            p.dash = d[7];
            p.sol = d[8];
            p.bench = d[9];
            p.agil = d[10];
            p.jmp = d[11];
            p.pspec = d[12];
            p.dev = d[13];
            p.gr = d[14];
            //p.grT = calcTrueGrade(p.posG, p.gr, p.dash, p.dev); not enough room/value in this metric.
            //p.grC = calcCombineGrade(p.posG, p.dash, p.sol, p.bench, p.agil, p.jmp, p.pspec);
            // could add p.truegrade(gr,dash[to check combine/nocombine],dev) and p.combine(combines..., posG)
        }
        
        else if (params.fileName.match(draftmanConst.FILENAME_PLAYER_INFO)) {
            // Modify existing retrieved object rather than return new one.
            p = params.retrievedObj;
            
            p.bY = d[16];
            p.bM = d[17];
            p.bD = d[18];
            //p.collegeNum = d[19];
            p.drRd = d[20];
            p.drPk = d[21];
            p.drTm = d[22];
            p.drYr = d[23];
            p.pos = d[5];
        }
        
        else if (params.fileName.match(draftmanConst.FILENAME_PLAYER_RECORD)) {
            // Modify existing retrieved object rather than return new one.
            p = params.retrievedObj;
            p.record = {};
            
            p.record.loy = d[9];
            p.record.win = d[10];
            p.record.pers = d[11];
            p.record.lead = d[12];
            p.record.intel = d[13];
            p.redFlag = d[14];
            p.vol = d[16];
            p.record.pop = d[20];
            
            // If the player is on a team (free agents are team 99, draft class team 49), mark as drafted.
            if((d[5] !== "99") && (d[5] !== "49")) {
              p.drafted = true;
            } /* else {
              p.drafted = false;
            } we don't actually want to undraft players marked drafted, right? */
        }
        else if (params.fileName.match(draftmanConst.FILENAME_DRAFT_PERSONAL)) {
            // Modify existing retrieved object rather than return new one.
            p = params.retrievedObj;
            p.bars = []; //initialize array of player bars.
            
            p.intvw = d[1];
            for (var i = 2; i <= 117; i++ ) {   // magic numbers determined by draft_personal.csv format.
                var skipped = [
                    9, 15, 16, 17, 18, 19, 36, 67, 73, 74, 75, 76, 77, 94
                ];  // these columns don't appear to be any bars.
                
                if(skipped.indexOf(i) == -1) { //if current index isn't a member of the skipped array.
                    p.bars.push(d[i]);
                }
            }
        }
        
        else if (params.fileName.match(draftmanConst.FILENAME_PLAYERS_PERSONAL)) {
        
                        
            // Modify existing retrieved object rather than return new one.
            p = params.retrievedObj;
            // initialize array of player bars for late free agency
            p.barsLFA = []; 
            // initialize overall ratings storage
            p.overall = {
                current:0,
                future:0, 
            };
            
            for (var i = 1; i <= 118; i++) { // players_personal.csv format.
                var skipped = [
                    8, 14, 15, 16, 17, 18, 35, 67, 73, 74, 75, 76, 77, 94,
                    59, 118 
                ]; 
                
                if(skipped.indexOf(i) == -1) { //if current index isn't in skipped array.
                    p.barsLFA.push(d[i]);
                }
                
                else if(i == 59) { //current overall
                    p.overall.current = d[i];
                }
                
                else if(i == 118) { //future overall
                    p.overall.future = d[i];
                }
            }
            
        }
        
        else if (params.fileName.match(draftmanConst.FILENAME_STELMACK_CSV)) {
            
            // Modify existing retrieved object rather than return new one.
            p = params.retrievedObj;
            
            // Store Stelmagic data
            p.stel = {
                d: d[30],
                v: d[31],
                g: d[32],
                a: d[33],
                f: d[34],
                s: d[35]
            };
            
        }
    
    return p;
}

/*
 * 
 */
function loadSave(db, arrayData) {
    var transaction = db.transaction(draftmanConst.PLAYER_STORE_NAME, 'readwrite');
    var store = transaction.objectStore(draftmanConst.PLAYER_STORE_NAME);

    // Overwrite existing data completely.
    store.clear();
    
    for (var i = 0; i < arrayData.length; i++) {
        var entry = arrayData[i];
        
        if(entry.pid) {
            var pid = entry.pid;
        }
        
        else {
            // Error handle? Missing pid key, so this file is wrong format.
        }
        
        var req = store.put(entry,pid);
        
        req.onerror = function(e) {
            console.log(this.error);
        }
    }
    
    transaction.oncomplete = function(e) {
        
        console.log('loadSave transaction complete.');
    };
    
    transaction.error = function(e) {
        console.log('loadSave error:');
        console.log(this.error);
    };
    
    return;
}

/*
 * 
 */ 
function exportSave() {
    var req = indexedDB.open(draftmanConst.DB_NAME);
    
    /* Open database */
    
    req.onupgradeneeded = function(e) {
        var db = e.target.result;
        dbCreateStore(db, draftmanConst.DBINFO_STORE_NAME);
        dbCreateStore(db, draftmanConst.PLAYER_STORE_NAME);
        
    };
    
    req.onsuccess = function(e) {
        var db = e.target.result;
        var content = [];
        var transaction = db.transaction(draftmanConst.PLAYER_STORE_NAME, 'readonly');
        var store = transaction.objectStore(draftmanConst.PLAYER_STORE_NAME);
        
        store.openCursor().onsuccess = function(e) {
            var cursor = e.target.result;
            
            if(cursor) {
                content.push(JSON.stringify(cursor.value));
                cursor.continue();
            }
        };
        
        store.openCursor().onerror = function(e) {
            console.log(this.error);
        };
        
        transaction.oncomplete = function(e) {
            var blob = new Blob([content]);
            var blobURL = window.URL.createObjectURL(blob);
            
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function() {
                var a = document.createElement('a');
                a.href = window.URL.createObjectURL(xhr.response);
                a.download = draftmanConst.DRAFTMAN_SAVENAME_DEFAULT;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                delete a;
            };
            
            xhr.open('GET', blobURL);
            xhr.send();
            
        };
        
        transaction.onerror = function(e) {
            console.log(this.error);
        };
    };
    
    return;
}




/*
 * 
 */
function dbCreateStore(db, storeName) {
    if(!db.objectStoreNames.contains(storeName)) {
        
        var store = db.createObjectStore(storeName);
        
        var indexList = [
            'sole', 'dash', 'agil', 'bench', 'jmp', 'pspec', 'gr', 'dev', 'namL', 'namF', 'round'
        ];
        if(storeName.match(draftmanConst.PLAYER_STORE_NAME)) {
            // Create indexes to search over.            
            store.createIndex("sole", "sole", { unique: false });
            store.createIndex("dash", "dash", { unique: false });
            store.createIndex("agil", "agil", { unique: false });
            store.createIndex("bench", "bench", { unique: false });
            store.createIndex("jmp", "jmp", { unique: false });
            store.createIndex("pspec", "pspec", { unique: false });
            store.createIndex("gr", "gr", { unique: false });
            store.createIndex("dev", "dev", { unique: false });
            store.createIndex("namL", "namL", { unique: false });
            store.createIndex("namF", "namF", { unique: false });
            store.createIndex("round", "round", { unique: false });
            // also add in "combine score" later.
        }
    }
    
    
    
    
    return;
}

/*
 *  @param db
 *  @param entry
 *  @param key
 */
function updateDbInfoRecord(db, entry, key) {
    var transaction = db.transaction(draftmanConst.DBINFO_STORE_NAME, 'readwrite');
    var store = transaction.objectStore(draftmanConst.DBINFO_STORE_NAME);
    
    store.put(entry,key);
    
    transaction.oncomplete = function(e) {
        console.log('Updated ' +draftmanConst.DBINFO_STORE_NAME + ':' + key + ' with entry: ' + entry + '.');
    }; 
    
    transaction.error = function(e) {
        console.log(this.error);
    };
    
    return;
}

/*
 *  @param db
 *  @param pid
 *  @param updates
 */
function dbUpdatePlayerRecord(db, pid, updates) {
    var transaction = db.transaction(draftmanConst.PLAYER_STORE_NAME, 'readwrite');
    var store = transaction.objectStore(draftmanConst.PLAYER_STORE_NAME);
    
    // Modify a retrieved object with specified attribute/value pairs.
    
    var req = store.get(pid);
    
    req.onerror = function(e) {
        console.log('dbUpdatePlayerRecord error: there is no record stored for player pid:' + pid);
    };
    
    req.onsuccess = function(e) {
        var entry = req.result; //retrievedObject
        
        for (i = 0; i < updates.length; i++) {
            var attr = updates[i].attr;
            var value = updates[i].value;
            
            entry[attr] = value;
            store.put(entry,pid);
            console.log('dbUpdatePlayerRecord modified player pid:' + pid + ' on attr:' + attr + ' with value:' + value);
        }
    };
    
    return;
}

/*
 *  @param sourcePage
 *      --mainly, this function is here to call displayPage with
 *      various, different callbacks.
 * DEPRECATED
 */
function handleDisplay(db, sourcePage, params) {
    switch(sourcePage) {
        case 'list':
            displayPage(db, displayCallbackList, params);
            break;
        case 'index':
        default:
            displayPage(db, displayCallbackIndex, params);
    }

    return;
}
/* handleDisplay sub functions go here */

function handleDisplayClick(link) {
    
    var req = indexedDB.open(draftmanConst.DB_NAME);
    req.onupgradeneeded = function(e) {
        var db = e.target.result;
        dbCreateStore(db, draftmanConst.DBINFO_STORE_NAME);
        dbCreateStore(db, draftmanConst.PLAYER_STORE_NAME);
        
    };
    
    req.onerror = function(e) {
        console.log(this.error);
    };
    
    req.onsuccess = function(e) {
        var li = link.parentNode;
        var ul = li.parentNode;
        var displayParams = {};
        var db = this.result;
        console.log('handleDisplayClick indexedDB.open success!');
        
        if(ul.id == 'posMenu') {
            
            
            /* Handle class changes to menu */
            for (var i = 0; i < ul.childNodes.length; i++) {
                if(ul.childNodes[i].nodeType == Node.ELEMENT_NODE) {
                    $(ul.childNodes[i]).removeClass(draftmanConst.ACTIVE_CLASS);
                }
            }
            $(li).addClass(draftmanConst.ACTIVE_CLASS);
            
        }
        
        else if(ul.id == 'showOnlyMenu') {
            
            /* Toggle */
            if ($(li).hasClass(draftmanConst.ACTIVE_CLASS)) {
                $(li).removeClass(draftmanConst.ACTIVE_CLASS);
            } 
            else {
                $(li).addClass(draftmanConst.ACTIVE_CLASS);
            }
            
            
        }
        
        else if (ul.id == 'gradeMenu') {

            /* Toggle */ //What behavior should this be? It can be toggle, or switch on single/switch off rest.
            if ($(li).hasClass(draftmanConst.ACTIVE_CLASS)) {
                $(li).removeClass(draftmanConst.ACTIVE_CLASS);
            } 
            else {
                $(li).addClass(draftmanConst.ACTIVE_CLASS);
            }
            
        
           
        }
        
        /* Display page */
        displayPage(db, getCurDisplayParams());
        
    };
    
    
    
    
    return;
}

function displayPage(db, params) {
    /* If eventually we have different kinds, handle that within params in this function.
     * Use different callback functions for different params 
     */
    var transaction = db.transaction(draftmanConst.PLAYER_STORE_NAME, 'readwrite');
    var store = transaction.objectStore(draftmanConst.PLAYER_STORE_NAME);
    var items = [];
    
    transaction.oncomplete = function(e) {
        displayCallbackDraftman(items, params);

    };
    
    
    var cursorRequest = store.index('gr').openCursor(null, 'prev'); //sort by grade, prev=desc
    //There needs to be error handling in case store.index doesn't work!
    
    cursorRequest.onerror = function(e) {
        console.log(this.error);
    };
    
    cursorRequest.onsuccess = function(e) {
        var cursor = e.target.result;
        if (cursor) {
            items.push(cursor.value);
            cursor.continue();
        }
    };
    
    return;
}

function displayCallbackDraftman(items, params) {
               
    if(items.length > 0) {
        
        // Display output.
        displayDraftList(items, params);
        
        
        // Set up key interface.
        draftmanGlobal.scrollNodeParent = document.getElementById('tbodyPosAll');
        draftmanGlobal.scrollNodeList = getScrollNodeList(draftmanGlobal.scrollNodeParent);
        
        if(draftmanGlobal.scrollNodeList.length > 0) {
            // Automatically select the first player in the list.
            clickPlayerRow(draftmanGlobal.scrollNodeList[0],draftmanGlobal.scrollNodeParent.id);
            //Automatically make scrolling active always (in index)
            draftmanGlobal.scrollToggle = true;
            
            /* handle scroll activation */
            $(document).on('click', function(e) {
            
                if( (draftmanGlobal.hasOwnProperty('scrollNodeParent')) && (draftmanGlobal.scrollNodeParent.hasOwnProperty('id')) ) {
                    handleScrollToggleClick(e, draftmanGlobal.scrollNodeParent.id);
                }
            });
        }
        
        else {
            // If there's no players that made the list
            displayNoPlayers();
        }
        
    }
    
    else {  // no items were returned; store is empty
        displayNoClassImported();
    }
    
    return;
}

/*DEPRECATED*/
function displayCallbackList(items, params) {
    
    if(items.length > 0) {
        // Display output.
        //displayListTypesMenu();
        displayDraft(items,params);
        
         // Set up key interface.
        draftmanGlobal.scrollNodeParent = document.getElementById('tbodyPosAll');
        draftmanGlobal.scrollNodeList = getScrollNodeList(draftmanGlobal.scrollNodeParent);
        // Automatically select the first player in the list.
        clickPlayerRow(draftmanGlobal.scrollNodeList[0],draftmanGlobal.scrollNodeParent.id);
        //Automatically make scrolling active always (in index)
        draftmanGlobal.scrollToggle = true;
        
        
    }
    
    else {  // no items were returned; store is empty
        displayNoClassImported();
    }
    
    /* handle scroll activation */
    $(document).on('click', function(e) {
        handleScrollToggleClick(e, draftmanGlobal.scrollNodeParent.id);
    });
    
    return;
}
/* disp subfunctions go here; i.e, key presses, pagination */

function displayDraftList(items, params) {

    var content = [];
    var playerListClass= '';
    if (params.hasOwnProperty('posG') && params.posG.length == 1) {
        //If more than one position group is to be displayed, mark the table as such.
        playerListClass = 'singlePosG';
    }
    
    content.push(
    '<table id="playerList" class="'+playerListClass+'"cellpadding = "3">'
        + '<thead><tr>'
            + '<th class="order">#</th>'
            + '<th class="pos">pos</th>' 
            + '<th class="nam">name</th>'
            + '<th class="ht"><abbr title="Height">Ht</abbr></th>'
            + '<th class="wt"><abbr title="Weight">Wt</abbr></th>'
            + '<th class="sol">Sol</th>'
            + '<th class="dash">40</th>'
            + '<th class="bench">Bench</th>'
            + '<th class="agil">Agil</th>'
            + '<th class="jmp"><abbr title="Broad Jump">BrJ</abbr></th>'
            + '<th class="pspec"><abbr title="Position Drills">Drills</abbr></th>'
            + '<th class="dev"><abbr title="% developed">Dev</abbr></th>'
            + '<th class="gr">Grade</th>'
            //+ '<th class="grC"><abbr title="Combine Grade">Comb</abbr></th>'
            + '<th class="stelD"><abbr title="Stelmagic: Draftable?">D?</abbr></th>'
            + '<th class="stelMax"><abbr title="Stelmagic: Max Likelihood & Percentage">sM</abbr></th>'
            + '<th class="round"><abbr title="Round Grade">Rd</abbr></th>'
            + '<th class="notes"></th>'
            + '<th class="interview"></th>'
            
        + '</tr></thead>'
    );
    content.push('<tbody id="tbodyPosAll">');
    
    var j = 0; //true index, since i iterates even for skipped players.
    for (var i = 0; i < items.length; i++) {
        var p = processPlayerObjDisplay(items[i]); // player object.
        var classes = [];
        var stelMagic = {};
        
        if (p.reject == true) { classes.push('reject'); }
        if (p.mark == true) { classes.push('mark'); }
        if (p.supermark == true) { classes.push('supermark'); }
        if (p.drafted == true) { classes.push('drafted'); }
        if (p.intvw == 1) { classes.push('intvw'); }
        
        /* Handle stelmack if present, and player has combine */
        if ((typeof(p.stel) != "undefined") && (p.agil !== 0)) {
            stelMagic.d = p.stel.d;
            stelMagic.sM = maxStelmagic(p.stel);
        }
        
        else {
            console.log(p.stel);
            stelMagic.d = '-';
            stelMagic.sM = {
                type: '',
                max: ''
            }
        }
        
        var requirements = [];
        /* handle params */
        if (params.hasOwnProperty('posG')) { 
            if (params.posG.indexOf(p.posG) < 0) {
                // player's p.posG isn't in array of posG's to display.
                
                requirements.push(false);
            }
        }
        
        if ((params.hasOwnProperty('status')) && (params.status.length > 0)) {
            /* If the player matches ANY of the given status markers, display. Otherwise, don't. */
            
            var passedTest = false;
            for (var k = 0; k < params.status.length; k++) {
                if( p.hasOwnProperty(params.status[k]) && (p[params.status[k]] == true) ) {
                   passedTest = true;
                }
            }
            
            if(passedTest == false) {
                //if none of the status markers were matched, don't display.
                requirements.push(false);
            }
            
    
        }
        
        if ( (params.hasOwnProperty('grade')) && (params.grade.length > 0) ) {
            /* Current implementation: if player matches ANY of given grades, display.
             */
            var passedTest = false;
            
            for (var k = 0; k < params.grade.length; k++) {
                
                if ( p.hasOwnProperty('round') && (p.round == params.grade[k]) ) {
                    passedTest = true;
                }
           
            }
            
            if(passedTest == false) {
                //if none of the grade markers were matched, don't display.
                requirements.push(false);
            }
            
        }
        
        /* If status isn't a parameter, OR, status is a parameter but drafted isn't present, don't display drafted. */
        if ( !params.hasOwnProperty('status') 
            || ( (params.hasOwnProperty('status')) && (params.status.indexOf('drafted') < 0) )
        ) { //params doesn't have a 'status' property
            requirements.push(p.drafted !== true);
        }
        
        /* And the same for reject.*/
        if ( !params.hasOwnProperty('status') 
            || ( (params.hasOwnProperty('status')) && (params.status.indexOf('reject') < 0) ) 
        ) { //params doesn't have a 'status' property
            requirements.push(p.reject !== true);
        }
        
        if (satisfyAll(requirements)) {    // don't show reject players here.
            
            var stDev = getStDevs(p);
            var rowID = 'posAll' + j;
            j++;
            
            content.push('<tr id="' + rowID + '" onclick="clickPlayerRow(this,\'tbodyPosAll\')" class="' + classes.join(' ') + '" title="'+p.namF+' ' +p.namL+'">'
                + '<td class="order">' + (j) + '</td>'
                + '<td class="pos">' + p.posG + '</td>'
                + '<td class="nam" id="' + p.pid + '">' + p.namF[0] + '.' + p.namL + '</td>'
                + '<td class="ht">' + p.dispHt + '</td>'
                + '<td class="wt">' + p.wt + '</td>'
                + '<td class="sol '+p.q.sol+'" onmouseover="highlightCorrelations(this,\''+p.posG+'\',\'sol\',true)" onmouseout="highlightCorrelations(this,\''+p.posG+'\',\'sol\',false)" title="' + p.sol + '">' + stDev.sol + '</td>'
                + '<td class="dash '+p.q.dash+'" onmouseover="highlightCorrelations(this,\''+p.posG+'\',\'dash\',true)" onmouseout="highlightCorrelations(this,\''+p.posG+'\',\'dash\',false)" title="' + p.dispDash + '">' + stDev.dash + '</td>'
                + '<td class="bench '+p.q.bench+'" onmouseover="highlightCorrelations(this,\''+p.posG+'\',\'bench\',true)" onmouseout="highlightCorrelations(this,\''+p.posG+'\',\'bench\',false)" title="' + p.bench + '">' + stDev.bench + '</td>'
                + '<td class="agil '+p.q.agil+'" onmouseover="highlightCorrelations(this,\''+p.posG+'\',\'agil\',true)" onmouseout="highlightCorrelations(this,\''+p.posG+'\',\'agil\',false)" title="' + p.agil + '">' + stDev.agil + '</td>'
                + '<td class="jmp '+p.q.jmp+'" onmouseover="highlightCorrelations(this,\''+p.posG+'\',\'jmp\',true)" onmouseout="highlightCorrelations(this,\''+p.posG+'\',\'jmp\',false)" title="' + p.jmp + '">' + stDev.jmp + '</td>'
                + '<td class="pspec '+p.q.pspec+'" onmouseover="highlightCorrelations(this,\''+p.posG+'\',\'pspec\',true)" onmouseout="highlightCorrelations(this,\''+p.posG+'\',\'pspec\',false)" title="' + p.pspec + '">' + stDev.pspec + '</td>'
                + '<td class="dev">' + p.dev + '%</td>'
                + '<td class="gr">' + p.dispGr + '</td>'
                //+ '<td class="grC">' + p.grC + '</td>'
                + '<td class="stelD">' + stelMagic.d + '</td>'
                + '<td class="stelMax">' + stelMagic.sM.type + stelMagic.sM.max + '</td>'
                + '<td class="round">' + displayFormatRoundGrade(p.round) + '</td>'
                + '<td class="notes">' + (p.notes ? draftmanConst.NOTE_ICON : '') + '</td>'
                + '<td class="interview">' + (p.interviewCandidate ? draftmanConst.INTERVIEW_ICON : '') + '</td>'
                + '</tr>'
            );
        }
    }
    
    content.push('</tbody</table>');
    
    // draw player list.
    draftmanID.drPlayerTable.innerHTML = content.join('');
    
    //Also, if there's a #mainmsg, clear it.
    $('body').removeClass('hasMainmsg');
    draftmanID.mainmsg.innerHTML = '';
    
    return;
}

function displayNoPlayers() {
    draftmanID.drPlayerTable.innerHTML = 'No players found!';
}

/*
 * @param state: bool, determines if function turns on or off the correlation display.
 */
function highlightCorrelations(cell,posG,cat,state) {
    if($(cell).parent().hasClass('selected')) { //only highlight for actively selected players.
        var lookupTable = draftmanTables.combineCorrelations; 
        
        if(lookupTable.hasOwnProperty(posG) && lookupTable[posG].hasOwnProperty(cat)) {        
            // Check that position exists in lookup table, then check that category does under said position.
            // not all positions (such as LS) or all categories will have correlations.
            var correlatedBars = lookupTable[posG][cat];
            for (var i = 0; i < correlatedBars.length; i++) {
                if (state == true) {
                    $('#'+correlatedBars[i]).addClass('highlight_correlation');
                }
                else {
                    $('#'+correlatedBars[i]).removeClass('highlight_correlation');
                }
            }
            
            if (state == true) {    //also highlight cell
                $(cell).addClass('highlight_correlation');
            }
            
            else {
                $(cell).removeClass('highlight_correlation');
            }
        
        }
        
    }
    return;
}


/* DEPRECATED */
function contentPlayerTableStart() {
    var content = '<table id="posAllTable" cellpadding = "3">'
        + '<thead><tr>'
            + '<th class="order">#</th>'
            + '<th class="pos">pos</th>' 
            + '<th class="nam">name</th>'
            + '<th class="ht"><abbr title="Height">Ht</abbr></th>'
            + '<th class="wt"><abbr title="Weight">Wt</abbr></th>'
            + '<th class="sol">Sol</th>'
            + '<th class="dash">40</th>'
            + '<th class="bench">Bench</th>'
            + '<th class="agil">Agil</th>'
            + '<th class="jmp"><abbr title="Broad Jump">BrJ</abbr></th>'
            + '<th class="pspec"><abbr title="Position Drills">Drills</abbr></th>'
            + '<th class="dev"><abbr title="% developed">Dev</abbr></th>'
            + '<th class="gr">Grade</th>'
            //+ '<th class="grC"><abbr title="Combine Grade">Comb</abbr></th>'
            + '<th class="round"><abbr title="Round Grade">Rd</abbr></th>'
            + '<th class="notes"></th>'
            + '<th class="interview"></th>'
            
        + '</tr></thead>';
 
    return content;
    
}

function displayNoClassImported() {
    $(draftmanID.mainmsg).load(draftmanFile.noClassImported);
    $('body').addClass('hasMainmsg'); //for different menus to not be displayed when mainmsg is present.
    return;
}

/* data manipulation */
function processPlayerObjDisplay(p) {
    if(!p.pos) {
        p.pos = p.posG
    }
    // Format numbers
    p.dispHt = (p.ht - (p.ht % 12))/12 + '\'' + (p.ht % 12);
    p.dispGr = (p.gr / 10).toFixed(1);
    //p.dispGrT = (p.grT / 10).toFixed(1);
    if (p.dash > 0) {
        p.dispDash = (p.dash / 100).toFixed(2);
    } else { p.dispDash = draftmanConst.NO_COMBINE_SCORE_DISPLAY; }
    
    if (p.agil > 0) {
        p.dispAgil = (p.agil / 100).toFixed(2);
    } else { p.dispAgil = draftmanConst.NO_COMBINE_SCORE_DISPLAY }
    
    // Format missing combines.
    var combines = [
        'sol', 'dash', 'agil', 'bench', 'jmp', 'pspec'
    ];
    
    for (var i = 0; i < combines.length; i++) {
        if(p[combines[i]] == 0) {
            p[combines[i]] = draftmanConst.NO_COMBINE_SCORE_DISPLAY;
            // If a combine score is zero, display differently.
        }
    }    
    
    //  Measure quality of the player's metrics.
    p.q = {}; 
    
    p.q.sol = calcQual(p.posG, p.sol, 'sol');
    p.q.dash = calcQual(p.posG, p.dash, 'dash');
    p.q.agil = calcQual(p.posG, p.agil, 'agil');
    p.q.bench = calcQual(p.posG, p.bench, 'bench');
    p.q.jmp = calcQual(p.posG, p.jmp, 'jmp');
    p.q.pspec = calcQual(p.posG, p.pspec, 'pspec');
    
    //p.q.combine overall score
    return p;
}

function calcQual(posG, metric, cat) {
    var q = ''; /* quality score */
    
    var qTable = draftmanTables.combineQuality;
    
    // Assign quality score only if posG+metric are in the table.
    if ( qTable.hasOwnProperty(posG) && qTable[posG].hasOwnProperty(cat) ) {
        var lo = qTable[posG][cat].lo;
        var hi = qTable[posG][cat].hi;
        var top = qTable[posG][cat].top;
        
        if(combineWorseThan(metric,lo, cat)) {
            q = 'combine_lo';
        }
        
        else if (combineBetterEq(metric,top,cat)) {
            q = 'combine_top';
        }
        
        else if(combineBetterEq(metric,hi,cat)) {
            q = 'combine_hi';
        }
        
    }
    
    return q;
}

function getStDevs(p) {
    var i, pCat, pDelta, pStDev;
    var data = draftmanTables.combineData;
    
    var combines = [
        {name: 'dash', bestHigh: false},
        {name: 'sol', bestHigh: true},
        {name: 'bench', bestHigh: true},
        {name: 'agil', bestHigh: false},
        {name: 'jmp', bestHigh: true},
        {name: 'pspec', bestHigh: true}
    ];
    
    var stDev = {};
    
    for (i = 0; i < combines.length; i++) {
        pCat = combines[i].name;
        
        if((p.posG !== 'LS') && !isNaN(p[pCat])) {
            
            if(combines[i].bestHigh === true) {
                pDelta = p[pCat] - data[p.posG][pCat].avg;
            }
            
            else {
                /* dash and agility -- lower is better*/
                pDelta = data[p.posG][pCat].avg - (p[pCat]/100);
            }
            
            pStDev = (pDelta / data[p.posG][pCat].stDev).toFixed(2);
            
            /* Format positive numbers */
           
            if (pStDev >= 0) {
                pStDev = '+' + pStDev;
            }
            
            stDev[combines[i].name] = pStDev;
        } else {
          stDev[combines[i].name] = '&mdash;';
        }
    }
    
    
    return stDev;
}
/* deprecate
function calcCombineGrade(posG, dash, sol, bench, agil, jmp, pspec) {
    var grC = 0;
    var grades = {};
    var boundaries = draftmanTables.combineGradeBoundaries;
    var weights = draftmanTables.combineGradeWeights;
    var combines = [
        'dash', 'sol', 'bench', 'agil', 'jmp', 'pspec'
    ];

    var results = [
        dash, sol, bench, agil, jmp, pspec
    ];
    
    var arrayPosG = [
        'QB', 'RB', 'FB', 'TE', 'WR', 'T', 'G', 'C', 'DE', 'DT', 'ILB', 'OLB', 'CB', 'S', 'K', 'P', 'LS'
    ];
    
    
    if((posG !== 'LS') && (dash > 0)) {   //exclude Long Snappers and combine skippers.
        // Calculate grades for each category.
        for (var i = 0; i < combines.length; i++) {
            var cat = combines[i];
            var bound = boundaries[posG][cat];
            var score = results[i];
            
            //belowMin (guarantee 0)
            if (combineWorseThan(score, bound.min, cat)) {
                grades[cat] = 0;
            }
            
            //min-to-bad: 0-20 contribution to score
            else if ((combineBetterEq(score, bound.min, cat)) && (combineWorseThan(score, bound.bad, cat))) {
                grades[cat] = (0.20) * ( (score - bound.min) / bound.bad );
            }
            
            //bad-to-good (midrange): 30-80 contribution to score
            else if ((combineBetterEq(score, bound.bad, cat)) && (combineWorseThan(score, bound.good, cat))) {
                grades[cat] = (0.5) * ( (score - bound.bad) / bound.good ); //width of contribution range
                grades[cat] += 0.30; //offset
            }
            
            //good-to-max: 85-100 contribution to scores
            else if ((combineBetterEq(score, bound.good, cat)) && (combineWorseThan(score, bound.max, cat)))  {
                grades[cat] = (0.15) * ( (score - bound.good) / bound.max );
                grades[cat] += 0.85;
            }
            
            //aboveMax (guarantee 100)
            else if (combineBetterEq(score, bound.max, cat)) {
                grades[cat] = 1.0;
            }
            
            else {
                grades[cat] = 0; 
            }
            
            // With grade calculated, apply position-specific weights for this category
            
            
            grades[cat] = grades[cat] * weights[posG][cat];
            
            
        }
        
        // With grades for each combine category now calculated and weighted, average and format as percentage to two decimals.
        
        var numWeights = 0;
        for (var i = 0; i < combines.length; i++) {  

            if(weights[posG][combines[i]] > 0) {
                grC += 100 * grades[combines[i]] * weights[posG][combines[i]];
                numWeights += weights[posG][combines[i]];
            }
        }
   
        
        
        grC =  ( (grC/numWeights) - 30).toFixed(1); 
        //-30 for normalizing. That is, if all the player's scores are on the bottom edge just before the 
        // "lo" cliff, he should have a normalized combine score of close to 0.
    }
    
    else { // Long Snappers and No Combine guys get 0.
        grC = 0;
    }
    
    console.log(results);
            console.log(posG);
            console.log(grades);
            console.log(numWeights);
            console.log(grC);
    return grC;
}     */

function combineBetterEq(a, b, cat) {
    var result = false;
    if ((cat == 'dash') || (cat == 'agil')) {
        result = (a <= b);
    }
    else {
        result = (a >= b);
    }
    
    return result;
}

function combineWorseThan(a, b, cat) {
    var result = false;
    
    if ((cat == 'dash') || (cat == 'agil')) {
        result = (a > b);
    }
    else {
        result = (a < b);
    }
    
    return result;
}

function calcCombineStDev(posG, cat, score) {
    var stDev = false;
    
    
    
    return stDev;
}

/* key interface subfunctions */

function processKey(db, keyCode) {
    //console.log(keyCode);
    
    /* Test to make sure focus isn't on textarea, and also that scrollToggle is on */
    var elem = document.activeElement;

    if ((draftmanGlobal.scrollToggle == true) && (elem.id !== draftmanIDNames.draftmanNotepad)) {
        // Get current actively selected player.
        var elem = draftmanGlobal.scrollNodeList[draftmanGlobal.scrollCount]; // this should properly be named "row", i guess.
        
        var pid = elem.childNodes[2].id;
        
        // If L/R arrow, attempt to change parents. Depends on current parent.
    
        // If up/down keys, scroll through list under current parent.
        if(keyCode == draftmanConst.KEYCODE_DOWN) {
            console.log(draftmanGlobal.scrollCount);
            if(draftmanGlobal.scrollCount < draftmanGlobal.scrollNodeList.length -1) { 
                                
                draftmanGlobal.scrollCount++;
                
                var smoothScroll = draftmanGlobal.scrollCount;
                if (draftmanGlobal.scrollNodeList[smoothScroll+2]) {
                    smoothScroll += 2;
                }
                
                var nextElement = draftmanGlobal.scrollNodeList[draftmanGlobal.scrollCount];
                clickPlayerRow(nextElement,draftmanGlobal.scrollNodeParent.id);
                
                draftmanGlobal.scrollNodeList[smoothScroll].scrollIntoView(false);
            }
        }
        
        else if(keyCode == draftmanConst.KEYCODE_UP) {
            if(draftmanGlobal.scrollCount > 0) {
                draftmanGlobal.scrollCount--;
                var smoothScroll = draftmanGlobal.scrollCount;
                if (draftmanGlobal.scrollNodeList[smoothScroll+2]) {
                    smoothScroll += 2;
                }
                
                var nextElement = draftmanGlobal.scrollNodeList[draftmanGlobal.scrollCount];
                clickPlayerRow(nextElement,draftmanGlobal.scrollNodeParent.id);
                
                draftmanGlobal.scrollNodeList[smoothScroll].scrollIntoView(false);
            }
        }
        
        else if(keyCode == draftmanConst.KEYCODE_REJECT) {
            var result = dbPlayerAction(db, pid, elem, draftmanConst.ACTION_REJECT);
        }
        
        else if(keyCode == draftmanConst.KEYCODE_MARK) {
            
            var result = dbPlayerAction(db, pid, elem, draftmanConst.ACTION_MARK);
        }
        
        else if(keyCode == draftmanConst.KEYCODE_SUPERMARK) {
            var result = dbPlayerAction(db, pid, elem, draftmanConst.ACTION_SUPERMARK);
        }
        
        else if(keyCode == draftmanConst.KEYCODE_INTERVIEW) {
            var result = dbPlayerAction(db, pid, elem, draftmanConst.ACTION_INTERVIEW);
        }
        
        else if(keyCode == draftmanConst.KEYCODE_DRAFTED) {
            var result = dbPlayerAction(db, pid, elem, draftmanConst.ACTION_DRAFTED);
        }
         
        else if(draftmanConst.roundGradeKeyCodes.indexOf(keyCode) >= 0) {   //key is one of the many 'assign round grade' keycodes
            //Give the player a round grade.
            var roundGrade;
            
            if( (keyCode == draftmanConst.KEYCODE_1) || (keyCode == draftmanConst.KEYCODE_NUM1) ){
                roundGrade = 1;
            }
            
            else if ( (keyCode == draftmanConst.KEYCODE_2) || (keyCode == draftmanConst.KEYCODE_NUM2) ) {
                roundGrade = 2;
            }
            
            else if ( (keyCode == draftmanConst.KEYCODE_3) || (keyCode == draftmanConst.KEYCODE_NUM3) ) {
                roundGrade = 3;
            }
            
            else if ( (keyCode == draftmanConst.KEYCODE_4) || (keyCode == draftmanConst.KEYCODE_NUM4) ) {
                roundGrade = 4;
            }
            
            else if ( (keyCode == draftmanConst.KEYCODE_5) || (keyCode == draftmanConst.KEYCODE_NUM5) ) {
                roundGrade = 5;
            }
            
            else if ( (keyCode == draftmanConst.KEYCODE_6) || (keyCode == draftmanConst.KEYCODE_NUM6) ) {
                roundGrade = 6;
            }
            
            else if ( (keyCode == draftmanConst.KEYCODE_7) || (keyCode == draftmanConst.KEYCODE_NUM7) ) {
                roundGrade = 7;
            }
            
            else if ( (keyCode == draftmanConst.KEYCODE_FA) ) {
                roundGrade = 8;
            }
            else { // keyCode == 0 or num0
                roundGrade = 0;
            }
            
            dbPlayerRoundGrade(db, pid, elem, roundGrade);
        }
    }
    
   
    
    // If < > buttons...
    
    return;
}

function getScrollNodeList(node) {
    var scrollNodeList = [];
    
    if(!(node === null)) {
        var tbodyChildren = node.childNodes;
        for (var i = 0; i < tbodyChildren.length; i++) {
            scrollNodeList.push(document.getElementById(tbodyChildren[i].id));
        }

    }
    return scrollNodeList;
}

function handleScrollToggleClick(e, id) {
    if (!$(e.target).closest('#'+id).length) {
        draftmanGlobal.scrollToggle = false;
    }
    
    else {
        draftmanGlobal.scrollToggle = true;
    }
    
    return;
}

function clickPlayerRow(row, parentID) {
        
    // Mark all rows as not selected
    var sisterNodes = document.getElementById(parentID).childNodes;
    for (var i = 0; i < sisterNodes.length; i++) {
        $("#"+sisterNodes[i].id).removeClass('selected');
    }
    
    // Mark row as selected if not already.
    if(row.className !== 'selected') {
        $(row).addClass('selected');
        // Display player in Info Pane
        displayPlayerInfoPane(row);
    }
    
    draftmanGlobal.scrollCount = row.id.replace(/[^0-9]/g, '');
    //console.log(draftmanGlobal.scrollCount);

    
 
    return;
    
}

/* interface Action Results */

function displayPlayerInfoPane(row) {
    var pid = row.childNodes[2].id;
    
    //have to open up separate DB transaction, ew
    var req = indexedDB.open(draftmanConst.DB_NAME);
    
    req.onupgradeneeded = function(e) { // should never get here, though, right?
        var db = e.target.result;
        dbCreateStore(db, draftmanConst.DBINFO_STORE_NAME);
        dbCreateStore(db, draftmanConst.PLAYER_STORE_NAME);
    };
    
    req.onsuccess = function(e) {
        var db = e.target.result;
        outputPlayerInfoPane(db, pid);
    };
    
    return;
}

function outputPlayerInfoPane(db, pid) {
    var transaction = db.transaction(draftmanConst.PLAYER_STORE_NAME, 'readonly');
    var store = transaction.objectStore(draftmanConst.PLAYER_STORE_NAME);
        
        
    var req = store.get(pid);
        
    req.onerror = function(e) {
        console.log('outPlayerInfoPane error: no player found on pid:' + pid);
    };
        
    req.onsuccess = function(e) {
        var result = req.result;
        drawPlayerOverview(result);
        drawPlayerBars(result);
        drawNotepad(db, pid, result);
    };
        
    return;
}

function drawPlayerOverview(result) {
    var playerInfoHTML;
    var playerNameHTML;
    var stelmagicHTML = '';
    var playerRatingsDisplay = '';
    var playerRecordInline = '';
    var recordVol = '';
    var p = processPlayerObjDisplay(result);
    var stDev = getStDevs(p);
    var redFlag = '';
    
    if(result.hasOwnProperty('pos')) {
        result.pos = result.posG;
    }
    
    if(result.hasOwnProperty('redFlag') && (result.redFlag == 1)) {
        redFlag = draftmanConst.RED_FLAG_ICON;
    }
    
    if(result.hasOwnProperty('overall')) {
        /* Late FA information on player is available */
        
        playerRatingsDisplay = '<h3>' 
            + result.overall.current 
            + ' / '
            + result.overall.future
        + '</h3>';
        
        if(result.hasOwnProperty('vol')) {
            recordVol = result.vol;
        }
        
        playerRecordInline = '<table class="playerCombineInline">'
            + '<thead><tr>'
                + '<td title="Intelligence">intel</td>'
                + '<td title="Loyalty">loyal</td>'
                + '<td title="Play for Winner">win</td>'
                + '<td title="Leadership">lead</td>'
                + '<td title="Personality">pers</td>'
                + '<td title="Volatility">vol</td>'
                + '<td title="Fan Popularity">pop</td>'
            + '</tr></thead>'
            + '<tbody><tr>'
                + '<td>' + result.record.intel + '</td>'
                + '<td>' + result.record.loy + '</td>'
                + '<td>' + result.record.win + '</td>'
                + '<td>' + result.record.lead + '</td>'
                + '<td>' + result.record.pers + '</td>'
                + '<td>' + recordVol + '</td>'
                + '<td>' + result.record.pop + '</td>'
            + '</tr></tbody>'
        +'</table>';
    }
    
    // Draw player name.
    playerNameHTML = '<h2>' + redFlag + result.pos + ' ' + result.namF + ' ' + result.namL + '</h2>';
    playerNameHTML += playerRatingsDisplay;
    draftmanID.drInfoPlayerName.innerHTML = playerNameHTML;
    
    // Draw his combine scores & other overview info.
    playerInfoHTML = '<p class="playerAttributes">' + p.dispHt + ', ' + p.wt + '</p>';
    playerInfoHTML += '<table class="playerCombineInline">'
            + '<thead><tr class="">'
                + '<td>sol</td>'
                + '<td>40</td>'
                + '<td>Bench</td>'
                + '<td>Agil</td>'
                + '<td>BrJ</td>'
                + '<td>Drills</td>'
                + '<td>Dev</td>'
                + '<td>Grade</td>'
            + '</tr></thead>'
            + '<tbody><tr>'
                + '<td class="' + p.q.sol + '" title="' + p.sol + '">' + stDev.sol + '</td>'
                + '<td class="' + p.q.dash + '" title="' + p.dispDash + '">' + stDev.dash +'</td>'
                + '<td class="' + p.q.bench + '" title="' + p.bench + '">' + stDev.bench + '</td>'
                + '<td class="' + p.q.agil + '" title="' + p.dispAgil + '">' + stDev.agil + '</td>'
                + '<td class="' + p.q.jmp + '" title="' + p.jmp + '">' + stDev.jmp + '</td>'
                + '<td class="' + p.q.pspec + '" title="' + p.pspec + '">' + stDev.pspec + '</td>'
                + '<td>' + p.dev + '%</td>'
                + '<td>' + p.dispGr + '</td>'
            + '</tr></tbody>'
        + '</table>';
        
    
    if (result.hasOwnProperty('stel')) {
        // Draw Stelmagic table.
        stelmagicHTML = '<table class="playerCombineInline">'
                + '<thead><tr class="">'
                    + '<td><abbr title="Draftable?">D?</abbr></td>'
                    + '<td><abbr title="Very Good">VG</abbr></td>'
                    + '<td><abbr title="Good">G</abbr></td>'
                    + '<td><abbr title="Average">A</abbr></td>'
                    + '<td><abbr title="Fair/Poor">FP</abbr></td>'
                + '</tr></thead>'
                + '<tbody><tr>'
                    + '<td>' + p.stel.d + '</td>'
                    + '<td>' + p.stel.v + '</td>'
                    + '<td>' + p.stel.g + '</td>'
                    + '<td>' + p.stel.a + '</td>'
                    + '<td>' + p.stel.f + '</td>'
                + '</tbody></tr>'
            + '</table>';
    }
    
    playerInfoHTML += playerRecordInline;
    playerInfoHTML += stelmagicHTML;
    
    draftmanID.drInfoPlayerInfo.innerHTML = playerInfoHTML;
    
    return;
}

function drawPlayerBars(result) {
    var bars = result.bars;
    var barsLFA, displayBarsLFA;
    var content = [];
    var displayBars = draftmanTables.shownBars[result.posG];
    var displayBarsLFA = '';
    var barValueLFA = '';
    var barsLFAClass = 'noBarsLFA';
    
    
    /* push content */
    content.push('<table id="tablePlayerBars">');
    for (var i = 0; i < displayBars.length; i++) {
        var barInfo = draftmanTables.barInfo[displayBars[i]];
        
        /* draw LFA bars if available */
        if (result.barsLFA) {
            barsLFAClass = 'barsLFA';
            barsLFA = result.barsLFA;
            
            displayBarsLFA = '<span class="lfa_bar">'
                + '<span class="lfa_bar_future" style="width:'+barsLFA[barInfo.hi]+'%">'
                + '</span>'
                + '<span class="lfa_bar_current" style="width:'+barsLFA[barInfo.lo]+'%">'
                    + barsLFA[barInfo.lo] + '/' + barsLFA[barInfo.hi]
                + '</span>'
            + '</span>';
            
            barValueLFA = '<span class="bar_value_lfa">'
                +barsLFA[barInfo.lo] + '<span class="divider"> / </span>' + barsLFA[barInfo.hi]
            + '</span>';
                    
        }
        
        content.push('<tr class="'+barsLFAClass+'"><td class="bar_name">' + barInfo.displayName + '</td>'
            + '<td class="bar_draw" id="'+displayBars[i]+'"><p>' 
                + '<span class="bar_overlay"></span>'
                + displayBarsLFA
                + '<span class="bar_fill" style="width:'+(bars[barInfo.hi] - bars[barInfo.lo])+'%; margin-left:'+bars[barInfo.lo]+'%;">' +bars[barInfo.lo] + ' - ' +bars[barInfo.hi]+'</span>'
            + '</p></td>'
            + '<td class="bar_value">'
                + '<span class="bar_value_draft">'
                    + bars[barInfo.lo] + ' - ' + bars[barInfo.hi]
                + '</span>'
                + barValueLFA
            + '</td>'
            
            + '</tr>');
    }
    
    content.push('</table>');

    draftmanID.drInfoPlayerBars.innerHTML = content.join('');
    return;
}

function drawNotepad(db, pid, result) {
    var content = [];
    
    content.push('<textarea id="draftmanNotepad" placeholder="Enter player notes here...">');
        content.push(result.notes);
    content.push('</textarea>');
    
    draftmanID.drInfoPlayerNotes.innerHTML = content.join('');

    document.getElementById('draftmanNotepad').addEventListener('blur', function (e) {
        dbSaveNote(db,pid,e.target.value);
        //draw the notepad icon into the player row.
        var row = document.getElementById(pid).parentNode;
        for(var i = 0; i < row.childNodes.length; i++) {
            if(row.childNodes[i].className == 'notes') {
                var notesTD = row.childNodes[i];
                if(e.target.value) {
                    var row = document.getElementById(pid).parentNode;
                    notesTD.innerHTML = draftmanConst.NOTE_ICON;
                }
                
                //clear the notepad icon if the note has become empty
                else { 
                    notesTD.innerHTML = '';
                }
            }
        }
        
    });
    
    
    
    
    return;
}

function displayFormatRoundGrade(round) {
    var display = draftmanConst.NO_GRADE_DISPLAY; //covers default and grade = 0
    
    if(round) { //don't change from default if p.round isn't defined yet.
        if(round == 8) {
            display = draftmanConst.FA_GRADE_DISPLAY;
        }
        
        else if(round == 0) {
            display = draftmanConst.NO_GRADE_DISPLAY;
        }
        
        else {
            display = round;
        }
        
    }
    
    return display;
}

/*
 * @param action = string
 */
function dbPlayerAction(db, pid, elem, action) {
    var transaction = db.transaction(draftmanConst.PLAYER_STORE_NAME, 'readwrite');
    var store = transaction.objectStore(draftmanConst.PLAYER_STORE_NAME);
    
    var req = store.get(pid);
    
    req.onerror = function(e) {
        console.log('dbPlayerAction: no player found under ' + pid + '!');
    };
    
    req.onsuccess = function(e) {
        var retrievedObj = req.result;
        var result = false;
        
        if(!retrievedObj.hasOwnProperty(action) || (retrievedObj[action] == false)) {
            // player not currently actioned, do so here.
            retrievedObj[action] = true;
            result = true;
        }
        
        else if(retrievedObj[action] == true) {
            // un-action player.
            retrievedObj[action] = false;
        }
        
        // Update with the toggled reject status for player pid.
        store.put(retrievedObj, pid);
        
        // Update the class names for the player's display row as well.
        if(result == true) { $(elem).addClass(action); }
        else { $(elem).removeClass(action); }
        
        //For interview toggles, also draw in the icon.
        if(action == draftmanConst.ACTION_INTERVIEW) {
            
            for (var i = 0; i < elem.childNodes.length; i++) {
                if(elem.childNodes[i].className == 'interview') {
                    if(result == true) {
                        elem.childNodes[i].innerHTML = draftmanConst.INTERVIEW_ICON;
                    }
                    
                    else {
                        elem.childNodes[i].innerHTML = '';
                    }
                }
            }
            
        }

    };
    
    return;    
}

function dbSaveNote(db, pid, content) {
    var transaction = db.transaction(draftmanConst.PLAYER_STORE_NAME, 'readwrite');
    var store = transaction.objectStore(draftmanConst.PLAYER_STORE_NAME);
    
    var req = store.get(pid);

    req.onerror = function(e) {
        console.log('dbSaveNote: no player found under ' + pid + '!');
    };
    
    req.onsuccess = function(e) {
        var retrievedObj = req.result;
        // Set notes property, rewriting if already extant.
        retrievedObj.notes = content;
        
        store.put(retrievedObj, pid);
    };
    
    return;
}

function dbPlayerRoundGrade(db, pid, elem, roundGrade) { 
    var transaction = db.transaction(draftmanConst.PLAYER_STORE_NAME, 'readwrite');
    var store = transaction.objectStore(draftmanConst.PLAYER_STORE_NAME);
    
    var req = store.get(pid);
    
    req.onerror = function(e) {
        console.log('dbPlayerRoundGrade: no player found under ' + pid + '!');
    };
    
    req.onsuccess = function(e) {
        var retrievedObj = req.result;
        retrievedObj.round = roundGrade;
        
        // Save round, rewriting if already extant.
        store.put(retrievedObj, pid);
            
        //I suppose we should technically wait for success of put to do this:
        if(roundGrade == 8) {
            roundGrade = draftmanConst.FA_GRADE_DISPLAY;
        }
        
        else if(roundGrade == 0) {
            roundGrade = draftmanConst.NO_GRADE_DISPLAY;
        }
        
    
        //Display the new round grade.
        for (var i=0; i < elem.childNodes.length; i++) {
            if (elem.childNodes[i].className == 'round') {
                elem.childNodes[i].innerHTML = roundGrade;
            }
        }
        
        
    }
    return;
}
/* various lib functions below */
function getTimestamp() {
    if(!Date.now) { // shim for older browsers (no ES5 support)
        Date.now = function() {
            return new Date().getTime();
        };
    }

    return Date.now();
}

function satisfyAll(requirements) {
    var result = true;
    
    for (var i = 0; i < requirements.length; i++) {
        if (!requirements[i]) {
            result = false;
        }
    }
    
    return result;
}

function getCurDisplayParams() {
    var params = {};
    params.posG = [];
    params.status = [];
    params.grade = [];
    
    var menus = [
        {id: 'posMenu', paramName: 'posG'},
        {id: 'showOnlyMenu', paramName: 'status'},
        {id: 'gradeMenu', paramName: 'grade'}
    ]; //Note, the showOnly and gradeMenu may not necessarily be displayed and attainable.
    
    for (var i = 0; i < menus.length; i++) {
        var curMenu = document.getElementById(menus[i].id);
        if (!(curMenu === null)) {
            for (var k = 0; k < curMenu.childNodes.length; k++) {
                if( 
                    (curMenu.childNodes[k].nodeType == Node.ELEMENT_NODE) &&
                    ($(curMenu.childNodes[k]).hasClass(draftmanConst.ACTIVE_CLASS))
                    
                ){
                    var curMenuItemID = curMenu.childNodes[k].id;
                    var paramValue = '';
                    if(curMenu.id == 'posMenu') {
                        paramValue = curMenuItemID.substr(7); //# characters in "curMenu"
                    }
                    
                    else if (curMenu.id == 'showOnlyMenu') {
                        paramValue = curMenuItemID.substr(8); //# characters in "showOnly"
                    }
                    
                    else if (curMenu.id == 'gradeMenu') {
                        paramValue = curMenuItemID.substr(9); //# characters in "gradeMenu"
                    }
                    
                    if(paramValue !== '') {
                        var paramType = menus[i].paramName;
                        //Exception case for posG "all" and "nospec"
                        if (curMenu.id == 'posMenu') {
                            if (paramValue == 'All') { //push ALL positions to posG
                                params.posG = draftmanConst.posGNormal.concat(draftmanConst.posGSpecial);
                            }
                            
                            else if (paramValue =='NoSpec') { //push ALL but Specialist positions to posG
                                params.posG = draftmanConst.posGNormal;
                            }
                            
                            else { //Normal case.
                                params[paramType].push(paramValue);
                            }
                        }
                        
                        else { //Normally, we just push paramValue to array params[paramType].
                            params[paramType].push(paramValue);
                        }
                    }
                }
            }
        }
    }
    
    
    return params;
}

/*
 * 
 */
function showImportDump() {
    
    $(draftmanID.msgBox).addClass(draftmanConst.ACTIVE_CLASS);
    $(draftmanID.content).addClass(draftmanConst.FADED_CLASS);
    $(draftmanID.msgBox).load(draftmanFile.importDump);
    return;
}

function closeMsgBox() {
    $(draftmanID.msgBox).removeClass(draftmanConst.ACTIVE_CLASS);
    draftmanID.msgBox.innerHTML = '';
    $(draftmanID.content).removeClass(draftmanConst.FADED_CLASS);
    
    return;
}

function submitDump() {
    var req = indexedDB.open(draftmanConst.DB_NAME);
    
    /* Open database */
    
    req.onupgradeneeded = function(e) {
        var db = e.target.result;
        dbCreateStore(db, draftmanConst.DBINFO_STORE_NAME);
        dbCreateStore(db, draftmanConst.PLAYER_STORE_NAME);
        
    };
    
    req.onerror = function(e) {
        console.log(this.error);
    };
    
    req.onsuccess = function(e) {
        var db = this.result;
        console.log('submitDump indexedDB.open success!');
            
        /* import dump */
        draftmanID.dumpContent = document.getElementById('dumpContent');
        var dumpLines = dumpContent.value.split('\n');
        var players = []; //array of players to be marked drafted
        
        for(var i = 0; i < dumpLines.length; i++) {
            var line = dumpLines[i].split('. - ');
                //line[0] contains the draft position, in case that's ever needed.
            var curPlayer = line[1].split(', ');
            var lastName = curPlayer[0];
            var firstName = curPlayer[1];
            var posG = curPlayer[2];
            var college = curPlayer[3];
            players.push({
                namL: lastName,
                namF: firstName,
                posG: posG,
                coll: college
            });
        }
        
        // Having constructed the list of players, mark them all drafted.
        importDump(db,players);
        // Reload the draft list.
        var displayParams = getCurDisplayParams();
        displayPage(db, displayParams);
        
        
        // Now wait for three seconds and disappear the box.
        
        setTimeout(function () {
            closeMsgBox();
        }, 3000);
        
    };
    return;
}   


function importDump(db,players) {
    var transaction = db.transaction(draftmanConst.PLAYER_STORE_NAME, 'readwrite');
    var store = transaction.objectStore(draftmanConst.PLAYER_STORE_NAME);
       
    
    store.openCursor().onsuccess = function(e) {
        var cursor = e.target.result;
        
        if(cursor) {            
            // check current cursor player against entire passed players-to-be-marked list.
            for (var i = 0; i < players.length; i++) {
                if(
                    (cursor.value.namL == players[i].namL) &&
                    (cursor.value.namF == players[i].namF) &&
                    (cursor.value.posG == players[i].posG)
                ) {
                    //match! Now mark as drafted in database.
                    var updates = [];
                    updates.push({attr: 'drafted', value:true});
                    dbUpdatePlayerRecord(db, cursor.value.pid, updates);
                }//endif
            }
            
            cursor.continue();
        }
    };
        
    store.openCursor().onerror = function(e) {
        console.log(this.error);
    }
    
    transaction.oncomplete = function(e) {
        $(draftmanID.importDump).append(draftmanConst.SUCCESS_MSG);
    }
        
       
            
    return;
}


/* fileValidateByHeaders
 *
 */
 
function fileValidateByHeaders(headers, fileName) {
    
    var result = false;
    
    if(fileName in fileHeaders) {
        if(arrayEquals(headers, fileHeaders[fileName])) {
            //console.log(header);
            //console.log(fileHeaders.fileName);
            result = true;
        }
        
        else {
            console.log('fileValidate failed for ' + fileName);
        }
    }
    
   
    
    return result;
}

/*
 *
 */
function playerNameMatchStelmack(data, cursor) {
    var dataName = data[0];
    var cursorName = cursor.value.namF + ' ' + cursor.value.namL;
    
    if (dataName == cursorName) {
        return true;
    }
    
    else {
        return false;
    }
}

/*
 *
 */
 
function arrayEquals(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;
    
    // If you don't care about the order of elements inside array,
    // sort both arrays here.
    
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    
    return true;
}

/* maxStelmagic
 *
 * @param stel
 *
 * Takes input player.stel data and returns the type of, and maximum 
 * of the expected values (among VG, G, A, and FP)
 */
 
function maxStelmagic(stel) {
    var result = {};
    
    result.max = Math.max(
        stel.v, 
        stel.g, 
        stel.a, 
        stel.f
    );
    
    // Now see which one it is;
    switch(result.max.toString()) {
        case(stel.v):
            result.type = 'V';
            break;
        case(stel.g):
            result.type = 'G';
            break;
        case(stel.a):
            result.type = 'A';
            break;
        case(stel.f):
            result.type = 'F';
            break;
        default:
            result.type = null;
    }
    
    
    return result;
    
    
}
//end