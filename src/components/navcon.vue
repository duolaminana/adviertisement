/**
* 头部菜单
*/ 
<template>
  <div class="nav">
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      background-color="#334157"
      text-color="#fff"
      active-text-color="#fff"
    >
      <el-button class="buttonimg">
        <img class="showimg" :src="collapsed?imgsq:imgshow" @click="toggle(collapsed)" />
      </el-button>
      <el-submenu index="2" class="submenu">
        <!-- <template slot="title">{{user.userRealName}}</template> -->
        <template slot="title">{{user.userName}}</template>
        <el-menu-item v-if="user.level==1" @click="addUser" index="2-1">新增用户</el-menu-item>
        <el-menu-item @click="changePsw" index="2-2">修改密码</el-menu-item>
        <el-menu-item @click="exit" index="2-3">退出</el-menu-item>
      </el-submenu>
    </el-menu>
    <el-dialog
      title="新增用户"
      :visible.sync="editFormVisible"
      width="500px"
      @click="editFormVisible=false"
    >
      <el-form label-width="80px" :model="editForm" ref="editForm" :rules="rules">
        <el-form-item label="用户名" prop="userName">
          <el-input
            size="small"
            v-model="editForm.userName"
            auto-complete="off"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="userPassword">
          <el-input
            size="small"
            v-model="editForm.userPassword"
            auto-complete="off"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input size="small" v-model="editForm.phone" auto-complete="off" placeholder="请输入手机号码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editFormVisible=false">取消</el-button>
        <el-button
          size="small"
          type="primary"
          :loading="loading"
          class="title"
          @click="submitForm('editForm')"
        >保存</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="psdDetVisible"
      width="500px"
      title="修改密码"
      @click="psdDetVisible=false"
    >
      <el-form ref="formPassword" :model="formPassword" :rules="ruleValidate" label-width="80px">
        <el-form-item label="旧密码" prop="oldPassword" class="psd">
          <el-input
            :type="oldPswd?'text':'password'"
            size="small"
            v-model.trim="formPassword.oldPassword"
            placeholder="旧密码"
          >
            <i v-if="oldPswd" slot="suffix" class="iconfont icon-eye" @click="oldPswd=!oldPswd"></i>
            <i v-if="!oldPswd" slot="suffix" class="iconfont icon-eye1" @click="oldPswd=!oldPswd"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="userPassword" class="psd">
          <el-input
            :type="newPswd?'text':'password'"
            size="small"
            v-model.trim="formPassword.userPassword"
            placeholder="新密码"
          >
            <i v-if="newPswd" slot="suffix" class="iconfont icon-eye" @click="newPswd=!newPswd"></i>
            <i v-if="!newPswd" slot="suffix" class="iconfont icon-eye1" @click="newPswd=!newPswd"></i>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" class="cancel" @click="psdDetVisible=false">取消</el-button>
        <el-button size="small" type="primary" class="title" @click="psdKeep('formPassword')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { user } from "../api/http.js";
export default {
  name: "navcon",
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("输入不能为空"));
      } else if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error("电话号码格式错误"));
      } else {
        callback();
      }
    };
    return {
      newPswd: false,
      oldPswd: false,
      formPassword: {},
      ruleValidate: {
        oldPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ],
        userPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ]
      },
      psdDetVisible: false,
      loading: false, //是显示加载
      editForm: {},
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" }
        ],
        userPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ],
        phone: [{ required: true, validator: validatePhone, trigger: "blur" }]
      },
      editFormVisible: false,
      collapsed: true,
      imgshow: require("../assets/img/show.png"),
      imgsq: require("../assets/img/sq.png"),
      user: {}
    };
  },
  // 创建完毕状态(里面是操作)
  created() {
    this.user = JSON.parse(localStorage.getItem("userdata"));
    console.log(this.user);
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          user("/add", this.editForm)
            .then(res => {
              this.loading = false;
              this.editFormVisible = false;
              this.$message({
                message: "操作成功",
                type: "success"
              });
            })
            .catch(err => {
              this.loading = false;
              this.$message.error("操作失败，请稍后再试！");
            });
        }
      });
    },
    addUser() {
      this.editFormVisible = true;
      this.editForm = {
        userName: null,
        userPassword: null,
        phone: null
      };
      this.$nextTick(() => {
        this.$refs["editForm"].resetFields();
      });
    },
    changePsw() {
      this.psdDetVisible = true;
      this.newPswd = false;
      this.oldPswd = false;
      this.formPassword = {
        oldPassword: null,
        userPassword: null
      };
      this.$nextTick(() => {
        this.$refs["formPassword"].resetFields();
      });
    },
    psdKeep(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.formPassword.oldPassword == this.formPassword.userPassword) {
            this.$message.error("新密码与原密码一致，请重新输入");
          } else {
            this.loading = true;
            this.formPassword.userId = this.user.userId;
            this.formPassword.userName = this.user.userName;
            user("/updatePwd", this.formPassword)
              .then(res => {
                this.loading = false;
                this.psdDetVisible = false;
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
              })
              .catch(err => {
                this.loading = false;
                this.$message.error("操作失败，请稍后再试！");
              });
          }
        }
      });
    },
    // 退出登录
    exit() {
      this.$confirm("退出登录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          setTimeout(() => {
            localStorage.removeItem("userdata");
            this.$store.commit("logout", "false");
            this.$router.push({ path: "/login" });
            this.$message({
              type: "success",
              message: "已退出登录!"
            });
          }, 1000);
          // loginout()
          //   .then(res => {
          //     if (res.success) {
          //       //如果请求成功就让他2秒跳转路由
          //       setTimeout(() => {
          //         this.$store.commit('logout', 'false')
          //         this.$router.push({ path: '/login' })
          //         this.$message({
          //           type: 'success',
          //           message: '已退出登录!'
          //         })
          //       }, 1000)
          //     } else {
          //       this.$message.error(res.msg)
          //       this.logining = false
          //       return false
          //     }
          //   })
          //   .catch(err => {
          //     // 获取图形验证码
          //     this.getcode()
          //     this.logining = false
          //     this.$message.error('退出失败，请稍后再试！')
          //   })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 切换显示
    toggle(showtype) {
      this.collapsed = !showtype;
      this.$root.Bus.$emit("toggle", this.collapsed);
    }
  }
};
</script>
<style lang="less" scoped>
.nav {
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    border: none;
  }
  .submenu {
    float: right;
  }
  .buttonimg {
    height: 60px;
    background-color: transparent;
    border: none;
  }
  .showimg {
    width: 26px;
    height: 26px;
    position: absolute;
    top: 17px;
    left: 17px;
  }
  .showimg:active {
    border: none;
  }
  .psd {
    .iconfont {
      cursor: pointer;
    }
  }
}
</style>