/**
 * 系统管理 用户管理
 */
<template>
  <div class="user">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>酒店管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label>
        <el-input size="small" v-model="formInline.machineCode" placeholder="输入设备号"></el-input>
      </el-form-item>
      <el-form-item label>
        <el-input size="small" v-model="formInline.point" placeholder="输入酒店名称"></el-input>
      </el-form-item>
      <el-form-item label="是否营业">
        <el-select size="small" clearable v-model="formInline.isBusiness" placeholder="请选择">
          <el-option label="歇业" value="0"></el-option>
          <el-option label="正常" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label>
        <el-input size="small" v-model="formInline.area" placeholder="请输入所在区域"></el-input>
      </el-form-item>
      <el-form-item label="是否在线">
        <el-select size="small" clearable v-model="formInline.machineState" placeholder="请选择">
          <el-option label="正常" value="0"></el-option>
          <el-option label="异常" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table
      size="small"
      :data="userData"
      highlight-current-row
      v-loading="loading"
      border
      element-loading-text="拼命加载中"
      style="width: 100%;"
    >
      <el-table-column align="center" prop="machineCode" label="终端编号" width="120"></el-table-column>
      <el-table-column align="center" prop="area" label="分区" width="120"></el-table-column>
      <el-table-column align="center" prop="point" label="酒店名" width="120"></el-table-column>
      <el-table-column align="center" prop="police" label="所属分局" min-width="50"></el-table-column>
      <el-table-column align="center" prop="policePlace" label="所属派出所" min-width="50"></el-table-column>
      <el-table-column align="center" prop="isPoi" label="是否有POI" min-width="50">
        <template slot-scope="scope">
          <div>{{scope.row.isPoi==0?'无':scope.row.isPoi?'有':''}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="poi" label="poi名称" min-width="120"></el-table-column>
      <el-table-column align="center" prop="roomNum" label="房间数" min-width="50"></el-table-column>
      <el-table-column align="center" prop="type" label="酒店类型" min-width="80"></el-table-column>
      <el-table-column align="center" prop="address" label="酒店地址" width="200"></el-table-column>
      <el-table-column align="center" prop="isBusiness" label="营业状态" min-width="50">
        <template slot-scope="scope">
          <div>{{scope.row.isBusiness?'营业':'歇业'}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="updateTime" label="最后更新时间" min-width="120"></el-table-column>
      <el-table-column label="操作" align="center" min-width="300">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteUser(scope.$index, scope.row)">删除</el-button>
          <el-button size="mini" type="success" @click="untying(scope.row)">解绑</el-button>
          <el-button size="mini" type="warning" @click="machineChange(scope.row)">更换</el-button>
          <el-button
            v-if="!scope.row.isBusiness"
            size="mini"
            type="success"
            @click="work(scope.$index, scope.row,1)"
          >营业</el-button>
          <el-button v-else size="mini" type="danger" @click="work(scope.$index, scope.row,0)">歇业</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog
      :title="title"
      :visible.sync="editFormVisible"
      width="600px"
      @click="closeDialog('edit')"
    >
      <el-form class="dialogForm" label-width="120px" ref="editForm" :model="editForm">
        <el-form-item label="终端编号" v-if="showNewlyType=='xz'">
          <el-input
            size="small"
            v-model="editForm.machineCode"
            auto-complete="off"
            placeholder="请输入终端编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="分区">
          <el-input size="small" v-model="editForm.area" auto-complete="off" placeholder="请输入分区"></el-input>
        </el-form-item>
        <el-form-item label="酒店名">
          <el-input size="small" v-model="editForm.point" placeholder="请输入酒店名"></el-input>
        </el-form-item>
        <el-form-item label="酒店地址">
          <el-input size="small" v-model="editForm.address" placeholder="请输入酒店地址"></el-input>
        </el-form-item>
        <el-form-item label="所属分局">
          <el-input size="small" v-model="editForm.police" placeholder="请输入所属分局"></el-input>
        </el-form-item>
        <el-form-item label="所属派出所">
          <el-input size="small" v-model="editForm.policePlace" placeholder="请输入所属派出所"></el-input>
        </el-form-item>
        <el-form-item label="营业状态">
          <el-radio v-model="editForm.isBusiness" label="1">营业</el-radio>
          <el-radio v-model="editForm.isBusiness" label="0">歇业</el-radio>
        </el-form-item>
        <el-form-item label="房间数">
          <el-input size="small" v-model="editForm.roomNum" placeholder="请输入房间数"></el-input>
        </el-form-item>
        <el-form-item label="酒店类型">
          <el-input size="small" v-model="editForm.type" placeholder="请输入酒店类型"></el-input>
        </el-form-item>
        <el-form-item label="是否有POI">
          <el-radio v-model="editForm.isPoi" label="1">有</el-radio>
          <el-radio v-model="editForm.isPoi" label="0">无</el-radio>
        </el-form-item>
        <el-form-item label="poi地址" v-if="editForm.isPoi==1">
          <el-input size="small" v-model="editForm.poi" placeholder="请输入poi地址"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog('edit')">取消</el-button>
        <el-button
          size="small"
          type="primary"
          :loading="loading"
          class="title"
          @click="submitForm"
        >保存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="更换设备"
      :visible.sync="machineChangeVisible"
      width="30%"
      @click="machineChangeVisible=false"
    >
      <el-form label-width="80px" :model="machineChangeValue">
        <el-form-item label="设备号">
          <el-input
            size="small"
            v-model="machineChangeValue.machineCode"
            auto-complete="off"
            placeholder="请输入设备号"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="machineChangeVisible=false">取消</el-button>
        <el-button
          size="small"
          type="primary"
          :loading="loading"
          class="title"
          @click="machineChangeKeep"
        >保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入请求方法
import {
  userList,
  userSave,
  userDelete,
  userPwd,
  userExpireToken,
  userFlashCache,
  userLock,
  UserDeptTree,
  UserDeptSave,
  UserDeptdeptTree,
  UserChangeDept
} from "../../api/userMG";
import Pagination from "../../components/Pagination";
import { netWorkHttp } from "../../api/http.js";
export default {
  data() {
    return {
      machineChangeValue: {},
      machineChangeVisible: false,
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      title: "添加用户",
      editFormVisible: false, //控制编辑页面显示与隐藏
      unitAccessshow: false, //控制所属单位隐藏与显示
      // 编辑与添加
      editForm: {
        machineCode: null,
        area: null,
        point: null,
        address: null,
        roomNum: null,
        type: null,
        police: null,
        policePlace: null,
        isBusiness: "1",
        isPoi: "1",
        poi: null
      },
      // 请求数据参数
      formInline: {
        pageIndex: 1,
        pageSize: 10,
        machineCode: null,
        point: null,
        isBusiness: null,
        area: null,
        machineState: null
      },
      //用户数据
      userData: [],
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      },
      rowData: null,
      showNewlyType: "xz"
    };
  },
  // 注册组件
  components: {
    Pagination
  },
  // created() {
  //   this.getData();
  // },
  methods: {
    untying(row) {
      const url = `/unbundlingMachine?&&id=${row.id}`;
      netWorkHttp(url, null, "get")
        .then(res => {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.getData();
        })
        .catch(err => {
          this.$message.error("err");
        });
    },
    machineChangeKeep() {
      if (this.machineChangeValue.machineCode) {
        const url = `/replaceMachine?machineCode=${this.machineChangeValue.machineCode}
        &&id=${this.rowData.id}`;
        netWorkHttp(url, null, "get")
          .then(res => {
            this.machineChangeVisible = false;
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.getData();
          })
          .catch(err => {
            this.$message.error("err");
          });
      } else {
        this.$message.error("错了哦，信息填写不完整");
      }
    },
    work(index, row, isWorking) {
      const url = `/isBusiness?isBusiness=${isWorking}&&id=${row.id}`;
      netWorkHttp(url, null, "get")
        .then(res => {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.getData();
        })
        .catch(err => {
          this.$message.error("err");
        });
    },
    machineChange(row) {
      this.machineChangeVisible = true;
      this.rowData = row;
    },
    // 获取数据方法
    getData() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      netWorkHttp("/list", this.formInline)
        .then(res => {
          this.pageparm.currentPage = res.body.pageIndex;
          this.pageparm.pageSize = res.body.pageSize;
          this.pageparm.total = res.body.totalNum;
          this.userData = res.body.List;
          loading.close();
        })
        .catch(err => {
          this.$message.error("err");
          loading.close();
        });
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.pageIndex = parm.currentPage;
      this.formInline.pageSize = parm.pageSize;
      this.getData();
    },
    //搜索事件
    search() {
      this.getData();
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      if (row) {
        this.showNewlyType = "bj";
        this.title = "编辑酒店";
        this.editForm = JSON.parse(JSON.stringify(row));
        this.editForm.isBusiness = this.editForm.isBusiness + "";
        this.editForm.isPoi = this.editForm.isPoi + "";
      } else {
        this.title = "新增酒店";
        this.showNewlyType = "xz";
        this.editForm = {
          machineCode: null,
          area: null,
          point: null,
          police: null,
          policePlace: null,
          isBusiness: "1",
          isPoi: "1",

          poi: null
        };
      }
    },
    // 编辑、添加提交方法
    submitForm() {
      let {
        machineCode,
        area,
        point,
        police,
        policePlace,
        isBusiness,
        id,
        isPoi,
        poi,
        type,
        roomNum,
        address
      } = this.editForm;
      if (
        machineCode &&
        area &&
        point &&
        police &&
        policePlace &&
        type &&
        roomNum &&
        address &&
        (isPoi == 0 || poi)
      ) {
        let data = {
          machineCode,
          area,
          point,
          police,
          policePlace,
          isBusiness,
          id,
          isPoi,
          type,
          roomNum,
          address,
          poi
        };
        let url;
        if (this.showNewlyType == "xz") {
          url = "/add";
        } else {
          url = "/update";
        }
        netWorkHttp(url, data)
          .then(res => {
            this.editFormVisible = false;
            this.loading = false;
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.getData();
          })
          .catch(err => {
            this.editFormVisible = false;
            this.loading = false;
            this.$message.error("操作失败，请稍后再试！");
          });
      } else {
        this.$message.error("信息填写不完整！");
      }
    },
    // 关闭编辑、增加弹出框
    closeDialog(dialog) {
      this.editFormVisible = false;
    },
    // 删除用户
    deleteUser(index, row) {
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 删除
          userDelete(row.id)
            .then(res => {
              if (res.success) {
                this.$message({
                  type: "success",
                  message: "数据已删除!"
                });
                this.getdata(this.formInline);
              } else {
                this.$message({
                  type: "info",
                  message: res.msg
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message.error("数据删除失败，请稍后再试！");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除！"
          });
        });
    }
  }
};
</script>

<style lang="less" scoped>
.user {
  .el-select {
    width: 100px;
  }
  .el-input{
    width: 160px;
  }
  .user-search {
    margin-top: 20px;
  }
  .userRole {
    width: 100%;
  }
  .dialogForm {
    /deep/ .el-input--small {
      width: 390px;
    }
  }
}
</style>
