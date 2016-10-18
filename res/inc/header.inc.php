<div id='header'>
    <h1><a href='index.php'>draftman <span class='beta'>beta</span></a></h1>
    
    <ul id='nav'>
    
        <li>
           <label for='importDraft' id='labelImportCSV' title='Import FOF7 draft class from game-generated CSVs. Select all export data CSVs; draftman will choose the necessary ones.'>Import</label>
           <input type='file' id='importDraft' name='importDraft' value='Load' multiple>
        </li>
        
        <li>
            <label for='importSave' id='labelImportSave' title='Load a draftman saved draft list.'>Load</label>
            <input type='file' id='importSave' name='importSave' value='Load'>
        </li>
            
        <li>
            <a href='#' id='buttonSave' onclick='exportSave()' title='Save a draftman draft list for later use.'>Save</a>
        </li>
        
        <li class='new'>
            <label for='importStelmack' id='labelImportStelmack' title='Import a Stelmack Draft Analyzer CSV to get his Stelmagic numbers.'>Stelmagic</label>
            <input type='file' id='importStelmack' name='importStelmack' value='Stelmagic'>
        </li>
        
        
        
        
    </ul>
</div>
