<template>
  <div class="login">
    <div class="bg_img fl"></div>
    <div class="p40">
      <div class="login_box">
        <div class="tittle">
          {{islogin?'登录':'修改密码'}}
        </div>
        <div class="userinfo">
          <div v-if="islogin">
            <div class="fsz28">密码</div>
            <div class="input_box">
              <cube-input
                v-model="passWord"
                :eye="eye"
                type='password'
                placeholder="请输入密码"
              ></cube-input>
            </div>
          </div>
          <div v-else>
            <div class="fsz28">原密码</div>
            <div class="input_box">
              <cube-input
                v-model="passWord"
                :eye="eye"
                type='password'
                placeholder="请输入原密码"
              ></cube-input>
            </div>
            <div class="fsz28">新密码</div>
            <div class="input_box">
              <cube-input
                v-model="newpassWord"
                :eye="eye"
                type='password'
                placeholder="请输入新密码"
              ></cube-input>
            </div>
          </div>
          <div
            class="btn loginbtn"
            @click="loginIt"
          >{{islogin?'登录':'修改密码'}}</div>
        </div>
        <div
          class="forget fr"
          @click="islogin = !islogin"
        >{{islogin?'修改密码':'返回登录'}}</div>
      </div>
    </div>
  </div>
</template>

<script >
import boss from "../api/boss/boss.js";
let lodash = require("lodash");
export default {
  data() {
    return {
      islogin: true,
      passWord: "",
      newpassWord: "",
      eye: {
        open: true,
        reverse: true
      }
    };
  },
  methods: {
    loginIt: lodash.throttle(function() {
      let pass = this.passWord;
      let newPass = this.newpassWord;
      if (this.islogin) {
        boss.login({ password: pass }).then(res => {
          if (res.errcode == 0) {
            const toast = this.$createToast({
              txt: "恭喜您，登录成功！",
              type: "correct"
            });
            toast.show();
            sessionStorage.setItem("islogin", "letmyBoss");
            setTimeout(() => {
              this.$router.push("dataView");
              return 333;
            }, 1500);
            clearTimeout(333);
          }
        });
      } else {
        boss
          .changePassWord({
            oldpassword: pass,
            newpassword: newPass
          })
          .then(res => {
            if (res.errcode == 0) {
              const toast = this.$createToast({
                txt: "恭喜您，修改成功！",
                type: "correct"
              });
              toast.show();
              setTimeout(() => {
                this.islogin = true;
                return 333;
              }, 1000);
            }
          });
      }
    }, 2000)
  },
  components: {}
};
</script>
<style scoped lang="less">
@import "../../static/css/1px.less";
.login {
  position: relative;
  height: 100%;
  background-color: #f0f7f7;
  .bg_img {
    width: 100%;
    height: 677px;
      background: url('http://wx.richwin8.com/img/codai_bg@3x.png') no-repeat;
      background-size: cover;
  }
  .p40 {
    // height: 100%;
    width: 100%;
    padding: 0 40px;
    position: absolute;
    top: 310px;
  }
  .login_box {
    padding: 70px 66px 100px 66px;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 12px 30px 0px rgba(125, 221, 255, 0.4);
    border-radius: 20px;
    .forget {
      color: #0cbfff;
      margin-top: 30px;
      margin-right: 10px;
    }
    .tittle {
      font-size: 48px;
      color: #333;
      font-weight: bold;
    }
    .userinfo {
      .fsz28 {
        margin-top: 76px;
        font-size: 28px;
        color: #999;
      }
      .input_box {
        position: relative;
        height: 80px;
        line-height: 80px;
        font-size: 32px;
        z-index: 1;
        input {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          font-size: 32px;
        }
        ::-moz-placeholder {
          color: #ccc;
        }
        ::-webkit-input-placeholder {
          color: #ccc;
        }
        :-ms-input-placeholder {
          color: #ccc;
        }
        .border-b(#dcdcdc, solid);
      }
    }
    .loginbtn {
      margin-top: 96px;
    }
  }
}
</style>

<style lang="less">
.login {
  .cube-input::after {
    border: 0 !important;
  }
}
</style>
