<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="单子id">
          <el-input placeholder="单子id" v-model="listQuery.caseid"></el-input>
        </el-form-item>
        <el-form-item label="比赛id">
          <el-input placeholder="比赛id" v-model="listQuery.matchid"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input placeholder="用户昵称" v-model="listQuery.username"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            clearable
            style="width: 90px"
            class="filter-item"
            v-model="listQuery.right"
            placeholder="结果"
          >
            <el-option
              v-for="item in rightOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <!-- <el-button
              type="success"
          @click="handleCreate" icon="el-icon-circle-plus" style="margin-left: 0">新增</el-button>-->
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
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="比赛">
              <span>{{ scope.row.matchname }}</span>
            </el-form-item>
            <el-form-item label="推荐买点">
              <span>{{ scope.row.title }}</span>
            </el-form-item>
            <el-form-item label="推荐理由">
              <span>{{ scope.row.content }}</span>
            </el-form-item>
            <el-form-item label="推荐答案">
              <span>{{ scope.row.authanswer }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.id')" width="65">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单子ID" prop="id"></el-table-column>
      <el-table-column align="center" label="用户昵称" prop="nickName"></el-table-column>
      <el-table-column align="center" label="比赛ID" prop="matchid"></el-table-column>
      <!-- <el-table-column align="center" label="比赛" prop="matchname"></el-table-column> -->
      <el-table-column align="center" label="队伍1" prop="team1"></el-table-column>
      <el-table-column align="center" label="队伍2" prop="team2"></el-table-column>
      <el-table-column align="center" label="价格" prop="price"></el-table-column>
      <el-table-column align="center" label="推荐答案" prop="authanswer"></el-table-column>
      <!-- <el-table-column align="center" label="推荐理由" prop="content"></el-table-column> -->
      <el-table-column align="center" label="结果" prop="right">
        <template slot-scope="scope">
          <span v-for="item in rightOptions">
            <el-tag v-if="item.value == scope.row.right">{{item.label}}</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="显示">
        <template slot-scope="scope">
          <span>{{scope.row.show==0?'不显示':"显示"}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序" prop="order"></el-table-column>
      <el-table-column align="center" min-width="150" label="创建时间">
        <template slot-scope="scope">
          <span>{{formatTime(scope.row.ctime)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="150" label="结算时间">
        <template slot-scope="scope">
          <span>{{scope.row.rtime?formatTime(scope.row.rtime):''}}</span>
        </template>
      </el-table-column>
      <el-table-column
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
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="结果" prop="right">
          <el-radio-group v-model="temp.right">
            <el-radio-button label="1">正确</el-radio-button>
            <el-radio-button label="2">错误</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="显示" prop="show">
          <el-radio-group v-model="temp.show">
            <el-radio-button label="1">显示</el-radio-button>
            <el-radio-button label="2">不显示</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input type="number" v-model="temp.order"></el-input>数值越大越靠前
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
<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
<script>
import { list, edit, settlement } from "@/api/pushcase";
import { parseTime } from "@/utils/index";
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
        caseid: undefined,
        matchid: undefined,
        right: 99,
        page: 1,
        limit: 20
      },
      temp: {
        show: 1,
        order: 0,
        right: 0
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
      rightOptions: [
        {
          value: 99,
          label: "所有"
        },
        {
          value: 0,
          label: "请求结果"
        },
        {
          value: 1,
          label: "正确"
        },
        { value: 2, label: "错误" }
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
    formatTime(time) {
      return parseTime(time);
    },
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
    resetTemp() {
      this.temp = {
        show: 1,
        order: 0,
        right: 0
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          console.log(this.temp);
          add(this.temp).then(res => {
            if (res.code === 200) {
              this.temp.id = res.id;
              this.temp.ctime = res.ctime;
              this.list.push(this.temp);
              this.$message.success("操作成功");
              this.dialogFormVisible = false;
            } else {
              this.$message.error("游戏已存在");
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
          settlement(tempData).then(res => {
            if (res.code == 200) {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  this.temp.rtime = res.rtime;
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
