// ==UserScript==
// @name         DevBest Alerts
// @namespace    http://tesomayn.com/
// @version      1.5.4
// @description  Get Notifications for DevBest Shoutbox
// @author       TesoMayn
// @copyright    2015
// @match        https://devbest.com/
// @require      https://greasyfork.org/scripts/14637-arrive-js/code/Arrivejs.js?version=92469
// @require      https://cdn.jsdelivr.net/jquery.notification/1.0.3/jquery.notification.min.js
// @require      https://greasyfork.org/scripts/14852-patreon-lib/code/Patreonlib.js?version=93835
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

$(document).ready( function() {

    ////////////////////// Configuration ///////////////////////////
    const consoleLogging = false; // This is for debugging
    const desktopAlerts  = true;  // Chrome Desktop Notifications
    const mobileAlerts   = false; // Keep false, this is not implemented

    const alertUsers = ["TesoMayn"]; // Usernames that you get alerted by
    const alertNames = [""]; // Your username (keep current formt as currently is not case-insensative)
    ///////////////////////////////////////////////////////////////



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// DO NOT EDIT BELOW THIS LINE ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    if (GM_getValue("firstRun", "") != true) {
        GM_setValue("firstRun", true);
        alert("Be sure to set your configuraton!");
    }

    $.notification.requestPermission(function () { console.log($.notification.permissionLevel()); });

    $('ul#siropuChatMessages').arrive('li', function() {

        ////////////////////////// Variables //////////////////////////
        var getAuthor       = $(this).attr('data-author');
        var getMessage      = $(this).find('.siropuChatMessage').text();
        var getAvatar       = $('.siropuChatContentLeft', this).find('img').attr('src');
        var currentTime     = Math.floor(Date.now() / 1000);
        var fiveMinutesAgo  = currentTime - (5 * 60);
        var messageTime     = $(this).find('.DateTime').attr('data-time');
        var message12Time   = $(this).find('.DateTime').attr('title');
        ///////////////////////////////////////////////////////////////

        if (checkArray(getMessage, alertNames) == true) {
            if ( $.inArray(getAuthor, alertUsers) != -1 ) {

                getAvatar = getAvatar.replace("avatars/s", "avatars/l");

                if(messageTime > fiveMinutesAgo) {

                    ///////////////////////// Console Log /////////////////////////
                    if ( consoleLogging == true ) {
                        console.log("PINGED BY " + getAuthor + " ON " + message12Time);
                    }
                    ///////////////////////////////////////////////////////////////

                    //////////////////// Chrome Notifications ////////////////////
                    if ( desktopAlerts == true ) {
                        var options = {
                            iconUrl: getAvatar,
                            title: 'Ping From: ' + getAuthor,
                            body: getMessage
                        };
                        $.notification(options).then(function (notification) {
                            setTimeout(function () {
                                notification.close();
                            }, 10000);
                        });
                    }
                    //////////////////////////////////////////////////////////////

                    /////////////////////////// Mobile //////////////////////////
                    if ( mobileAlerts == true ) {
                        $.ajax({
                            type : "POST",
                            url : "",
                            data : { 
                                message : getMessage,
                                title : "Ping From: " + getAuthor
                            },
                            success: function(data){
                                console.log("Success");
                            },
                            error: function(jqxhr) {
                                console.log(jqxhr.responseText);
                            }
                        });
                    }
                    /////////////////////////////////////////////////////////////

                }                
            }            
        };        
        function checkArray(str, arr){
            for(var i=0; i < arr.length; i++){
                if(str.match((".*" + arr[i].trim() + ".*").replace(" ", ".*")))
                    return true;
            }
            return false;
        }
        
    });
    $('<li><a href="#">DevBest Alerts v' +  GM_info.script.version + '</a></li>').appendTo('ul.secondaryContent.blockLinksList');
});

