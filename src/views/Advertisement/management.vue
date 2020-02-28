/**
 * 广告管理 广告管理
 */
<template>
  <div class="adviertisementManagement">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>广告管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label>
        <el-input size="small" v-model="formInline.machineCode" placeholder="输入广告关键字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table
      size="small"
      :data="advertisingData"
      highlight-current-row
      v-loading="loading"
      border
      element-loading-text="拼命加载中"
      style="width: 100%;"
    >
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column align="center" prop="machineCode" label="广告名称" width="120"></el-table-column>
      <el-table-column align="center" prop="area" label="发布人" width="120"></el-table-column>
      <el-table-column align="center" prop="point" label="广告类型" width="120"></el-table-column>
      <el-table-column align="center" prop="police" label="播放时长/大小" min-width="50"></el-table-column>
      <el-table-column align="center" prop="policePlace" label="发布时间" min-width="50"></el-table-column>
      <el-table-column align="center" prop="poi" label="广告描述" min-width="120"></el-table-column>
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
      <el-form label-width="120px" ref="editForm" :model="editForm">
        <el-form-item label="广告名称">
          <el-input
            size="small"
            v-model="editForm.area"
            auto-complete="off"
            placeholder="请输入广告名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="广告类型">
          <el-select size="small" v-model="editForm.advertisingType" clearable placeholder="请选择">
            <el-option
              v-for="item in advertisingType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容类别">
          <el-select size="small" v-model="editForm.textType" clearable placeholder="请选择">
            <el-option
              v-for="item in textType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布人账号">
          <el-input size="small" v-model="editForm.address" placeholder="请输入发布人账号"></el-input>
        </el-form-item>
        <el-form-item label="请选择广告">
          <div>
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="文字广告">
          <el-input size="small" v-model="editForm.police" placeholder="请输入广告描述"></el-input>
        </el-form-item>
        <el-form-item label="广告信息备注">
          <el-input
            size="small"
            v-model="editForm.policePlace"
            type="textarea"
            placeholder="请输入备注内容"
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
          @click="submitForm"
        >保存</el-button>
      </div>
    </el-dialog>
    <!-- 更换设备界面 -->
    <el-dialog
      title="更换设备"
      :visible.sync="machineChangeVisible"
      width="600px"
      @click="machineChangeVisible=false"
    >
      <el-form label-width="100px" :model="machineChangeValue">
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
  name: "adviertisementManagement",
  data() {
    return {
      fileList: [],
      advertisingType: [
        {
          value: "选项1",
          label: "公益广告"
        },
        {
          value: "选项2",
          label: "效益广告"
        },
        {
          value: "选项3",
          label: "招商广告"
        }
      ],
      textType: [
        {
          value: "选项1",
          label: "文字广告"
        },
        {
          value: "选项2",
          label: "视频广告"
        },
        {
          value: "选项3",
          label: "图片广告"
        }
      ],
      machineChangeValue: {},
      machineChangeVisible: false,
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      title: "",
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
      advertisingData: [{}],
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
  created() {
    this.getData();
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

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
          this.advertisingData = res.body.List;
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
        this.title = "编辑广告";
        this.editForm = JSON.parse(JSON.stringify(row));
        this.editForm.isBusiness = this.editForm.isBusiness + "";
        this.editForm.isPoi = this.editForm.isPoi + "";
      } else {
        this.title = "新增广告";
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
.user-search {
  margin-top: 20px;
}
.userRole {
  width: 100%;
}
.el-form-item {
  /deep/ .el-input--small {
    width: 390px;
  }
  /deep/ .upload-demo{
    width: 390px;
  }
}
</style>
