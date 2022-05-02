<template>
  <div
    id="hikvision-grid"
    class="wrapper"
    ref="wrapper"
    :style="{ width: '100%', height: '100%' }"
  >
    <div
      v-show="oWebControl"
      :id="setting.id"
      :class="[oWebControl === null ? 'videoNull' : '']"
    ></div>

    <br />
    <div v-show="!oWebControl">
      <div v-html="playText"></div>
      <br />
      <div v-show="playText.includes('插件启动失败')">
        下载完成？
        <el-button type="primary" @click="destroyedAndCreate">
          点击此处
        </el-button>
        启动插件
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    // 从父组件传递过来的
    props: {
      setting: {
        // 设置项，带id
        type: Object,
        default: () => ({
          id: 1
        })
      },
      sysParams: {
        // 系统参数
        type: Object,
        default: () => ({
          appkey: '29228660',
          secret: 'eDSkiRPcZ9VTSGt8zT7p',
          // ip: '57.215.7.52',
          // port: 443
        })
      },
      list: {
        // cameraCode列表
        type: Array,
        default: () => []
      },
      layout: {
        // 布局
        type: String,
        default: '2x2'
      }
    },
    data() {
      return {
        videoWidth: 0,
        videoHeight: 0,
        left: '',
        top: '',
        initCount: 0, // 启动次数
        playMode: 0, // 0 预览 1回放
        playText: '加载中...',
        cameraIndexCode: '', // 监控点编号
        oWebControl: null,
        href: '../../../public/lib/VideoWebPlugin.exe',
        selfEle: null // 自身原始
      };
    },
    mounted() {
      // 当前组件
      this.selfEle = this.$refs.wrapper;
      this.observeWrapper();
    },
    methods: {
      // 监听自身容器大小变化
      observeWrapper() {
        // 监听 自身容器 元素宽度的变化
        const ro = new ResizeObserver(entries => {
          for (const entry of entries) {
            const cr = entry.contentRect;
            this.videoWidth = cr.width;
            this.videoHeight = cr.height;
            this.oWebControl &&
            this.oWebControl.JS_Resize(this.videoWidth, this.videoHeight);
            this.oWebControl && this.setWndCover();
          }
        });
        ro.observe(document.querySelector('#hikvision-grid'));
      },
      // 初始化+预览
      createdVideo() {
        this.playText = '启动中...';
        this.initPlugin(this.setting.id, () => {
          this.multiPreviewVideo();
        });
      },
      // 销毁插件
      destroyWnd(cb) {
        if (this.oWebControl) {
          this.oWebControl.JS_HideWnd();
          this.oWebControl
            .JS_DestroyWnd({
              funcName: 'destroyeWnd'
            })
            .then(function (oData) {});
        } else {
          console.log('没有实例');
        }
        cb && cb();
      },
      // 销毁并重启
      destroyedAndCreate() {
        this.destroyWnd(() => {
          this.createdVideo();
        });
      },
      // 初始化
      init(callback) {
        this.getPubKey(() => {
          ////////////////////////////////// 请自行修改以下变量值   ////////////////////////////////////
          let appkey = this.sysParams.appkey; //综合安防管理平台提供的appkey，必填
          let secret = this.setEncrypt(this.sysParams.secret); //综合安防管理平台提供的secret，必填
          let ip = this.sysParams.ip; //综合安防管理平台IP地址，必填
          let playMode = this.playMode; //初始播放模式：0-预览，1-回放
          let port = this.sysParams.port; //综合安防管理平台端口，若启用HTTPS协议，默认443
          let snapDir = 'D:\\SnapDir'; //抓图存储路径
          let videoDir = 'D:\\VideoDir'; //紧急录像或录像剪辑存储路径
          let layout = this.layout; //playMode指定模式的布局
          let enableHTTPS = 1; //是否启用HTTPS协议与综合安防管理平台交互，是为1，否为0
          let encryptedFields = 'secret'; //加密字段，默认加密领域为secret
          let showToolbar = 0; //是否显示工具栏，0-不显示，非0-显示
          let showSmart = 0; //是否显示智能信息（如配置移动侦测后画面上的线框），0-不显示，非0-显示
          let buttonIDs =
            '0,16,256,257,258,259,260,512,513,514,515,516,517,768,769'; //自定义工具条按钮
          ////////////////////////////////// 请自行修改以上变量值   ////////////////////////////////////
          this.oWebControl
            .JS_RequestInterface({
              funcName: 'init',
              argument: JSON.stringify({
                appkey: appkey, //API网关提供的appkey
                secret: secret, //API网关提供的secret
                ip: ip, //API网关IP地址
                playMode: playMode, //播放模式（决定显示预览还是回放界面）
                port: port, //端口
                snapDir: snapDir, //抓图存储路径
                videoDir: videoDir, //紧急录像或录像剪辑存储路径
                layout: layout, //布局
                enableHTTPS: enableHTTPS, //是否启用HTTPS协议
                encryptedFields: encryptedFields, //加密字段
                showToolbar: showToolbar, //是否显示工具栏
                showSmart: showSmart, //是否显示智能信息
                buttonIDs: buttonIDs //自定义工具条按钮
              })
            })
            .then(oData => {
              // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
              this.oWebControl.JS_Resize(this.videoWidth, this.videoHeight);
              callback && callback();
            });
        });
      },
      // 创建播放实例
      initPlugin(id, callback) {
        let that = this;
        that.oWebControl = new WebControl({
          szPluginContainer: id, // 指定容器id
          iServicePortStart: 15900, // 指定起止端口号，建议使用该值
          iServicePortEnd: 15909,
          szClassId: '23BF3B0A-2C56-4D97-9C03-0CB103AA8F11', // 用于IE10使用ActiveX的clsid
          cbConnectSuccess: function () {
            // 创建WebControl实例成功
            that.oWebControl
              .JS_StartService('window', {
                // WebControl实例创建成功后需要启动服务
                dllPath: './VideoPluginConnect.dll' // 值"./VideoPluginConnect.dll"写死
              })
              .then(
                function () {
                  // 启动插件服务成功
                  that.oWebControl.JS_SetWindowControlCallback({
                    // 设置消息回调
                    cbIntegrationCallBack: that.cbIntegrationCallBack
                  });

                  that.oWebControl
                    .JS_CreateWnd(id, that.videoWidth, that.videoHeight)
                    .then(() => {
                      //JS_CreateWnd创建视频播放窗口，宽高可设定
                      that.init(callback); // 创建播放实例成功后初始化
                    });
                },
                function () {
                  // 启动插件服务失败
                }
              );
          },
          cbConnectError: () => {
            // 创建WebControl实例失败
            that.oWebControl = null;
            that.playText = '插件未启动，正在尝试启动，请稍候...';
            WebControl.JS_WakeUp('VideoWebPlugin://'); // 程序未启动时执行error函数，采用wakeup来启动程序
            that.initCount++;
            if (that.initCount < 3) {
              setTimeout(() => {
                that.initPlugin();
              }, 3000);
            } else {
              that.playText = `插件启动失败，请检查插件是否安装！<a href=${this.href} type="primary" download="VideoWebPlugin.exe" style='color:#4194fc'>下载地址</a>`;
            }
          },
          cbConnectClose: bNormalClose => {
            // 异常断开：bNormalClose = false
            // JS_Disconnect正常断开：bNormalClose = true
            that.oWebControl = null;
          }
        });
      },
      // 关闭
      handleClose() {
        if (this.oWebControl) {
          this.oWebControl.JS_RequestInterface({
            funcName: 'stopAllPreview'
          });
          this.oWebControl.JS_HideWnd(); // 先让窗口隐藏，规避可能的插件窗口滞后于浏览器消失问题
          this.oWebControl.JS_Disconnect().then(
            () => {
              // 断开与插件服务连接成功
            },
            () => {
              // 断开与插件服务连接失败
            }
          );
          this.oWebControl = null;
        }
      },
      // 消息回调
      cbIntegrationCallBack(oData) {
        // console.log(oData);
      },
      // 预览
      previewVideo() {
        let cameraIndexCode = this.cameraIndexCode; // 获取输入的监控点编号值，必填
        let streamMode = 1; // 主子码流标识：0-主码流，1-子码流
        let transMode = 1; // 传输协议：0-UDP，1-TCP
        let gpuMode = 0; // 是否启用GPU硬解，0-不启用，1-启用
        let wndId = -1; // 播放窗口序号（在2x2以上布局下可指定播放窗口）

        this.oWebControl.JS_RequestInterface({
          funcName: 'startPreview',
          argument: JSON.stringify({
            cameraIndexCode: cameraIndexCode.trim(), // 监控点编号
            streamMode: streamMode, // 主子码流标识
            transMode: transMode, // 传输协议
            gpuMode: gpuMode, // 是否开启GPU硬解
            wndId: wndId // 可指定播放窗口
          })
        });
      },
      // 批量预览
      multiPreviewVideo() {
        let streamMode = 1; // 主子码流标识：0-主码流，1-子码流
        let transMode = 1; // 传输协议：0-UDP，1-TCP
        let gpuMode = 0; // 是否启用GPU硬解，0-不启用，1-启用
        this.oWebControl
          .JS_RequestInterface({
            funcName: 'startMultiPreviewByCameraIndexCode',
            argument: JSON.stringify({
              list: this.list.map((camera, idx) => {
                return {
                  cameraIndexCode: camera, //监控点编号
                  streamMode, //主子码流标识
                  transMode, //传输协议
                  gpuMode, //是否开启GPU硬解
                  wndId: idx + 1 // 播放窗口序号（在2x2以上布局下可指定播放窗口）
                };
              }) // 监控点编号集合
            })
          })
          .then(res => {
            if (res.errorCode === 0) {
              console.log('预览成功');
            }
          });
      },
      //获取公钥
      getPubKey(callback) {
        this.oWebControl
          .JS_RequestInterface({
            funcName: 'getRSAPubKey',
            argument: JSON.stringify({
              keyLength: 1024
            })
          })
          .then(oData => {
            if (oData.responseMsg.data) {
              this.pubKey = oData.responseMsg.data;
              callback();
            }
          });
      },
      //RSA加密
      setEncrypt(value) {
        let encrypt = new JSEncrypt();
        encrypt.setPublicKey(this.pubKey);
        return encrypt.encrypt(value);
      },
      // 设置窗口裁剪，当因滚动条滚动导致窗口需要被遮住的情况下需要JS_CuttingPartWindow部分窗口
      setWndCover() {
        let iWidth = $(window).width(); // 获取浏览器宽度 不含滚动条
        let iHeight = $(window).height();
        let oDivRect = $('#' + this.setting.id)
          .get(0)
          .getBoundingClientRect();

        let iCoverLeft = oDivRect.left < 0 ? Math.abs(oDivRect.left) : 0;
        let iCoverTop = oDivRect.top < 0 ? Math.abs(oDivRect.top) : 0;
        let iCoverRight =
          oDivRect.right - iWidth > 0 ? Math.round(oDivRect.right - iWidth) : 0;
        let iCoverBottom =
          oDivRect.bottom - iHeight > 0
            ? Math.round(oDivRect.bottom - iHeight)
            : 0;

        iCoverLeft =
          iCoverLeft > this.videoWidth ? this.videoWidth : iCoverLeft;
        iCoverTop = iCoverTop > this.videoHeight ? this.videoHeight : iCoverTop;
        iCoverRight =
          iCoverRight > this.videoWidth ? this.videoWidth : iCoverRight;
        iCoverBottom =
          iCoverBottom > this.videoHeight ? this.videoHeight : iCoverBottom;

        // 多1个像素点防止还原后边界缺失一个像素条
        this.oWebControl.JS_RepairPartWindow(
          0,
          0,
          this.videoWidth + 1,
          this.videoHeight
        );
        if (iCoverLeft != 0) {
          this.oWebControl.JS_CuttingPartWindow(
            0,
            0,
            iCoverLeft,
            this.videoHeight
          );
        }
        if (iCoverTop != 0) {
          // 多剪掉一个像素条，防止出现剪掉一部分窗口后出现一个像素条
          this.oWebControl.JS_CuttingPartWindow(
            0,
            0,
            this.videoWidth + 1,
            iCoverTop
          );
        }
        if (iCoverRight != 0) {
          this.oWebControl.JS_CuttingPartWindow(
            this.videoWidth - iCoverRight,
            0,
            iCoverRight,
            this.videoHeight
          );
        }
        if (iCoverBottom != 0) {
          this.oWebControl.JS_CuttingPartWindow(
            0,
            this.videoHeight - iCoverBottom,
            this.videoWidth,
            iCoverBottom
          );
        }
      }
    },
    destroyed() {
      this.destroyWnd();
    },
    watch: {
      list: {
        immediate: true,
        deep: true,
        handler(value) {
          if (value.length > 0) {
            console.log('watch海康威视组件的列表list:', value);
            this.destroyedAndCreate();
          } else {
            this.destroyWnd(() => {
              this.oWebControl = null;
            });
            this.playText = '请选择要播放的监控';
          }
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .playWnd {
    // margin: 30px 0 0 400px;
    width: 1000px; /*播放容器的宽和高设定*/
    height: 600px;
    border: 1px solid red;
  }
  .operate {
    margin-top: 24px;
  }
  .operate::after {
    content: '';
    display: block;
    clear: both;
  }
  .module {
    float: left;
    width: 340px;
    /*min-height: 320px;*/
    margin-left: 16px;
    padding: 16px 8px;
    box-sizing: border-box;
    border: 1px solid #e5e5e5;
  }
  .module .item {
    margin-bottom: 4px;
  }
  .module input[type='text'] {
    box-sizing: border-box;
    display: inline-block;
    vertical-align: middle;
    margin-left: 0;
    width: 150px;
    min-height: 20px;
  }
  .module .btn {
    min-width: 80px;
    min-height: 24px;
    margin-top: 100px;
    margin-left: 80px;
  }
</style>
