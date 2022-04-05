/* Carrossel de imagens de fundo
* Criado: 17 de janeiro de 2012 por DynamicDrive.com. Este aviso deve permanecer intacto para uso
* Autor: Dynamic Drive em http://www.dynamicdrive.com/
* Visite http://www.dynamicdrive.com/ para obter o código-fonte completo
*/

//** Modificado em 23 de janeiro, 12'- Corrigido o erro com o erro de rotação automática no modo "manual"
//** Modificado em 21 de fevereiro, 12'- Corrigido bug com carrossel nem sempre inicializando no IE8 e menos
//** Modificado em 26 de junho de 14 para v1.1': agora há suporte para dimensões flexíveis de carrossel, deslize para navegar adicionado, além de outros pequenos aprimoramentos.
//** Modificado em 27 de junho de 14: Corrigido o problema de fade in/out dos botões de navegação

jQuery.noConflict()

function bgCarousel(opções){
	var $=jQuery
	this.setting={displaymode:{type:'auto', pause:2000, stoponclick:false, cycles:2, pauseonmouseover:true}, activeslideclass:'selectedslide', orientação:'h', persist:true, slideduration:500 } //configurações padrão
	jQuery.extend(this.setting, options) //mesclar configurações padrão com opções
	this.setting.displaymode.pause+=400+this.setting.slideduration // 400ms é o fade in time padrão
	var curslide=(this.setting.persist)? bgCarousel.routines.getCookie("slider-"+this.setting.wrapperid) : 0
	this.curslide=(curslide==null || curslide>this.setting.imagearray.length-1)? 0 : parseInt(curslide) //verifica se o índice do curslide está dentro dos limites
	this.curstep=0
	this.animation_isrunning=false //variável para indicar se uma imagem está sendo deslizada no momento
	this.posprop=(this.setting.orientation=="h")? "esquerda" : "topo"
	opções=nulo
	var slideshow=this, setting=this.setting, preloadimages=[], imagesloaded=0, slidesHTML=''
	for (var i=0, max=setting.imagearray.length; i<max; i++){ //pré-carregar imagens
		preloadimages[i]=nova Imagem()
		$(preloadimages[i]).bind('load error', function(){
			imagens carregadas++
			if (imagesloaded==max){ //quando todas as imagens forem pré-carregadas
		$(function(){ //em document.ready
			slideshow.init($, slidesHTML)
		})
			}
		})
		preloadimages[i].src=setting.imagearray[i][0]
		slidesHTML+=bgCarousel.routines.getSlideHTML(setting, setting.imagearray[i], '100%', '100%', this.posprop)+'\n'
	}

	função positioncontrols($controls){
		var winwidth = $(window).outerWidth(),
				winheight = $(window).outerHeight(),
				controlwidth = $controls.eq(0).width(),
				controlheight = $controls.eq(0).height(),
				controltop, controlleft
				
		if (configuração.orientação == 'h'){
			controltop = (setting.dimensions[1] > winheight)? winheight/2 : '50%'
			$controls.css({top: controltop, marginTop: -controlheight/2})
		}
		senão if (configuração.orientação == 'v'){
			controlleft = (setting.dimensions[0] > winwidth)? winwidth/2: '50%'
			$controls.css({left: controlleft, marginLeft: -controlwidth/2})
		}
	}
	this.positioncontrols = positioncontrols

	$(window).bind('unload', function(){ //no carregamento da janela
		if (slideshow.setting.persist) //lembra o índice do último slide mostrado?
			bgCarousel.routines.setCookie("slider-"+setting.wrapperid, slideshow.curslide)
	})

	$(window).bind('resize', function(){
		if (configuração.dimensões){
			setting.dimensions=[slideshow.$wrapperdiv.width(), slideshow.$wrapperdiv.height()]
			positioncontrols(apresentação de slides.$controls)
		}
	})

}

bgCarousel.prototype={

	slide:function(nextslide, dir){ //valores possíveis para dir: "left", "right", "top" ou "down"
		if (this.curslide==nextslide)
			Retorna
		var slider=this, setting=this.setting
		var createobj=bgCarousel.routines.createobj
		var nextslide_initialpos=setting.dimensions[(dir=="right"||dir=="left")? 0 : 1] * ((dir=="right"||dir=="down")? -1 : 1)
		var curslide_finalpos=-nextslide_initialpos
		var posprop=this.posprop
		if (this.animation_isrunning!=null)
			this.animation_isrunning=true //indica que a animação está em execução
		this.$imageslides.eq(nextslide).show().css(createobj([posprop, nextslide_initialpos], ['opacity', 0.5])) //mostra o próximo slide
			.stop().velocity(createobj([posprop, 0]), setting.slideduration, function(){
				var $this=jQuery(this)
				$this.addClass(setting.activeslideclass).velocity({opacity:1})
				.find('div.desc').stop().velocity({top:slider.descoffsettop, opacity: 1})
				slider.animation_isrunning=false
			})
			.find('div.desc').css({top: '-=100%', opacidade: 0})

		this.$imageslides.eq(this.curslide)
			.removeClass(setting.activeslideclass)
			.stop().velocity(createobj([posprop, curslide_finalpos]), setting.slideduration, function(){
					var $this=jQuery(this)
					$this.hide()
			}) //oculta o slide de saída

		this.curslide=nextslide
	},

	navegue:função(palavra-chave){ //palavra-chave: "voltar" ou "avançar"
		var slideshow=this, setting=this.setting
		clearTimeout(this.rotatetimer)
		if (!setting.displaymode.stoponclick && setting.displaymode.type!="manual"){ //se o controle deslizante deve continuar girando automaticamente após os botões de navegação serem clicados
			this.curstep=(keyword=="voltar")? this.curstep-1 : this.curstep+1 //move o contador de curstep explicitamente para trás ou para frente dependendo da direção do slide
			this.rotatetimer=setTimeout(function(){slideshow.rotate()}, setting.displaymode.pause)
		}
		var dir=(palavra-chave=="voltar")? (setting.orientation=="h"? "right" : "down") : (setting.orientation=="h"? "left" : "up")	
		var targetslide=(keyword=="voltar")? this.curslide-1 : this.curslide+1
		targetslide=(targetslide<0)? this.$imageslides.length-1 : (targetslide>this.$imageslides.length-1)? 0 : targetslide //envolvendo
		if (this.animation_isrunning==false)
			this.slide(targetslide, dir)
	},

	girar:função(){
		var slideshow=this, setting=this.setting
		if (this.ismouseover){ //pausa a apresentação de slides ao passar o mouse
			this.rotatetimer=setTimeout(function(){slideshow.rotate()}, setting.displaymode.pause)
			Retorna
		}
		var nextslide=(this.curslide<this.$imageslides.length-1)? this.curslide+1 : 0
		this.slide(nextslide, this.posprop) // vai para o próximo slide, para a esquerda ou para cima, dependendo da configuração de configuração.orientação
		if (setting.displaymode.cycles==0 || this.curstep<this.maxsteps-1){
			this.rotatetimer=setTimeout(function(){slideshow.rotate()}, setting.displaymode.pause)
			this.curstep++
		}
	},

	init:function($, slidesHTML){
		var slideshow=this, setting=this.setting
		this.$wrapperdiv=$('#'+setting.wrapperid)
		setting.dimensions=[this.$wrapperdiv.width(), this.$wrapperdiv.height()]
		this.$wrapperdiv.css({position:'relative', visible:'visible', overflow:'hidden', backgroundImage:'none'})
		if (this.$wrapperdiv.length==0){ //se nenhum DIV wrapper encontrado
			alert("Erro: DIV com ID \""+setting.wrapperid+"\" não encontrado na página.");
			Retorna
		}
		this.$wrapperdiv.html(slidesHTML)
		this.$imageslides=this.$wrapperdiv.find('div.slide').hide()
		this.descoffsettop = this.$imageslides.eq(0).find('div.desc').css('top')
		this.$imageslides.eq(this.curslide).show()
			.css(bgCarousel.routines.createobj(['opacity', 0.5], [this.posprop, 0])) // define a posição CSS do slide atual (ou "esquerda" ou "topo") como 0
			.addClass(setting.activeslideclass)
			.stop().velocity({opacity:1})
			.find('div.desc').css({top: '-=100%', opacity: 0}).velocity({top:this.descoffsettop, opacity: 1})
		var orientação=configuração.orientação
		var caminhos de controle=(orientação=="h")? setting.navbuttons.slice(0, 2) : setting.navbuttons.slice(2)
		var $controls = $('<img class="navbutton" src="'+controlpaths[1]+'" data-dir="forth" style="position:absolute; z-index:5; cursor:pointer; ' + (orientation=='v'? 'bottom:8px; left:46%' : 'top:46%; right:8px;') + '" />'
			+ '<img class="navbutton" src="'+controlpaths[0]+'" data-dir="back" style="position:absolute;z-index:5; cursor:pointer; ' + (orientation= ='v'? 'topo:8px; esquerda:45%' : 'topo:45%; esquerda:8px;') + '" />'
		)
		.css({opacity:0})
		.click(function(){
			var palavra-chave = this.getAttribute('data-dir')
			setting.curslide = (palavra-chave == "certo")? (setting.curslide == setting.content.length-1? 0 : setting.curslide + 1)
				: (setting.curslide == 0? setting.content.length-1 : setting.curslide - 1)
			slideshow.navigate(palavra-chave)
		})
		this.$controls = $controls.appendTo(this.$wrapperdiv)
		this.positioncontrols(this.$controls)
		if (setting.displaymode.type=="auto"){ //modo de slide automático?
			setting.displaymode.pause+=setting.slideduration
			this.maxsteps=setting.displaymode.cycles * this.$imageslides.length
			if (setting.displaymode.pauseonmouseover){
				this.$wrapperdiv.mouseenter(function(){slideshow.ismouseover=true})
				this.$wrapperdiv.mouseleave(function(){slideshow.ismouseover=false})
			}
			this.rotatetimer=setTimeout(function(){slideshow.rotate()}, setting.displaymode.pause)
		}

		var swipeOptions={ // desliza as variáveis ​​do objeto
			triggerOnTouchEnd : true,
			triggerOnTouchLeave : true,
			allowPageScroll: setting.orientation == 'h'? "vertical Horizontal",
			swipethreshold: configuração.swipethreshold,
			Elementos excluídos:[]
		}

		swipeOptions.swipeStatus = function(evento, fase, direção, distância){
			if (phase == 'start' && event.target.tagName == 'A'){ // cancela Uma ação quando o dedo faz contato com o elemento
				evtparent.onclick = function(){
					retorna falso
				}
			}
			if (phase == 'cancel' && event.target.tagName == 'A'){ // se a ação de passar o dedo for cancelada (portanto, não é necessário passar o dedo), habilitar A ação
				evtparent.onclick = function(){
					retornar verdadeiro
				}
			}
			if (fase == 'fim'){
				var navkeyword = /(direita)|(baixo)/i.test(direção)? 'voltar': 'avançar'
				if ( (configuração.orientação == 'h' && /(esquerda)|(direita)/i.test(direção)) || (configuração.orientação == 'v' && /(cima)|(baixo)/i .test(direção)) )
					slideshow.navigate(navkeyword)
			}
		}

		if (this.$wrapperdiv.swipe){
			this.$wrapperdiv.swipe(swipeOptions)
		}

		this.$wrapperdiv.bind('clique do mouse', function(){
			if (apresentação de slides.$controles && apresentação de slides.$controles.comprimento == 2){
				apresentação de slides.$controls.stop().velocity({opacity: 1})
			}
		})
	
		this.$wrapperdiv.bind('mouseleave', function(){
			if (apresentação de slides.$controles && apresentação de slides.$controles.comprimento == 2){
				slideshow.$controls.stop().velocity({opacity: 0}, 'fast')
			}
		})
	}

}

bgCarousel.routines={

	getSlideHTML:function(setting, imgref, w, h, posprop){
		var posstr=posprop+":"+((posprop=="esquerda")? w : h)
		return '<div class="slide" style="background-image:url(' + imgref[0] + '); position:absolute;'+posstr+';width:'+w+'; height:'+h+' ;">'
							+ ((imgref[1])? '<div class="desc">' + imgref[1] + '</div>\n' : '')
							+ '</div>'
	},

	getCookie:função(Nome){
		var re=new RegExp(Nome+"=[^;]+", "i"); //construir RE para procurar o par nome/valor do alvo
		if (document.cookie.match(re)) //se o cookie for encontrado
			return document.cookie.match(re)[0].split("=")[1] //retorna seu valor
		retornar nulo
	},

	setCookie:função(nome, valor){
		document.cookie = nome+"=" + valor + ";caminho=/"
	},

	createobj:function(){
		var obj={}
		for (var i=0; i<argumentos.comprimento; i++){
			obj[argumentos[i][0]]=argumentos[i][1]
		}
		retornar obj
	}
}
