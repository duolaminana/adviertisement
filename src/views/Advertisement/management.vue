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
    <el-form :inline="true" :model="formInline" class="adv-search">
      <el-form-item label>
        <el-input size="small" v-model="formInline.advName" placeholder="请输入广告名"></el-input>
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
      :data="advertisingData"
      highlight-current-row
      v-loading="loading"
      border
      element-loading-text="拼命加载中"
      style="width: 100%;"
    >
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column align="center" prop="advName" label="广告名称" min-width="120"></el-table-column>
      <el-table-column align="center" prop="advUser" label="发布人" width="100"></el-table-column>
      <el-table-column align="center" prop="advCategory" label="广告类型" width="120">
        <template slot-scope="scope">{{scope.row.advCategory|advCategory}}</template>
      </el-table-column>
      <el-table-column align="center" prop="onceShowTime" label="播放时长/大小" min-width="120"></el-table-column>
      <el-table-column align="center" prop="policePlace" label="广告链接" min-width="120">
        <template slot-scope="scope">
          <img :src="scope.row.advUrl" class="imgstyle" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="advType" label="内容类别" width="120">
        <template slot-scope="scope">{{scope.row.advType|advType}}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row,'bj')">编辑</el-button>
          <el-button size="mini" type="warning" @click="handleEdit(scope.$index, scope.row,'sh')">审核</el-button>
          <!-- <el-button size="mini" type="danger" @click="deleteUser(scope.$index, scope.row)">删除</el-button> -->
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
      @close="closeDialog('editForm')"
    >
      <el-form
        class="dialogForm"
        label-width="120px"
        ref="editForm"
        :rules="rules"
        :model="editForm"
        :disabled="isCheck"
      >
        <el-form-item label="广告名称" prop="advName">
          <el-input size="small" v-model="editForm.advName" placeholder="请输入广告名称" ></el-input>
        </el-form-item>
        <el-form-item label="广告类型" prop="advCategory">
          <el-select size="small" v-model="editForm.advCategory" clearable placeholder="请选择">
            <el-option
              v-for="item in advertisingType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容类别" prop="advType">
          <el-select size="small" v-model="editForm.advType" clearable placeholder="请选择">
            <el-option
              v-for="item in textType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单次播放时间" prop="onceShowTime">
          <el-input size="small" v-model="editForm.onceShowTime" placeholder="请输入单次播放时间"></el-input>
        </el-form-item>
        <el-form-item label="播放序号" prop="orderNumber">
          <el-input size="small" v-model="editForm.orderNumber" placeholder="请输入播放序号"></el-input>
        </el-form-item>
        <el-form-item label="请选择广告" prop="advText">
          <el-upload
            ref="myUpload"
            class="avatar-uploader"
            action
            :show-file-list="imageUrl?true:false"
            :auto-upload="false"
            :on-change="changeUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog('editForm')">取消</el-button>
        <el-button
          v-if="this.showNewlyType=='xz'||this.showNewlyType=='bj'"
          size="small"
          type="primary"
          :loading="loading"
          class="title"
          @click="submitForm('editForm')"
        >保存</el-button>
        <el-button
          v-if="this.showNewlyType=='sh'"
          size="small"
          type="primary"
          :loading="loading"
          class="title"
          @click="submitForm('editForm',true)"
        >审核通过</el-button>
        <el-button
          v-if="this.showNewlyType=='sh'"
          size="small"
          type="danger"
          :loading="loading"
          class="title"
          @click="submitForm('editForm',false)"
        >审核不通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入请求方法
import Pagination from "../../components/Pagination";
import { netWorkAdv } from "../../api/http.js";
export default {
  name: "adviertisementManagement",
  data() {
    return {
      file: null,
      imageUrl: null,
      advertisingType: [
        {
          value: "1",
          label: "公益广告"
        },
        {
          value: "2",
          label: "宣传广告"
        },
        {
          value: "3",
          label: "效益广告"
        },
        {
          value: "4",
          label: "招商广告"
        }
      ],
      textType: [
        {
          value: "1",
          label: "文字广告"
        },
        {
          value: "2",
          label: "视频广告"
        },
        {
          value: "3",
          label: "图片广告"
        }
      ],
      machineChangeValue: {},
      machineChangeVisible: false,
      loading: false, //是显示加载
      title: "",
      editFormVisible: false, //控制编辑页面显示与隐藏
      unitAccessshow: false, //控制所属单位隐藏与显示
      // 编辑与添加数据
      editForm: {
        advName: null,
        advCategory: null,
        advType: null,
        onceShowTime: null,
        orderNumber: null,
        advAudit: 0
      },
      rules: {
        advName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" }
        ],
        advCategory: [
          { required: true, message: "请选择广告类型", trigger: "change" }
        ],
        advType: [
          { required: true, message: "请选择内容类别", trigger: "change" }
        ],
        onceShowTime: [
          { required: true, message: "请填写播放时间", trigger: "blur" }
        ],
        orderNumber: [
          { required: true, message: "请填写播放序号", trigger: "blur" }
        ]
      },
      // 请求数据参数
      formInline: {
        pageIndex: 1,
        pageSize: 10,
        advId: null,
        advName: null,
        advCategory: null,
        advType: null,
        advUser: null,
        advAudit: null
      },
      //广告数据
      advertisingData: [],
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      },
      rowData: null,
      showNewlyType: "xz",
      isCheck: true
    };
  },
  // 注册组件
  components: {
    Pagination
  },
  created() {
    this.getData();
  },
  filters: {
    advType(num) {
      switch (num) {
        case 1:
          return "文本";
          break;
        case 2:
          return "图片";
          break;
        case 3:
          return "视频";
          break;
      }
    },
    advCategory(num) {
      switch (num) {
        case "1":
          return "公益广告";
          break;
        case "2":
          return "宣传广告";
          break;
        case "3":
          return "效益广告";
          break;
        case "4":
          return "招商广告";
          break;
      }
    }
  },
  methods: {
    reset() {
      this.formInline.advName = null;
      this.formInline.pageIndex = 1;
      this.getData();
    },
    changeUpload(file) {
      console.log(file);
      this.file = file.raw;
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    // 获取数据方法
    getData() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      netWorkAdv("/list", this.formInline)
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
      this.formInline.pageIndex = 1;
      this.getData();
    },
    //显示编辑界面
    handleEdit(index, row, type) {
      this.editFormVisible = true;
      if (type == "bj") {
        this.isCheck = false;
        this.showNewlyType = "bj";
        this.title = "编辑广告";
        this.editForm = JSON.parse(JSON.stringify(row));
        console.log(this.editForm);
      } else if (type == "sh") {
        this.isCheck = true;
        this.showNewlyType = "sh";
        this.title = "审核广告";
        this.editForm = JSON.parse(JSON.stringify(row));
      } else {
        this.isCheck = false;
        this.title = "新增广告";
        this.showNewlyType = "xz";
        this.editForm = {
          advName: null,
          advCategory: null,
          advType: null,
          onceShowTime: null,
          orderNumber: null,
          advAudit: 0
        };
        this.file = null;
        this.imageUrl = null;
        setTimeout(() => {
          this.$refs["myUpload"].clearFiles();
        }, 2);
      }
    },

    // 编辑、添加提交方法
    submitForm(formName, flag) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          let url;
          if (this.showNewlyType == "xz") {
            url = "/upload";
          } else if (this.showNewlyType == "bj") {
            url = "/update";
          } else {
            flag ? (this.editForm.advAudit = 1) : (this.editForm.advAudit = 2);
            url = "/update";
          }
          let data = new FormData();
          for (let key in this.editForm) {
            data.append(key, this.editForm[key]);
          }
          data.append("file", this.file);
          netWorkAdv(url, data)
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
    closeDialog(name) {
      this.editFormVisible = false;
      this.$refs[name].resetFields();
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
.adviertisementManagement {
  .adv-search {
    margin-top: 20px;
  }
  .imgstyle {
    width: 50px;
    height: 50px;
    margin: 5px 5px 0px 5px;
    box-sizing: border-box;
  }
  .dialogForm {
    /deep/ .el-input--small {
      width: 390px;
    }
    /deep/ .upload-demo {
      width: 390px;
    }
    .line {
      margin-left: 3px;
    }
    /deep/ .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    /deep/ .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 170px;
      height: 170px;
      line-height: 170px;
      text-align: center;
    }
    .avatar {
      width: 170px;
      height: 170px;
      display: block;
    }
  }
}
</style>
