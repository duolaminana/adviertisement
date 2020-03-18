/**
 * 广告管理 广告管理
 */
<template>
  <div class="adviertisementGroup">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>广告分组</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="advGroup-search">
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
      :data="advertisingGroupData"
      highlight-current-row
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      v-loading="loading"
      border
      element-loading-text="拼命加载中"
      style="width: 100%;"
    >
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column align="center" prop="groupName" label="分组名称" min-width="120"></el-table-column>
      <el-table-column align="center" prop="createDate" label="发布时间" min-width="120"></el-table-column>
      <el-table-column align="center" prop label="分组详情" min-width="120">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="advGroupMore(scope.row,'xz')">新增详情</el-button>
          <el-button size="mini" type="success" @click="advGroupMore(scope.row,'ck')">查看详情</el-button>
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
            placeholder="请输入广告分组名称"
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
      :title="advTitle"
      :visible.sync="advGroupDetVisible"
      :width="advWidth"
      @click="advGroupDetVisible=false"
    >
      <div v-if="this.advTitle=='分组广告详情'" class="advGroupMore">
        <el-table
          size="small"
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
          <el-table-column align="center" prop="advUrl" label="广告链接" width="120">
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
          <el-table-column label="操作" align="center" min-width="150">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="advGroupMore(scope.row,'bj')">编辑</el-button>
              <el-button size="mini" type="danger" @click="deleteAdvGroup(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="this.advTitle=='新增分组广告'||this.advTitle=='编辑分组广告'" class="advGroupEdit">
        <el-form
          class="dialogForm"
          label-width="120px"
          ref="editForm"
          :rules="rules"
          :model="editForm"
        >
          <el-form-item label="广告名称" prop="advId">
            <el-select v-model="editForm.advId" size="small" filterable @change="changeValue">
              <el-option
                v-for="item in options"
                :key="item.advId"
                :label="item.advName"
                :value="item.advId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="广告时间">
            <el-col :span="10">
              <el-form-item prop="startPlayTime">
                <el-date-picker
                  v-model="editForm.startPlayTime"
                  size="small"
                  type="datetime"
                  placeholder="选择开始时间"
                  style="width:185px;"
                  :picker-options="pickerOptionsStart"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="1">---</el-col>
            <el-col :span="10">
              <el-form-item prop="stopPlayTime">
                <el-date-picker
                  v-model="editForm.stopPlayTime"
                  size="small"
                  type="datetime"
                  placeholder="选择结束时间"
                  style="width: 185px;"
                  :picker-options="pickerOptionsEnd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="单次播放时长" prop="onceShowTime">
            <el-input size="small" v-model="editForm.onceShowTime" placeholder="请输入单次播放时长"></el-input>
          </el-form-item>
          <el-form-item label="广告播放顺序" prop="onceShowTime">
            <el-input size="small" v-model="editForm.orderNumber" placeholder="请输入广告播放顺序"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" class="cancel" @click="advGroupDetVisible=false">取消</el-button>
          <el-button
            size="small"
            type="primary"
            class="title"
            @click="advGroupMoreKeep('editForm')"
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
  netWorkAdvGroup,
  netWorkAdvGroupDet,
  netWorkAdv
} from "../../api/http.js";
export default {
  name: "adviertisementManagement",
  // 注册组件
  components: {
    Pagination
  },
  data() {
    return {
      pickerOptionsStart: {
        disabledDate: time => {
          if (this.editForm.stopPlayTime) {
            return (
              time.getTime() < Date.now() - 8.64e7 ||
              time.getTime() > this.editForm.stopPlayTime
            );
          }
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          return (
            time.getTime() < Date.now() - 8.64e7 ||
            time.getTime() < this.editForm.startPlayTime
          );
        }
      },
      advWidth: null,
      advTitle: "新增广告",
      advData: [],
      machineChangeValue: {},
      advGroupDetVisible: false,
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
      rules: {
        advId: [
          { required: true, message: "请输入活动名称", trigger: "change" }
        ],
        startPlayTime: [
          {
            required: true,
            message: "请选择开始时间",
            trigger: "change"
          }
        ],
        stopPlayTime: [
          {
            required: true,
            message: "请选择结束时间",
            trigger: "change"
          }
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
        groupId: null,
        groupName: null
      },
      //用户数据
      advertisingGroupData: [{}],
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      },
      showNewlyType: "xz",
      options: [],
      groupId: null,
      advGroupId: null
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
  },
  methods: {
    changeValue(value) {
      this.editForm.advId = value;
    },
    getDataMore() {
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
    // 显示分组详情弹框
    advGroupMore(row, type) {
      this.advGroupDetVisible = true;
      if (type == "ck") {
        console.log(row);
        this.advGroupId = row.id;
        this.advTitle = "分组广告详情";
        this.advWidth = "1000px";
        this.getDataMore();
      } else if (type == "bj") {
        console.log(row);
        this.advWidth = "600px";
        this.advTitle = "编辑分组广告";
        this.showNewlyType = "bj";
        this.editForm = JSON.parse(JSON.stringify(row));
        this.editForm.startPlayTime = this.$moment(
          parseInt(this.editForm.startPlayTime)
        ).format("YYYY-MM-DD HH:mm:ss");
        this.editForm.stopPlayTime = this.$moment(
          parseInt(this.editForm.stopPlayTime)
        ).format("YYYY-MM-DD HH:mm:ss");
        this.editForm.advGroupId = this.advGroupId;
      } else {
        console.log(row);
        this.advWidth = "600px";
        this.advTitle = "新增分组广告";
        this.showNewlyType = "xz";
        this.$nextTick(() => {
          this.editForm = {
            advGroupId: row.id,
            advId: null,
            startPlayTime: null,
            stopPlayTime: null,
            onceShowTime: null,
            orderNumber: null
          };
          this.$refs["editForm"].resetFields();
        });
      }
      let data = {
        pageIndex: 1,
        pageSize: 100000000
      };
      netWorkAdv("/list", data)
        .then(res => {
          this.options = res.body.List;
        })
        .catch(err => {
          this.$message.error("err");
        });
    },
    // 分组详情保存
    advGroupMoreKeep(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          this.editForm.startPlayTime = new Date(
            this.editForm.startPlayTime
          ).getTime();
          this.editForm.stopPlayTime = new Date(
            this.editForm.stopPlayTime
          ).getTime();
          console.log(this.editForm);
          let url;
          if (this.showNewlyType == "xz") {
            url = "/add";
          } else if (this.showNewlyType == "bj") {
            url = "/update";
          }
          console.log(this.editForm);
          netWorkAdvGroupDet(url, this.editForm)
            .then(res => {
              this.loading = false;
              this.$message({
                message: "操作成功",
                type: "success"
              });
              if (this.showNewlyType == "xz") {
                this.advGroupDetVisible = false;
                this.getData();
              } else {
                this.advTitle = "分组广告详情";
                this.advWidth = "1000px";
                this.getDataMore();
              }
            })
            .catch(err => {
              this.advGroupDetVisible = false;
              this.loading = false;
              this.$message.error("操作失败，请稍后再试！");
            });
        }
      });
    },

    // 删除分组详情
    deleteAdvGroup(row) {
      console.log(row);
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 删除
          let url = "/delete?id=" + row.id;
          netWorkAdvGroupDet(url, null, "delete")
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
      this.formInline.advName = null;
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
      netWorkAdvGroup("/list", this.formInline)
        .then(res => {
          this.pageparm.currentPage = res.body.pageIndex;
          this.pageparm.pageSize = res.body.pageSize;
          this.pageparm.total = res.body.totalNum;
          this.advertisingGroupData = res.body.List;
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
        this.title = "编辑广告分组";
        this.groupForm = JSON.parse(JSON.stringify(row));
        this.$nextTick(() => {
          this.$refs["groupForm"].clearValidate();
        });
      } else {
        this.title = "新增广告分组";
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
          netWorkAdvGroup(url, this.groupForm)
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
.adviertisementGroup {
  .advGroup-search {
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
    .el-select {
      width: 390px;
    }
    .line {
      margin-left: 3px;
    }
    .advName {
      /deep/ .el-input--small {
        width: 330px;
      }
      /deep/ .el-select-dropdown {
        width: 330px;
      }
    }
  }
  .advGroupEdit {
    .cancel {
      margin-left: 430px;
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
