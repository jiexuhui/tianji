<template>
  <div class="app-container">
    <el-table :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <!-- <el-table-column align="center" :label="$t('table.id')" width="65">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>-->
      <el-table-column align="center" label="ID" prop="id"></el-table-column>
      <el-table-column align="center" label="活动名称" width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.actName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="活动简介" width="300px" prop="actDesc"></el-table-column>
      <el-table-column align="center" min-width="150" label="宣传图" prop="image">
        <template slot-scope="scope">
          <img
            class="link-type"
            @click="handleUpload(scope.row)"
            :src="scope.row.image"
            width="40"
            height="40"
          >
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="150" label="奖品图" prop="prizeimg">
        <template slot-scope="scope">
          <img
            class="link-type"
            @click="handlePicUpload(scope.row)"
            :src="scope.row.prizeimg"
            width="40"
            height="40"
          >
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="150" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status === 1? "正常": "关闭"}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="150" label="开始时间">
        <template slot-scope="scope">
          <span>{{scope.row.stime}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        align="center"
        :label="$t('table.actions')"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >{{$t('table.edit')}}</el-button>

          <el-button size="mini" type="danger" @click="detailpath(scope.row)">详情</el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <div class="filter-container" style="margin-top:60px;">
      <el-form :inline="true">
        <el-form-item label="中奖码列表" prop="codes">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入抽奖码，以英文逗号分隔"
            v-model="drawcodes"
            :disabled="!codesEdit"
          ></el-input>
          <span>每日24点定时发奖，请及时填写中奖列表</span>
        </el-form-item>
        <el-form-item>
          <el-button
            type="success"
            @click="handleLottery"
            icon="el-icon-circle-plus"
            style="margin-left: 0"
            v-if="codesEdit==false"
          >编辑</el-button>
          <el-button
            type="warning"
            @click="doLottery"
            icon="el-icon-circle-plus"
            style="margin-left: 0"
            v-if="codesEdit==true"
          >确定</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="filter-container" style="margin-top:60px;">
      <h2>抽奖码列表</h2>
      <el-form :inline="true">
        <el-form-item label="抽奖码">
          <el-input placeholder="抽奖码" v-model="listQuery.code"></el-input>
        </el-form-item>
        <el-form-item label="用户名称">
          <el-input placeholder="用户名称" v-model="listQuery.nickname"></el-input>
        </el-form-item>
        <el-form-item label="来源">
          <el-select
            clearable
            style="width: 90px"
            class="filter-item"
            v-model="listQuery.source"
            placeholder="来源"
          >
            <el-option
              v-for="item in sourceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="listQuery.date"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      key="1"
      :data="codelist"
      v-loading="listLoading"
      element-loading-text="给我一点时间"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" :label="$t('table.id')" width="65">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="抽奖码" width="150px" prop="drawcode"></el-table-column>
      <el-table-column align="center" label="活动名称" width="150px" prop="actName"></el-table-column>
      <el-table-column align="center" label="用户昵称" width="150px" prop="nickName"></el-table-column>
      <el-table-column align="center" min-width="150" label="来源">
        <template slot-scope="scope">
          <el-tag :type="scope.row.source | statusFilter" v-if="scope.row.source == 1">查看免费单</el-tag>
          <el-tag :type="scope.row.source | statusFilter" v-if="scope.row.source == 2">分享</el-tag>
          <el-tag :type="scope.row.source | statusFilter" v-if="scope.row.source == 3">付费单</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="150" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.result | statusFilter" v-if="scope.row.result == 0">未开奖</el-tag>
          <el-tag :type="scope.row.result | statusFilter" v-if="scope.row.result == 1">中奖</el-tag>
          <el-tag :type="scope.row.result | statusFilter" v-if="scope.row.result == 2">未中奖</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="150" label="时间">
        <template slot-scope="scope">
          <span>{{scope.row.ctime}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" v-el-drag-dialog :visible.sync="dialogFormVisible">
      <el-form
        :rules="rules"
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="中奖码列表" prop="codes">
          <el-input type="textarea" :rows="2" placeholder="请输入抽奖码，以英文逗号分隔" v-model="temp.codes"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button
          v-if="dialogStatus=='create'"
          type="primary"
          @click="createData"
        >{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { codelist, lottery } from "@/api/draws";
import waves from "@/directive/waves"; // 水波纹指令
import elDragDialog from "@/directive/el-dragDialog";

export default {
  name: "complexTable",
  directives: {
    waves,
    elDragDialog
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      codelist: null,
      total: null,
      listLoading: true,
      listQuery: {
        id: undefined,
        nickname: "",
        status: undefined,
        page: 1,
        limit: 20
      },
      temp: {
        actid: 0,
        codes: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create"
      },
      gameOptions: [],
      sourceOptions: [
        {
          value: 1,
          label: "免费查看"
        },
        {
          value: 2,
          label: "分享"
        },
        {
          value: 3,
          label: "付费查看"
        }
      ],
      rules: {
        codes: [{ required: true, message: "中奖码不能为空", trigger: "blur" }]
      },
      uploaddialogFormVisible: false,
      uploadPicFormVisible: false,
      fileList: [],
      file: {},
      codesEdit: false,
      drawcodes: ""
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "success",
        1: "info"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      const typeOptions = [
        {
          value: 1,
          label: "类型一"
        },
        {
          value: 2,
          label: "类型二"
        }
      ];
      const typeOption = typeOptions.filter(item => item.value === type);
      console.log("typeoptopm:", typeOption);
      return typeOption[0].label;
    }
  },
  created() {
    this.list.push(JSON.parse(sessionStorage.getItem("drawdetail")));
    this.listLoading = false;
    console.log("this.list>>", this.list);
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.listQuery.actid = this.list[0].id;
      codelist(this.listQuery).then(response => {
        this.codelist = response.data[0];
        this.drawcodes = response.data[1][0].list;
        this.total = response.data[1][0].count;
        this.listLoading = false;
      });
    },
    handleLottery() {
      this.codesEdit = true;
    },
    doLottery() {
      if (this.drawcodes == "") {
        this.$message.error("中奖名单不能为空！");
      }
      this.codesEdit = true;
      const params = {
        actid: this.list[0].id,
        list: this.drawcodes
      };
      lottery(params).then(response => {
        this.getList();
        if (response.code === 200) {
          this.$message.success("操作成功");
          this.codesEdit = false;
        }
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleModifyStatus(row) {
      this.pubdialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys([]);
      });
      let rolename = row.rolename;
      this.modifyparams = Object.assign({}, row);
      defaultcheck(rolename).then(res => {
        if (res.code === 200) {
          this.$refs.tree.setCheckedKeys(res.data);
          this.pubdialogFormVisible = true;
        }
      });
    },
    handleCreate() {
      // this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.temp.image = "";
          this.temp.prizeimg = "";
          console.log(this.temp);
          add(this.temp).then(res => {
            if (res.code === 200) {
              this.list.unshift(this.temp);
              this.$message.success("操作成功");
              this.dialogFormVisible = false;
            } else {
              this.$message.error("队伍已存在");
            }
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          console.log("%o", tempData);
          edit(tempData).then(res => {
            if (res.code == 200) {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v);
                  this.list.splice(index, 1, this.temp);
                  break;
                }
              }
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "更新成功",
                type: "success",
                duration: 2000
              });
            }
          });
        }
      });
    },
    handleDelete(row) {
      this.temp = Object.assign({}, row); // copy obj
      const index = this.list.indexOf(row);
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          del(this.temp).then(res => {
            if (res.code == 200) {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v);
                  this.list.splice(index, 1);
                  break;
                }
              }
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = ["timestamp", "title", "type", "importance", "status"];
        const filterVal = [
          "timestamp",
          "title",
          "type",
          "importance",
          "status"
        ];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list"
        });
        this.downloadLoading = false;
      });
    },
    handleUpload(row) {
      this.fileList = [];
      // console.log("row", row);
      this.temp = Object.assign({}, row);
      this.file.name = row.actName + "-logo";
      if (row.image !== "" && row.image !== null) {
        this.file.url = row.image;
        this.fileList.push(this.file);
      }
      this.uploaddialogFormVisible = true;
    },
    beforeupload(file) {
      if (this.fileList.length === 1) {
        this.$message.error("只能上传一张海报哦~");
        return;
      }
      console.log("beforefile:", file);
      let param = new FormData(); // 创建form对象
      param.append("file", file, file.name); // file对象是 beforeUpload参数
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      upload(param).then(res => {
        if (res.code === 200 && res.data) {
          console.log(res);
          this.file = {};
          this.file.name = res.data.name;
          this.temp.image = res.data.url;
          this.file.url = res.data.url;
          this.fileList.push(this.file);
          console.log("this.fileList:", this.fileList);
        }
      });
      return false;
    },
    handlePicUpload(row) {
      this.fileList = [];
      // console.log("row", row);
      this.temp = Object.assign({}, row);
      this.file.name = row.prizeimg + "-宣传图";
      if (row.prizeimg !== "" && row.prizeimg !== null) {
        this.file.url = row.prizeimg;
        this.fileList.push(this.file);
      }
      this.uploadPicFormVisible = true;
    },
    beforeuploadpic(file) {
      if (this.fileList.length === 1) {
        this.$message.error("只能上传一张宣传图哦~");
        return;
      }
      console.log("beforefile:", file);
      let param = new FormData(); // 创建form对象
      param.append("file", file, file.name); // file对象是 beforeUpload参数
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      uploadPic(param).then(res => {
        if (res.code === 200 && res.data) {
          console.log(res);
          this.file = {};
          this.file.name = res.data.name;
          this.temp.prizeimg = res.data.url;
          this.file.url = res.data.url;
          this.fileList.push(this.file);
          console.log("this.fileList:", this.fileList);
        }
      });
      return false;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
      this.file.url = "";
    },
    handlePreview(file) {
      console.log(file);
    },
    uploadLogo() {
      this.temp.image = this.file.url;
      console.log("temp>>", this.temp);
      // return;
      edit(this.temp).then(res => {
        if (res.code == 200) {
          for (const v of this.list) {
            if (v.id === this.temp.id) {
              const index = this.list.indexOf(v);
              this.list.splice(index, 1, this.temp);
              break;
            }
          }
          this.uploaddialogFormVisible = false;
          this.uploadPicFormVisible = false;
          this.$notify({
            title: "成功",
            message: "更新成功",
            type: "success",
            duration: 2000
          });
        }
      });
    },
    uploadPic() {
      this.temp.prizeimg = this.file.url;
      edit(this.temp).then(res => {
        if (res.code == 200) {
          for (const v of this.list) {
            if (v.id === this.temp.id) {
              const index = this.list.indexOf(v);
              this.list.splice(index, 1, this.temp);
              break;
            }
          }
          this.uploaddialogFormVisible = false;
          this.uploadPicFormVisible = false;
          this.$notify({
            title: "成功",
            message: "更新成功",
            type: "success",
            duration: 2000
          });
        }
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>
