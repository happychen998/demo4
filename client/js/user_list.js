'use strict';

$(function() {
  // 方案一
  // $('.del').click(function(event) {
  //   // body...
  //   console.log(event);
  //   var target = $(event.target);
  //   var id = target.data('id');
  //   var tr = $('.item-id-' + id);
  //   console.log('id');
  //   console.log(id);
  //   $.ajax({
  //     type: 'DELETE',
  //     url: '/admin/list?id=' + id
  //   }).done(function(results) {
  //     // body...
  //     console.log('results');
  //     console.log(results);
  //     if (results.ok === 1) {
  //       if (tr.length > 0) {
  //         tr.remove();
  //       }
  //     }
  //   });
  // });
  // 
  // 方案二
  $('#delConfirm').on('show.bs.modal', function(event) {
    var button = $(event.relatedTarget);
    var id = button.attr('data-id');
    console.log('id');
    console.log(id);
    var okbtn = $('#delConfirmbtnOK');
    okbtn.attr('data-id', id);
  });

  $('#delConfirmbtnOK').click(function(event) {
    // body...
    console.log(event);
    var target = $(event.target);
    var id = target.attr('data-id');
    var tr = $('.item-id-' + id);
    // console.log('id');
    // console.log(id);
    $.ajax({
      type: 'DELETE',
      url: '/admin/user/list?id=' + id
    }).done(function(results) {
      // body...
      console.log('results');
      console.log(results);
      if (results.ok === 1) {
        if (tr.length > 0) {
          tr.remove();
        }
      }
      $('#delConfirm').modal('hide');
    });
  });
});
