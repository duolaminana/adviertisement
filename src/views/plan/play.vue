/**
 * 广告管理 广告管理
 */
<template>
  <div class="adviertisementManagement">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>播放计划</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label>
        <el-input size="small" v-model="formInline.planName" placeholder="请输入计划名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit('xz')">添加</el-button>
        <el-button size="small" type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table
      size="small"
      :data="playData"
      highlight-current-row
      v-loading="loading"
      border
      element-loading-text="拼命加载中"
      style="width: 100%;"
    >
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column align="center" prop="planName" label="计划名称" min-width="120"></el-table-column>
      <el-table-column align="center" prop="advGroupName" label="广告分组" min-width="120">
        <template slot-scope="scope">
          <span class="lookDetails" @click="seeMore(scope.row,'adv')">{{scope.row.advGroupName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="machineGroupName" label="设备分组" min-width="120">
        <template slot-scope="scope">
          <span class="lookDetails" @click="seeMore(scope.row,'equ')">{{scope.row.machineGroupName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="enable" label="是否启用" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.state" class="green">已启用</span>
          <span v-if="!scope.row.state" class="red">未启用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit('bj',scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="success"
            @click="handleEdit('sh',scope.row)"
            v-if="user.level==1"
          >审核</el-button>
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
      <el-form
        class="dialogForm"
        label-width="120px"
        ref="editForm"
        :rules="rules"
        :model="editForm"
      >
        <el-form-item label="计划名称" prop="planName">
          <el-input
            :disabled="isShowState"
            size="small"
            v-model="editForm.planName"
            auto-complete="off"
            placeholder="请输入计划名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="广告组" prop="advGroupId">
          <el-select
            :disabled="isShowState"
            size="small"
            v-model="editForm.advGroupId"
            clearable
            placeholder="请选择广告组"
          >
            <el-option
              v-for="item in advGroupData"
              :key="item.id"
              :label="item.groupName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备组" prop="machineGroupId">
          <el-select
            :disabled="isShowState"
            size="small"
            v-model="editForm.machineGroupId"
            clearable
            placeholder="请选择设备组"
          >
            <el-option
              v-for="item in equGroupData"
              :key="item.id"
              :label="item.groupName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用" v-if="isShowState">
          <el-radio v-model="editForm.state" label="1">启用</el-radio>
          <el-radio v-model="editForm.state" label="0">未启用</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog('edit')">取消</el-button>
        <el-button
          size="small"
          type="primary"
          :loading="loading"
          class="title"
          @click="submitForm('editForm')"
        >保存</el-button>
      </div>
    </el-dialog>
    <!-- 更换设备界面 -->
    <el-dialog
      :title="titleMore"
      :visible.sync="machineChangeVisible"
      width="800px"
      @click="machineChangeVisible=false"
    >
      <div v-if="isShowAdv" class="advGroupMore">
        <el-table
          size="small"
          height="520"
          :data="advData"
          highlight-current-row
          v-loading="loading"
          border
          element-loading-text="拼命加载中"
          style="width: 100%;"
        >
          <el-table-column align="center" prop="advName" label="广告名称" width="120"></el-table-column>
          <el-table-column align="center" prop="advType" label="广告类型" width="80">
            <template slot-scope="scope">{{scope.row.advType|advType}}</template>
          </el-table-column>
          <el-table-column align="center" prop="advUrl" label="广告链接" width="100">
            <template slot-scope="scope">
              <img :src="scope.row.advUrl" class="imgstyle" />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="onceShowTime" label="播放时长" width="80"></el-table-column>
          <el-table-column align="center" prop="orderNumber" label="播放顺序" width="80"></el-table-column>
          <el-table-column align="center" prop="startPlayTime" label="开始时间" min-width="120">
            <template
              slot-scope="scope"
            >{{parseInt(scope.row.startPlayTime) |dateformat('YYYY-MM-DD HH:mm:ss')}}</template>
          </el-table-column>
          <el-table-column align="center" prop="stopPlayTime" label="结束时间" min-width="120">
            <template
              slot-scope="scope"
            >{{parseInt(scope.row.stopPlayTime) |dateformat('YYYY-MM-DD HH:mm:ss')}}</template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="!isShowAdv">
        <el-table
          size="small"
          :data="equData"
          highlight-current-row
          v-loading="loading"
          border
          element-loading-text="拼命加载中"
          style="width: 100%;"
        >
          <el-table-column align="center" prop="machineCode" label="设备编码" width="120"></el-table-column>
          <el-table-column align="center" prop="point" label="酒店名称" min-width="260"></el-table-column>
        </el-table>
      </div>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="machineChangeVisible=false">确定</el-button>
      </div>-->
    </el-dialog>
  </div>
</template>

<script>
// 导入请求方法
import Pagination from "../../components/Pagination";
import {
  netWorkadvPlan,
  netWorkAdvGroup,
  netWorkEquGroup,
  netWorkAdvGroupDet,
  netWorkEquGroupDet
} from "../../api/http.js";
export default {
  name: "adviertisementManagement",
  // 注册组件
  components: {
    Pagination
  },
  data() {
    return {
      machineGroupId: null,
      equData: [],
      advGroupId: null,
      advData: [],
      isShowAdv: true,
      titleMore: "分组详情",
      isShowState: false,
      fileList: [],
      advGroupData: [],
      equGroupData: [],
      machineChangeValue: {},
      machineChangeVisible: false,
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      title: "",
      editFormVisible: false, //控制编辑页面显示与隐藏
      unitAccessshow: false, //控制所属单位隐藏与显示
      // 编辑与添加
      editForm: {},
      rules: {
        planName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" }
        ],
        advGroupId: [
          { required: true, message: "请输入活动名称", trigger: "change" }
        ],
        machineGroupId: [
          { required: true, message: "请输入活动名称", trigger: "change" }
        ]
      },
      // 请求数据参数
      formInline: {
        pageIndex: 1,
        pageSize: 10,
        planName: null
      },
      //播放计划数据
      playData: [],
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      },
      rowData: null,
      showNewlyType: "xz",
      user: {}
    };
  },

  filters: {
    advType(num) {
      switch (num) {
        case 1:
          return "文字广告";
          break;
        case 2:
          return "视频广告";
          break;
        case 3:
          return "图片广告";
          break;
      }
    }
  },
  created() {
    this.getData();
    this.user = JSON.parse(localStorage.getItem("userdata"));
  },
  methods: {
    seeMore(row, type) {
      console.log(row);
      this.machineChangeVisible = true;
      if (type == "adv") {
        this.titleMore = "广告分组详情";
        this.isShowAdv = true;
        this.advGroupId = row.advGroupId;
        this.getAdvData();
      } else {
        this.titleMore = "设备分组详情";
        this.isShowAdv = false;
        this.machineGroupId = row.machineGroupId;
        this.getEquData();
      }
    },
    reset() {
      this.formInline.planName = null;
      this.formInline.pageIndex = 1;
      this.getData();
    },
    // 获取数据方法
    getData() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      netWorkadvPlan("/list", this.formInline)
        .then(res => {
          this.pageparm.currentPage = res.body.pageIndex;
          this.pageparm.pageSize = res.body.pageSize;
          this.pageparm.total = res.body.totalNum;
          this.playData = res.body.List;
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
    handleEdit(type, row) {
      console.log(row);
      this.editFormVisible = true;
      this.getAdvGroup();
      this.getEquGroup();
      if ((row, type)) {
        if (type == "sh") {
          this.showNewlyType = "sh";
          this.title = "审核播放计划";
          this.isShowState = true;
          this.editForm = JSON.parse(JSON.stringify(row));
          this.editForm.state = this.editForm.state + "";
          this.$nextTick(() => {
            this.$refs["editForm"].clearValidate();
          });
        } else if (type == "bj") {
          this.showNewlyType = "bj";
          this.title = "编辑播放计划";
          this.isShowState = false;
          this.editForm = JSON.parse(JSON.stringify(row));
          this.$nextTick(() => {
            this.$refs["editForm"].clearValidate();
          });
        } else {
          this.title = "新增播放计划";
          this.showNewlyType = "xz";
          this.isShowState = false;
          this.$nextTick(() => {
            this.editForm = {
              planName: null,
              advGroupId: null,
              machineGroupId: null,
              state: "0"
            };
            this.$refs["editForm"].resetFields();
          });
        }
      }
    },
    // 编辑、添加提交方法
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          let url;
          if (this.showNewlyType == "xz") {
            url = "/add";
            this.editForm.state = 0;
          } else if (this.showNewlyType == "bj") {
            url = "/update";
          } else {
            url = "/audit";
          }
          console.log(this.editForm);
          netWorkadvPlan(url, this.editForm)
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
        }
      });
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
    },
    // 获取广告分组数据
    getAdvGroup() {
      netWorkAdvGroup("/list", { pageIndex: 1, pageSize: 1000000000 })
        .then(res => {
          this.advGroupData = res.body.List;
        })
        .catch(err => {
          this.$message.error("err");
        });
    },
    // 获取设备分组数据
    getEquGroup() {
      netWorkEquGroup("/list", { pageIndex: 1, pageSize: 1000000000 })
        .then(res => {
          this.equGroupData = res.body.List;
        })
        .catch(err => {
          this.$message.error("err");
        });
    },
    getAdvData() {
      let url = "/list?groupId=" + this.advGroupId;
      netWorkAdvGroupDet(url, null, "get")
        .then(res => {
          console.log(res.body.length);
          res.body.length ? (this.advData = res.body) : (this.advData = []);
        })
        .catch(err => {
          this.$message.error("err");
        });
    },
    getEquData() {
      let url = "/list?groupId=" + this.machineGroupId;
      netWorkEquGroupDet(url, null)
        .then(res => {
          console.log(res.body.length);
          res.body.length ? (this.equData = res.body) : (this.equData = []);
        })
        .catch(err => {
          this.$message.error("err");
        });
    }
  }
};
</script>

<style lang="less" scoped>
.adviertisementManagement {
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
    /deep/ .upload-demo {
      width: 390px;
    }
  }
  .advGroupMore {
    .imgstyle {
      width: 50px;
      height: 50px;
      margin: 5px 5px 0px 5px;
      box-sizing: border-box;
    }
  }
}
</style>
