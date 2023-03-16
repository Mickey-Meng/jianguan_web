 $(function() {
     $.fn.extend({
        customAttr: function(a, b) {

                if (b != undefined && (b!=""||typeof(b)=="boolean")){
                    if (parent.PS2_config.auth.enableAuth) {
                    if (a == "disabled" && this.hasClass("toolbar-item")) {
                        $.each(this, function(i, item) {
                            var name = $(this).text();
                            /* if (!authMgr.checkAuthByName(name) ) {
                        $(this).attr(a, b);
                    }*/

                            if ($.inArray($.trim(name),parent.authMgr.getMenus())<0 && b == false) {

                            } else {
                                $(this).attr(a, b);
                            }
                            /* if ($(this).attr("hasJurisdiction") == "false" || $(this).attr("hasJurisdiction") == undefined) {
                             $(this).attr(a, b);
                         } else {
                             if (b != "" && b != "false") {
                                 $(this).attr(a, b);
                             }
                         }*/
                        });
                    } else {
                        $(this).attr(a, b);
                    }

                } else {
                      $(this).attr(a, b);
                }
            }
            else
            {
                 return $(this).attr(a);
            }
        }
    });
 });
