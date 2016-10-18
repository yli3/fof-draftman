<div id='menus'>
    <ul id='posMenu'>
        <?php
        $positions = array(
            'QB' => 'Quarterbacks',
            'RB' => 'Running backs',
            'FB' => 'Fullbacks',
            'TE' => 'Tight ends',
            'WR' => 'Wide receivers',
            'T' => 'Offensive tackles',
            'G' => 'Offensive guards',
            'C' => 'Centers',
            'DE' => 'Defensive ends',
            'DT' => 'Defensive tackles',
            'ILB' => 'Inside Linebackers',
            'OLB' => 'Outside Linebackers',
            'CB' => 'Cornerbacks',
            'S' => 'Safeties',
            'K' => 'Kickers',
            'P' => 'Punters',
            'LS' => 'Long snappers',
            'All' => 'Display all positions',
            'NoSpec' => 'Display all but specialist positions - K, P, LS'
        );
        
        foreach($positions as $pos => $title) {
            echo "<li id='posMenu$pos'>
                <a href='#' onclick='handleDisplayClick(this)' title='$title'>$pos</a>
            </li>";
        }
        ?>
    </ul>
    
</div>

<div id='wrapper'>
    <div id='content'>
        <div id='main'>
            <div id='extraMenu'>
                <ul>
                    <li>
                        <a href='#' class='button' id='buttonDump' onclick='showImportDump()' title='Paste a Draft Conscriptor Analyzer Dump to mark draftees as drafted.'>Mark Draftees</a>
                    </li>
                </ul>
            </div>
            <div id='filterMenus'>
                <h4>Show Only</h4>
                <ul id='showOnlyMenu'>
                    <?php
                    $showOnlyMenuOptions = array(
                        'mark' => array('display'=>'Mark', 'title'=>'Show only marked players'),
                        'supermark' => array('display'=>'Super', 'title'=>'Show only supermarked players'),
                        'intvw' => array('display'=>'Scout', 'title'=>'Show only interviewed players. You must import draft_personal for this!'),
                        'reject' => array('display'=>'X', 'title'=>'Show only rejected players'),
                        'interviewCandidate' => array('display'=>'List', 'title'=>'Show only shortlisted players.'),
                        'drafted' => array('display'=>'Draft', 'title'=>'Show only drafted players')
                    );
                    
                    foreach($showOnlyMenuOptions as $key => $option) {
                        $display = $option['display'];
                        $title = $option['title'];
                        echo "<li id='showOnly$key'>
                            <a href='#' onclick='handleDisplayClick(this)' title='$title'>$display</a>
                        </li>";                    
                    }
                    ?>
                </ul>
                
                <h4>Grade</h4>
                <ul id='gradeMenu'>
                    <?php
                        $gradeMenuOptions = array(
                            0 => array('display'=>'none', 'title'=>'Show only ungraded players'),
                            1 => array('display'=>'1', 'title'=>'Show only Round 1 Grade players'),
                            2 => array('display'=>'2', 'title'=>'Show only Round 2 Grade players'),
                            3 => array('display'=>'3', 'title'=>'Show only Round 3 Grade players'),
                            4 => array('display'=>'4', 'title'=>'Show only Round 4 Grade players'),
                            5 => array('display'=>'5', 'title'=>'Show only Round 5 Grade players'),
                            6 => array('display'=>'6', 'title'=>'Show only Round 6 Grade players'),
                            7 => array('display'=>'7', 'title'=>'Show only Round 7 Grade players'),
                            8 => array('display'=>'FA', 'title'=>'Show only Free Agent Grade players')
                        );
                        
                        foreach($gradeMenuOptions as $key => $option) {
                            $display = $option['display'];
                            $title = $option['title'];
                            echo "<li id='gradeMenu$key'>
                                <a href='#' onclick='handleDisplayClick(this)' title='$title'>$display</a>
                            </li>";
                        }
                    ?>
                </ul>
            </div>
            <div id='mainmsg'></div>
            <div id='drPlayerTable'></div>
        </div>

        <div id='side'>
            <div id='drInfoPlayerName'></div>
            
            <div id='drInfoPlayerInfo'></div>
            
            <div id='drInfoPlayerBars'></div>
            
            <div id='drInfoPlayerNotes'></div>
        </div>
    </div>
    
    <div id='msgBox' onblur='console.log("blurred")'></div>
</div>