/**
 * @fileOverview Mesktop
 * @author <a href="mailto:pancnlz@gmail.com">LongZhou</a>
 * @version 0.9
 */
$(document).ready(function() {
    WebApp.WebMain();
});

// 创建命名空间
var WebApp = WebApp || {};
// Main函数入口
WebApp.WebMain = function() {
    WebApp.os.init();
};

/**
 * @namespace
 */
WebApp.os = (function() {
    /**
     * @private
     * @description 应用程序集合
     */
    var $apps = $apps || {
        "appication" : [],  // 程序集合
        "count" : 8         // 计数器，8 % 8 = 0
    };

    /**
     * @private
     * @description 小图标寄存
     */
    var $smallerTemp = null;

    /**
     * @private
     * @description 当前column类
     */
    var $column = null;

    /**
     * @private
     * @description 初始化Apps，读取json数据，载入应用
     */
    var initApp = function() {
        $.ajax({
            url: "/api/apps",
            //url: "../data/app.json",
            type: "GET",
            cache: false,
            dataType: "json",
            success: function(json) {
                for (var i in json) {
                    switch(json[i].type) {
                        case "text":
                            $apps.appication[i] = {
                                id:         json[i].id,
                                type:       json[i].type,
                                size:       json[i].size,
                                title:      json[i].title,
                                content:    json[i].content
                            };
                            break;
                        case "img":
                            $apps.appication[i] = {
                                id:         json[i].id,
                                src:        json[i].src,
                                type:       json[i].type,
                                size:       json[i].size,
                                direction:  json[i].direction
                            };
                            break;
                        case "music":
                            $apps.appication[i] = {
                                id:         json[i].id,
                                src:        json[i].src,
                                type:       json[i].type,
                                size:       json[i].size,
                                thumb:      json[i].thumb,
                                title:      json[i].title,
                                subtitle:   json[i].subtitle,
                                direction:  json[i].direction
                            };
                            break;
                        case "video":
                            $apps.appication[i] = {
                                id:         json[i].id,
                                src:        json[i].src,
                                type:       json[i].type,
                                size:       json[i].size,
                                thumb:      json[i].thumb,
                                title:      json[i].title,
                                subtitle:   json[i].subtitle,
                                direction:  json[i].direction
                            };
                            break;
                        case "linker":
                            $apps.appication[i] = {
                                id:         json[i].id,
                                src:        json[i].src,
                                type:       json[i].type,
                                size:       json[i].size,
                                link:       json[i].link,
                                direction:  json[i].direction
                            };
                            break;
                    } // end switch
                } // end for

                // add Browser
                var browser = {
                    id:   "-1",
                    type: "browser",
                    size: "smaller"
                };
                $apps.appication.unshift(browser);

                // 渲染界面
                renderDesktop();
                // 绑定交互操作
                initEffect();
                // 初始化打开事件
                initOpenEvent();    
            },
            error: function(arg1, arg2, arg3) {
                // do nothing
            }
        });
    };

    /**
     * @private
     * @description 渲染桌面
     */ 
    var renderDesktop = function() {
        // 循环读取应用程序
        while(true) {
            // 退出判断
            var switcher = 0;
            switcher = $apps.appication.length;
            if (switcher <= 0) {
                break;
            }

            // 新建column类
            if ($apps.count == 8) {
                $column = $("<div>").addClass("column");
                $("#mainDesk").append($column);
            }
            $apps.count = $apps.count % 8;

            // 选取应用放置在桌面中
            if ($apps.appication.length > 0) {
                var appTemp = $apps.appication.shift();
                // 大图标直接插入
                if (appTemp.size == "bigger") {
                    creatIcon(appTemp, appTemp.type, "bigger");
                    $apps.count++;
                }
                // 小图标匹配成对后再插入
                else if (appTemp.size == "smaller") {
                    // 有配对
                    if ($smallerTemp != null) {
                        // 小图标成对插入
                        creatIcon($smallerTemp, $smallerTemp.type, "smaller");
                        creatIcon(appTemp, appTemp.type, "smaller");
                        
                        $apps.count++;
                        $smallerTemp = null;
                    }
                    // 无配对
                    else {
                        $smallerTemp = appTemp;
                    }
                }
            }
        };

        // 剩下单一无配对的小图标
        if ($smallerTemp != null) {
            // 新建column类
            if ($apps.count == 8) {
                $column = $("<div>").addClass("column");
                $("#mainDesk").append($column);
            }
            $apps.count = $apps.count % 8;
            // 小图标插入
            creatIcon($smallerTemp, $smallerTemp.type, "smaller");
            $smallerTemp = null;
        }
        // 初始化图片显示大小
        initImgApp();
    };

    /**
     * @private
     * @description 创建图标，模版初始化
     */ 
    var creatIcon = function(ico, type, cls) {
        switch(type) {
            // browser
            case "browser":
                var browser = $("<div>").addClass("app").addClass("browser").addClass(cls);
                
                $column.append(browser);

                break;
            // text
            case "text":
                var textDiv = $("<div>").addClass("app").addClass("text").addClass(cls);
                var title = $("<h2>").html(ico.title);
                var p = $("<p>").html(ico.content);

                textDiv.append(title).append(p);
                $column.append(textDiv);

                break;
            // img
            case "img":
                var imgDiv = $("<div>").addClass("app").addClass("img").addClass(cls);
                var img = $("<img>").attr("src", ico.src).addClass(ico.direction);

                imgDiv.append(img);
                $column.append(imgDiv);

                break;
            // music
            case "music": 
                var musicDiv = $("<div>").addClass("app").addClass("music").addClass(cls);
                var thumb = $("<img>").attr("src", ico.thumb).addClass(ico.direction);
                var playerBtn = $("<a>").attr("link", ico.src).attr("href", "javascript:void(0)");
                var detailFace = $("<div>").addClass("musicDetail");
                detailFace.html("<h2>" + ico.title + "</h2><p>" + ico.subtitle + "</p>").append(playerBtn);

                musicDiv.append(thumb).append(detailFace);
                $column.append(musicDiv);

                $(".music").hover(function() {
                    $(this).find(".musicDetail").css("opacity", "1");
                }, function() {
                    $(this).find(".musicDetail").css("opacity", "0");
                });

                break;
            // video
            case "video": 
                var videoDiv = $("<div>").addClass("app").addClass("video").addClass(cls);
                var thumb = $("<img>").attr("src", ico.thumb).addClass(ico.direction);
                var playerBtn = $("<a>").attr("link", ico.src).attr("href", "javascript:void(0)");
                var detailFace = $("<div>").addClass("videoDetail");
                detailFace.html("<h2>" + ico.title + "</h2><p>" + ico.subtitle + "</p>").append(playerBtn);

                videoDiv.append(thumb).append(detailFace);
                $column.append(videoDiv);

                $(".video").hover(function() {
                    $(this).find(".videoDetail").css("opacity", "1");
                }, function() {
                    $(this).find(".videoDetail").css("opacity", "0");
                });

                break;
            // linker
            case "linker": 
                var linkerDiv = $("<div>").addClass("app").addClass("linker").addClass(cls).attr("data-link", ico.link);
                var icon = $("<img>").attr("src", ico.src).addClass(ico.direction);

                linkerDiv.append(icon);
                $column.append(linkerDiv);

                break;
        }
    };

    /**
     * @private
     * @description 初始化图片显示大小
     */ 
    var initImgApp = function() {
        $(".bigger .width").css({
            width: 245
        });
        $(".bigger .height").css({
            height: 120
        });
        $(".smaller .width").css({
            width: 120
        });
        $(".smaller .height").css({
            height: 120
        });
    };

    /**
     * @private
     * @description 绑定交互操作
     */ 
    var initEffect = function() {
        var direction = 0;  // 正数表示向左，负数表示向右
    
        // 启动界面
        $("#loginPage").bind("dblclick", function() {
            $(this).addClass("slideUp");
            
            // 启动
            startUp();
        });

        // 注销按钮
        $("#logOff").bind("click", function() {
            $("#loginPage").removeClass("slideUp");

            // 注销
            shutDown();
        });
    
        // 鼠标拖拽桌面
        $("#mainDesk").drag("start", function(ev, dd) {
            direction = dd.offsetX;
        })
        .drag(function(ev, dd) {
            $(this).css({
                left: dd.offsetX - $("body").offset().left
            });
        })
        .drag("end", function(ev, dd) {
            direction = dd.offsetX - direction;
            if (outRangeLeft() || outRangeRight()){
                autoDesktopCurrent();
                return;
            }
            
            if (direction > 0) {
                $(this).animate({
                    left: dd.offsetX - $("body").offset().left - 15
                });
            }
            else if (direction < 0) {
                $(this).animate({
                    left: dd.offsetX - $("body").offset().left + 15
                });
            }

            autoDesktopCurrent();   // 自动适应屏幕
        });

        // 应用图标拖动
        $(".app").drag("start", function() {
            $(this).animate({
                opacity: .5
            });
            
            return $(this).clone()
                .css("opacity", 1)
                .appendTo(document.body);
        }, {
            distance: 50
        })
        .drag(function(ev, dd) {
            $(dd.proxy).addClass("absolute").css({
                left: dd.offsetX,
                top: dd.offsetY
            });
        })
        .drag("end", function(ev, dd) {
            // 图标互换位置
            if ($(this).hasClass("bigger") && $(dd.drop).hasClass("bigger") && $(this).html() != $(dd.drop).html()
             || $(this).hasClass("smaller") && $(dd.drop).hasClass("smaller") && $(this).html() != $(dd.drop).html()) {
                var $origin = $(this);
             
                // animate
                var drag = {
                    "left": $origin.offset().left,
                    "top": $origin.offset().top
                };
                var drop = {
                    "left": $(dd.drop).offset().left,
                    "top": $(dd.drop).offset().top
                };
                
                var $clone = $(dd.drop).clone().appendTo(document.body);
                $clone.addClass("absolute").css({
                    left: drop.left,
                    top: drop.top
                }).animate({
                    left: drag.left,
                    top: drag.top
                }, function() {
                    $(dd.drop).css({opacity: 1});
                    $clone.remove();
                });

                // 真实移动
                var empty = $("<div>");
                $origin.after(empty).animate({
                    opacity: 1
                }, 100);
                $(dd.drop).after($origin).css({
                    opacity: 0
                });
                empty.after($(dd.drop)).remove();
                $(dd.proxy).remove();
            }
            // 不满足移动条件
            else {  
                $(dd.proxy).remove();
                $(this).animate({
                    opacity: 1
                });
            }
            // 自动调整屏幕
            autoDesktopCurrent();
        });
        // 应用图标落下
        $(".app").drop("start", function(ev, dd) {

        })
        .drop(function(ev, dd) {

        })
        .drop("end", function(ev, dd) {

        });
        $.drop({ mode:"overlap" });
    };

    /**
     * @private
     * @description 初始化程序打开事件
     */ 
    var initOpenEvent = function() {
        // 浏览器
        $(".browser").dblclick(function() {
            // 显示关闭按钮
            $("#close").fadeIn();    
            // 浏览器面板
            var browserBone = $("<div>").attr("class", "browserBone").hide();
            var browserImage = $("<img>").attr("src", "images/browser.png");
            var browserLoading = $("<div>").attr("class", "browserLoading")
                                           .append(browserImage)
                                           .append(browserBone);
            var browserFace = $("<div>").attr("class", "appInterfaceBrowser")
                                        .append(browserLoading);

            $("body").append(browserFace);
            // loading animate
            setTimeout('$(".browserLoading").addClass("browserLoaded");', 1000);
            setTimeout('$(".browserBone").fadeIn("normal")', 3500);

            $("#close").live("click", function() {
                setTimeout('$(".browserLoading").removeClass("browserLoaded");', 500);
                setTimeout("$('.appInterfaceBrowser').remove();", 1500);
                // 隐藏关闭按钮
                $("#close").fadeOut();
            });
        });
        // 文章类型
        $(".text").dblclick(function() {
            // 显示关闭按钮
            $("#close").fadeIn();
            // 文章面板
            var contain = $("<div>").attr("class", "contain")
                                    .html($(this).html());

            var appFace = $("<div>").attr("class", "appInterfaceText")
                                    .append(contain);

            $("body").append(appFace);
            $(".appInterfaceText").addClass("animated bounceInDown");
            $("#close").live("click", function() {
                $(".appInterfaceText").addClass("animated bounceOutUp");
                setTimeout("$('.appInterfaceText').remove();", 500);
                // 隐藏关闭按钮
                $("#close").fadeOut();
            });
        });
        // 图片类型
        $(".img").dblclick(function() {
            // 显示关闭按钮
            $("#close").fadeIn();
            // 图片面板
            var contain = $("<div>").attr("class", "containImg")
                                    .html($(this).html());

            var appFace = $("<div>").attr("class", "appInterfaceImg")
                                    .append(contain);

            $("body").append(appFace);
            $(".containImg img").removeClass().attr("style", "");

            if (parseInt($(".containImg img").css("width")) > 600);
                $(".containImg img").css("width", "600px");

            $(".appInterfaceImg").addClass("animated bounceInDown");
            $("#close").live("click", function() {
                $(".appInterfaceImg").addClass("animated bounceOutUp");
                setTimeout("$('.appInterfaceImg').remove();", 500);
                // 隐藏关闭按钮
                $("#close").fadeOut();
            });
        });
        // 音乐类型
        $(".music").dblclick(function() {
            $("#musicPlayer").animate({
                left: -300
            }, function() {
                $("#musicPlayer").remove();
            });

            var audio = $("<audio>").attr("id", "musicPlayer").attr("controls", "controls");
            var source = $("<source>").attr("src", $(this).find("a").attr("link")).attr("type", "audio/mp3; codecs='mp3'");
            audio.append(source);
            $("body").append(audio);

            setTimeout(
                '$("#musicPlayer").animate({'
                    +'left: 0'
                +'}, function() {'
                    +'$audio = document.getElementById("musicPlayer");'
                    +'$audio.play();'
                +'});'
            , 500);
        });
        $("#musicPlayer").live("dblclick", function() {
            $("#musicPlayer").animate({
                left: -301
            }, function() {
                $audio = document.getElementById("musicPlayer");
                $audio.pause();
            });
        });
        // 视频类型
        $(".video").dblclick(function (){
            // 显示关闭按钮
            $("#close").fadeIn();
            // 视频面板
            var video = $("<video>").attr("id", "videoPlayer").attr("controls", "controls");
            var source = $("<source>").attr("src", $(this).find("a").attr("link")).attr("type", "video/mp4; codecs='mp4'");
            video.append(source);

            var appFace = $("<div>").attr("class", "appInterfaceVideo")
                                    .append(video);

            $("body").append(appFace);
            $(".appInterfaceVideo").addClass("animated bounceInDown");

            $("#videoPlayer").css("height", document.body.clientHeight - 100 + "px");
            $video = document.getElementById("videoPlayer");
            $video.play();

            $("#close").live("click", function() {
                $(".appInterfaceVideo").addClass("animated bounceOutUp");
                setTimeout("$('.appInterfaceVideo').remove();", 500);
                // 隐藏关闭按钮
                $("#close").fadeOut();
            });
        });
        // 外链类型
        $(".linker").dblclick(function (){
            // 显示关闭按钮
            $("#close").fadeIn();
            // 外链面板
            var iframe = $("<iframe>").attr("class", "linkIframe").attr("src", "http://" + $(this).attr("data-link"));
            var appFace = $("<div>").attr("class", "appInterfaceLink").append(iframe);

            $("body").append(appFace);
            $(".appInterfaceLink").addClass("animated bounceInDown");
            $("#close").live("click", function() {
                $(".appInterfaceLink").addClass("animated bounceOutUp");
                setTimeout("$('.appInterfaceLink').remove();", 500);
                // 隐藏关闭按钮
                $("#close").fadeOut();
            });
        });
    };

    /**
     * @private
     * @description 超出左边界
     */ 
    var outRangeLeft = function() {
        if (parseInt($("#mainDesk").css("left")) > 0){
            return true;
        }
        
        return false;
    };
    
    /**
     * @private
     * @description 超出右边界
     */ 
    var outRangeRight = function() {
        var minLeft = -(300 + 500 * $("#mainDesk .column").length + 100 * ($("#mainDesk .column").length-1) - document.body.clientWidth);
        if (parseInt($("#mainDesk").css("left")) < minLeft){
            return true;
        }
        
        return false;
    };
    
    /**
     * @private
     * @description 自动调整屏幕
     */ 
    var autoDesktopCurrent = function() {
        var minLeft = -(300 + 500 * $("#mainDesk .column").length + 100 * ($("#mainDesk .column").length-1) - document.body.clientWidth);
        if (outRangeLeft()) {
            $("#mainDesk").animate({
                left: 0
            });
        }
        else if (outRangeRight()) {
            $("#mainDesk").animate({
                left: minLeft
            });
        };
    };

    /**
     * @private
     * @description 启动界面
     */
    var startUp = function() {
        $("#mainDesk").show().removeClass().addClass("logined");
    };
    var shutDown = function() {
        $("#mainDesk").removeClass().addClass("unlogin");
    };
    
    /**
     * @private
     * @description 秒针计数
     */
    var seconds = true;
    /**
     * @private
     * @description 初始化时钟
     */
    var initTime = function() {
        var now = new Date();
        var weeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        $("#loginPage .week").text(weeks[now.getDay()]);
        $("#loginPage .date").text(months[now.getMonth()] + " " + now.getDate());
        
        var noon = "";
        var hours = now.getHours();
        var minutes = now.getMinutes(); 
        if (hours > 12) {
            hours -= 12;
            noon = "PM";
        } else {
            noon = "AM";
        }
        if (hours === 12) {
            noon = "PM";
        } else if (hours === 0) {
            noon = "AM";
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        
        if (seconds) {
            $("#loginPage .time").html(hours + "<span style='width:20px;display:inline-block;'>:</span>" + minutes + " " + noon);
        } else {
            $("#loginPage .time").html(hours + "<span style='width:20px;display:inline-block;visibility:hidden'> </span>" + minutes + " " + noon);
        }
        seconds = (!seconds);
    };
    
    /**
     * @scope WebApp.os
     */
    return {
        /**
         * @description 命名空间初始化 
         */
        init: function() {
            // 初始化应用程序
            initApp();
            // 初始化时钟
            window.setInterval(initTime, 1000);
        }
    };
}());
