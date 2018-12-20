<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="ID">
          <el-input placeholder="ID" v-model="listQuery.id"></el-input>
        </el-form-item>
        <el-form-item label="比赛名称">
          <el-input placeholder="比赛名称" v-model="listQuery.name"></el-input>
        </el-form-item>
        <el-form-item label="游戏">
          <el-select
            clearable
            style="width: 90px"
            class="filter-item"
            v-model="listQuery.gameid"
            placeholder="游戏"
          >
            <el-option
              v-for="item in gameOptions"
              :key="item.id"
              :label="item.game"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            clearable
            style="width: 90px"
            class="filter-item"
            v-model="listQuery.status"
            placeholder="状态"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示">
          <el-select
            clearable
            style="width: 90px"
            class="filter-item"
            v-model="listQuery.show"
            placeholder="显示与否"
          >
            <el-option
              v-for="item in showOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据源">
          <el-select
            clearable
            style="width: 90px"
            class="filter-item"
            v-model="listQuery.source"
            placeholder="数据源"
          >
            <el-option
              v-for="item in sourceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="类型">
          <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.type" placeholder="类型">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button
            type="success"
            @click="handleCreate"
            icon="el-icon-circle-plus"
            style="margin-left: 0"
          >新增</el-button>
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
            <el-form-item label="赛事ID">
              <span>{{ scope.row.id }}</span>
            </el-form-item>
            <el-form-item label="参赛队伍">
              <span>{{ scope.row.tname }}</span>
            </el-form-item>
            <el-form-item label="LOGO">
              <img
                class="link-type"
                @click="handleUpload(scope.row)"
                :src="scope.row.image"
                width="40"
                height="40"
              >
            </el-form-item>
            <el-form-item label="当前">
              <span>共{{scope.row.many}}场,正在进行第{{scope.row.whitch}}场</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.id')" width="65">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="ID" prop="id"></el-table-column> -->
      <el-table-column align="center" label="名称" prop="name"></el-table-column>
      <el-table-column align="center" label="描述" prop="desc"></el-table-column>
      <!-- <el-table-column align="center" label="参赛队伍" prop="tname"></el-table-column> -->
      <el-table-column align="center" label="所属游戏" prop="game"></el-table-column>
      <!-- <el-table-column align="center" min-width="150" label="logo" prop="image">
        <template slot-scope="scope">
          <img
            class="link-type"
            @click="handleUpload(scope.row)"
            :src="scope.row.image"
            width="40"
            height="40"
          >
        </template>
      </el-table-column>-->
      <!-- <el-table-column align="center" label="场次" prop="whitch">
        <template slot-scope="scope">
          <span>共{{scope.row.many}}场,正在进行第{{scope.row.whitch}}场</span>
        </template>
      </el-table-column>-->
      <el-table-column align="center" label="左侧队伍" prop="ltname"></el-table-column>
      <el-table-column align="center" label="左侧比分" prop="lscore"></el-table-column>
      <el-table-column align="center" label="右侧队伍" prop="rtname"></el-table-column>
      <el-table-column align="center" label="右侧比分" prop="rscore"></el-table-column>
      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">活动标识</span>
          <span v-if="scope.row.status == 1">未开始</span>
          <span v-if="scope.row.status == 2">进行中</span>
          <span v-if="scope.row.status == 3">已结束</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="数据源" prop="source"></el-table-column>
      <el-table-column align="center" label="显示" prop="is_show">
        <template slot-scope="scope">
          <span v-if="scope.row.is_show == 1">显示</span>
          <span v-if="scope.row.is_show == 2">不显示</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开始时间" prop="stime">
        <template slot-scope="scope">
          <span>{{formatTime(scope.row.stime)}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="结束时间" prop="etime">
        <template slot-scope="scope">
          <span>{{formatTime(scope.row.etime)}}</span>
        </template>
      </el-table-column>-->
      <!-- <el-table-column align="center" min-width="150" label="创建时间">
        <template slot-scope="scope">
          <span>{{formatTime(scope.row.ctime)}}</span>
        </template>
      </el-table-column>-->
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
            @click="handleShow(scope.row)"
          >{{scope.row.is_show == 1?"不显示":'显示'}}</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >{{$t('table.edit')}}</el-button>

          <el-button
            v-if="scope.row.status!='deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
          >{{$t('table.delete')}}</el-button>
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
        <el-form-item label="赛事名称" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="temp.desc"></el-input>
        </el-form-item>
        <el-form-item label="所属游戏" prop="gameid">
          <el-select class="filter-item" v-model="temp.gameid" placeholder="游戏">
            <el-option
              v-for="item in gameOptions"
              :key="item.id"
              :label="item.game"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参赛队伍" prop="teams">
          <el-select class="filter-item" v-model="temp.teams" placeholder="参赛队伍" multiple>
            <el-option
              v-for="item in teamOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="共几场" prop="many">
          <el-input type="number" v-model="temp.many"></el-input>
        </el-form-item>
        <el-form-item label="正在进行" prop="many">
          <el-input type="number" v-model="temp.whitch"></el-input>
        </el-form-item>
        <el-form-item label="左侧队伍" prop="lteam">
          <el-select class="filter-item" v-model="temp.lteam" placeholder="左侧队伍">
            <el-option
              v-for="item in teamOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="左侧比分" prop="lscore">
          <el-input type="number" v-model="temp.lscore"></el-input>
        </el-form-item>
        <el-form-item label="右侧队伍" prop="rteam">
          <el-select class="filter-item" v-model="temp.rteam" placeholder="右侧队伍">
            <el-option
              v-for="item in teamOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="右侧比分" prop="rscore">
          <el-input type="number" v-model="temp.rscore"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select class="filter-item" v-model="temp.status" placeholder="状态">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="stime" label="开始时间">
          <el-date-picker
            v-model="temp.stime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="etime" label="结束时间">
          <el-date-picker
            v-model="temp.etime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="18:00:00"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
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

    <el-dialog title="上传图片" :visible.sync="uploaddialogFormVisible">
      <el-form
        :rules="rules"
        ref="dialogForm"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left:50px;"
      >
        <el-upload
          class="upload"
          ref="upload"
          action
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-upload="beforeupload"
          :file-list="fileList"
          :auto-upload="true"
          list-type="picture"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <!-- <el-progress v-show="showProgress" :text-inside="true" :stroke-width="15" :percentage="percentage"></el-progress> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploaddialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="uploadLogo">{{$t('table.confirm')}}</el-button>
        <!-- <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, add, edit, del, upload } from "@/api/serise";
import waves from "@/directive/waves"; // 水波纹指令
import elDragDialog from "@/directive/el-dragDialog";
import { parseTime } from "@/utils/index";

export default {
  name: "complexTable",
  directives: {
    waves,
    elDragDialog
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        id: undefined,
        name: "",
        source: "",
        show: undefined,
        page: 1,
        limit: 20
      },
      temp: {
        name: "",
        desc: "",
        gameid: undefined,
        teams: undefined,
        stime: "",
        etime: "",
        sort: 0,
        status: undefined,
        leftteam: undefined,
        leftscore: undefined,
        rightteam: undefined,
        rightscore: undefined
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create"
      },
      gameOptions: [],
      statusOptions: [
        {
          value: 0,
          label: "活动标识"
        },
        {
          value: 1,
          label: "未开始"
        },
        {
          value: 2,
          label: "进行中"
        },
        {
          value: 3,
          label: "已结束"
        }
      ],
      typeOptions: [
        {
          value: 1,
          label: "类型一"
        },
        {
          value: 2,
          label: "类型二"
        }
      ],
      showOptions: [
        {
          value: 1,
          label: "显示"
        },
        {
          value: 2,
          label: "不显示"
        }
      ],
      sourceOptions: [
        {
          value: "vpgame",
          label: "vpgame"
        },
        {
          value: "esport007",
          label: "esport007"
        }
      ],
      rules: {
        name: [{ required: true, message: "请输入比赛名称", trigger: "blur" }]
      },
      uploaddialogFormVisible: false,
      fileList: [],
      file: {},
      teamOptions: []
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
        this.gameOptions = response.data[1];
        this.total = response.data[2][0].count;
        this.teamOptions = response.data[3];
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
    handleCreate() {
      // this.resetTemp();
      this.$refs.dataForm && this.$refs.dataForm.resetFields();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          console.log(this.temp.teams);
          this.temp.teams = this.temp.teams.toString();
          console.log(this.temp.teams);
          add(this.temp).then(res => {
            if (res.code === 200) {
              // this.temp.id = res.id;
              // this.temp.ctime = res.ctime;
              // this.list.unshift(this.temp);
              this.getList();
              this.$message.success("操作成功");
              this.dialogFormVisible = false;
            }
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      console.log("this.temp.teams11", row);
      this.temp.teams =
        this.temp.teams != null ? this.temp.teams.split(",").map(Number) : "";
      console.log("this.temp.teams", this.temp.teams);
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
          tempData.teams = tempData.teams.toString();
          edit(tempData).then(res => {
            if (res.code == 200) {
              this.getList();
              // for (const v of this.list) {
              //   if (v.id === this.temp.id) {
              //     const index = this.list.indexOf(v);
              //     this.list.splice(index, 1, tempData);
              //     break;
              //   }
              // }
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
    handleShow(row) {
      row.is_show = row.is_show == 1 ? 2 : 1;
      // const tempData = Object.assign({}, row); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
      // console.log("%o", tempData);
      edit(row).then(res => {
        if (res.code == 200) {
          // this.getList();
          for (const v of this.list) {
            if (v.id === row.id) {
              const index = this.list.indexOf(v);
              this.list.splice(index, 1, row);
              console.log("list>>", this.list);
              break;
            }
          }
          // this.dialogFormVisible = false;
          this.$notify({
            title: "成功",
            message: "更新成功",
            type: "success",
            duration: 2000
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
      this.file.name = row.name + "-logo";
      if (row.image !== "" && row.image !== null) {
        this.file.url = row.image;
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
          this.temp.logo = res.data.url;
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
