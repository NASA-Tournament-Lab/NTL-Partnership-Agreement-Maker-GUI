//on dom ready
$(document).ready(function() {
  var dataFile = $('body').attr('data-json');
  if (dataFile !== undefined) {
    // set json data
    setData('data/' + dataFile)
  }

  // bindToggers
  bindToggers();
  // initFlyouts  
  initFlyouts();
  // initDD  
  initDD();
  // initDT  
  initDT();

  // eventBindings  
  eventBindings();
  // flyoutEvent  
  flyoutEvent();
  // initSelects  
  initSelects();
  // initModals  
  initModals();

  // initTreeStructures  
  initTreeStructures();
  // initDatepicker  
  initDatepicker();

  // initDragDropFileUpload  
  initDragDropFileUpload()

  // editor
  initEditor();
  // bindSequenceEvent
  bindSequenceEvent();

  //monitors input elements
  monitorInput($('.manual-add-reviewer'))

})

//init datepickder
function initDatepicker() {
  if ($('.datepicker').length > 0) {
    $('.datepicker').datepicker({
      autoHide: true,
      autoPick: false,
      format: "mm/dd/yyyy"
    });
  }
}

// initEditor
function initEditor() {
  if (typeof(tinymce) !== "undefined") {
    tinymce.init({
      selector: '#editor',
      height: 550,
      menubar: false,
      plugins: [
        'advlist autolink lists link image charmap print preview hr anchor pagebreak',
        'searchreplace wordcount visualblocks visualchars code fullscreen',
        'insertdatetime media nonbreaking save table contextmenu directionality',
        'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc'
      ],

      toolbar: 'undo redo | bold italic underline backcolor | alignleft aligncenter alignright | bullist numlist | styleselect',
      content_css: './css/editor.css'
    });
  }
}

// eventBindings
function eventBindings() {
  $('.btn-filter').on('click', function() {
    if ($('body').hasClass('filter-opened')) {
      $('body').removeClass('filter-opened');
      $('i', $(this)).addClass('icon-caret').removeClass('icon-caret-i');
    } else {
      $('body').addClass('filter-opened');
      $('i', $(this)).addClass('icon-caret-i').removeClass('icon-caret');
    }
  })

  //lk-remove
  $('.datatable-routing-container').on('click', '.lk-remove', function() {
    var im = $(this),
      parent = im.closest('[data-repeaters].datatable-routing');

    im.closest('tbody').remove();
    updateSequence(parent);
    im.closest('tbody').remove();
  })

  //lk-add-edit
  $('.datatable-routing-container').on('click', '.lk-add-edit', function(e) {
    var m = $('#add-reviewer-modal');
    updateReviewerData($(e.target),m);

    $('.modal-overlay').show();
    m.removeClass('search-results-visible');
    m.addClass('manual-entry-visible');
    m.show();
  })

  //lk-remove-child
  $('.datatable-routing-container').on('click', '.lk-remove-child', function() {
    $(this).closest('tr').remove();
  })

  //remove-hold status
  $('body').on('click', '.lk-remove-hold', function() {
    $('.cs', $(this).closest('.concurrence-status')).html("Approved<br/><span class='t'>00/00/0000  00:00 AM</span>").removeClass('Hold');
  })
  
  //click menu icon in mobile view
  $(".btn-icon-menu").on('click', function() {
    $(".mobile-aside").toggleClass("hide");
  })
  
  //click menu icon in mobile view
  $(".mobile-aside .layer-bg").on('click', function() {
    $(".mobile-aside").addClass("hide");
  })
}


//flyout event
function flyoutEvent() {
  $('[data-flyout]').each(function(e) {
    var im = $(this),
      canHide = false;
    var fOut = $('.action-flyout');
    im.on('mouseenter click', '.info-action', function(e) {
      if($(window).width()<=1024)
      {
        if(e.type === "mouseenter")
          return;
      }
      
      var right_padding = 30;
      if($(window).width()<=767)
      {
        right_padding = 15;
      }
      
      e.stopPropagation();
      canHide = true;
      var fOutPos = fOut[0].getBoundingClientRect();
      var fTC = $('.table-container')[0].getBoundingClientRect();

      var pos = this.getBoundingClientRect();


      var idx = table.row($(this).closest('tr')).index();
      var data = $('.action-flyout')[0].db;
      var c = data[idx];

      $('.flyout-tx', fOut).html(c.flyoutTx);
      $('.flyout-tx2', fOut).html(c.flyoutTx2);
      $('.flyout-tx3', fOut).html(c.flyoutTx3);

      var pl = pos.left + $('body').scrollLeft();
      fOut.css('top', (pos.top - fTC.top - 10) + 'px');
      fOut.css('right', (fTC.width - pl + right_padding + 11) + 'px');
      fOut.addClass('on');
    })

    im.on('mouseleave', '.info-action', function(e) {
      if($(window).width()<=1024)
      {
        return;
      }
      canHide = true;
      window.setTimeout(function() {
        if (canHide) {
          fOut.removeClass('on');
          canHide = false;
        }
      }, 300);
    })

    fOut.on('mouseenter', function() {
      canHide = false;
      fOut.addClass('on');
    })
    fOut.on('mouseleave', function() {
      canHide = true;
      window.setTimeout(function() {
        if (canHide) {
          fOut.removeClass('on');
          canHide = false;
        }
      }, 300);
    })
    
    //resize window
    $(window).resize(function(){
      canHide = true;

      if (canHide) {
        fOut.removeClass('on');
        canHide = false;
      }
    })
  })


  $('.action-flyout').on('click', function(e) {
    e.stopPropagation();
  })
}
var table;
//inits datatables
function initDT() {
  $('[data-datatable]').each(function() {
    var dt = $(this);
    var dataID = dt.attr('data-datatable');
    table = dt.DataTable({
      "info": false,
      "searching": true,
      "autoWidth": false,
      "dom": '<"top">rt<"bottom"flp><"clear">',
      "order": [
        [0, 'desc']
      ],
      "language": {
        "lengthMenu": "Show _MENU_"
      },
      "ajax": {
        "url": "data/" + dataID,
        "dataType": "json"
      }
    });

    //datatable on init
    dt.on('init.dt', function(e, s, j) {
      $('#' + dt.attr('data-linked-id')).text(j.draftCount);
      $('#inrouting-count').text(j.inRoutingCount);
      $('#completed-count').text(j.completedCount);
    })
  })
}

//fetches JSON data
function setData(url) {
  $.get(url, function(data) {
    attachData(data);

    // initPopupFilter
    initPopupFilter();
  });
}

// binds JSON data to 'db' attribute of tables
function attachData(db) {
  $('[data-repeaters]').each(function() {
    var t = $(this),
      key;
    key = t.attr('data-repeaters');
    t[0].db = db[key];
  });

  bindRepeaters();
}

// inits Repeaters
function bindRepeaters() {
  $('[data-repeaters]').each(function() {
    if ($(this).data('bind-to-memory') === true) {
      return false;
    }
    var repeaterEl = $(this);
    var dataRepeat = $('[data-repeat]', repeaterEl);

    //If table is empty
    if (dataRepeat.length <= 0) {
      dataRepeat = repeaterEl[0].template.clone();
    }


    dataRepeat.each(function() {
      var el = $(this),
        pagesize = -1,
        pnum = 0,
        startIdx = 0,
        newEl;
      pagesize = el.attr('data-pagesize') !== undefined ? Math.min(el.attr('data-pagesize') * 1, repeaterEl[0].db.length) : repeaterEl[0].db.length;
      pnum = el.attr('data-pnum') !== undefined ? el.attr('data-pnum') * 1 : 0;

      //template
      if ($('[data-repeat].template', repeaterEl).length > 0) {
        repeaterEl[0].template = $('[data-repeat].template', repeaterEl).clone();
      }
      repeaterEl[0].template.removeClass('template');
      $('[data-repeat].template', repeaterEl).remove();

      $('tbody', repeaterEl).remove();

      for (var i = startIdx; i < pagesize; i++) {
        var item = repeaterEl[0].db[i];
        newEl = repeaterEl[0].template.clone();
        $('.child-template', newEl).remove();
        //bind data
        $('[data-bind]', newEl).each(function() {
          var key = $(this).attr('data-bind');
          if (item !== undefined) {
            $(this).html(item[key]);
          }
        })

        //bind element class
        $('[data-class]', newEl).each(function() {
          var key = $(this).attr('data-class');
          $(this).addClass(item[key]);
        })

        //set group el name
        $('[data-group-name]', newEl).each(function() {
          var name = $(this).attr('data-group-name');
          $(this).attr('name', name + i);
        })

        //sets checked status
        $('[data-is-checked]', newEl).each(function() {
          var isChk = $(this).attr('data-is-checked');
          $(this).attr('checked', item[isChk]);
        })

        //sets enabled status
        $('[data-is-enabled]', newEl).each(function() {
          var isChk = $(this).attr('data-is-enabled');
          if (item[isChk]) {
            $(this).addClass('enabled');
          }
        })

        //sets disabled status
        $('[data-is-disabled]', newEl).each(function() {
          var isChk = $(this).attr('data-is-disabled');
          if (item[isChk]) {
            $(this).addClass('disabled');
          }
        })

        // $index keyword
        $('[data-add-index]', newEl).each(function() {
          idxEl = $(this);
          if (idxEl.length > 0) {
            var attrName = idxEl.attr('data-add-index');
            idxEl.attr(attrName) !== undefined ? idxEl.attr(attrName, idxEl.attr(attrName) + i) : '';
          }
        })

        //child elements
        if (typeof(item.child) !== "undefined" && item.child.length > 0) {
          for (var j = 0; j < item.child.length; j++) {
            var newChildEl = $('.child-template', el).clone().removeAttr('data-class').removeClass('child-template');
            var childData = item.child[j];

            //bind data
            $('[data-bind]', newChildEl).each(function() {
              var key = $(this).attr('data-bind');
              if (childData !== undefined) {
                $(this).html(childData[key]);
              }
            })

            //sets checked status
            $('[data-is-checked]', newChildEl).each(function() {
              var isChk = $(this).attr('data-is-checked');
              $(this).attr('checked', childData[isChk]);
            })

            //sets enabled status
            $('[data-is-child-enabled]', newChildEl).each(function() {
              var isChk = $(this).attr('data-is-child-enabled');
              if (childData[isChk]) {
                $(this).addClass('enabled');
              }
            })

            // $index keyword
            $('[data-add-index]', newChildEl).each(function() {
              idxEl = $(this);
              if (idxEl.length > 0) {
                var attrName = idxEl.attr('data-add-index');
                idxEl.attr(attrName) !== undefined ? idxEl.attr(attrName, idxEl.attr(attrName) + j) : '';
              }
            })

            newEl.append(newChildEl);
          }
        }
        repeaterEl.append(newEl);
      }
    })



    if (repeaterEl.attr('updateSequence') !== "") {
      // Callback
      updateSequence(repeaterEl);

    }
  })
}

// updateSequence
function updateSequence(el) {
  $('.movers .move', el).removeClass('disabled');
  var len = $('tbody', el).length;
  $('tbody', el).each(function(idx) {
    var rw = $(this);
    if (idx === 0) {
      $('.icon-move-u', rw).addClass('disabled');
    }
    if (idx === len - 1) {
      $('.icon-move-d', rw).addClass('disabled');
    }
    $('.sno', rw).html(idx + 1);
  })
}

// bindSequence
function bindSequenceEvent() {
  //move up
  $('.datatable-routing').on('click', '.icon-move-u', function() {
    if (!$(this).hasClass('disabled')) {
      var tb = $(this).closest('tbody');
      var prev = tb.prev();
      tb.insertBefore(prev);
      updateSequence(tb.closest('.datatable-routing'));
    }
  })

  //move down
  $('.datatable-routing').on('click', '.icon-move-d', function() {
    if (!$(this).hasClass('disabled')) {
      var tb = $(this).closest('tbody');
      var next = tb.next();
      tb.insertAfter(next);
      updateSequence(tb.closest('.datatable-routing'));
    }
  })
}

//togglers
function bindToggers() {
  $('[data-toggle-parent]').on('click', function(e) {
    e.stopPropagation();
    var p = $(this).parent();
    if (p.hasClass('on')) {
      p.removeClass('on');
    } else {
      p.addClass('on');
    }
  })

  $('.header-flyout').on('click', function(e) {
    e.stopPropagation();
  })

  // close flyout on clicking outside flyout
  $('body').on('click', function() {
    $('[data-toggle-parent]').parent().removeClass('on');
    $('.action-flyout').removeClass('on');
  })
}

//flyouts
function initFlyouts() {
  var fos = $('.header-flyout');
  //check all functions
  fos.each(function() {
    var fo = $(this);
    $('input:checkbox', fo).on('change', function() {
      var chkall = $('[data-checkall]', fo);
      if ($(this).is(':checked')) {
        var nchk = $('.chkctrl', fo).length,
          nchecked = $('.chkctrl:checked', fo).length;
        if (!chkall.is(':checked') && nchk - 1 === nchecked) {
          chkall.prop('checked', true);
        }
      } else {
        chkall.prop('checked', false);
      }
    })

    $('[data-checkall]', fo).on('click', function() {
      if ($(this).is(':checked')) {
        $('input:checkbox', fo).prop('checked', true);
      } else {
        $('input:checkbox', fo).prop('checked', false);
      }
    })
  })
}

//ints dd
function initDD() {
  $('.dd-list .tx').on('click', function() {
    var p = $(this).closest('.dd-list');
    $('.val', p).text($(this).text());
  })
}

//modals
function initModals() {
  /* Custom modal popups */
  $('.modal .close-modal').on('click', function() {
    $(this).parents('.modal').hide();
    $('.modal-overlay').hide();
  });

  $('body').on('click', '.modal-trigger', function() {
    var modalId = $(this).attr('data-show-modal');
    if (modalId) {
      $('.modal-overlay').show();
      $('#' + modalId + '.modal').removeClass('search-results-visible');
      $('#' + modalId + '.modal').removeClass('manual-entry-visible');
      $('#' + modalId + '.modal').show();
    }
    if (modalId === 'add-routing-template-modal') {
      $('#add-routing-template-modal').removeClass('next-group-step').removeClass('template-details-step');
    }
    
    if($(this).hasClass("btn-add-revision") && $(window).width()<768)
    {
      $("html, body").animate({scrollTop:0});
    }
  });

  $('.modal-overlay').on('click', function() {
    hideModal();
  });

  $('.button-directory-lookup').on('click', function() {
    $(this).parents('.modal').removeClass('manual-entry-visible');
    $(this).parents('.modal').addClass('search-results-visible');
  });

  $('.button-manual-entry').on('click', function(e) {
    var m = $(e.target).closest('.modal');
    m.removeClass('search-results-visible');
    m.addClass('manual-entry-visible');
    // adds dummy data
    $('input:text, textarea', m).val('');
    $('input:checkbox', m).eq(0).removeAttr('checked');
  });

  $('.button-add-routing-template').on('click', function() {
    $(this).parents('.modal').removeClass('next-group-step');
    $(this).parents('.modal').addClass('template-details-step');
  });

  $(document).keyup(function(e) {
    typeof(e.keyCode);
    if (e.keyCode === 27) { // escape key maps to keycode `27`
      hideModal();
    }
  });
}

// hideModal
function hideModal() {
  $('.modal').hide();
  $('.modal-overlay').hide();
}

//file tree structure
function initTreeStructures() {
  $('.file-tree .toggle-tree').off();
  $('.file-tree .toggle-tree').on('click', function() {
    $(this).parents('.file-tree').toggleClass('collapsed');
  });
  $('.file-tree > li > ul .icon-delete').off();
  $('.file-tree > li > ul .icon-delete').on('click', function() {
    $(this).parent().parent().remove();
  });
  $('.file-tree > li .root .icon-delete').off();
  $('.file-tree > li .root .icon-delete').on('click', function() {
    $(this).parents('.file-tree').data('revision', 0);
    $(this).parent().siblings('ul').find('li').remove();
    $(this).parent().remove();
  });
}

//select dropdowns
function initSelects() {
  $('select.stylize').dropkick({mobile: true});
}
//reviewerAdded
function reviewerAdded(e) {
  $('.table-container.no-data').removeClass('no-data');
  hideModal();
}
//reviewerSelected
function reviewerSelected(e) {
  var im = $(e.target);
  updateReviewerData(im, im.closest('.modal'));
}

//updateReviewerData
function updateReviewerData(el,modal) {
  var im = el;
  var m = modal;
  m.removeClass('search-results-visible');
  m.addClass('manual-entry-visible');
  // adds dummy data
  $('.manual-add-reviewer input:text, .manual-add-reviewer textarea', m).val('lorem ipsum');
  $('.manual-add-reviewer input:checkbox', m).eq(0).attr('checked', 'checked');

  var rw = im.closest('li').length>0?im.closest('li'):im.closest('td');
  //first name
  $('#fName',m).val($('.name',rw).text());
  //dummy title
  $('#input-title',m).val('Research Technical Engineer & Applicant');
}

//addNewRoutingTemplate
function addNewRoutingTemplate() {
  if ($('.datatable-routing-container tbody').length > 0 && $('.datatable-routing-container').hasClass('no-data')) {
    $('.datatable-routing-container').removeClass('no-data');
  } else {
    // push new data 
    // newData can be any object that is to be push
    var newData = $('.datatable-routing')[0].db[0];
    //push data in the @db attribute of the repeating node
    $('.datatable-routing')[0].db.push(newData)

    // bind events & redraw
    bindRepeaters();
  }
}


//enableSubmit
function enableSubmit() {
  $('body').addClass('submit-enabled');
  hideModal();
}

//filterTable
function filterTable() {
  var q = $('#titleFilter').val();
  var table = $('[data-enabled-search]').DataTable();
  table
    .columns(0)
    .search(q)
    .draw();

  var table = $('[data-filter-enabled]').DataTable();
  var qf = $('#qFilter').val()
  table
    .columns(1)
    .search(qf)
    .draw();
}

//get current date
function getCurrentDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!

  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  return dd + '/' + mm + '/' + yyyy;
}

//file browse/drag/drop and upload
function initDragDropFileUpload() {
  $('.drag-drop-files-here input[type="file"]').on('change', function() {
    var file = this.files[0];
    var fileSize = Math.round(file.size / 1024);
    var fileName = file.name;
    if (fileName.length > 20) {
      fileName = fileName.substring(0, 10) + '...' + fileName.slice(-10);
    }
    var revision = $(this).parents('.drag-drop-files-here').siblings('.uploaded-files').find('.file-tree').data('revision');
    if (revision) {
      revision = revision + 1;
    } else {
      revision = 1;
      var rootToggleNode = '<a class="icon-collapse toggle-tree"></a>';
      var rootFileInfoNodes = '<span class="file-name"></span><span class="file-size"></span><span class="file-date"></span>';
      var rootFileDeleteNode = '<a class="icon-delete"></a>';
      var rootNode = '<p class="root">' + rootToggleNode + rootFileInfoNodes + rootFileDeleteNode + '</p>';
      $(this).parents('.drag-drop-files-here').siblings('.uploaded-files').find('.file-tree > li').prepend(rootNode);
    }
    $(this).parents('.drag-drop-files-here').siblings('.uploaded-files').find('.file-tree').data('revision', revision);
    var revisionNode = document.createElement('li');
    var p = document.createElement('p');
    $(p).append('<span class="revision-name">Replace <span class="revision">Revision ' + revision + '</span></span>');
    $(p).append('<span class="file-size">' + fileSize + 'kb</span>');
    $(p).append('<span class="file-date">' + getCurrentDate() + '</span>');
    $(p).append('<a  class="icon-delete"></a>');
    $(revisionNode).append(p);
    $(this).parents('.drag-drop-files-here').siblings('.uploaded-files').find('.file-tree li ul').prepend(revisionNode);
    $(this).parents('.drag-drop-files-here').siblings('.uploaded-files').find('.file-tree .root .file-name').text(fileName);
    $(this).parents('.drag-drop-files-here').siblings('.uploaded-files').find('.file-tree .root .file-size').text(fileSize + 'kb');
    $(this).parents('.drag-drop-files-here').siblings('.uploaded-files').find('.file-tree .root .file-date').text(getCurrentDate());

    initTreeStructures();
  });
  $('.file-adder').on('dragover', '.drag-drop-files-here', function(e) {
    $(this).addClass('active');
    e.preventDefault();
    e.stopPropagation();
  });
  $('.file-adder').on('dragenter', '.drag-drop-files-here', function(e) {
    $(this).addClass('active');
    e.preventDefault();
    e.stopPropagation();
  });
  $('.file-adder').on('dragleave', '.drag-drop-files-here', function(e) {
    $(this).removeClass('active');
  });
  $('.file-adder').on('drop', '.drag-drop-files-here', function(e) {
    if (e.originalEvent.dataTransfer) {
      if (e.originalEvent.dataTransfer.files.length) {
        e.preventDefault();
        e.stopPropagation();
        var file = e.originalEvent.dataTransfer.files[0];
        var fileSize = Math.round(file.size / 1024);
        var fileName = file.name;
        if (fileName.length > 20) {
          fileName = fileName.substring(0, 10) + '...' + fileName.slice(-10);
        }
        var revision = $(this).siblings('.uploaded-files').find('.file-tree').data('revision');
        if (revision) {
          revision = revision + 1;
        } else {
          revision = 1;
          var rootToggleNode = '<a  class="icon-collapse toggle-tree"></a>';
          var rootFileInfoNodes = '<span class="file-name"></span><span class="file-size"></span><span class="file-date"></span>';
          var rootFileDeleteNode = '<a  class="icon-delete"></a>';
          var rootNode = '<p class="root">' + rootToggleNode + rootFileInfoNodes + rootFileDeleteNode + '</p>';
          $(this).siblings('.uploaded-files').find('.file-tree > li').prepend(rootNode);
        }
        $(this).siblings('.uploaded-files').find('.file-tree').data('revision', revision);
        var revisionNode = document.createElement('li');
        var p = document.createElement('p');
        $(p).append('<span class="revision-name">Replace <span class="revision">Revision ' + revision + '</span></span>');
        $(p).append('<span class="file-size">' + Math.round(file.size / 1024) + 'kb</span>');
        $(p).append('<span class="file-date">' + getCurrentDate() + '</span>');
        $(p).append('<a  class="icon-delete"></a>');
        $(revisionNode).append(p);
        $(this).siblings('.uploaded-files').find('.file-tree li ul').prepend(revisionNode);
        $(this).siblings('.uploaded-files').find('.file-tree .root .file-name').text(fileName);
        $(this).siblings('.uploaded-files').find('.file-tree .root .file-size').text(fileSize + 'kb');
        $(this).siblings('.uploaded-files').find('.file-tree .root .file-date').text(getCurrentDate());
        $(this).removeClass('active');

        initTreeStructures();
      }
    }
  });
}

//filterReset
function filterReset() {
  var q = $('#titleFilter').val('');
  $('input').val('');
  $('input:checkbox').prop('checked', false);
  var table = $('[data-enabled-search]').DataTable();
  table.columns(0).search('').draw();
  $('#routing-group').val('Routing Group');
  var sel = $('#routing-group').prev('');
  $('.dk-selected ', sel).text('Routing Group');
  $('.dk-select-options .dk-option-selected', sel).removeClass('dk-option-selected');
  $('.dk-select-options li:first', sel).addClass('dk-option-selected');

  $('#partner-name').val('Partner Name');
  sel = $('#partner-name').prev('');
  $('.dk-selected ', sel).text('Partner Name');
  $('.dk-select-options .dk-option-selected', sel).removeClass('dk-option-selected');
  $('.dk-select-options li:first', sel).addClass('dk-option-selected');
}

//monitorInput
function monitorInput(el) {
  var ips = $('input:text, textarea', el);
  ips.keyup(function() {
    if ($(this).val() !== undefined && $(this).val() !== '') {
      $(this).addClass('no-focus');
    } else {
      $(this).removeClass('no-focus');
    }
  })
}

// initPopupFilter
function initPopupFilter() {
  var table = $('[data-filter-enabled]').DataTable({
    "info": false,
    "searching": true,
    "autoWidth": false,
    "pagination": false,
    "dom": '<"top">rt<"bottom"><"clear">'
  });

  $('.status-flyout input:checkbox').on('change', function() {
    var qs = '';
    $('.status-flyout input:checkbox:checked').each(function() {
      if ($(this).val !== "") {
        qs = qs === "" ? $(this).val() : qs + '|' + $(this).val();
      }
    })
    qs = qs.replace(/ /, '\\s');
    qs = '(?:' + qs + ')';
    table.columns(1).search(qs, true, false).draw();
  })
}

//add files
function addFiles() {
  var f = $('.template', $('[data-add-files]')).clone();
  f.removeClass('template');
  $('[data-add-files] .files-container').append(f);
  initTreeStructures();
}
