var config = {
  isGFSCRouting: false,
  isDisabledSaveAndSend: false
}

$.get('data/db-create-routings.json', function(data) {
    if(data.isGFSCRouting){
      config.isGFSCRouting = true;
    }else{
      config.isGFSCRouting = false;
    }
  });

/**
 * create-new-routing-package-add-dist-options.html
 * 
 * setting  isGFSCRouting= false & isDisabledSaveAndSend = false
 * displays the GFSC message & disables the "Save and Send" button
 */

/**
 * create-new-routing-package-add-reviewers.html
 * 
 * setting  isGFSCRouting= false
 * displays the GFSC message
 */

$('document').ready(function() {
  initGfscConfig();
})

//gfsc config init
function initGfscConfig() {
  if (config.isGFSCRouting) {
    $('body').addClass('enabled-gfsc-comments');
  }
  if (config.isDisabledSaveAndSend) {
    $('.btn-save-send').addClass('disabled');
    $('.btn-save-send').on('click', function(e) { e.preventDefault(); })
  }
}
