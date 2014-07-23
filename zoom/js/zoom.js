/* Plugin de Zoom
  Desenvolvedor: Felipe Silva
  Data de Primeira Versão: 05/02/2014
*/

// Variaveis Globais
var zoom_larguraImg = 0;
var zoom_alturaImg = 0;
var zoom_larguraImgTemp = 'auto';
var zoom_alturaImgTemp = 'auto';
var zoom_larguraImgInicial = 0;
var zoom_alturaImgInicial = 0;
var dReferency = 0;
var wReferency = 0;
var hReferency = 0;
var zoom_num = 0;
var zoom_numH;
var zoom_numV;
var zoom_numMax = 0;
var delta = 0;
var zoom_numtotalV = 0;
var zoom_numtotalH = 0;

var zoom_imgClass;
var zoom_boxZoom;
var zoom_larguradiv;
var zoom_alturadiv;
var zoom_urlImg;
var wImgzoom;
var hImgzoom;
var widthContentZoom;
var heightContentZoom;
var widthZoomReferency;
var heightZoomReferency;
var widthImgContent;
var heightImgContent;
var boxWImgzoom = 0;
var boxHImgzoom = 0;
var heightBoxDrag = 0;
var zoom_limiteW = 0;
var zoom_limiteH = 0;
var parametrosZoom;
var zoom_flagZoom = true;

var zoom_larguraImgMax = 0;
var zoom_alturaImgMax = 0;
var zoom_larguraBoxMin = 0;
var zoom_alturaBoxMin = 0;
var zoom_diferencaImgW = 0;
var zoom_diferencaImgH = 0;
var zoom_diferencaboxW = 0;
var zoom_diferencaboxH = 0;
var zoom_numImgW = 0;
var zoom_numImgH = 0;
var zoom_numboxW = 0;
var zoom_numboxH = 0;


function zoom(dadosZoom){
  parametrosZoom = dadosZoom;
  //changeZoom = parametrosZoom.change;

  //Variaveis do Zoom
  zoom_imgClass = "#zoom";
  if(parametrosZoom.imgid != undefined){
    zoom_imgClass = "#"+parametrosZoom.imgid;
  }

  zoom_boxZoom = $(zoom_imgClass).parent();
  zoom_larguradiv = $(zoom_boxZoom).width();
  zoom_alturadiv = $(zoom_boxZoom).height();
  
  if(parametrosZoom.heightBoxDrag != undefined){
    heightBoxDrag = parametrosZoom.heightBoxDrag;
  }
  

  //Carregamento da Imagem para Iniciar o Script
  carregamentoImagens();
  
}

function carregamentoImagens(){
  zoom_urlImg = parametrosZoom.img;
  var image = new Image();
  $(zoom_imgClass).animate({'opacity': 0},300).addClass('zoomLoad');
  
  if(zoom_urlImg != undefined){
    image.src = zoom_urlImg;
  }else{
    image.src = $(zoom_imgClass).attr('src');
  }

  // Inicia o Script
  image.onload = function(){
    $(zoom_boxZoom).addClass('containerZoom');
    if(zoom_urlImg != undefined){
      $(zoom_boxZoom).html("");
      $(zoom_boxZoom).html("<img src='"+parametrosZoom.img+"' id='"+parametrosZoom.imgid+"'/>");
      zoom_larguraImg = parseInt(parametrosZoom.widthImg);
      zoom_alturaImg = parseInt(parametrosZoom.heightImg);
    }else{
      zoom_larguraImg = parseInt($(zoom_imgClass).width());
      zoom_alturaImg = parseInt($(zoom_imgClass).height());
    } 

    dimensaoImg();

    if(parametrosZoom.responsive == true){
      var timer;
      $(window).bind('resize', function(){
        timer && clearTimeout(timer);
        timer = setTimeout(responsiveZoom, 200);
      });
    }
    if(parametrosZoom.typeZoom == 'referency'){
      referenciaZoom();
    }
    $(zoom_imgClass).animate({'opacity': 1},300,function(){
      $(this).removeClass('zoomLoad');
    });

    if(parametrosZoom.callbackZoom == true){
      callbackZoom();
    }
    
  }
}

var zoom_flagchange = false;
var zoom_flagEventMouse = true;
function changeZoom(changeDados){
  $(zoom_imgClass).animate({'opacity': 0},300).addClass('zoomLoad');
  zoom_flagchange = true
  parametrosZoom.img = changeDados.img
  parametrosZoom.widthImg = parseInt(changeDados.widthImg);
  parametrosZoom.heightImg = parseInt(changeDados.heightImg);
  carregamentoImagens();
  zoom_flagZoom = true;
  zoom_num = 0;
  prevX = -1;
  zoom_numAnterior = 0;
}

function dimensaoImg(){
  zoom_larguradiv = $(zoom_boxZoom).width();
  zoom_alturadiv = $(zoom_boxZoom).height();
  var zoom_topImg = 0;
  var zoom_leftImg = 0;

  if(zoom_larguraImg > zoom_alturaImg){
    if(zoom_larguradiv > zoom_alturadiv){
        
      zoom_larguraImgTemp = zoom_larguradiv;  
      zoom_alturaImgTemp = (zoom_larguradiv*zoom_alturaImg)/zoom_larguraImg;
      zoom_topImg = (zoom_alturadiv - zoom_alturaImgTemp)/2;
      zoom_leftImg = 0;
      type = 2;

      if(zoom_alturaImgTemp > zoom_alturadiv){
        zoom_larguraImgTemp = (zoom_alturadiv*zoom_larguraImg)/zoom_alturaImg;
        zoom_alturaImgTemp = zoom_alturadiv;
        zoom_topImg = 0;
        zoom_leftImg = (zoom_larguradiv - zoom_larguraImgTemp)/2;
        type = 3;
      }
        
        
    }else{
      zoom_larguraImgTemp = (zoom_alturadiv*zoom_larguraImg)/zoom_alturaImg;
      zoom_alturaImgTemp = zoom_alturadiv;
      zoom_topImg = 0;
      zoom_leftImg = (zoom_larguradiv - zoom_larguraImgTemp)/2;
      type = 3;

      if(zoom_larguraImgTemp > zoom_larguradiv){
        zoom_larguraImgTemp = zoom_larguradiv;  
        zoom_alturaImgTemp = (zoom_larguradiv*zoom_alturaImg)/zoom_larguraImg;
        zoom_topImg = (zoom_alturadiv - zoom_alturaImgTemp)/2;
        zoom_leftImg = 0;
        type = 2;
      }
    }
      
  }else{
    if(zoom_larguradiv > zoom_alturadiv){
        
      zoom_larguraImgTemp = (zoom_alturadiv*zoom_larguraImg)/zoom_alturaImg;
      zoom_alturaImgTemp = zoom_alturadiv;
      zoom_topImg = 0;
      zoom_leftImg = (zoom_larguradiv - zoom_larguraImgTemp)/2;
      type = 3;

      if(zoom_larguraImgTemp > zoom_larguradiv){
        zoom_larguraImgTemp = zoom_larguradiv;  
        zoom_alturaImgTemp = (zoom_larguradiv*zoom_alturaImg)/zoom_larguraImg;
        zoom_topImg = (zoom_alturadiv - zoom_alturaImgTemp)/2;
        zoom_leftImg = 0;
        type = 2;
      }   
        
    }else{
      zoom_larguraImgTemp = zoom_larguradiv;  
      zoom_alturaImgTemp = (zoom_larguradiv*zoom_alturaImg)/zoom_larguraImg;
      zoom_topImg = (zoom_alturadiv - zoom_alturaImgTemp)/2;
      zoom_leftImg = 0;
      type = 2;
      if(zoom_alturaImgTemp > zoom_alturadiv){
          
        zoom_larguraImgTemp = (zoom_alturadiv*zoom_larguraImg)/zoom_alturaImg;
        zoom_alturaImgTemp = zoom_alturadiv;
        zoom_topImg = 0;
        zoom_leftImg = (zoom_larguradiv - zoom_larguraImgTemp)/2;
        type = 3;

      }
    }

  }
  zoom_larguraImgInicial = zoom_larguraImgTemp;
  zoom_alturaImgInicial = zoom_alturaImgTemp;

  $(zoom_imgClass).css({'width': zoom_larguraImgTemp ,'height': zoom_alturaImgTemp, 'position': 'absolute', 'top': zoom_topImg, 'left': zoom_leftImg})
}

function dimensaoreferencia(){
  var zoom_imgPanoramica = zoom_alturaImg+(zoom_alturaImg/3);
  var templargura = wReferency;
  if(zoom_larguraImg > zoom_alturaImg){
    calculo1();
    if(widthContentZoom > zoom_larguradiv){
     	oldWReferency = hReferency;
     	hReferency = hReferency - (hReferency*0.1);
     	dimensaoreferencia();
     	return false;
    }
  }else{
    calculo2();
  }

  function calculo1(){
    widthContentZoom = (hReferency*zoom_larguraImg)/zoom_alturaImg;
    heightContentZoom = hReferency;
    widthImgContent = (zoom_alturadiv*zoom_larguraImg)/zoom_alturaImg;
    heightImgContent = zoom_alturadiv;
    wImgzoom = (((hReferency*zoom_larguraImg)/zoom_alturaImg)-10);
    hImgzoom = (hReferency-8);
    zoom_larguraLimit = (hReferency*zoom_larguradiv)/zoom_alturadiv;
    zoom_alturaLimit = hReferency;
  }
  function calculo2(){
    widthContentZoom = wReferency;
    heightContentZoom = (wReferency*zoom_alturaImg)/zoom_larguraImg;
    widthImgContent = zoom_larguradiv;
    heightImgContent = (zoom_larguradiv*zoom_alturaImg)/zoom_larguraImg;
    wImgzoom = (wReferency-10);
    hImgzoom = (((wReferency*zoom_alturaImg)/zoom_larguraImg)-10);
    zoom_larguraLimit = wReferency;
    zoom_alturaLimit = (wReferency*zoom_alturadiv)/zoom_larguradiv;
  }

  widthZoomReferency = widthContentZoom;
  heightZoomReferency = heightContentZoom + heightBoxDrag;
  console.log(heightBoxDrag);
}
  
var zoom_larguraLimit = 0;
var zoom_alturaLimit = 0;
var tempW = zoom_larguraImgTemp;
var tempW2 = boxWImgzoom;
var tempH = zoom_alturaImgTemp;
var tempH2 = boxHImgzoom;
var tempWInicial = zoom_larguraImgTemp;
var tempHInicial = zoom_alturaImgTemp;
var zoom_posX = 0;
var zoom_posY = 0;
var zoom_limitX = 0;
var zoom_limitY = 0;
var zoom_topImg = 0;
var zoom_leftImg = 0;
var zoom_x = 0;
var zoom_y = 0;
var referencyPosition;
var referencyTop;
var referencyBottom;
var referencyLeft;
var referencyRight;
var wBoxLayer = 0;
var hBoxLayer = 0;
var oldWReferency = 0;
var flagZoomMove = true;
  
function referenciaZoom(){
  var zoom_urlImgContent = $(zoom_imgClass).attr('src');
  if(parametrosZoom.urlReferency != undefined){
    zoom_urlImgContent = parametrosZoom.urlReferency;
  }
    
  dReferency = parseInt(parametrosZoom.dimensionReferency);
  wReferency = parseInt(dReferency);
  hReferency = parseInt(dReferency);
  if(dReferency == undefined){
      
    if(dReferency == undefined && dReferency == undefined){
      wReferency = 100;
      hReferency = 100;
    }else{
      wReferency = parametrosZoom.widthReferency;
      hReferency = parametrosZoom.heighReferency;
    }
  }
  widthImgContent = '100%';
  heightImgContent = '100%';
    
  var boxTImgZoom = 0;
  var boxLImgZoom = 0;
  var TImgZoom = 0;
  var LImgZoom = 0;

  dimensaoreferencia();

  wBoxLayer = widthContentZoom-10;
  hBoxLayer = heightContentZoom-10;
  boxWImgzoom = widthContentZoom-10;
  boxHImgzoom = heightContentZoom-11;
  boxTImgZoom = -1;
  boxLImgZoom = -1;
  TImgZoom = 0;
  LImgZoom = 0;
  referencyPosition = parametrosZoom.referencyPosition;
  referencyTop = parametrosZoom.referencyPosition.top;
  referencyLeft = parametrosZoom.referencyPosition.left;
  referencyBottom = parametrosZoom.referencyPosition.bottom;
  referencyRight = parametrosZoom.referencyPosition.right;
  if(referencyTop == undefined){
    referencyTop = '';
    referencyBottom = 'bottom:'+parametrosZoom.referencyPosition.bottom+";";
    if(referencyBottom == undefined){
      referencyBottom = '';
    }
  }else{
    referencyTop = 'top:'+parametrosZoom.referencyPosition.top+";";
    referencyBottom = '';
  }
  if(referencyLeft == undefined){
    referencyLeft = '';
    referencyRight = 'right:'+parametrosZoom.referencyPosition.right+";";
    if(referencyRight == undefined){
      referencyRight ='';
    }
  }else{
    referencyLeft = 'left:'+parametrosZoom.referencyPosition.left+";";
    referencyRight ='';
  }


  var htmlZoom = '<div class="zoomReferency" style="width:'+(widthZoomReferency-10)+'px;height:'+(heightZoomReferency-10)+'px;'+referencyTop+referencyRight+referencyBottom+referencyLeft+'padding: 5px;background: #fff;position: absolute;display: block;">'
          + '<div class="contentZoom" style="width:'+(widthContentZoom-10)+'px;height:'+(heightContentZoom-10)+'px;position: relative;display: block;">'
          + '<div class="mouseReferency" style="position:relative;">'
            + '<div style="position:relative;width:'+wBoxLayer+'px;height:'+hBoxLayer+'px;display:block;">'
              + '<img src="'+zoom_urlImgContent+'" style="width:'+wBoxLayer+'px;height:'+hBoxLayer+'px;" />'
              + '<div style="background:#000;opacity:0.6;width:100%;height:100%;position:absolute;top:0;left:0;z-index:10;"></div>'
            + '</div>'
            + '<div class="contentImgZoom" style="border:1px solid #fff;z-index:20;position:absolute;top:'+boxTImgZoom+'px;left:'+boxLImgZoom+'px;overflow:hidden;width:'+boxWImgzoom+'px;height:'+boxHImgzoom+'px;">'
              + '<img src="'+zoom_urlImgContent+'" style="width:'+wImgzoom+'px;height:'+hImgzoom+'px; top:'+TImgZoom+'px; left:'+LImgZoom+'px;position:absolute;" />'
            + '</div>'
          + '</div>'
         + '</div></div>';

  $(zoom_boxZoom).append(htmlZoom);

  
  var numMaxZoom = 1;
  if(parametrosZoom.MaxZoom != undefined){
    numMaxZoom = parseInt(parametrosZoom.MaxZoom)/100;
  }
  zoom_larguraImgMax = zoom_larguraImg + (zoom_larguraImg*numMaxZoom);
  zoom_alturaImgMax = zoom_alturaImg + (zoom_alturaImg*numMaxZoom);
  zoom_larguraBoxMin = (boxWImgzoom*zoom_larguradiv)/zoom_larguraImgMax;
  zoom_alturaBoxMin = (boxHImgzoom*zoom_alturadiv)/zoom_alturaImgMax;

  if(zoom_larguraImgMax < zoom_larguradiv){
    zoom_larguraBoxMin = boxWImgzoom;
  }
  if(zoom_alturaImgMax < zoom_alturadiv){
    zoom_alturaBoxMin = boxHImgzoom;
  }

  zoom_limiteW = zoom_larguraBoxMin;
  zoom_limiteH = zoom_alturaBoxMin;

  zoom_numeros();

  tempW = zoom_larguraImgTemp;
  tempW2 = boxWImgzoom;
  tempH = zoom_alturaImgTemp;
  tempH2 = boxHImgzoom;
  
  var flagw = false

  zoom_numV = (boxHImgzoom - zoom_limiteH)/(widthContentZoom-20);
  zoom_numH = (boxWImgzoom - zoom_limiteW)/(widthContentZoom-20);
  zoom_numtotalV = (boxHImgzoom - zoom_limiteH)/zoom_numV;  
  zoom_numtotalH = (boxWImgzoom - zoom_limiteW)/zoom_numH;

  if(zoom_larguraImgMax < zoom_larguradiv){
    zoom_numtotalH = 0;
  }
  if(zoom_alturaImgMax < zoom_alturadiv){
    zoom_numtotalV = 0;
  }

  if(zoom_flagEventMouse == true){
    zoom_flagEventMouse = false;
    eventMouse();
  }
  flagZoomMove = true;
  if(parametrosZoom.imageZoom == true){
    $(zoom_imgClass).addClass('scrollImage');
  }
  
  function eventMouse(){
    $(zoom_boxZoom).on('mousemove', '.mouseReferency', function(e){
      event.stopPropagation();
      var currentMousePos = { zoom_x: -1, zoom_y: -1 };
      var position = $(this).position();
      var offset = $(this).offset();
      zoom_x = e.pageX - (offset.left);
      zoom_y = e.pageY - (offset.top);

      zoom_posX = zoom_x-(tempW2/2);
      zoom_posY = zoom_y-(tempH2/2);
      zoom_limitX = wBoxLayer-tempW2+2;
      zoom_limitY = hBoxLayer-tempH2;
      zoom_topImg = 0;
      zoom_leftImg = 0;
      if(flagZoomMove == true){
        if(tempW2 != boxWImgzoom){
          if(zoom_larguraImgTemp > zoom_larguradiv){
            if(zoom_posX < -2){
              $('.contentImgZoom').css({'left':-2})
              $('.contentImgZoom img').css({'left':1})
                
              zoom_leftImg = 0;
              $(zoom_imgClass).css({'left': -zoom_leftImg})
            }else if(zoom_posX > zoom_limitX){
              $('.contentImgZoom').css({'left':zoom_limitX})
              $('.contentImgZoom img').css({'left':-zoom_limitX})
                
              zoom_leftImg = zoom_larguraImgTemp-zoom_larguradiv;
              $(zoom_imgClass).css({'left': -zoom_leftImg})
            }else{
              $('.contentImgZoom').css({'left':zoom_posX})
              $('.contentImgZoom img').css({'left':-zoom_posX})
                
              zoom_leftImg = (zoom_posX*zoom_larguraImgTemp)/wImgzoom;
              $(zoom_imgClass).css({'left': -zoom_leftImg})
            }
          }
        }

        if(tempH2 != boxHImgzoom){
          if(zoom_alturaImgTemp > zoom_alturadiv){
            if(zoom_posY < -2){
              $('.contentImgZoom').css({'top':-1})
              $('.contentImgZoom img').css({'top':-1})

              zoom_topImg = 0;
              $(zoom_imgClass).css({'top': -zoom_topImg})
            }else if(zoom_posY > zoom_limitY){
              $('.contentImgZoom').css({'top':zoom_limitY})
              $('.contentImgZoom img').css({'top':-zoom_limitY})

              zoom_topImg = zoom_alturaImgTemp-zoom_alturadiv;
              $(zoom_imgClass).css({'top': -zoom_topImg})
            }else{
              $('.contentImgZoom').css({'top':zoom_posY})
              $('.contentImgZoom img').css({'top':-zoom_posY})

              zoom_topImg = (zoom_posY*zoom_alturaImgTemp)/hImgzoom;
              $(zoom_imgClass).css({'top': -zoom_topImg})
            }
          }
        }
      }
    }).on('mouseenter', '.mouseReferency', function(event) {
      disable_scroll();
      event.stopPropagation();
      
      if(zoom_flagZoom == true){
        zoom_flagZoom = false;

        var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x
        $(this).bind(mousewheelevt, function(e){
          zoom_posX = zoom_x-(tempW2/2);
          zoom_posY = zoom_y-(tempH2/2);
          zoom_limitX = wBoxLayer-tempW2;
          zoom_limitY = hBoxLayer-tempH2;


          var evt = window.event || e //equalize event object     
          evt = evt.originalEvent ? evt.originalEvent : evt; //convert to originalEvent if possible               
          delta = evt.detail ? evt.detail*(-40) : evt.wheelDelta //check for detail first, because it is used by Opera and FF
          if(delta > 0) {
            if(zoom_num < (widthContentZoom-30)){
              zoom_num++;
            }
            zoomUpImg();

            var totalBarra = $('.contentDrag').width() 
            var larguraBtZoom = $('.objectDrag').width();
            var larguraBarra = zoom_num + (larguraBtZoom/2);
            if(zoom_num < (totalBarra - larguraBtZoom)){
              $('.lineDrag').width(larguraBarra);
              $('.objectDrag').css('left', zoom_num);
            }

          }else{
            if(zoom_num > 0){
              zoom_num--;
            }
            zoomDownImg();
            var totalBarra = $('.contentDrag').width() 
            var larguraBtZoom = $('.objectDrag').width();
            var larguraBarra = zoom_num + (larguraBtZoom/2);
            if(zoom_num > -1 && zoom_num < (totalBarra - larguraBtZoom)){
              $('.lineDrag').width(larguraBarra);
              $('.objectDrag').css('left', zoom_num);
            }       
          }  
          zoomPosition();
        });
      }
    }).on('click', '.mouseReferency', function(e){
      event.stopPropagation();
      if(flagZoomMove == true){
        flagZoomMove = false;
      }else{
        flagZoomMove = true;
      }
    });
    
    if(parametrosZoom.imageZoom == true){
      $(zoom_boxZoom).on('mouseenter','.scrollImage',function(event) {
        disable_scroll();
        var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x
        $(this).bind(mousewheelevt, function(e){
          zoom_posX = zoom_x-(tempW2/2);
          zoom_posY = zoom_y-(tempH2/2);
          zoom_limitX = wBoxLayer-tempW2;
          zoom_limitY = hBoxLayer-tempH2;


          var evt = window.event || e //equalize event object     
          evt = evt.originalEvent ? evt.originalEvent : evt; //convert to originalEvent if possible               
          delta = evt.detail ? evt.detail*(-40) : evt.wheelDelta //check for detail first, because it is used by Opera and FF
          if(delta > 0) {
            if(zoom_num < (widthContentZoom-30)){
              if((navigator.userAgent.indexOf('Win')!= -1)){
                zoom_num += 5;
              }else{
                zoom_num++;
              }
              
            }
            zoomUpImg();

            var totalBarra = $('.contentDrag').width() 
            var larguraBtZoom = $('.objectDrag').width();
            var larguraBarra = zoom_num + (larguraBtZoom/2);
            if(zoom_num < (totalBarra - larguraBtZoom)){
              $('.lineDrag').width(larguraBarra);
              $('.objectDrag').css('left', zoom_num);
            }

          }else{
            if(zoom_num > 0){
              if((navigator.userAgent.indexOf('Win')!= -1)){
                zoom_num -= 5;
              }else{
                zoom_num--;
              }
            }
            zoomDownImg();
            var totalBarra = $('.contentDrag').width() 
            var larguraBtZoom = $('.objectDrag').width();
            var larguraBarra = zoom_num + (larguraBtZoom/2);
            if(zoom_num > -1 && zoom_num < (totalBarra - larguraBtZoom)){
              $('.lineDrag').width(larguraBarra);
              $('.objectDrag').css('left', zoom_num);
            }       
          }  
          zoom_posX = $('.contentImgZoom').position().left;
          zoom_posY = $('.contentImgZoom').position().top;
          if(zoom_posX < 0){zoom_posX = 0}
          if(zoom_posY < 0){zoom_posY = 0}
          zoomPosition();
        });
      })
    }
    
    
  }
  if(parametrosZoom.buttonDrag == true){
    buttonDragReferency()
  }

  if(parametrosZoom.imageDrag == true){
    imgDragReferency()
  }

}
var zoom_numAnterior = 0;
var prevX = -1;
function buttonDragReferency(){
  var html = "<div class='boxDrag'>"
       + "<div class='contentDrag'>"
       + "<div class='objectDrag'></div>"
       + "<div class='lineDrag'></div>"
       + "</div></div>"
  $('.zoomReferency').append(html);

  var ox =$('.objectDrag').offset().left;
  var oy =$('.objectDrag').offset().top;
  
  $(".objectDrag").draggable( { containment: "parent" },{ axis: "x" },{
    start: function(event) {
      //event.stopPropagation();
    },
    drag: function( event, ui ) {
      var posicaoX = $(this).position();
      var larguraBtZoom = $(this).width();
      var totalBarra = $(this).parent().width() - larguraBtZoom;
      var espacozoom_numV = totalBarra/zoom_numtotalV;
      var espacozoom_numH = totalBarra/zoom_numtotalH;
            
      var larguraBarra = posicaoX.left + (larguraBtZoom/2);
      var espacozoom_numAtual = posicaoX.left;
      zoom_num = parseInt(posicaoX.left);
      $('.lineDrag').width(larguraBarra);
      
      if(prevX > event.pageX) {
        zoomDownImg();
        zoom_numAnterior = zoom_num;
      }else if(prevX < event.pageX) {// dragged right
        zoomUpImg();
        zoom_numAnterior = zoom_num;
      }
      prevX = event.pageX;
      var leftBox = (boxWImgzoom - tempW2)/2
      var topBox = (boxHImgzoom - tempH2)/2
      if(tempW2 > boxWImgzoom){leftBox = 0}
      if(tempH2 > boxHImgzoom){topBox = -1}
      $('.contentImgZoom').css({'top':topBox, 'left':(leftBox-2)});
      $('.contentImgZoom img').css({'top':-topBox,'left':-leftBox});
      zoom_topImg = (zoom_alturadiv-zoom_alturaImgTemp)/2;
      zoom_leftImg = (zoom_larguradiv-zoom_larguraImgTemp)/2;
      $(zoom_imgClass).css({'left': zoom_leftImg,'top': zoom_topImg});
    },
    stop: function() {

    }    
  });
}

function imgDragReferency(){
  var larguraDragImg;
  var alturaDragImg;
  var leftAtual;
  var topAtual;
  $(zoom_imgClass).draggable( { snap: zoom_boxZoom , cursor: "pointer"},{
    start: function(event) {
      larguraDragImg = $(this).width();
      alturaDragImg = $(this).height();
    },
    drag: function( event, ui ) {
      var posicao = $(this).position();
      leftAtual = posicao.left;
      topAtual = posicao.top;   
      var leftContentZoom = (leftAtual*boxWImgzoom)/larguraDragImg;
      var topContentZoom = (topAtual*boxHImgzoom)/alturaDragImg;
      var posicaoTempleft = larguraDragImg - zoom_larguradiv;
      var posicaoTemptop = alturaDragImg - zoom_alturadiv;
      var flagAndarX = false;
      var flagAndarY = false;

      if(leftAtual > 0){
        leftContentZoom = 0;
      }else if(leftAtual < -(posicaoTempleft)){
        leftContentZoom = (((-posicaoTempleft)*boxWImgzoom)/larguraDragImg)+1;
      }

      if(larguraDragImg < zoom_larguradiv){
        leftContentZoom = 0;
      }

      if(topAtual > 0){
        topContentZoom = 0;
      }else if(topAtual < -(posicaoTemptop)){
        topContentZoom = ((-posicaoTemptop)*boxHImgzoom)/alturaDragImg;
      }

      if(alturaDragImg < zoom_alturadiv){
        topContentZoom = 0;
      }

      $('.contentImgZoom').css({'left':-leftContentZoom, 'top':-topContentZoom});
      $('.contentImgZoom img').css({'left':leftContentZoom, 'top':topContentZoom});
      $(zoom_imgClass).addClass('handler');
    },
    stop: function() {
      $(zoom_imgClass).removeClass('handler');
      var posicaoTempleft = larguraDragImg - zoom_larguradiv;
      var posicaoTemptop = alturaDragImg - zoom_alturadiv;
      var flagAndarX = false;
      var flagAndarY = false;
      var andarTop = 0;
      var andarLeft = 0;
      
      if(leftAtual > 0){
        andarLeft = 0;
        flagAndarX = true;
      }else if(leftAtual < -(posicaoTempleft)){
        andarLeft = -posicaoTempleft;
        flagAndarX = true;
      }
      if(posicaoTempleft < 0){
        andarLeft = (zoom_larguradiv - larguraDragImg)/2;
        flagAndarX = true;
      }

      if(topAtual > 0){
        andarTop = 0;
        flagAndarY = true;
      }else if(topAtual < -(posicaoTemptop)){
        andarTop = -posicaoTemptop;  
        flagAndarY = true;
      }

      if(posicaoTemptop < 0){
        andarTop = (zoom_alturadiv - alturaDragImg)/2;
        flagAndarY = true;
      }

      if(flagAndarX == true && flagAndarY == false){
        $(zoom_imgClass).animate({'left': andarLeft}, 300)
      }else if(flagAndarX == false && flagAndarY == true){
        $(zoom_imgClass).animate({'top': andarTop}, 300)
      }else if(flagAndarX == true && flagAndarY == true){
        $(zoom_imgClass).animate({'top': andarTop,'left': andarLeft}, 300)
      }
    }    
    
  });
  $(zoom_imgClass).draggable('disable');

}

var zoom_numTempH = 0;
var zoom_numTempW = 0;
var flagAltura = true;
var flagLargura = true;
function zoomUpImg(){
  console.log(parametrosZoom.imageDrag);

  var tempW4 = zoom_larguraImgInicial + zoom_num*zoom_numImgW;
  var tempH4 = zoom_alturaImgInicial + zoom_num*zoom_numImgH;

  if(parametrosZoom.imageDrag == true){ 
    $(zoom_imgClass).draggable('enable');

    if(type == 2){
      if(zoom_alturaImgTemp > zoom_alturadiv){
        $(zoom_imgClass).draggable({ axis: false});
        tempH2 = (zoom_alturadiv*boxHImgzoom)/tempH4;
      }else{
        $(zoom_imgClass).draggable({ axis: "x"});
        tempH2 = boxHImgzoom;
      }
      tempW2 = ((zoom_larguradiv*boxWImgzoom)/tempW4)-2;
    }else if(type == 3){
      if(zoom_larguraImgTemp > zoom_larguradiv){
        $(zoom_imgClass).draggable({ axis: false});
        tempW2 = ((zoom_larguradiv*boxWImgzoom)/tempW4)-2;
      }else{
        $(zoom_imgClass).draggable({ axis: "y"});
        tempW2 = boxWImgzoom;
      }
      tempH2 = (zoom_alturadiv*boxHImgzoom)/tempH4;
    }
  }else{
    if(type == 2){
      if(zoom_alturaImgTemp > zoom_alturadiv){
        tempH2 = (zoom_alturadiv*boxHImgzoom)/tempH4;
      }else{
        tempH2 = boxHImgzoom;
      }
      tempW2 = ((zoom_larguradiv*boxWImgzoom)/tempW4)-2;
    }else if(type == 3){
      if(zoom_larguraImgTemp > zoom_larguradiv){
        tempW2 = ((zoom_larguradiv*boxWImgzoom)/tempW4)-2;
      }else{
        tempW2 = boxWImgzoom;
      }
      tempH2 = (zoom_alturadiv*boxHImgzoom)/tempH4;
    }
  }

  
  
  zoom_larguraImgTemp = tempW4;
  zoom_alturaImgTemp =  tempH4;
  
  $(zoom_imgClass).css({'width': zoom_larguraImgTemp,'height': zoom_alturaImgTemp});
  $('.contentImgZoom').css({'width':tempW2,'height': tempH2});
}


function zoomDownImg(){
  var tempW4 = zoom_larguraImgInicial + zoom_num*zoom_numImgW;
  var tempH4 = zoom_alturaImgInicial + zoom_num*zoom_numImgH;

  if(parametrosZoom.imageDrag == true){ 
    if(type == 2){
      if(zoom_alturaImgTemp > zoom_alturadiv){
        $(zoom_imgClass).draggable({ axis: false});
        tempH2 = (zoom_alturadiv*boxHImgzoom)/tempH4;
      }else{
        $(zoom_imgClass).draggable({ axis: "x"});
        tempH2 = boxHImgzoom;
      }
      tempW2 = ((zoom_larguradiv*boxWImgzoom)/tempW4);
    }else if(type == 3){
      if(zoom_larguraImgTemp > zoom_larguradiv){
        $(zoom_imgClass).draggable({ axis: false});
        tempW2 = ((zoom_larguradiv*boxWImgzoom)/tempW4);
      }else{
        $(zoom_imgClass).draggable({ axis: "y"});
        tempW2 = boxWImgzoom;
      }
      tempH2 = (zoom_alturadiv*boxHImgzoom)/tempH4;
    }
    if(zoom_num == 0){
      $(zoom_imgClass).draggable('disable')
    }
  }else{
    if(type == 2){
      if(zoom_alturaImgTemp > zoom_alturadiv){
        tempH2 = (zoom_alturadiv*boxHImgzoom)/tempH4;
      }else{
        tempH2 = boxHImgzoom;
      }
      tempW2 = ((zoom_larguradiv*boxWImgzoom)/tempW4);
    }else if(type == 3){
      if(zoom_larguraImgTemp > zoom_larguradiv){
        tempW2 = ((zoom_larguradiv*boxWImgzoom)/tempW4);
      }else{
        tempW2 = boxWImgzoom;
      }
      tempH2 = (zoom_alturadiv*boxHImgzoom)/tempH4;
    }
  }
  
  zoom_larguraImgTemp = tempW4;
  zoom_alturaImgTemp =  tempH4;
  
  $(zoom_imgClass).css({'width': zoom_larguraImgTemp,'height': zoom_alturaImgTemp});
  $('.contentImgZoom').css({'width':tempW2,'height': tempH2});
}


function zoomPosition(){
  if(zoom_larguraImgTemp > zoom_larguradiv){
    if(zoom_posX < -2){
      $('.contentImgZoom').css({'left':-2})
      $('.contentImgZoom img').css({'left':1})
                  
      zoom_posX = 1;
      $(zoom_imgClass).css({'left': 0})
    }else if(zoom_posX > (zoom_limitX-1)){
      $('.contentImgZoom').css({'left':zoom_limitX})
      $('.contentImgZoom img').css({'left':-zoom_limitX})
                  
      zoom_leftImg = zoom_larguraImgTemp-zoom_larguradiv;
      $(zoom_imgClass).css({'left': -zoom_leftImg})
    }else{

      $('.contentImgZoom').css({'left':zoom_posX})
      $('.contentImgZoom img').css({'left':-zoom_posX})
                  
      zoom_leftImg = (zoom_posX*zoom_larguraImgTemp)/wImgzoom;
      $(zoom_imgClass).css({'left': -zoom_leftImg})
    }
  }else{
    $('.contentImgZoom').css({'left':-2})
    $('.contentImgZoom img').css({'left':1})
    zoom_leftImg = (zoom_larguradiv-zoom_larguraImgTemp)/2;
    $(zoom_imgClass).css({'left': zoom_leftImg});
  }

  if(zoom_alturaImgTemp > zoom_alturadiv){
    if(zoom_posY < -2){
      $('.contentImgZoom').css({'top':-1})
      $('.contentImgZoom img').css({'top':-1})

      zoom_topImg = 1;
      $(zoom_imgClass).css({'top': -zoom_topImg})
    }else if(zoom_posY > zoom_limitY){
      $('.contentImgZoom').css({'top':zoom_limitY})
      $('.contentImgZoom img').css({'top':-zoom_limitY})

      zoom_topImg = zoom_alturaImgTemp-zoom_alturadiv;
      $(zoom_imgClass).css({'top': -zoom_topImg})
    }else{
      $('.contentImgZoom').css({'top':zoom_posY})
      $('.contentImgZoom img').css({'top':-zoom_posY})

      zoom_topImg = (zoom_posY*zoom_alturaImgTemp)/hImgzoom;
       $(zoom_imgClass).css({'top': -zoom_topImg})
    }
  }else{
    $('.contentImgZoom').css({'top':-1})
    $('.contentImgZoom img').css({'top':-1})
    zoom_topImg = (zoom_alturadiv-zoom_alturaImgTemp)/2;
    $(zoom_imgClass).css({'top': zoom_topImg});
  }
} 

function responsiveZoom(){
  dimensaoImg();
  if(parametrosZoom.typeZoom == 'referency'){

    boxWImgzoom = widthContentZoom-10;
    boxHImgzoom = heightContentZoom-10;
    boxTImgZoom = -1;
    boxLImgZoom = -1;
    TImgZoom = 0;
    LImgZoom = 0;
    zoom_num = 0;
    zoom_numAnterior = 0;

    $('.contentImgZoom').css({'width': boxWImgzoom, 'height': boxHImgzoom, 'top': boxTImgZoom, 'left': boxLImgZoom});
    $('.contentImgZoom img').css({'top': TImgZoom, 'left': LImgZoom});
    $('.lineDrag').width(10);
    $('.objectDrag').css('left', 0);

    tempW = zoom_larguraImgTemp;
    tempW2 = boxWImgzoom;
    tempW3 = boxWImgzoom;
    tempH = zoom_alturaImgTemp;
    tempH2 = boxHImgzoom;
    TempH3 = boxHImgzoom;

    if(type == 2){
      widthImgContent = (zoom_alturadiv*zoom_larguraImg)/zoom_alturaImg;
      heightImgContent = zoom_alturadiv;
    }else if(type == 3){
      widthImgContent = zoom_larguradiv;
      heightImgContent = (zoom_larguradiv*zoom_alturaImg)/zoom_larguraImg;
    }

    zoom_numeros();
  }
};

function zoom_numeros(){
  zoom_diferencaImgW = zoom_larguraImgMax - zoom_larguraImgInicial;
  zoom_diferencaImgH = zoom_alturaImgMax - zoom_alturaImgInicial;
  zoom_diferencaboxW = boxWImgzoom - zoom_larguraBoxMin;
  zoom_diferencaboxH = boxHImgzoom - zoom_alturaBoxMin;
  zoom_numImgW = zoom_diferencaImgW/(widthContentZoom-20);
  zoom_numImgH = zoom_diferencaImgH/(widthContentZoom-20);
  zoom_numboxW = zoom_diferencaboxW/(widthContentZoom-20);
  zoom_numboxH = zoom_diferencaboxH/(widthContentZoom-20);

  if(zoom_larguraImgMax > zoom_larguradiv || zoom_alturaImgMax > zoom_alturadiv){
    $('.zoomReferency').show();
  }else{
    $('.zoomReferency').hide();
  }
}

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = [37, 38, 39, 40];

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function keydown(e) {
    for (var i = keys.length; i--;) {
        if (e.keyCode === keys[i]) {
            preventDefault(e);
            return;
        }
    }
}
function wheel(e) {
  preventDefault(e);
}
function disable_scroll() {
    if (window.addEventListener) {
        window.addEventListener('DOMMouseScroll', wheel, false);
    }
    window.onmousewheel = document.onmousewheel = wheel;
    document.onkeydown = keydown;
}
function enable_scroll() {
    if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', wheel, false);
    }
    window.onmousewheel = document.onmousewheel = document.onkeydown = null;  
}