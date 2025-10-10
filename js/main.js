// ヒーロー動画をクロスフェードで切り替え
document.addEventListener('DOMContentLoaded', function() {
	var stacks = document.querySelectorAll('.hero-video-stack[data-hero-sources]');
	stacks.forEach(function(stack) {
		var sourcesAttr = stack.dataset.heroSources || '';
		var sources = sourcesAttr.split('|').map(function(path) {
			return path.trim();
		}).filter(Boolean);
		if (!sources.length) {
			return;
		}

		stack.innerHTML = '';

		var videos = sources.map(function(src, index) {
			var video = document.createElement('video');
			video.className = 'hero-video' + (index === 0 ? ' is-active' : '');
			video.src = src;
			video.autoplay = false;
			video.loop = false;
			video.muted = true;
			video.setAttribute('muted', '');
			video.playsInline = true;
			video.setAttribute('playsinline', '');
			video.preload = 'auto';
			stack.appendChild(video);
			return video;
		});

		if (!videos.length) {
			return;
		}

		var activeIndex = 0;
		var fadeLead = 0.9;

		var ensurePlayback = function(video) {
			var playPromise = video.play();
			if (playPromise && typeof playPromise.then === 'function') {
				playPromise.catch(function() {
					// 自動再生がブロックされた場合はそのまま無視
				});
			}
		};

		ensurePlayback(videos[activeIndex]);

		if (videos.length === 1) {
			videos[0].loop = true;
			return;
		}

		var switchTo = function(nextIndex) {
			if (nextIndex === activeIndex) {
				return;
			}
			var currentVideo = videos[activeIndex];
			var nextVideo = videos[nextIndex];
			if (!nextVideo) {
				return;
			}

			nextVideo.currentTime = 0;
			ensurePlayback(nextVideo);
			nextVideo.classList.add('is-active');

			var pauseAfterFade = function(event) {
				if (event.propertyName !== 'opacity') {
					return;
				}
				currentVideo.pause();
				currentVideo.currentTime = 0;
				currentVideo.removeEventListener('transitionend', pauseAfterFade);
			};
			currentVideo.addEventListener('transitionend', pauseAfterFade);
			currentVideo.classList.remove('is-active');
			activeIndex = nextIndex;
		};

		videos.forEach(function(video, index) {
			var switchScheduled = false;
			var ensureSwitch = function() {
				if (switchScheduled) {
					return;
				}
				switchScheduled = true;
				var nextIndex = (index + 1) % videos.length;
				switchTo(nextIndex);
			};

			video.addEventListener('play', function() {
				switchScheduled = false;
			});

			video.addEventListener('timeupdate', function() {
				if (!video.duration || video.duration === Infinity) {
					return;
				}
				if (video.duration - video.currentTime <= fadeLead) {
					ensureSwitch();
				}
			});

			video.addEventListener('ended', ensureSwitch);
		});
	});
});

//タイマー
$(function() {
	var timer = false;
	$(window).resize(function() {
		if(timer !== false){
			clearTimeout(timer);
		}
		timer = setTimeout(function() {
		}, 500);
	});
});


// menu
$(window).on("load resize", function() {
	setTimeout(function(){

		var winW = window.innerWidth;
		var winBP = 800;	//ブレイクポイント

			//小さな端末用
			if(winW < winBP) {
				$('body').addClass('s').removeClass('p');
				$('#menubar').addClass('dn').removeClass('db');
				$('#menubar_hdr').addClass('db').removeClass('dn').removeClass('ham');
					
			//大きな端末用
			} else {
				$('body').addClass('p').removeClass('s');
				$('#menubar').addClass('db').removeClass('dn');
				$('#menubar_hdr').removeClass('db').addClass('dn');
			}

	}, 100);
});


//ハンバーガーメニューをクリックした際の処理
$(function() {
	$('#menubar_hdr').click(function() {
		$(this).toggleClass('ham');

			if($(this).hasClass('ham')) {
				$('#menubar').addClass('db').removeClass('dn');
			} else {
				$('#menubar').addClass('dn').removeClass('db');
			}

	});
});


// 同一ページへのリンクの場合に開閉メニューを閉じる処理
$(function() {
	$('#menubar a[href^="#"]').click(function() {
		$('#menubar').removeClass('db');
		$('#menubar_hdr').removeClass('ham');
	});
});


//ドロップダウンの親liタグ
$(function() {
    $('#mainmenu a[href=""]').click(function() {
		return false;
    });
});


//ドロップダウンメニューの処理
$(function(){

	$('#menubar li:has(ul)').addClass('ddmenu_parent');
	$('#mainmenu li:has(ul)').addClass('ddmenu_parent');
	$('.ddmenu_parent > a').addClass('ddmenu');

		//タッチデバイス用
		$('.ddmenu').on('touchstart', function() {
			$(this).next('ul').stop().slideToggle();
			$('.ddmenu').not(this).next('ul').slideUp();
			return false;
		});

		//PC用
		$('.ddmenu_parent').hover(function() {
			$(this).children('ul').stop().slideToggle();
		});

});


//pagetop
$(function() {
    var scroll = $('.pagetop');
    var scrollShow = $('.pagetop-show');
        $(scroll).hide();
        $(window).scroll(function() {
            if($(this).scrollTop() >= 300) {
                $(scroll).fadeIn().addClass(scrollShow);
            } else {
                $(scroll).fadeOut().removeClass(scrollShow);
            }
        });
});


//スムーススクロール
$(window).on('load', function() {
	var hash = location.hash;
	if(hash) {
		$('body,html').scrollTop(0);
		setTimeout(function() {
			var target = $(hash);
			var scroll = target.offset().top;
			$('body,html').animate({scrollTop:scroll},500);
		}, 100);
	}
});
$(window).on('load', function() {
    $('a[href^="#"]').click(function() {
        var href = $(this).attr('href');
        var target = href == '#' ? 0 : $(href).offset().top;
            $('body,html').animate({scrollTop:target},500);
            return false;
    });
});


// 汎用開閉処理
$(function() {
	$('.openclose').next().hide();
	$('.openclose').click(function() {
		$(this).next().slideToggle();
		$('.openclose').not(this).next().slideUp();
	});
});


//h2の中に下線用のスタイルを作る
$(function() {
	$('main h2').wrapInner('<span class="uline">');
});
