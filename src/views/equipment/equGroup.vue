/**
 * 设备管理 设备管理
 */
<template>
  <div class="equiertisementGroup">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>设备分组</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="equGroup-search">
      <el-form-item label>
        <el-input size="small" v-model="formInline.groupName" placeholder="请输入分组名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit">添加</el-button>
        <el-button size="small" type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table
      size="small"
      :data="equertisingGroupData"
      highlight-current-row
      row-key="id"
      v-loading="loading"
      border
      element-loading-text="拼命加载中"
      style="width: 100%;"
    >
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column align="center" prop="groupName" label="分组名称" min-width="120"></el-table-column>
      <el-table-column align="center" prop="createDate" label="发布时间" min-width="120"></el-table-column>
      <el-table-column align="center" prop label="分组详情" min-width="220">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="equGroupMore(scope.row,'xz')">新增详情</el-button>
          <el-button size="mini" type="success" @click="equGroupMore(scope.row,'ck')">查看详情</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
        class="dialogGroupForm"
        label-width="120px"
        ref="groupForm"
        :rules="groupRules"
        :model="groupForm"
      >
        <el-form-item label="分组名称" prop="groupName">
          <el-input
            size="small"
            v-model="groupForm.groupName"
            auto-complete="off"
            placeholder="请输入设备分组名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog('edit')">取消</el-button>
        <el-button
          size="small"
          type="primary"
          :loading="loading"
          class="title"
          @click="submitForm('groupForm')"
        >保存</el-button>
      </div>
    </el-dialog>
    <!-- 分组详情 -->
    <el-dialog
      :title="equTitle"
      :visible.sync="equGroupDetVisible"
      width="700px"
      @click="equGroupDetVisible=false"
    >
      <div v-if="this.equTitle=='分组设备详情'" class="equGroupMore">
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
          <el-table-column label="操作" align="center" width="120">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="deleteequGroup(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="this.equTitle=='新增分组设备'||this.equTitle=='编辑分组设备'" class="equGroupEdit">
        <el-form class="dialogForm" ref="editForm" :model="editForm" :inline="true">
          <div>
            <el-form-item label="设备编码">
              <el-input
                size="small"
                v-model="hotelsline.machineCode"
                auto-complete="off"
                placeholder="请输入设备编码"
                prefix-icon="el-icon-search"
                @keyup.enter.native="searchEqu"
              ></el-input>
            </el-form-item>
            <el-form-item label="酒店名称">
              <el-input
                size="small"
                v-model="hotelsline.point"
                auto-complete="off"
                prefix-icon="el-icon-search"
                placeholder="请输入酒店名称"
                @keyup.enter.native="searchEqu"
              ></el-input>
            </el-form-item>
          </div>
          <div>
            <el-table
              size="small"
              height="520"
              :data="options"
              highlight-current-row
              v-loading="loading"
              border
              element-loading-text="拼命加载中"
              style="width: 100%;"
              @select="handleSelect"
              @select-all="handleSelectAll"
            >
              <el-table-column align="center" type="selection" width="55"></el-table-column>
              <el-table-column align="center" prop="machineCode" label="终端编号" min-width="80"></el-table-column>
              <el-table-column
                align="center"
                prop="point"
                label="酒店名"
                min-width="150"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                align="center"
                prop="address"
                label="酒店地址"
                min-width="200"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" class="cancel" @click="equGroupDetVisible=false">取消</el-button>
          <el-button
            size="small"
            type="primary"
            class="title"
            @click="equGroupMoreKeep('editForm')"
          >保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入请求方法
import Pagination from "../../components/Pagination";
import { timestampToTime } from "../../utils/util.js";
import {
  netWorkEquGroup,
  netWorkEquGroupDet,
  netWorkHttp
} from "../../api/http.js";
export default {
  name: "equiertisementManagement",
  // 注册组件
  components: {
    Pagination
  },
  data() {
    return {
      equTitle: "新增设备",
      equData: [],
      machineChangeValue: {},
      equGroupDetVisible: false,
      loading: false, //是显示加载
      title: "",
      editFormVisible: false, //控制编辑页面显示与隐藏
      // 分组编辑与添加
      groupForm: {},
      groupRules: {
        groupName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" }
        ]
      },
      // 分组详情编辑与添加
      editForm: {},
      // 请求数据参数
      formInline: {
        pageIndex: 1,
        pageSize: 10,
        groupId: null,
        groupName: null
      },
      //用户数据
      equertisingGroupData: [],
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      },
      showNewlyType: "xz",
      options: [],
      groupId: null,
      machineGroupId: null,
      // 请求数据参数
      hotelsline: {
        pageIndex: 1,
        pageSize: 1000000000,
        machineCode: null,
        point: null
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    handleSelect(val, row) {
      console.log(val);
      console.log(row);
      /* 1 => add ; 0 => remove*/
      let flag = 0;
      val.forEach(item => {
        if (row.id == item.id) {
          flag = 1;
        }
      });
      if (flag === 1) {
        // 如果判断当前为添加则将当前勾选数据push到指定数组中
        this.editForm.machineIds.push(row.machineId);
      } else {
        // 否则从数组中删除当前行数据
        this.editForm.machineIds.forEach((item, index) => {
          if (item == row.machineId) {
            this.editForm.machineIds.splice(index, 1);
          }
        });
      }
    },
    handleSelectAll(val) {
      console.log(val);
      if (val.length) {
        if (this.editForm.machineIds.length == 0) {
          val.forEach(item => {
            this.editForm.machineIds.push(item.machineId);
          });
        } else {
          val.forEach(item => {
            let flag = 0;
            this.editForm.machineIds.forEach((i, index) => {
              if (i == item.machineId) {
                flag = 1;
              }
            });
            if (!flag) {
              this.editForm.machineIds.push(item.machineId);
            }
          });
        }
      } else {
        this.editForm.machineIds = [];
      }
    },
    searchEqu() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      netWorkHttp("/list", this.hotelsline)
        .then(res => {
          this.options = res.body.List;
          loading.close();
        })
        .catch(err => {
          this.$message.error("err");
          loading.close();
        });
    },
    changeValue(value) {
      this.editForm.machineId = value;
    },
    getDataMore() {
      let url = "/list?groupId=" + this.machineGroupId;
      netWorkEquGroupDet(url, null)
        .then(res => {
          console.log(res.body.length);
          res.body.length ? (this.equData = res.body) : (this.equData = []);
        })
        .catch(err => {
          this.$message.error("err");
        });
    },
    // 显示分组详情弹框
    equGroupMore(row, type) {
      this.equGroupDetVisible = true;
      if (type == "ck") {
        console.log(row);
        this.machineGroupId = row.id;
        this.equTitle = "分组设备详情";
        this.getDataMore();
      } else {
        console.log(row);
        this.equTitle = "新增分组设备";
        this.showNewlyType = "xz";
        this.hotelsline.machineCode = null;
        this.hotelsline.point = null;
        this.options = [];
        this.editForm.machineIds = [];
        this.$nextTick(() => {
          this.editForm = {
            machineGroupId: row.id,
            machineIds: []
          };
          this.$refs["editForm"].resetFields();
        });
      }
    },
    // 分组详情保存
    equGroupMoreKeep(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          let url;
          if (this.showNewlyType == "xz") {
            url = "/add";
          }
          console.log(this.editForm);
          netWorkEquGroupDet(url, this.editForm)
            .then(res => {
              this.loading = false;
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.equGroupDetVisible = false;
              this.getData();
            })
            .catch(err => {
              this.equGroupDetVisible = false;
              this.loading = false;
              this.$message.error("操作失败，请稍后再试！");
            });
        }
      });
    },

    // 删除分组详情
    deleteequGroup(row) {
      console.log(row);
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 删除
          let url = "/delete?id=" + row.id;
          netWorkEquGroupDet(url, null, "delete")
            .then(res => {
              this.$message({
                type: "success",
                message: "数据已删除!"
              });
              this.getDataMore();
            })
            .catch(err => {
              this.$message.error("操作失败，请稍后再试！");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除！"
          });
        });
    },
    reset() {
      this.formInline.equName = null;
      this.formInline.pageIndex = 1;
      this.formInline.pageSize = 10;
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
      netWorkEquGroup("/list", this.formInline)
        .then(res => {
          this.pageparm.currentPage = res.body.pageIndex;
          this.pageparm.pageSize = res.body.pageSize;
          this.pageparm.total = res.body.totalNum;
          this.equertisingGroupData = res.body.List;
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
      this.formInline.pageIndex = 1;
      this.getData();
    },
    //显示编辑界面
    handleEdit(index, row) {
      this.editFormVisible = true;
      if (row) {
        this.showNewlyType = "bj";
        this.title = "编辑设备分组";
        this.groupForm = JSON.parse(JSON.stringify(row));
        this.$nextTick(() => {
          this.$refs["groupForm"].clearValidate();
        });
      } else {
        this.title = "新增设备分组";
        this.showNewlyType = "xz";
        this.$nextTick(() => {
          this.groupForm = {
            groupName: null
          };
          this.$refs["groupForm"].resetFields();
        });
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
          } else {
            url = "/update";
          }
          netWorkEquGroup(url, this.groupForm)
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
    }
  }
};
</script>

<style lang="less" scoped>
.equiertisementGroup {
  .equGroup-search {
    margin-top: 20px;
  }
  .userRole {
    width: 100%;
  }
  .dialogForm {
    /deep/ .el-input--small {
      width: 200px;
    }
    .line {
      margin-left: 3px;
    }
    .equName {
      /deep/ .el-input--small {
        width: 330px;
      }
      /deep/ .el-select-dropdown {
        width: 330px;
      }
    }
  }
  .equGroupEdit {
    .cancel {
      margin-left: 530px;
      margin-top: 20px;
    }
  }
  .equGroupMore {
    .imgstyle {
      width: 50px;
      height: 50px;
      margin: 5px 5px 0px 5px;
      box-sizing: border-box;
    }
  }
}
</style>
