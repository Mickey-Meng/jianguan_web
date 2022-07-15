<template>
  <iframe :src="url" frameborder="0"
          width="100%" height="100%"></iframe>

</template>

<script>
  let qs = require("qs");
  export default {
    name: "",
    data() {
      return {
        url: ""
      };
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        let data = {
          grant_type: "client_credentials",
          client_id: "5da87851cb5c444283424fa6f7b2fe6b",
          client_secret: "50f28c2d97e54f55bf837053b0aa3790",
          scope: "UserPool"
        };
        this.$axios({
          method: "post",
          headers: {
            "Content-type": "application/x-www-form-urlencoded"
          },
          url: "https://proj.bim-ace.com:10260/connect/token",
          data: qs.stringify(data)

        }).then(res => {
          let {data} = res;
          if (data && data.access_token) {

            fetch(
              "https://proj.bim-ace.com:10260/api/user-pool/user/autoLoginCode?userName=zjcjjt",
              {
                headers: {
                  Authorization: `Bearer ${data.access_token}`
                }
              }
            )
              .then((res) => res.json())
              .then((res) => {
                this.jump(res.code);
              });
          }
        });
      },
      jump(code) {
        let authUrl = `https://proj.bim-ace.com:10260/connect/authorize`;
        authUrl += "?client_id=5da87851cb5c444283424fa6f7b2fe6b";
        authUrl += "&response_type=code";
        authUrl += `&redirect_uri=${encodeURIComponent("https://proj.bim-ace.com:10112/auto-login")}`;
        authUrl += "&scope=openid";
        authUrl += `&auto_login_code=${code}`;
        this.url = authUrl;
      }
    }
  }
</script>

<style scoped>

</style>
