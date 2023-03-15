(function(ctx, $) {
    ctx.SFM.TableHelper = ctx.SFM.Base.extend({
        constructor: function(options) {
            var me = this;
            me.data = {};
            me.data.displayField = options.displayField;
            me.data.displayLabel = options.displayLabel
            me.data.data = options.data;
            me.data.cb = {};
            me.data.cb.onDblClick = options.onDblClick;
            me.data.el = {};
            me.data.el.$tbody = options.tbody;
            me.data.el.$btnExport2Excel = options.btnExport2Excel;
            if (me.data.el.$btnExport2Excel) {
                me.data.el.$btnExport2Excel.on('click', function() {
                    me.export2Excel();
                });
            }
        },
        renderTable: function() {
            var me = this;
            var h = '';
            var d = me.data.data;
            if (!d) {
                return me;
            }
            var df = me.data.displayField;
            for (var i = 0; i < d.length; i++) {
                var di = d[i];
                var rcn = di.rowClassName == undefined ? '' : ' ' + di.rowClassName;
                h += '<tr class="sfm-m-th-row' + rcn + '" data-ri="' + i + '">';
                for (var j = 0; j < df.length; j++) {
                    var fj = df[j];
                    h += '<td class="sfm-m-th-cell sfm-m-th-col sfm-m-th-col' + j + '">';
                    h += di[fj];
                    h += '</td>';
                }
                h += '</tr>';
            }
            var $tb = me.data.el.$tbody;
            $tb.html(h);
            if (typeof me.data.cb.onDblClick == 'function') {
                $tb.find('.sfm-m-th-row').on('dblclick', function() {
                    var $t = $(this);
                    var ri = Number($t.attr('data-ri'));
                    me.data.cb.onDblClick.call(me, me.data.data[ri], ri);
                });
            }
            return me;
        },
        setData: function(data) {
            this.data.data = data;
            return this;
        },
        clear: function() {
            this.data.data = null;
            this.data.el.$tbody.find('.sfm-m-th-row').off('click');
            this.data.el.$tbody.find('.sfm-m-th-row').off('dblclick');
            this.data.el.$tbody.empty();
            return this;
        },
        export2Excel: function() {
            var me = this;
            if (!me.data.el.$tbody.html()) {
                return me;
            }
            var xls = null;
            try {
                xls = new ActiveXObject("Excel.Application");
            } catch (e) {
                xls = this.WPSExcelHv();
            }
            if(!xls){
            	return me;
            }
            try {
                xls.visible = true;
                var xlsBook = xls.Workbooks.Add;
                var xlsSheet = xlsBook.WorkSheets(1);

                var columns = me.data.displayLabel;
                for (var k = 0; k < columns.length; k++) {
                    xlsSheet.Cells(1, k + 1).Value = columns[k];
                }

                var rowList = me.data.el.$tbody[0].rows;
                for (var i = 0; i < rowList.length; i++) {
                    var cellList = rowList[i].cells;
                    for (var j = 0; j < cellList.length; j++) {
                        xlsSheet.Cells(i + 2, j + 1).Value = cellList[j].innerHTML;
                    }
                }

                xls.UserControl = true;
            } catch (err) {
                //alert(err.description);
            }
            return me;
        },
        WPSExcelHv: function() {
            var xls = null;
            try {
                xls = new ActiveXObject("KET.Application");
            } catch (e) {
                xls = this.WPSExcelLv();
            }
            return xls;
        },
        WPSExcelLv: function() {
            var xls = null;
            try {
                xls = new ActiveXObject("ET.Application");
            } catch (e) {
                // alert("导出WPS失败，确定是否安装了WPS");
                alert("无法启动Excel\n\n如果您确信您的电脑中已经安装了Excel, 那么请调整IE的安全级别\n" +
                    "具体的操作：\n" +
                    "工具 -> Internet选项 -> 安全 -> 自定义级别 -> 对没有标记为安全的ActiveX进行初始化和脚本运行 -> 启用");
                return;
            }
            return xls;
        },
        destroy: function() {
            this.clear();
            this.data.displayField = null;
            this.data.displayLabel = null;
            delete this.data.cb;
            delete this.data;
        }
    });
})(window, jQuery);
