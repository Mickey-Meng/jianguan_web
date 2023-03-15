OpenLayers.Util.createUrlObject=function(a,b){
    b=b||{};
    if(!/^\w+:\/\//.test(a)){
        var c=window.location,d=c.port?":"+c.port:"",d=c.protocol+"//"+c.host.split(":").shift()+d;
        0===a.indexOf("/")?a=d+a:(c=c.pathname.charAt(0)=='/'?c.pathname:"/"+c.pathname,c=c.split("/"),c.pop(),a=d+c.join("/")+"/"+a)
    }
    b.ignoreCase&&(a=a.toLowerCase());
    c=document.createElement("a");
    c.href=a;
    d={};
    d.host=c.host.split(":").shift();
    d.protocol=c.protocol;
    d.port=b.ignorePort80?"80"==c.port||"0"==c.port?"":c.port:""==c.port||"0"==c.port?"80":c.port;
    d.hash=b.ignoreHash||"#"===
    c.hash?"":c.hash;
    var e=c.search;
    e||(e=a.indexOf("?"),e=-1!=e?a.substr(e):"");
    d.args=OpenLayers.Util.getParameters(e,{
        splitArgs:b.splitArgs
    });
    d.pathname="/"==c.pathname.charAt(0)?c.pathname:"/"+c.pathname;
    return d
};
