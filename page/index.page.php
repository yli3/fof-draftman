<script>
    var displayParams = {};
    /*default: All positions */
    displayParams.posG = draftmanConst.posGNormal.concat(draftmanConst.posGSpecial);
    
    window.onload = mainLoop(displayParams);
    
    $('#posMenuAll').addClass('active');
</script>";