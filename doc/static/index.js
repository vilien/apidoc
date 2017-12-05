function viewApi(path) {
  var $swagger = $('#swagger');
  var src = $swagger.attr('src').replace(/#.*$/, '');
  $('#swagger').attr('src', src + '#' + path);
  window.frames['swagger'].location.reload();
}

function appendList(dom, list) {
  $.each(list, function(index, item) {
    if (item.type === 'category') {
      var child = $('<li></li>');
      var ul = $('<ul class="d-menu" data-role="dropdown" style="display: none;"></ul>');
      child.append('<a class="dropdown-toggle" href="#">'+item.title+'</a>');
      child.append(ul);
      dom.append(child);
      appendList(ul, item.list);
    } else if (item.type === 'api') {
      var title;
      var className = '';
      if (item.info) {
        title = item.info.title;
        title += item.info.version ? '(' + item.info.version + ')' : '';
      } else {
        title = item.path;
      }
      if ('#' + item.path === location.hash) {
        className = 'active';
        dom.closest('ul').show();
        viewApi(item.path);
      }
      dom.append('<li class="'+className+'"><a href="#'+item.path+'">'+title+'</a></li>');
    }
  });
}

$(function(){
  $.get('/apimenu/list').then(function(data){
    appendList($('#menu'), data.data);
  });

  $('#menu').on('click', 'a', function(e){
    var $this = $(this);
    $('#menu').find('li').removeClass('active');
    $this.parent('li').addClass('active');
    setTimeout(function(){
      $this.closest('ul').show();
    }, 300);
    viewApi($this.attr('href').replace(/^#/, ''));
  });
});