<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="昵称">
          <el-input placeholder="昵称" v-model="listQuery.name"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            clearable
            style="width: 90px"
            class="filter-item"
            v-model="listQuery.pass"
            placeholder="审核状态"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :key="tableKey"
      :data="list"
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
      <el-table-column align="center" label="用户ID" prop="id"></el-table-column>
      <el-table-column align="center" label="昵称" width="150px" prop="nickName"></el-table-column>
      <el-table-column align="center" min-width="150" label="头像" prop="avatarUrl">
        <template slot-scope="scope">
          <img :src="scope.row.avatarUrl" width="40" height="40">
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="150" label="申请状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">
            <span v-if="scope.row.god === 0">已撤销</span>
            <span v-if="scope.row.god === 1">申请中</span>
            <span v-if="scope.row.god === 2">已通过</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="150" label="虚拟点赞上限" prop="viragree"></el-table-column>
      <el-table-column align="center" min-width="150" label="虚拟转发上限" prop="virshare"></el-table-column>
      <el-table-column align="center" min-width="150" label="平台倍率" prop="platformrate"></el-table-column>
      <el-table-column align="center" min-width="150" label="申请时间">
        <template slot-scope="scope">
          <span>{{scope.row.gtime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="后台账号" width="150px" prop="account"></el-table-column>
      <el-table-column
        align="center"
        :label="$t('table.actions')"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handlePass(scope.row)">
            <span v-if="scope.row.god === 0">通过</span>
            <span v-if="scope.row.god === 1">通过</span>
            <span v-if="scope.row.god === 2">撤销</span>
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >{{$t('table.edit')}}</el-button>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        :rules="rules"
        ref="dataForm"
        :model="etemp"
        label-position="left"
        label-width="100px"
        style="width: 500px; margin-left:50px;"
      >
        <el-form-item label="大神名称" prop="godname">
          <el-input v-model="etemp.godname"></el-input>
        </el-form-item>
        <el-form-item label="大神等级" prop="godtype">
          <el-select
            clearable
            style="width: 90px"
            class="filter-item"
            v-model="etemp.godtype"
            placeholder="审核状态"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领域" prop="field">
          <el-select
            clearable
            style="width: 120px"
            class="filter-item"
            v-model="etemp.field"
            placeholder="领域"
          >
            <el-option
              v-for="item in gameOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="etemp.phone" type="number"></el-input>
        </el-form-item>
        <el-form-item label="大神说明" prop="desc">
          <el-input v-model="etemp.desc"></el-input>
        </el-form-item>
        <el-form-item label="大神简介" prop="introduction">
          <el-input v-model="etemp.introduction"></el-input>
        </el-form-item>
        <el-form-item label="后台账号" prop="account">
          <el-input v-model="etemp.account"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="etemp.phone" type="number"></el-input>
        </el-form-item>
        <el-form-item label="虚拟点赞上限" prop="viragree">
          <el-input v-model="etemp.viragree"></el-input>
        </el-form-item>
        <el-form-item label="虚拟转发上限" prop="virshare">
          <el-input v-model="etemp.virshare"></el-input>
        </el-form-item>
        <el-form-item label="平台繁荣倍率" prop="platformrate">
          <el-input v-model="etemp.platformrate"></el-input>
          <label>前端显示数：（真实点赞（转发）+虚拟点赞（转发））* 平台繁荣倍率 （24小时内增加至最大值）</label>
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
import { list, pass, edit } from "@/api/godpass";
import waves from "@/directive/waves"; // 水波纹指令

export default {
  name: "complexTable",
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        name: "",
        pass: undefined,
        page: 1,
        limit: 20
      },
      temp: {
        name: "",
        picture: "",
        url: "",
        status: 0
      },
      etemp: {
        godname: "",
        godtype: 1,
        field: undefined,
        phone: "",
        desc: "",
        introduction: "",
        account: "",
        viragree: 0,
        virshare: 0,
        platformrate: 1
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create"
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }]
      },
      uploaddialogFormVisible: false,
      fileList: [],
      file: {},
      statusOptions: [
        {
          value: 1,
          label: "申请中"
        },
        {
          value: 2,
          label: "审核通过"
        }
      ],
      typeOptions: [
        {
          value: 1,
          label: "A"
        },
        {
          value: 2,
          label: "B"
        }
      ],
      gameOptions: [
        {
          value: 1,
          label: "DOTA2"
        },
        {
          value: 2,
          label: "LOL"
        },
        {
          value: 3,
          label: "CS:GO"
        },
        {
          value: 4,
          label: "王者荣耀"
        }
      ]
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "success",
        1: "info"
      };
      return statusMap[status];
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      list(this.listQuery).then(response => {
        this.list = response.data[0];
        this.total = response.data[1][0].count;
        this.listLoading = false;
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
    handlePass(row) {
      this.temp = Object.assign({}, row); // copy obj
      let params = {};
      params.uid = this.temp.id;
      if (this.temp.god == 1 || this.temp.god == 0) {
        params.pass = 2;
      } else {
        params.pass = 0;
      }

      const index = this.list.indexOf(row);
      this.$confirm("确定吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          pass(params).then(res => {
            if (res.code == 200) {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  this.temp.god = this.temp.god == 2 ? 0 : 2;
                  const index = this.list.indexOf(v);
                  this.list.splice(index, 1, this.temp);
                  break;
                }
              }
              this.$notify({
                title: "成功",
                message: "操作成功",
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
    handleUpdate(row) {
      row.field = +row.field;
      this.etemp = Object.assign({}, row); // copy obj
      console.log("etemp>>", this.etemp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.etemp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          console.log("tempData>>%o", tempData);
          edit(tempData).then(res => {
            if (res.code == 200) {
              this.getList();
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
      this.file.name = "banner-" + row.name;
      if (row.picture !== "" && row.picture !== null) {
        this.file.url = row.picture;
        this.fileList.push(this.file);
      }
      this.uploaddialogFormVisible = true;
    },
    beforeupload(file) {
      if (this.fileList.length === 1) {
        this.$message.error("只能上传一张logo哦~");
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
          this.temp.picture = res.data.url;
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
      this.temp.picture = this.file.url;
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
