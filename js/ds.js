String.prototype.rsplit = function(sep, maxsplit) {
    var split = this.split(sep);
    
    return maxsplit ? [ split.slice(0, -maxsplit).join(sep) ].concat(split.slice(-maxsplit)) : split;
}

String.prototype.f = function() {
    var s = this;
    var i = arguments.length;
    
    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    
    return s;
};


function processDot(dot, multi) {
    var scrot = dot.prev('div#scrot');
    var overlay = dot.next('div.overlay');
    var header = dot.parent().prev();
    var minimize = dot.next().next('div.minimize');
    var table = dot.children('table.highlighttable')
    
    var dotHeight = ((multi || scrot.length) && table.width() < 750) ? table.css('height') : dot.css('height');
    var dotCHeight = (dot.hasClass('first') ? 160 : 25) + 'px';
    
    if (dot.hasClass('first') && dot.height() < 160) {
        if (scrot.length) {
            if (dot.height() > table.height()) {
                table.css('height', (160 - (dot.height() - table.height())) + 'px');
            } else {
                table.css('height', '160px');
            }
        }
    } else {
        dot.css({
            'height': dotCHeight,
            'overflow': 'hidden'
        });
        
        overlay.show();
        
        var toggled = false;
        var animating = false;
        
        header.delegate('a', 'click', function(e) {
            e.stopImmediatePropagation();
        });
        
        if (scrot.length) {
            header.click(function() {
                if (!animating) {
                    if (!toggled) {
                        $('.toggled').parent().prev().click();
                        
                        animating = true;
                        
                        overlay.fadeOut(400, function() {
                            scrot.animate({
                                'width': 'toggle'
                            }, 500, function() {
                                minimize.fadeIn('fast');
                                
                                dot.css('overflow', 'auto');
                                dot.animate({
                                    'height': dotHeight
                                }, 1000, function() {
                                    dot.addClass('toggled')
                                    
                                    toggled = true;
                                    animating = false;
                                });
                            });
                        });
                    } else {
                        animating = true;
                        
                        minimize.fadeOut('fast');
                        
                        dot.css('overflow', 'hidden');
                        dot.animate({
                            'height': dotCHeight
                        }, 1000, function() {
                            scrot.animate({
                                'width': 'toggle'
                            }, 500, function() {
                                overlay.fadeIn(400, function() {
                                    dot.removeClass('toggled')
                                    
                                    toggled = false;
                                    animating = false;
                                });
                            });
                        });
                    }
                }
            });
        } else if (multi) {
            var parent = dot.parent().parent();
            var siblings = parent.siblings('div.file');
            var width = parent.css('width');
            var margin = parent.css('margin-left');
            
            header.click(function() {
                if (!animating) {
                    if (!toggled) {
                        $('.toggled').parent().prev().click();
                        
                        animating = true;
                        
                        siblings.hide('fold', { 'size': 20 }, 600).promise().done(function() {
                            parent.css('margin-left', '0px');
                            
                            parent.animate({
                                'width': '100%'
                            }, 400, function() {
                                overlay.fadeOut(400, function() {
                                    minimize.fadeIn('fast');
                                    
                                    dot.animate({
                                        'height': dotHeight
                                    }, 1000, function() {
                                        dot.css('overflow', 'auto');
                                        dot.addClass('toggled')
                                        
                                        toggled = true;
                                        animating = false;
                                    });
                                });
                            });
                        });
                    } else {
                        animating = true;
                        
                        minimize.fadeOut('fast');
                        
                        dot.css('overflow', 'hidden');
                        dot.animate({
                            'height': dotCHeight
                        }, 1000, function() {
                            overlay.fadeIn(400, function() {
                                parent.animate({
                                    'width': width
                                }, 400, function() {
                                    parent.css('margin-left', margin);
                                    
                                    siblings.show('fold', { 'size': 20 }, 600).promise().done(function() {
                                        dot.removeClass('toggled')
                                        
                                        toggled = false;
                                        animating = false;
                                    });
                                });
                            });
                        });
                    }
                }
            });
        } else {
            header.click(function() {
                if (!animating) {
                    if (!toggled) {
                        $('.toggled').parent().prev().click();
                        
                        animating = true;
                        
                        minimize.fadeIn('fast');
                        
                        overlay.fadeOut(400, function() {
                            dot.css('overflow', 'auto');
                            dot.animate({
                                'height': dotHeight
                            }, 1000, function() {
                                dot.addClass('toggled')
                                
                                toggled = true;
                                animating = false;
                            });
                        });
                    } else {
                        animating = true;
                        
                        minimize.fadeOut('fast');
                        
                        dot.css('overflow', 'hidden');
                        dot.animate({
                            'height': dotCHeight
                        }, 1000, function() {
                            overlay.fadeIn(400, function() {
                                dot.removeClass('toggled')
                                
                                toggled = false;
                                animating = false;
                            });
                        });
                    }
                }
            });
        }
        
        overlay.click(function() {
            header.click();
        });
        
        minimize.click(function() {
           header.click();
        });
    }
}

$(document).ready(function() {
    //
    // Dot create/edit forms.
    //
    var addFile = $('input.addFile');
    
    if (addFile.length) {
        var current = parseInt(addFile.parent().parent().prev().find('p textarea').attr('id').match(/files-([0-9]+)-file/)[1]) + 1;
        var html = '<div class="content file"><p><label for="files-{0}-filename">Filename</label><input id="files-{0}-filename" name="files-{0}-filename" type="text" value="" /></p>\n<p><label for="files-{0}-file"><span class="dark-orange">*</span>Dot</label><textarea id="files-{0}-file" name="files-{0}-file"></textarea></p><p class="removeFile">(<a href="#">remove</a>)</p></div>';
        
        addFile.click(function() {
            addFile.parent().parent().before(html.f(current++));
            
            return false;
        });
        
        $('p.removeFile a').live('click', function() {
            $(this).parent().parent().remove();
            
            return false;
        });
    }
    
    
    //
    // Lightbox gallery on browse pages.
    //
    var scrots = $('a[rel="scrot"]');
    
    if (scrots.length) {
        scrots.tipsy({
            gravity: 'w',
            offset: 8,
            fade: true,
            title: function() {
                return 'view scrot';
            }
        }).colorbox({
            minWidth: 125,
            minHeight: 125,
            maxWidth: '90%',
            maxHeight: '90%',
            title: function() {
                var $this = $(this);
                
                var link = $this.parent().parent().find('td:first a').attr('href');
                var data = $this.attr('original-title').rsplit(':', 3);
                
                var title = '<a href="{0}">{1}</a>'.f(link, data[0]);
                var author = '<a href="/~{0}/">{0}</a>'.f(data[1]);
                var category = '<em>({0}/<a href="/category/{0}/{1}/">{1}</a>)</em>'.f(data[2], data[3]);
                
                return '{0} by {1} in {2}'.f(title, author, category);
            }
        });
    }
    
    $('a.likes').tipsy({
        gravity: 's',
        offset: 5,
        fade: true,
        fallback: 'sort by likes'
    });
    
    $('a.comments').tipsy({
        gravity: 's',
        offset: 5,
        fade: true,
        fallback: 'sort by comments'
    });
    
    
    //
    // Scrot lightbox when viewing a dot.
    //
    var scrot = $('div#scrot');
    
    if (scrot.length) {
        var scrotOverlay = scrot.children('div.overlay');
        
        scrot.css({
            'display': 'block',
            'visibility': 'visible'
        });
        
        scrotOverlay.show();
        
        scrot.find('p a img').one('load',function() {
            var scrotImg = Math.round((160 - $(this).height()) / 2) - 5;
            
            scrot.css({
                'padding-top': scrotImg + 'px',
                'height': (160 - scrotImg) + 'px'
            });
        }).each(function() {
            if (this.complete) $(this).trigger('load');
        });
        
        scrotOverlay.click(function(b) {
            var $this = $(this);
            var link = $this.prev().children().attr('href').replace('-thumb', '')
            
            if (b.which == 2) {
                window.open(link);
            } else {
                $this.colorbox({
                    href: link,
                    minWidth: 50,
                    minHeight: 50,
                    maxWidth: '90%',
                    maxHeight: '90%',
                    title: function() {
                        return '<a class="scrot" href="' + $this.prev().children('a').attr('href') + '" target="_blank">Open in new tab.</a>';
                    }
                });
            }
        });
        
        $('a.scrot').live('click', function() {
            $('#cboxClose').click();
        });
    }
    
    
    //
    // Dot expansion.
    //
    var multi = $('div.multi');
    
    if (multi.length) {
        processDot($('div.dot.first'));
        
        multi.each(function(i) {
            var dots = $(this).children('div.file');
            var width = Math.floor((750 - ((dots.length - 1) * 5)) / dots.length);
            
            dots.each(function(ii) {
                var parent = $(this);
                var dot = parent.find('div.content div.dot');
                
                parent.css({
                    'float': 'left',
                    'overflow': 'hidden',
                    'width': width + 'px'
                });
                
                if (ii != 0) {
                    parent.css('margin-left', '6px');
                }
                
                processDot(dot, true);
            });
        });
    } else {
        var dots = $('div.dot');
        
        if (dots.length) {
            dots.each(function() {
                processDot($(this));
            });
        }
    }
    
    if ($('div.dot').length) {
        $(this).keydown(function(k) {
            if (k.keyCode == 27 && $('div#colorbox').css('display') == 'none') {
                $('.toggled').parent().prev().click();
            }
        });
    }
});
